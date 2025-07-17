import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const Login = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
      style={{ perspective: '1000px' }}
    >
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div className="aurora-1"></div>
        <div className="aurora-2"></div>
        <div className="aurora-3"></div>
      </div>
      <style>{`
        .aurora-1, .aurora-2, .aurora-3 {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }
        .aurora-1 { top: -20%; left: -20%; width: 50vw; height: 50vw; background: #204DFF; animation: move1 15s infinite alternate; }
        .aurora-2 { bottom: -20%; right: -20%; width: 40vw; height: 40vw; background: #8B5CF6; animation: move2 18s infinite alternate; }
        .aurora-3 { top: 20%; right: 10%; width: 30vw; height: 30vw; background:rgb(63, 39, 136); animation: move3 20s infinite alternate; }
        @keyframes move1 { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(100px, 50px) rotate(30deg); } }
        @keyframes move2 { from { transform: translate(0, 0) scale(1); } to { transform: translate(-80px, 40px) scale(1.5); } }
        @keyframes move3 { from { transform: rotate(0deg); } to { transform: rotate(60deg); } }
      `}</style>
      
      <div className="container relative z-10 mx-auto p-4">
        <div className="grid md:grid-cols-2 items-center gap-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex flex-col items-start text-left"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
              <img src="/logo.svg" alt="CareerCanvas logo" className="h-16 w-16" />
              <h1 className="text-5xl font-bold text-white [text-shadow:0_0_20px_rgba(255,255,255,0.3)]">CareerCanvas</h1>
            </motion.div>
            <motion.p variants={itemVariants} className="text-2xl text-blue-200 mt-2 font-light">
              Craft your professional story. <span className="font-medium text-white">Effortlessly.</span>
            </motion.p>
            <motion.p variants={itemVariants} className="text-md text-blue-100 mt-4 max-w-md">
              Leverage AI to build a resume that stands out and is tailored to your dream job.
            </motion.p>
          </motion.div>

          <motion.div
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl" style={{ transformStyle: 'preserve-3d' }}>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-blue-200">Sign in to unlock your potential.</CardDescription>
              </CardHeader>
              <CardContent>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: {
                      ...ThemeSupa,
                      variables: {
                        ...ThemeSupa.variables,
                        colors: {
                          ...ThemeSupa.default.colors,
                          brand: '#204DFF',
                          brandAccent: '#8B5CF6',
                          brandButtonText: 'black',
                          defaultButtonBackgroundHover: '#204DFF',
                        },
                      },
                    },
                    className: {
                      button: 'mt-4 bg-primary border-0 text-primary-foreground hover:bg-accent hover:text-accent-foreground font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full',
                      input: 'bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 w-full',
                      label: 'text-sm font-medium text-blue-100 text-left w-full',
                      anchor: 'text-blue-200 hover:text-white transition-colors',
                      message: 'text-red-300 text-sm mt-2',
                    }
                  }}
                  providers={[]}
                  theme="dark"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login; 