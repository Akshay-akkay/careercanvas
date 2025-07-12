import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { parseFileText } from '../lib/file-parser';
import { extractStructuredData, generateTailoredResume } from '../lib/gemini';
import { CoreProfile, GenerationHistoryEntry } from '../types';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { managedToast } from '../lib/toastManager';
import { mergeProfiles } from '../lib/profile-merger';

export interface ResumeFile {
  id: string;
  fileName: string;
  status: 'pending' | 'parsing' | 'extracting' | 'merging' | 'merged' | 'error';
  error: string | null;
}

interface ResumeState {
  resumes: Record<string, ResumeFile>;
  jobDescription: string;
  coreProfile: CoreProfile | null;
  generationHistory: GenerationHistoryEntry[];
  
  setJobDescription: (jd: string) => void;
  addFile: (file: File) => Promise<void>;
  removeFile: (id: string) => void;
  generate: () => Promise<void>;
  clearAll: () => void;
  deleteHistoryEntry: (id: string) => void;
  updateCoreProfile: (profile: CoreProfile) => void;
}

const initialCoreProfile: CoreProfile = {
  personalDetails: { name: '', email: '', phone: '', links: [] },
  summary: '',
  skills: {},
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};

export const useResumeStore = create(
  persist<ResumeState>(
    (set, get) => ({
      resumes: {},
      jobDescription: '',
      coreProfile: null,
      generationHistory: [],

      setJobDescription: (jd) => set({ jobDescription: jd }),
      
      addFile: async (file) => {
        const id = `${file.name}-${file.lastModified}`;
        if (get().resumes[id]) {
          toast.error('This file has already been processed.');
          return;
        }

        const fileProcessingPromise = new Promise(async (resolve, reject) => {
          try {
            set(state => ({
              resumes: { ...state.resumes, [id]: { id, fileName: file.name, status: 'parsing', error: null } },
            }));
            
            const text = await parseFileText(file);
            
            set(state => ({
              resumes: { ...state.resumes, [id]: { ...state.resumes[id], status: 'extracting' } },
            }));

            const structuredData = await extractStructuredData(text);
            
            set(state => ({
              resumes: { ...state.resumes, [id]: { ...state.resumes[id], status: 'merging' } },
            }));

            const existingProfile = get().coreProfile || initialCoreProfile;
            const newCoreProfile = await mergeProfiles(existingProfile, [structuredData]);

            set(state => ({
              coreProfile: newCoreProfile,
              resumes: { ...state.resumes, [id]: { ...state.resumes[id], status: 'merged' } },
            }));
            resolve(file.name);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            set(state => ({
              resumes: { ...state.resumes, [id]: { ...get().resumes[id], status: 'error', error: errorMessage } },
            }));
            reject(error);
          }
        });

        managedToast.promise(fileProcessingPromise, {
          loading: `Processing ${file.name}...`,
          success: (fileName) => `${fileName} processed and merged!`,
          error: (err) => `Failed to process file: ${err.message}`,
        });
      },

      removeFile: (id) => {
        set(state => {
          const newResumes = { ...state.resumes };
          delete newResumes[id];
          return { resumes: newResumes };
        });
        managedToast.show('Removed file from list. Your Core Profile is unaffected.');
      },

      generate: async () => {
        const { coreProfile, jobDescription } = get();
        if (!coreProfile) {
          toast.error('Please upload a resume to build your Core Profile first.');
          return;
        }
        if (!jobDescription.trim()) {
          toast.error('Please provide a job description.');
          return;
        }

        const generationPromise = new Promise<void>(async (resolve, reject) => {
          try {
            const generatedResume = await generateTailoredResume(coreProfile, jobDescription);
            const jobTitle = jobDescription.split('\n')[0].trim() || 'Untitled Generation';
            const newHistoryEntry: GenerationHistoryEntry = {
              id: uuidv4(),
              timestamp: new Date().toISOString(),
              jobTitle,
              jobDescription,
              generatedResume,
              coreProfileSnapshot: JSON.parse(JSON.stringify(coreProfile)),
            };
            set(state => ({
              generationHistory: [newHistoryEntry, ...state.generationHistory],
            }));
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        managedToast.promise(generationPromise, {
            loading: 'AI is generating your tailored resume...',
            success: 'Your tailored resume has been generated!',
            error: (err: any) => `Generation failed: ${err.message}`,
        });
      },

      clearAll: () => {
        set({ 
          resumes: {}, 
          jobDescription: '', 
          coreProfile: null, 
          generationHistory: [] 
        });
        managedToast.show('Cleared all data, including your Core Profile and History.');
      },

      deleteHistoryEntry: (id: string) => {
        set(state => ({
          generationHistory: state.generationHistory.filter(entry => entry.id !== id)
        }));
        managedToast.show('History entry deleted.');
      },

      updateCoreProfile: (profile: CoreProfile) => {
        set({ coreProfile: profile });
      }
    }),
    {
      name: 'resume-optimizer-storage-v3',
    }
  )
);
