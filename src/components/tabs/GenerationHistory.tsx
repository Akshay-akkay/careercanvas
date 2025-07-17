import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardBadge } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '../ui/Dialog';
import { FileText, Eye, Trash2, Calendar, Clock, Briefcase, History, Download, Share2, BookOpen } from 'lucide-react';
import ResumePreview from '../preview/ResumePreview';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function GenerationHistory() {
  const { generationHistory, deleteHistoryEntry } = useResumeStore((state) => ({
    generationHistory: state.generationHistory,
    deleteHistoryEntry: state.deleteHistoryEntry,
  }));

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    
    // Animate out then delete
    setTimeout(() => {
      deleteHistoryEntry(id);
      setDeletingId(null);
    }, 300);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!generationHistory || generationHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="glass" className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle size="lg">Generation History</CardTitle>
                <CardDescription className="mt-1">
                  Your generated resumes will appear here
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center text-center py-16"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-lg flex items-center justify-center mb-6">
                <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No History Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                Generate your first tailored resume to see it here. Each generation is automatically saved for easy access and reuse.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <Button variant="primary" size="lg">
                  Generate Your First Resume
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Card variant="gradient-border" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center">
                <History className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle size="xl" gradient>
                  Generation History
                </CardTitle>
                <CardDescription size="lg" className="mt-2">
                  {generationHistory.length} resume{generationHistory.length !== 1 ? 's' : ''} generated
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CardBadge variant="info" className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {generationHistory.length} total
              </CardBadge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid of history items */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {generationHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: deletingId === item.id ? 0 : 1, 
                y: deletingId === item.id ? -20 : 0,
                scale: deletingId === item.id ? 0.95 : 1 
              }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <Dialog>
                <Card 
                  variant="elevated" 
                  hover 
                  className="flex flex-col h-full transition-all duration-300 hover:scale-[1.02] group-hover:shadow-xl relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="truncate group-hover:text-primary transition-colors duration-300 mb-2">
                          {item.jobTitle}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs">
                          <CardBadge variant="default" className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatTimeAgo(item.timestamp)}
                          </CardBadge>
                          <span className="text-gray-500 dark:text-gray-400">
                            {new Date(item.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {item.jobDescription}
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                        <span className="text-gray-500 dark:text-gray-400">Skills</span>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {Object.values(item.coreProfileSnapshot.skills || {}).flat().length}
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                        <span className="text-gray-500 dark:text-gray-400">Experience</span>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.coreProfileSnapshot.experience?.length || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <div className="p-4 pt-0 mt-auto relative z-10">
                    <div className="flex gap-2">
                      <DialogTrigger asChild>
                        <Button 
                          variant="primary" 
                          className="flex-1 group/btn"
                          size="sm"
                        >
                          <Eye className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                          View Resume
                        </Button>
                      </DialogTrigger>
                      
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        className="hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        className="hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] p-0">
                    <DialogHeader className="sr-only">
                      <DialogTitle>{item.jobTitle}</DialogTitle>
                      <DialogDescription>
                        Generated on {new Date(item.timestamp).toLocaleString()}
                      </DialogDescription>
                    </DialogHeader>
                    <ResumePreview profile={item.coreProfileSnapshot} />
                  </DialogContent>
                </Card>
              </Dialog>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      {generationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="soft" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your generation history
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  Export All
                </Button>
                <Button variant="destructive" size="sm">
                  Clear History
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
