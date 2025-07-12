import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './Dialog';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  title: string;
  description: string;
  image?: string;
}

const tourSteps: TourStep[] = [
  {
    title: 'Welcome to CareerCanvas',
    description: 'Your all-in-one tool for creating tailored resumes that stand out. Let us show you around!',
  },
  {
    title: 'Upload Your Resumes',
    description: 'Start by uploading one or more existing resumes. We\'ll extract all your professional data and merge it into a powerful Core Profile.',
  },
  {
    title: 'Add Job Descriptions',
    description: 'Paste job descriptions to generate tailored resumes that match exactly what employers are looking for.',
  },
  {
    title: 'Analyze Your Profile',
    description: 'Get insights about your professional profile and discover areas for improvement.',
  },
  {
    title: 'Export Your Resume',
    description: 'Export your tailored resume as a beautifully formatted PDF with just one click, ready to impress employers.',
  }
];

export function TourGuide() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    // Check if this is the user's first visit
    const hasSeenTour = localStorage.getItem('careercanvas-tour-completed');
    if (!hasSeenTour) {
      setOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem('careercanvas-tour-completed', 'true');
    setOpen(false);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">{tourSteps[currentStep].title}</DialogTitle>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="py-4"
          >
            {tourSteps[currentStep].image && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={tourSteps[currentStep].image} 
                  alt={tourSteps[currentStep].title} 
                  className="rounded-lg max-h-40 object-contain"
                />
              </div>
            )}
            <DialogDescription className="text-center text-base">
              {tourSteps[currentStep].description}
            </DialogDescription>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center mt-2">
          {Array.from({ length: tourSteps.length }).map((_, index) => (
            <div
              key={index}
              className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-primary w-4'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between gap-2 mt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleComplete}
            >
              <X className="h-4 w-4 mr-1" />
              Skip Tour
            </Button>
          </div>
          
          <Button size="sm" onClick={nextStep}>
            {currentStep < tourSteps.length - 1 ? (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 