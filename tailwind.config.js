/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Plus Jakarta Sans', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(227, 100%, 56%)',
          '50': 'hsl(227, 100%, 97%)',
          '100': 'hsl(227, 100%, 94%)',
          '200': 'hsl(227, 100%, 88%)',
          '300': 'hsl(227, 100%, 81%)',
          '400': 'hsl(227, 100%, 74%)',
          '500': 'hsl(227, 100%, 66%)',
          '600': 'hsl(227, 100%, 56%)',
          '700': 'hsl(227, 100%, 49%)',
          '800': 'hsl(227, 100%, 42%)',
          '900': 'hsl(227, 100%, 35%)',
          '950': 'hsl(227, 100%, 25%)',
        },
        accent: {
          DEFAULT: 'hsl(261, 100%, 76%)',
          '50': 'hsl(261, 100%, 97%)',
          '100': 'hsl(261, 100%, 94%)',
          '200': 'hsl(261, 100%, 88%)',
          '300': 'hsl(261, 100%, 81%)',
          '400': 'hsl(261, 100%, 74%)',
          '500': 'hsl(261, 100%, 66%)',
          '600': 'hsl(261, 100%, 76%)',
          '700': 'hsl(261, 100%, 69%)',
          '800': 'hsl(261, 100%, 62%)',
          '900': 'hsl(261, 100%, 55%)',
          '950': 'hsl(261, 100%, 45%)',
        },
        /* Vivid palette exclusively for AI-focused gradients */
        vivid: {
          primary: '#204DFF',
          accent: '#8B5CF6',
        },
        background: {
          light: '#FFFFFF',
          dark: '#0F1117',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#171923',
        },
        border: {
          DEFAULT: 'hsl(214.3, 31.8%, 91.4%)',
          color: 'hsl(214.3, 31.8%, 91.4%)',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "fade-out": {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
        "slide-in-bottom": {
          from: { transform: "translateY(20px)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "pulse-gentle": {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "shimmer": {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        "scale-in": {
          from: { transform: 'scale(0.95)', opacity: 0 },
          to: { transform: 'scale(1)', opacity: 1 },
        },
        "bounce-in": {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '70%': { transform: 'scale(1.05)', opacity: 0.7 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        "gradient-x": {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.4s ease-out",
        "pulse-gentle": "pulse-gentle 2s infinite ease-in-out",
        "float": "float 3s infinite ease-in-out",
        "spin-slow": "spin-slow 3s linear infinite",
        "shimmer": "shimmer 2s infinite linear",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-in": "bounce-in 0.5s ease-out",
        "gradient-x": "gradient-x 4s ease infinite",
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(124, 58, 237, 0.5)',
        'glow-accent': '0 0 20px -5px rgba(45, 212, 191, 0.5)',
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 20px 35px -10px rgba(0, 0, 0, 0.08)',
        'inner-glow': 'inset 0 0 15px -5px rgba(124, 58, 237, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
