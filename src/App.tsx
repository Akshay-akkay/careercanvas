import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Button } from './components/ui/Button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/Sheet';
import { Menu, Sun, Moon, LayoutGrid, Sparkles, ChevronsLeft, ChevronsRight, FileText, LogOut, Zap, User, Settings } from 'lucide-react';
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

const TABS: { id: Tab; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { 
    id: 'core', 
    label: 'Core Profile', 
    icon: <LayoutGrid className="w-5 h-5" />, 
    description: 'Build your comprehensive profile',
    color: 'from-blue-600 to-indigo-600'
  },
  { 
    id: 'generate', 
    label: 'Generate Resume', 
    icon: <Sparkles className="w-5 h-5" />, 
    description: 'Create tailored resumes',
    color: 'from-purple-600 to-pink-600'
  },
  { 
    id: 'cv', 
    label: 'Generate CV', 
    icon: <FileText className="w-5 h-5" />, 
    description: 'Professional CV generation',
    color: 'from-emerald-600 to-teal-600'
  },
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

  const NavLinks = ({ direction = 'col', showLabel = true, isMobile = false }: { direction?: 'row' | 'col'; showLabel?: boolean; isMobile?: boolean }) => (
    <nav className={cn(
      'flex',
      direction === 'col' ? 'flex-col gap-1' : 'flex-row items-center gap-6'
    )}>
      {TABS.map((tab, index) => (
        <motion.button
          key={tab.id}
          initial={{ opacity: 0, x: collapsed ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => {
            setActiveTab(tab.id);
            setSheetOpen(false);
          }}
          className={cn(
            'group relative text-sm font-semibold transition-all duration-300 flex items-center gap-3 py-3 px-4 rounded-2xl border-2',
            'hover:scale-[1.02] active:scale-[0.98] will-change-transform',
            !showLabel && 'justify-center w-full px-3',
            activeTab === tab.id
              ? `text-white bg-gradient-to-r ${tab.color} shadow-xl shadow-primary/30 scale-105 border-white/20 backdrop-blur-sm`
              : 'text-gray-700 dark:text-gray-300 border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md',
            isMobile && 'w-full justify-start'
          )}
          title={showLabel ? undefined : tab.label}
        >
          <div className={cn(
            'flex items-center justify-center relative z-10',
            activeTab === tab.id && !collapsed && 'animate-pulse-soft'
          )}>
            {tab.icon}
          </div>
          {showLabel && (
            <div className="flex flex-col items-start relative z-10 min-w-0 flex-1">
              <span className="font-semibold truncate">{tab.label}</span>
              {!collapsed && (
                <span className={cn(
                  'text-xs transition-colors duration-300 truncate',
                  activeTab === tab.id 
                    ? 'text-white/90' 
                    : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                )}>
                  {tab.description}
                </span>
              )}
            </div>
          )}
          {activeTab === tab.id && !collapsed && (
            <div className="relative z-10 flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-2 h-2 bg-white/50 rounded-full"
              />
            </div>
          )}
        </motion.button>
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
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 text-gray-900 dark:text-gray-50 transition-all duration-500">
        {/* Enhanced Sidebar for desktop */}
        <motion.aside 
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.1 }}
          className={cn(
            'hidden md:flex flex-col glass-primary border border-blue-200/30 dark:border-gray-800/50 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 transition-all duration-500 backdrop-blur-xl bg-gradient-to-b from-white/90 to-blue-50/50 dark:from-gray-900/90 dark:to-blue-950/30',
            collapsed ? 'w-20 items-center px-3 py-6' : 'w-80 px-6 py-8'
          )}
        >
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn('flex items-center gap-3 mb-8', collapsed ? 'justify-center' : '')}
          >
            {!collapsed ? (
              <>
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl gradient-text">CareerCanvas</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Resume Builder</span>
                </div>
              </>
            ) : (
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </motion.div>

          {/* User Info Section */}
          {!collapsed && session?.user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
                             className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200/30 dark:border-blue-800/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {session.user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Premium Plan
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1"
          >
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Workspace
              </h3>
            )}
            <NavLinks direction="col" showLabel={!collapsed} />
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              'space-y-2 pt-6 border-t border-blue-200/30 dark:border-blue-800/30',
              collapsed ? 'items-center' : ''
            )}
          >
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={cn(
                'group relative text-sm font-medium transition-all duration-300 flex items-center py-3 px-3 rounded-xl w-full',
                'hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-[0.98]',
                collapsed ? 'justify-center' : 'gap-3',
                'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              )}
              title={collapsed ? 'Toggle theme' : undefined}
            >
              <span className="relative flex items-center justify-center">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:text-purple-500" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:text-purple-500" />
              </span>
              {!collapsed && <span className="font-medium">Toggle Theme</span>}
            </button>

            {/* Settings */}
            {!collapsed && (
              <button className="group relative text-sm font-medium transition-all duration-300 flex items-center gap-3 py-3 px-3 rounded-xl w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-[0.98]">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </button>
            )}

            {/* Sign out */}
            <button
              onClick={() => supabase.auth.signOut()}
              className={cn(
                'group relative text-sm font-medium transition-all duration-300 flex items-center py-3 px-3 rounded-xl w-full',
                'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
                'hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-[1.02] active:scale-[0.98]',
                collapsed ? 'justify-center' : 'gap-3'
              )}
              title={collapsed ? 'Sign Out' : undefined}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="font-medium">Sign Out</span>}
            </button>

            {/* Collapse button */}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className={cn(
                'group text-sm font-medium transition-all duration-300 flex items-center py-2 px-3 rounded-xl w-full',
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800/50',
                collapsed ? 'justify-center' : 'gap-3'
              )}
              aria-label="Toggle sidebar"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="text-xs">Collapse</span>
                </>
              )}
            </button>
          </motion.div>
        </motion.aside>

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Enhanced Mobile Header */}
          <motion.header 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-30 flex h-16 items-center gap-4 glass border-b border-white/20 dark:border-gray-800/50 shadow-soft px-4 md:hidden backdrop-blur-xl"
          >
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs glass border-r border-white/20 dark:border-gray-800/50">
                <SheetHeader className="border-b pb-4 mb-6 border-white/20 dark:border-gray-700/50">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="gradient-text font-bold">CareerCanvas</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="space-y-4">
                  <NavLinks direction="col" isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">CareerCanvas</span>
            </div>
            
            <div className="ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="group hover:bg-gray-100 dark:hover:bg-gray-800/50"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 group-hover:text-purple-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 group-hover:text-purple-500" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </motion.header>

          {/* Enhanced content with better animations */}
          <AnimatePresence mode="wait">
            <motion.main 
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.4, 
                type: "spring", 
                bounce: 0.1,
                opacity: { duration: 0.3 }
              }}
              className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 min-h-0"
            >
              {/* Tab Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-4 mb-2"
              >
                <div className={cn(
                  'w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br text-white',
                  TABS.find(tab => tab.id === activeTab)?.color || 'from-blue-600 to-indigo-600'
                )}>
                  {TABS.find(tab => tab.id === activeTab)?.icon}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {TABS.find(tab => tab.id === activeTab)?.label}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    {TABS.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 min-h-0"
              >
                {renderContent()}
              </motion.div>
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;
