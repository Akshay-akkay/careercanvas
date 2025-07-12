import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '../ui/Dialog';
import { FileText, Eye, Trash2, Calendar, Clock, Briefcase } from 'lucide-react';
import ResumePreview from '../preview/ResumePreview';
import { motion, AnimatePresence } from 'framer-motion';

export default function GenerationHistory() {
  const { generationHistory, deleteHistoryEntry } = useResumeStore((state) => ({
    generationHistory: state.generationHistory,
    deleteHistoryEntry: state.deleteHistoryEntry,
  }));

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent dialog from opening
    // A confirmation dialog would be ideal here.
    // For now, we'll just delete directly.
    // Consider using an <AlertDialog> for confirmation in the future.
    deleteHistoryEntry(id);
  };

  if (!generationHistory || generationHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-transparent backdrop-blur-md">
            <CardTitle className="text-xl">Generation History</CardTitle>
            <CardDescription>Your generated resumes will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg mt-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No History Yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
              Generate a tailored resume from the 'Resume Generator' tab to see it here.
              Each generation is saved automatically for easy access.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-transparent backdrop-blur-md">
          <CardTitle className="text-xl">Generation History</CardTitle>
          <CardDescription>
            Review and reuse your previously generated resumes. History is sorted with the most recent first.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {generationHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Dialog>
                    <Card className="flex flex-col hover:shadow-lg transition-all duration-300 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-primary/30 group">
                      <CardHeader className="pb-2">
                        <CardTitle className="truncate text-lg group-hover:text-primary transition-colors duration-300">
                          {item.jobTitle}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.timestamp).toLocaleDateString()}
                          <Clock className="h-3.5 w-3.5 ml-2" />
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow py-2">
                        <div className="flex items-start gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {item.jobDescription}
                          </p>
                        </div>
                      </CardContent>
                      <div className="p-4 pt-0 mt-auto flex items-center gap-2 border-t border-gray-100 dark:border-gray-800">
                        <DialogTrigger asChild>
                          <Button className="w-full group" variant="primary">
                            <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                            View Resume
                          </Button>
                        </DialogTrigger>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={(e) => handleDelete(e, item.id)}
                          className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] p-0">
                        <DialogHeader className="sr-only">
                          <DialogTitle>{item.jobTitle}</DialogTitle>
                          <DialogDescription>Generated on {new Date(item.timestamp).toLocaleString()}</DialogDescription>
                        </DialogHeader>
                        <ResumePreview profile={item.coreProfileSnapshot} />
                      </DialogContent>
                    </Card>
                  </Dialog>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
