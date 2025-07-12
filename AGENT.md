# Resume.ai Agent Guide

## Commands
- `npm run dev` - Start development server (frontend)
- `npm run server` - Start Express server (backend)
- `npm run dev:all` - Start both frontend and backend concurrently
- `npm run build` - Build for production (runs tsc + vite build)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build

## Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **State Management**: Zustand for global state
- **Authentication**: Supabase Auth with session management
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: Puppeteer (Express server + serverless API)
- **AI Integration**: Google Gemini API for resume generation
- **File Processing**: Support for PDF, DOCX parsing
- **Deployment**: Hybrid (frontend + Express server + serverless functions)

## Code Style
- **Imports**: Use @ alias for src imports (`@/components/ui/Button`)
- **Components**: Functional components with TypeScript interfaces
- **Styling**: Tailwind classes with custom color palette (primary, accent, vivid)
- **UI Components**: shadcn/ui with Radix UI primitives
- **State**: Zustand stores in src/store/
- **Types**: Defined in src/types/
- **Error Handling**: React Hot Toast for notifications
- **Animations**: Framer Motion for complex animations, Tailwind for simple ones
