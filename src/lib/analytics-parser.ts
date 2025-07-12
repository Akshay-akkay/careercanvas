/*
  AI-Powered Resume Analytics Parser
  This module is responsible for extracting structured data from raw resume text.
  It's designed to be robust and handle various formats found in AI-generated or human-written resumes.
*/

export interface Link {
  type: 'email' | 'phone' | 'linkedin' | 'github' | 'portfolio' | 'other';
  url: string;
  text: string;
}

export interface PersonalDetails {
  name: string;
  email: string | null;
  phone: string | null;
  links: Link[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  description?: string;
}

export interface EducationEntry {
  degree: string;
  university: string;
  year: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  techStack?: string[];
}

export interface CertificationEntry {
  name: string;
  authority: string;
  year?: string;
}

export interface ParsedAnalytics {
  personalDetails: PersonalDetails;
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  additionalSections: Record<string, string>;
}

const SECTION_MATCHERS = {
  summary: /^\s*(professional )?summary\s*:/im,
  skills: /^\s*(technical )?skills|technologies\s*:/im,
  experience: /^\s*(professional |work )?experience\s*:/im,
  education: /^\s*(education|academic background)\s*:/im,
  projects: /^\s*projects\s*:/im,
  certifications: /^\s*certifications|licenses &amp; certifications\s*:/im,
};

const parsePersonalDetails = (text: string): PersonalDetails => {
  const lines = text.split('\n');
  const name = lines[0]?.trim() || 'N/A';
  
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  
  const links: Link[] = [];
  const linkRegex = /(https?:\/\/[^\s,]+)/g;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    const url = match[0];
    let type: Link['type'] = 'other';
    if (url.includes('linkedin.com')) type = 'linkedin';
    else if (url.includes('github.com')) type = 'github';
    else if (url.includes('portfolio') || url.includes('behance')) type = 'portfolio';
    links.push({ type, url, text: url.replace(/https?:\/\//, '') });
  }

  if (emailMatch && !links.some(l => l.url.includes(emailMatch[0]))) {
      links.unshift({ type: 'email', url: `mailto:${emailMatch[0]}`, text: emailMatch[0] });
  }

  return {
    name,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    links,
  };
};

const parseSummary = (content: string): string => content || '';
const parseSkills = (content: string): string[] => {
  if (!content) return [];
  return content.split(/, ?|\n| • /).map(s => s.replace(/^-/, '').trim()).filter(s => s && s.length > 1);
};

const parseExperience = (content: string): ExperienceEntry[] => {
  if (!content) return [];
  const entries = content.split(/\n\s*\n+/);
  return entries.map(entry => {
    const lines = entry.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return null;
    return {
      title: lines[0],
      company: lines[1],
      duration: lines.length > 2 ? lines[2] : 'N/A',
      description: lines.slice(3).join('\n'),
    };
  }).filter(Boolean) as ExperienceEntry[];
};

const parseEducation = (content: string): EducationEntry[] => {
  if (!content) return [];
  const entries = content.split(/\n\s*\n+/);
  return entries.map(entry => {
    const lines = entry.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 1) return null;
    return {
      degree: lines[0],
      university: lines.length > 1 ? lines[1] : 'N/A',
      year: lines.length > 2 ? lines[2] : 'N/A',
    };
  }).filter(Boolean) as EducationEntry[];
};

const parseProjects = (content: string): ProjectEntry[] => {
    if (!content) return [];
    const entries = content.split(/\n\s*\n+/);
    return entries.map(entry => {
        const lines = entry.trim().split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 1) return null;
        const title = lines[0];
        const description = lines.slice(1).join(' ');
        const techStackMatch = description.match(/(tech stack|technologies used):?\s*(.*)/i);
        const techStack = techStackMatch ? techStackMatch[2].split(/, ?| • /).map(s => s.trim()) : [];
        return { title, description, techStack };
    }).filter(Boolean) as ProjectEntry[];
};

const parseCertifications = (content: string): CertificationEntry[] => {
    if (!content) return [];
    const entries = content.split('\n');
    return entries.map(entry => {
        const parts = entry.split(/, ?| - /);
        if (parts.length < 1) return null;
        return {
            name: parts[0]?.trim() || 'N/A',
            authority: parts[1]?.trim() || 'N/A',
            year: parts[2]?.trim() || undefined,
        };
    }).filter(Boolean) as CertificationEntry[];
};

export const parseResumeForAnalytics = (text: string | null): ParsedAnalytics => {
  const emptyAnalytics: ParsedAnalytics = {
    personalDetails: { name: '', email: null, phone: null, links: [] },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    additionalSections: {},
  };

  if (!text) return emptyAnalytics;

  const sections: { name: keyof typeof SECTION_MATCHERS; index: number }[] = [];
  for (const name in SECTION_MATCHERS) {
    const key = name as keyof typeof SECTION_MATCHERS;
    const match = text.match(SECTION_MATCHERS[key]);
    if (match && typeof match.index === 'number') {
      sections.push({ name: key, index: match.index });
    }
  }
  sections.sort((a, b) => a.index - b.index);

  const sectionContent: Record<string, string> = {};
  for (let i = 0; i < sections.length; i++) {
    const currentSection = sections[i];
    const nextSection = sections[i + 1];
    const start = currentSection.index;
    const end = nextSection ? nextSection.index : text.length;
    const sectionText = text.substring(start, end);
    const contentMatch = sectionText.match(SECTION_MATCHERS[currentSection.name]);
    if (contentMatch) {
      sectionContent[currentSection.name] = sectionText.substring(contentMatch[0].length).trim();
    }
  }

  const firstSectionStart = sections.length > 0 ? sections[0].index : text.length;
  const personalDetailsText = text.substring(0, firstSectionStart);
  const personalDetails = parsePersonalDetails(personalDetailsText);

  // Detect additional headings not captured by SECTION_MATCHERS
  const genericHeadingRegex = /^\s*([A-Za-z][A-Za-z &]+?)\s*:/gm;
  let matchHeading: RegExpExecArray | null;
  const allHeadings: { heading: string; index: number }[] = [];
  while ((matchHeading = genericHeadingRegex.exec(text)) !== null) {
    allHeadings.push({ heading: matchHeading[1].trim(), index: matchHeading.index });
  }
  allHeadings.sort((a, b) => a.index - b.index);

  const knownHeadings = new Set(Object.keys(SECTION_MATCHERS).map(k => k.toLowerCase()));
  const additionalSections: Record<string, string> = {};
  for (let i = 0; i < allHeadings.length; i++) {
    const { heading, index } = allHeadings[i];
    if (knownHeadings.has(heading.toLowerCase())) continue;
    const next = allHeadings[i + 1];
    const start = index + heading.length + 1; // plus colon len maybe inaccurate but fine
    const end = next ? next.index : text.length;
    additionalSections[heading] = text.substring(start, end).trim();
  }

  return {
    personalDetails,
    summary: parseSummary(sectionContent.summary || ''),
    skills: parseSkills(sectionContent.skills || ''),
    experience: parseExperience(sectionContent.experience || ''),
    education: parseEducation(sectionContent.education || ''),
    projects: parseProjects(sectionContent.projects || ''),
    certifications: parseCertifications(sectionContent.certifications || ''),
    additionalSections,
  };
};
