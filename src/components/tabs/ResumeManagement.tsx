import { useState } from 'react';
import { useResumeStore, ResumeFile } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, FileText, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ResumeViewer = ({ resume }: { resume: ResumeFile }) => {
  const [view, setView] = useState<'original' | 'generated'>('generated');

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mt-4"
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="truncate max-w-xs sm:max-w-md">{resume.fileName}</CardTitle>
              <CardDescription>Status: <span className="font-medium capitalize">{resume.status}</span></CardDescription>
            </div>
            {resume.status === 'complete' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTextFile(resume.generatedText!, `optimized-${resume.fileName}.txt`)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {resume.status === 'complete' ? (
            <div>
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                  onClick={() => setView('generated')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'generated' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  Optimized Version
                </button>
                <button
                  onClick={() => setView('original')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'original' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                  Original Version
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <pre className="text-sm whitespace-pre-wrap p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg max-h-96 overflow-y-auto font-sans">
                    {view === 'generated' ? resume.generatedText : resume.originalText}
                  </pre>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : resume.status === 'error' ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">{resume.error}</p>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>Resume is being processed. Please wait.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ResumeManagement() {
  const resumes = Object.values(useResumeStore(state => state.resumes));
  const [visibleResumes, setVisibleResumes] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) => {
    setVisibleResumes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Resumes Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Go to the 'Upload & Generate' tab to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map(resume => (
        <Card key={resume.id}>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-medium text-gray-800 dark:text-gray-200">{resume.fileName}</span>
            </div>
            <Button variant="ghost" onClick={() => toggleVisibility(resume.id)}>
              {visibleResumes[resume.id] ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {visibleResumes[resume.id] ? 'Hide' : 'View'} Details
            </Button>
          </div>
          <AnimatePresence>
            {visibleResumes[resume.id] && <ResumeViewer resume={resume} />}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}
