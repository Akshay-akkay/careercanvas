import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Button } from './components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/Sheet';
import { Menu, Sun, Moon, LayoutGrid, Sparkles, ChevronsLeft, ChevronsRight, FileText, LogOut } from 'lucide-react';
import CoreProfileTab from './components/tabs/CoreProfileTab';
import GenerateResumeTab from './components/tabs/GenerateResumeTab';
import GenerateCV from './components/tabs/GenerateCV';
import { useTheme } from './components/theme-provider';
import { TourGuide } from './components/ui/TourGuide';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './lib/utils';
import { supabase } from './lib/supabaseClient';
import Login from './components/auth/Login';
import { Session } from '@supabase/supabase-js';

type Tab = 'core' | 'generate' | 'cv';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'core', label: 'Core Profile', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'generate', label: 'Generate Resume', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'cv', label: 'Generate CV', icon: <FileText className="w-4 h-4" /> },
];

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('core');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Ensure hydration is complete before animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'core':
        return <CoreProfileTab />;
      case 'generate':
        return <GenerateResumeTab />;
      case 'cv':
        return <GenerateCV />;
      default:
        return null;
    }
  };

  const NavLinks = ({ direction = 'col', showLabel = true }: { direction?: 'row' | 'col'; showLabel?: boolean }) => (
    <nav className={cn(
      'flex',
      direction === 'col' ? 'flex-col gap-2' : 'flex-row items-center gap-6'
    )}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            setSheetOpen(false);
          }}
          className={cn(
            'text-sm font-medium transition-all duration-300 flex items-center gap-2 py-2 px-1',
            direction === 'row' ? 'border-b-2' : 'border-l-2',
            activeTab === tab.id
              ? 'text-primary dark:text-primary-400 border-primary dark:border-primary-400'
              : 'text-gray-600 dark:text-gray-400 border-transparent hover:border-primary/30',
            !showLabel && 'justify-center w-full px-0 border-l-0',
          )}
          title={showLabel ? undefined : tab.label}
        >
          {tab.icon}
          {showLabel && tab.label}
        </button>
      ))}
    </nav>
  );

  if (!session) {
    return <Login />
  }

  if (!mounted) return null;

  return (
    <>
      <TourGuide />
      <Toaster position="bottom-right" />
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300">
        {/* Sidebar for desktop */}
        <aside className={cn(
          'hidden md:flex flex-col glass border border-gray-200 dark:border-gray-800 shadow-soft py-6 space-y-6 transition-all duration-300',
          collapsed ? 'w-16 items-center px-2' : 'w-64 px-4'
        )}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'px-2')}
          >
            {!collapsed ? (
              <>
                <img src="/logo.svg" alt="CareerCanvas logo" className="h-8 w-8" />
                <span className="font-bold text-2xl gradient-text">CareerCanvas</span>
              </>
            ) : (
              <img src="/logo.svg" alt="CareerCanvas logo" className="h-8 w-8" />
            )}
          </motion.div>

          {/* Theme toggle (top) */}
          <div
            className={cn(
              'flex transition-all duration-300',
              collapsed ? 'flex-col items-center gap-2' : 'mt-4 gap-2'
            )}
          >
            {/* Theme toggle styled like nav buttons */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={cn(
                'group relative text-sm font-medium transition-all duration-300 flex items-center py-2',
                collapsed ? 'justify-center w-full px-0' : 'gap-2 px-1',
                'border-l-2 border-transparent hover:border-primary/30 text-gray-600 dark:text-gray-400'
              )}
              title={collapsed ? 'Toggle theme' : undefined}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:text-amber-500" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:text-blue-500" />
              {!collapsed && 'Theme'}
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className={cn(
                'group relative text-sm font-medium transition-all duration-300 flex items-center py-2',
                collapsed ? 'justify-center w-full px-0' : 'gap-2 px-1',
                'border-l-2 border-transparent hover:border-primary/30 text-gray-600 dark:text-gray-400'
              )}
              title={collapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && 'Sign Out'}
            </button>
          </div>

          <NavLinks direction="col" showLabel={!collapsed} />

          <div className="mt-auto p-4">
          </div>

          {/* Collapse button at the bottom-right */}
          <div
            className={cn(
              'mt-auto w-full pb-2',
              collapsed ? 'flex justify-center' : 'flex'
            )}
          >
            <button
              onClick={() => setCollapsed((c) => !c)}
              className={cn(
                'group text-sm font-medium transition-all duration-300 flex items-center py-2',
                collapsed ? 'justify-center w-full px-0 border-l-0' : 'gap-2 px-1',
                'border-l-2 border-transparent hover:border-primary/30 text-gray-600 dark:text-gray-400'
              )}
              aria-label="Toggle sidebar"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              {!collapsed && 'Collapse'}
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex flex-col flex-1">
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 glass border border-b border-gray-200 dark:border-gray-800 shadow-soft px-4 md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs">
                <SheetHeader className="border-b pb-4 mb-4 border-gray-200 dark:border-gray-800">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <NavLinks direction="col" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold text-xl gradient-text"
            >
              CareerCanvas
            </motion.span>
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="group"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:text-amber-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:text-blue-500" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </header>

          {/* Animated content */}
          <AnimatePresence mode="wait">
            <motion.main 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"
            >
              {renderContent()}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;
