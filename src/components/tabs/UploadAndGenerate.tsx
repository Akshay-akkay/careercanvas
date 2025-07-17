import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Trash2, Wand2, Loader2, CheckCircle2, AlertCircle, ArrowRight, Sparkles, FileCheck, Download, Eye, Brain } from 'lucide-react';
import { useResumeStore, ResumeFile } from '../../store/resumeStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardBadge } from '../ui/Card';
import { AnimatePresence, motion } from 'framer-motion';

const StatusIndicator = ({ status }: { status: ResumeFile['status'] }) => {
  const statusConfig = {
    pending: { icon: FileText, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', spin: false },
    parsing: { icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', spin: true },
    extracting: { icon: Brain, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', spin: false },
    merging: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', spin: false },
    merged: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', spin: false },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', spin: false },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300', config.bg)}>
      <Icon className={cn('w-4 h-4', config.color, config.spin && 'animate-spin')} />
    </div>
  );
};

const FileItem = ({ resumeFile, index }: { resumeFile: ResumeFile; index: number }) => {
  const { removeFile } = useResumeStore();
  const isProcessing = ['parsing', 'extracting', 'merging'].includes(resumeFile.status);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusText = (status: ResumeFile['status']) => {
    const statusText = {
      pending: 'Pending',
      parsing: 'Reading file...',
      extracting: 'Extracting data...',
      merging: 'Merging profile...',
      merged: 'Complete',
      error: 'Error occurred',
    };
    return statusText[status];
  };

  const getStatusBadge = (status: ResumeFile['status']) => {
    const variants = {
      pending: 'default' as const,
      parsing: 'info' as const,
      extracting: 'info' as const,
      merging: 'warning' as const,
      merged: 'success' as const,
      error: 'error' as const,
    };
    return variants[status];
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <Card variant="elevated" className={cn(
        'overflow-hidden transition-all duration-300 border',
        isProcessing && 'border-primary/30 bg-primary/5',
        resumeFile.status === 'merged' && 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10',
        resumeFile.status === 'error' && 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
      )}>
        {/* Processing overlay */}
        {isProcessing && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-50"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <CardContent size="sm" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <StatusIndicator status={resumeFile.status} />
              
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {resumeFile.fileName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <CardBadge variant={getStatusBadge(resumeFile.status)} className="text-xs">
                    {getStatusText(resumeFile.status)}
                  </CardBadge>
                  {resumeFile.status === 'merged' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                {resumeFile.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1 line-clamp-1">
                    {resumeFile.error}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {resumeFile.status === 'merged' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-1"
                >
                  <Button variant="ghost" size="icon-sm" className="hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    <Eye className="w-3 h-3 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                    <Download className="w-3 h-3 text-emerald-600" />
                  </Button>
                </motion.div>
              )}
              
              <Button 
                variant="ghost" 
                size="icon-sm"
                className="hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-all duration-200" 
                onClick={() => removeFile(resumeFile.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>

        {/* Progress bar for processing files */}
        {isProcessing && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        )}
      </Card>
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
  const [isDragHovered, setIsDragHovered] = useState(false);
  
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
    onDragEnter: () => setIsDragHovered(true),
    onDragLeave: () => setIsDragHovered(false),
    onDropAccepted: () => setIsDragHovered(false),
  });

  const resumeList = Object.values(resumes);
  const isProcessing = resumeList.some(r => r.status === 'parsing' || r.status === 'extracting' || r.status === 'merging');
  const canGenerate = !!coreProfile && jobDescription.trim().length > 0;
  const processingCount = resumeList.filter(r => ['parsing', 'extracting', 'merging'].includes(r.status)).length;
  const completedCount = resumeList.filter(r => r.status === 'merged').length;

  return (
    <div className="space-y-8">
      {showBuild && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="glass" className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center">
                    <UploadCloud className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle size="lg">Build Your Core Profile</CardTitle>
                    <CardDescription className="mt-1">
                      Upload resumes to extract and merge data into a powerful profile
                    </CardDescription>
                  </div>
                </div>
                {coreProfile && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardBadge variant="success" className="flex items-center gap-1">
                      <FileCheck className="w-3 h-3" />
                      Profile Ready
                    </CardBadge>
                  </motion.div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-500 group overflow-hidden',
                  isDragActive || isDragHovered
                    ? 'border-primary bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 scale-[1.02] shadow-xl shadow-primary/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                )}
              >
                <input {...getInputProps()} />
                
                {/* Background animation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-gradient-shift" />
                </div>
                
                <motion.div
                  animate={{ 
                    y: isDragActive ? [0, -10, 0] : 0,
                    rotate: isDragActive ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ 
                    repeat: isDragActive ? Infinity : 0, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <div className={cn(
                    "w-20 h-20 rounded-2xl mb-6 flex items-center justify-center transition-all duration-500 shadow-lg",
                    isDragActive || isDragHovered
                      ? "bg-gradient-to-br from-primary to-accent scale-110"
                      : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-accent/20"
                  )}>
                    <UploadCloud className={cn(
                      "w-10 h-10 transition-all duration-500",
                      isDragActive || isDragHovered 
                        ? "text-white" 
                        : "text-gray-400 dark:text-gray-500 group-hover:text-primary"
                    )} />
                  </div>
                </motion.div>
                
                <div className="text-center relative z-10">
                  <h3 className={cn(
                    "text-lg font-semibold mb-2 transition-colors duration-300",
                    isDragActive ? "text-primary" : "text-gray-900 dark:text-gray-100"
                  )}>
                    {isDragActive ? 'Drop files here!' : 'Upload Your Resumes'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Drag & drop PDF or DOCX files, or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      PDF, DOCX
                    </span>
                    <span className="flex items-center gap-1">
                      <UploadCloud className="w-3 h-3" />
                      Max 5MB
                    </span>
                  </div>
                </div>
              </div>

              {/* File Processing Queue */}
              {resumeList.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Processing Queue</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {completedCount} of {resumeList.length} files processed
                        {processingCount > 0 && ` • ${processingCount} in progress`}
                      </p>
                    </div>
                    {resumeList.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(() => {
                                const completed = completedCount;
                                const processing = processingCount;
                                const total = resumeList.length;
                                // Give partial credit for processing files (50% for each processing file)
                                const adjustedProgress = (completed + (processing * 0.5)) / total;
                                return Math.min(adjustedProgress * 100, 100);
                              })()}%`
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            {/* Add shimmer effect when processing */}
                            {processingCount > 0 && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              />
                            )}
                          </motion.div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {(() => {
                            const completed = completedCount;
                            const processing = processingCount;
                            const total = resumeList.length;
                            const adjustedProgress = (completed + (processing * 0.5)) / total;
                            return Math.round(Math.min(adjustedProgress * 100, 100));
                          })()}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <AnimatePresence>
                      {resumeList.map((rf, index) => (
                        <FileItem key={rf.id} resumeFile={rf} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>
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
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle size="lg">Job Description</CardTitle>
                  <CardDescription className="mt-1">
                    Paste the job description to tailor your resume
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here...

Include:
• Job title and company
• Required skills and experience
• Responsibilities and qualifications
• Any specific requirements

The AI will analyze this to match your profile perfectly."
                  className={cn(
                    "w-full h-48 p-4 rounded-2xl border-2 transition-all duration-300 outline-none resize-none",
                    "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700",
                    "focus:border-primary focus:bg-white dark:focus:bg-gray-800",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  )}
                />
                <div className="absolute bottom-3 right-3">
                  <CardBadge variant={jobDescription.length > 100 ? 'success' : 'default'} className="text-xs">
                    {jobDescription.length} chars
                  </CardBadge>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  AI will analyze this to match your skills and experience
                </div>
                <div className="flex items-center gap-2">
                  {jobDescription.length > 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-1 text-emerald-600"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Good length
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button 
            size="xl" 
            variant="primary"
            onClick={generate} 
            disabled={!canGenerate || isProcessing} 
            className={cn(
              "flex-1 transition-all duration-300",
              !canGenerate && "opacity-60 cursor-not-allowed",
              canGenerate && "hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Generate Tailored Resume
              </>
            )}
          </Button>
          
          <Button 
            size="xl" 
            variant="destructive" 
            onClick={clearAll} 
            className="sm:w-auto transition-all duration-300"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Clear All
          </Button>
        </motion.div>
      )}
    </div>
  );
}
