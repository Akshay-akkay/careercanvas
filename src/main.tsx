import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { LazyMotion, domAnimation } from 'framer-motion'

// Load Inter font for better typography
const loadInterFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

// Load font
loadInterFont();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation}>
      <ThemeProvider defaultTheme="dark" storageKey="careercanvas-theme">
        <App />
      </ThemeProvider>
    </LazyMotion>
  </React.StrictMode>,
)
