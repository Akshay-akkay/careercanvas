import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Trash2, Wand2, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useResumeStore, ResumeFile } from '../../store/resumeStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { Shimmer } from '../ui/Shimmer';

const StatusIndicator = ({ status }: { status: ResumeFile['status'] }) => {
  switch (status) {
    case 'parsing':
    case 'extracting':
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    case 'merged':
      return <CheckCircle2 className="h-4 w-4 text-accent" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const FileItem = ({ resumeFile }: { resumeFile: ResumeFile }) => {
  const { removeFile } = useResumeStore();
  const isProcessing = ['parsing', 'extracting', 'merging'].includes(resumeFile.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-all duration-300"
    >
      {isProcessing && (
        <Shimmer className="absolute inset-0 rounded-lg opacity-60" />
      )}
      <div className="flex items-center gap-3 overflow-hidden relative z-10">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{resumeFile.fileName}</span>
          <div className="flex items-center gap-2">
            <StatusIndicator status={resumeFile.status} />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{resumeFile.status}</span>
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 flex-shrink-0 hover:bg-red-500/10 hover:text-red-500 transition-colors duration-300 relative z-10" 
        onClick={() => removeFile(resumeFile.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

interface UploadAndGenerateProps {
  showBuild?: boolean;
  showJob?: boolean;
  showActions?: boolean;
}

export default function UploadAndGenerate({ showBuild = true, showJob = true, showActions = true }: UploadAndGenerateProps) {
  const { resumes, jobDescription, setJobDescription, addFile, generate, clearAll, coreProfile } = useResumeStore();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => addFile(file));
  }, [addFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const resumeList = Object.values(resumes);
  const isProcessing = resumeList.some(r => r.status === 'parsing' || r.status === 'extracting');
  const canGenerate = !!coreProfile && jobDescription.trim().length > 0;

  return (
    <div className="space-y-6">
      {showBuild && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-500">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-transparent backdrop-blur-md">
              <CardTitle className="flex items-center gap-2 text-xl">
                <UploadCloud className="w-6 h-6" />
              Build Your Core Profile
              </CardTitle>
              <CardDescription>
                Upload one or more resumes (PDF or DOCX). We'll extract the data and merge it into a single, powerful profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={cn(
                  'flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300',
                  isDragActive 
                    ? 'border-primary bg-primary/10 scale-[1.02] shadow-glow' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ 
                    y: isDragActive ? [0, -10, 0] : 0
                  }}
                  transition={{ 
                    repeat: isDragActive ? Infinity : 0, 
                    duration: 1.5
                  }}
                >
                  <UploadCloud className={cn(
                    "w-16 h-16 mb-4 transition-colors duration-300",
                    isDragActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
                  )} />
                </motion.div>
                <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                  {isDragActive ? 'Drop the files here...' : 'Drag & drop files, or click to browse'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Max 5MB per file. Your Core Profile persists even if you remove files later.
                </p>
              </div>
              {resumeList.length > 0 && (
                <motion.div 
                  className="mt-6 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing Queue</h3>
                    {coreProfile && (
                      <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Profile Ready
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {resumeList.map(rf => <FileItem key={rf.id} resumeFile={rf} />)}
                  </AnimatePresence>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showJob && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-500">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-transparent backdrop-blur-md">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ArrowRight className="w-6 h-6" />
                Add Job Description
              </CardTitle>
              <CardDescription>
                Paste the job description below to tailor your resume from your Core Profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-48 p-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 outline-none resize-none"
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">AI will analyze this to match your profile</p>
                <p className="text-xs text-gray-500">{jobDescription.length} characters</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            size="lg" 
            variant="primary"
            onClick={generate} 
            disabled={!canGenerate || isProcessing} 
            className="flex-1 h-14 text-base font-medium transition-all duration-300 disabled:opacity-70"
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            )}
            Generate Tailored Resume
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={clearAll} 
            className="flex-1 sm:flex-none h-14 text-base font-medium transition-all duration-300 text-red-500 border-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Clear All Data
          </Button>
        </motion.div>
      )}
    </div>
  );
}
