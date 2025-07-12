import React, { useRef } from 'react';
import { CoreProfile } from '../../types';
import { Button } from '../ui/Button';
import { Pencil, Copy, Printer, FileText, Clipboard, Braces } from 'lucide-react';
import { ModernTemplate } from './ModernTemplate';
import { SimpleTemplate } from './SimpleTemplate';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../ui/Dialog';
import { useResumeStore } from '../../store/resumeStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { applyProfileEdit } from '../../lib/gemini';
import { Tooltip } from '../ui/Tooltip';
import { JsonEditor } from '../ui/JsonEditor';

interface ResumePreviewProps {
  profile: CoreProfile;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ profile }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  // local editable profile state
  const [currentProfile, setCurrentProfile] = React.useState(profile);
  React.useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  // template switching state
  const templates = {
    modern: ModernTemplate,
    simple: SimpleTemplate,
  } as const;
  type TemplateKey = keyof typeof templates;
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateKey>('modern');

  // edit dialog state
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editJson, setEditJson] = React.useState<string>('');

  const [instruction, setInstruction] = React.useState('');
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  // zustand action to update global core profile when available
  const { updateCoreProfile } = useResumeStore();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !resumeRef.current) {
      toast.error('Could not open print window.');
      return;
    }

    // Get all stylesheets from the document
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
        } catch (e) {
          // Skip CORS-protected stylesheets
          console.warn('Could not read stylesheet:', e);
          return '';
        }
      }).join('');

    // Create a clean name for the resume
    const cleanName = profile.personalDetails.name
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .trim();

    // Get the HTML content
    const content = resumeRef.current.innerHTML;

    // Write the content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${cleanName}_Resume</title>
        <style>
          ${styles}
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: white;
          }
          * { 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .resume-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: none;
            overflow: hidden;
          }
          ul.list-disc li {
            list-style-type: disc !important;
            display: list-item !important;
          }
          .section {
            page-break-inside: avoid;
            margin-bottom: 12px;
          }
          .section-header {
            page-break-after: avoid;
            margin-top: 15px;
          }
          ul, ol {
            page-break-before: avoid;
          }
          li {
            page-break-inside: avoid;
          }
          p {
            orphans: 3;
            widows: 3;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
            }
            .resume-container {
              box-shadow: none;
              margin: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="p-4 no-print">
          <button 
            onclick="window.print(); return false;" 
            style="display: flex; align-items: center; gap: 8px; background: #4f46e5; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; margin: 0 auto 20px;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect width="12" height="8" x="6" y="14"></rect></svg>
            Print Resume
          </button>
          <p style="text-align: center; margin-bottom: 20px; color: #666;">Tip: Use your browser's print dialog to save as PDF or print. For best results, set margins to "None" and enable "Background Graphics".</p>
        </div>
        <div class="resume-container">
          ${content}
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    
    // Give time for resources to load before triggering print
    setTimeout(() => {
      try {
        printWindow.focus();
      } catch (e) {
        console.error('Error focusing print window:', e);
      }
    }, 500);
  };

  const handleDirectPrint = () => {
    if (!resumeRef.current) {
      toast.error('Could not find resume content to print.');
      return;
    }

    const toastId = toast.loading('Preparing print view...');
    
    try {
      handlePrint();
      toast.success('Print dialog opened!', { id: toastId });
    } catch (err: any) {
      console.error('Print Error:', err);
      toast.error(`Failed to open print dialog: ${err.message}`, { id: toastId });
    }
  };

  const handleChangeTemplate = () => {
    const keys = Object.keys(templates) as TemplateKey[];
    const currentIndex = keys.indexOf(selectedTemplate);
    const next = keys[(currentIndex + 1) % keys.length];
    setSelectedTemplate(next);
    toast.success(`Switched to ${next.charAt(0).toUpperCase() + next.slice(1)} template`);
  };

  const handleOpenEdit = () => {
    setEditJson(JSON.stringify(currentProfile, null, 2));
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    try {
      const parsed = JSON.parse(editJson);
      setCurrentProfile(parsed);
      updateCoreProfile(parsed);
      toast.success('Profile updated!');
      setIsEditOpen(false);
    } catch (e: any) {
      toast.error(`Invalid JSON: ${e.message}`);
    }
  };

  const handleAiApply = async () => {
    if (!instruction.trim()) {
      toast.error('Please enter an instruction for the AI.');
      return;
    }
    setIsAiLoading(true);
    const toastId = toast.loading('AI is updating your profile...');
    try {
      const updated = await applyProfileEdit(currentProfile, instruction);
      setCurrentProfile(updated);
      updateCoreProfile(updated);
      setEditJson(JSON.stringify(updated, null, 2));
      toast.success('AI applied your changes!', { id: toastId });
      setInstruction('');
    } catch (err: any) {
      console.error(err);
      toast.error(`AI failed: ${err.message}`, { id: toastId });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-800/50 rounded-lg overflow-hidden transition-colors duration-300">
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 p-4 pr-14 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold"
        >
          Resume Preview
        </motion.h2>
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <Tooltip content="Export / Print">
            <Button onClick={handleDirectPrint} size="icon" className="flex-1 sm:flex-none">
              <Printer className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </Tooltip>
          <Tooltip content="Switch Template">
            <Button variant="secondary" onClick={handleChangeTemplate} size="icon" className="flex-1 sm:flex-none">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Change Template</span>
            </Button>
          </Tooltip>
          <Tooltip content="Edit / AI Assist">
            <Button variant="primary" onClick={handleOpenEdit} size="icon" className="flex-1 sm:flex-none">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Content</span>
            </Button>
          </Tooltip>
        </div>
      </header>
      <main className="flex-grow overflow-auto p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div ref={resumeRef} className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-lg">
            {(() => {
              const TemplateComp = templates[selectedTemplate];
              return <TemplateComp profile={currentProfile} />;
            })()}
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full shadow-md flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 animate-pulse-gentle">
            <FileText className="h-3 w-3" />
            A4 Format
          </div>
        </motion.div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[95vw] max-w-5xl">
          <DialogHeader>
            <DialogTitle>Edit Core Profile (JSON)</DialogTitle>
            <DialogDescription>
              You may edit the JSON directly or provide a natural-language instruction for the AI.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            {/* Manual JSON Column */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2 pr-10">
                <label className="text-sm font-medium">Manual JSON Edit</label>
                <div className="flex items-center gap-2 mr-10">
                  <Tooltip content="Beautify / Format JSON">
                    <Button variant="ghost" size="icon" onClick={() => {
                      try { setEditJson(JSON.stringify(JSON.parse(editJson), null, 2)); }
                      catch { toast.error('Invalid JSON: cannot format'); }
                    }}>
                      <Braces className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Copy to Clipboard">
                    <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(editJson).then(() => toast.success('Copied!'))}>
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <JsonEditor value={editJson} onChange={setEditJson} />
            </div>

            {/* AI Column */}
            <div className="flex flex-col h-full">
              <label className="text-sm font-medium mb-2">AI Assistant</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Add Docker to DevOps skills"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <Button onClick={handleAiApply} disabled={isAiLoading} variant="primary" className="flex-shrink-0">
                  {isAiLoading ? 'Applying...' : 'Run AI'}
                </Button>
              </div>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">Tip: Keep instructions concise and specific for best results.</p>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumePreview;
