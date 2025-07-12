export interface Link {
  type: 'linkedin' | 'github' | 'portfolio' | 'email' | 'phone' | 'other';
  url: string;
  text: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  university: string;
  year: string;
}

export interface Project {
  title: string;
  description: string[];
  techStack: string[];
  link?: string;
}

export interface Certification {
  name: string;
  authority: string;
  year: string;
}

export interface CoreProfile {
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    links: Link[];
  };
  summary: string;
  skills: Record<string, string[]>;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  additionalSections?: Record<string, string>;
}

export interface GenerationHistoryEntry {
  id: string;
  timestamp: string;
  jobTitle: string;
  jobDescription: string;
  generatedResume: string; // This is the raw text output, kept for legacy/raw view
  coreProfileSnapshot: CoreProfile;
}
