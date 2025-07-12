import { useResumeStore } from '../../store/resumeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  BrainCircuit, Briefcase, GraduationCap, AlertTriangle, User, FileText, Award, GitBranch,
  Linkedin, Github, Globe, Mail, Phone
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Link } from '../../types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';

const LinkIcon = ({ type }: { type: Link['type'] }) => {
  switch (type) {
    case 'linkedin': return <Linkedin className="w-4 h-4" />;
    case 'github': return <Github className="w-4 h-4" />;
    case 'portfolio': return <Globe className="w-4 h-4" />;
    case 'email': return <Mail className="w-4 h-4" />;
    case 'phone': return <Phone className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

export default function ProfileAnalytics() {
  const { coreProfile } = useResumeStore();

  if (!coreProfile) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <AlertTriangle className="w-16 h-16 text-yellow-400 dark:text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Core Profile Data</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Upload a resume on the 'Resume Generator' tab to build your profile and see analytics here.
        </p>
      </div>
    );
  }

  const { personalDetails, summary, skills, experience, education, projects, certifications, additionalSections } = coreProfile;
  
  // Flatten skills regardless of structure
  const allSkills: string[] = skills && typeof skills === 'object' ? Object.values(skills).flat() : Array.isArray(skills) ? skills : [];

  // Helper to parse a duration string like "Aug 2020 - Present" → years (float)
  const parseYears = (duration: string): number => {
    if (!duration) return 0;
    const [startRaw, endRaw] = duration.split(/[-–]/).map(s => s.trim());
    const parseDate = (str: string): Date | null => {
      if (!str) return null;
      if (/present/i.test(str)) return new Date();
      // Accept "MMM YYYY" or "MMMM YYYY" or "YYYY"
      const date = new Date(str);
      if (!isNaN(date.getTime())) return date;
      return null;
    };
    const start = parseDate(startRaw);
    const end = parseDate(endRaw);
    if (!start || !end) return 0;
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
  };

  // Build a corpus of experiences to map skills → years
  const skillYears: Record<string, number> = {};
  coreProfile.experience.forEach(exp => {
    const years = parseYears(exp.duration);
    if (years <= 0) return;
    const text = `${exp.title} ${exp.company} ${(exp.responsibilities || []).join(' ')} ${('description' in exp && (exp as any).description) ? (exp as any).description : ''}`.toLowerCase();
    allSkills.forEach(skill => {
      if (text.includes(skill.toLowerCase())) {
        skillYears[skill] = (skillYears[skill] || 0) + years;
      }
    });
  });

  // Fallback: if no years calculated, default to 1
  const skillChartData = allSkills.map(skill => ({
    name: skill,
    value: skillYears[skill] ? parseFloat(skillYears[skill].toFixed(1)) : 1,
  })).sort((a,b)=>b.value-a.value).slice(0,15);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6 text-primary" />
            {personalDetails.name || 'Your Name'}
          </CardTitle>
          <CardDescription>Consolidated Contact Information & Links</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {personalDetails.links.map((link, index) => (
            <Button asChild variant="outline" size="sm" key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <LinkIcon type={link.type} />
                {link.text}
              </a>
            </Button>
          ))}
        </CardContent>
      </Card>

      {summary && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
          </CardContent>
        </Card>
      )}

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary" />
            Core Skills
          </CardTitle>
          <CardDescription>All unique skills from your profile (Top 15 shown).</CardDescription>
        </CardHeader>
        <CardContent>
          {skillChartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChartData} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} interval={0} />
                  <Tooltip cursor={{ fill: 'rgba(128,128,128,0.1)' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" name="Present" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No skill data found in your profile.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Experience Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {experience.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No experience data found.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {experience.map((exp, index) => (
                <AccordionItem
                  key={index}
                  value={`exp-${index}`}
                  className="group rounded-md border-none transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/50 data-[state=open]:bg-primary/5"
                >
                  <AccordionTrigger className="text-left px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full ring-2 ring-primary/30" />
                        {index < experience.length - 1 && (
                          <div className="w-px flex-grow bg-gray-300 dark:bg-gray-700" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200 leading-tight text-[13px]">
                          {exp.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{exp.company}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{exp.duration}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {('description' in exp && (exp as any).description) && (
                      typeof (exp as any).description === 'string' ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 whitespace-pre-line">{(exp as any).description}</p>
                      ) : (
                        <pre className="text-sm text-gray-600 dark:text-gray-300 mb-2 whitespace-pre-line break-words">
                          {JSON.stringify((exp as any).description, null, 2)}
                        </pre>
                      )
                    )}
                    {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {exp.responsibilities.map((item,i)=>{
                          if (typeof item === 'string') return <li key={i}>{item}</li>;
                          if (item && typeof item === 'object') {
                            // Attempt to show nicely if has description field
                            const desc = (item as any).description || JSON.stringify(item);
                            const prefix = (item as any).type ? `[${(item as any).type}] ` : '';
                            return <li key={i}>{prefix}{desc}</li>;
                          }
                          return null;
                        })}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {education.length > 0 ? education.map((edu, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{edu.degree}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{edu.university}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{edu.year}</p>
              </div>
            )) : <p className="text-sm text-gray-500 dark:text-gray-400">No education data found.</p>}
          </div>
        </CardContent>
      </Card>

      {projects.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-primary" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((proj, index) => (
              <div key={index}>
                <p className="font-semibold">{proj.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {Array.isArray(proj.description) ? proj.description.map((d,index)=>(typeof d==='string'? d : JSON.stringify(d))).join(' ') : 
                   (typeof proj.description==='string'? proj.description : JSON.stringify(proj.description))}
                </p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.techStack.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {certifications.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index}>
                <p className="font-semibold">{cert.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{cert.authority} {cert.year && `(${cert.year})`}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dynamic additional sections */}
      {additionalSections && Object.keys(additionalSections).length > 0 && (
        Object.entries(additionalSections).map(([heading, content]) => (
          <Card key={heading} className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                {heading}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof content === 'string' && (
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{content}</p>
              )}
              {Array.isArray(content) && (
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {content.map((item,i)=>(<li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>))}
                </ul>
              )}
              {typeof content === 'object' && !Array.isArray(content) && (
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {Object.entries(content).map(([k,v])=> (
                    <p key={k}><span className="font-medium capitalize">{k}: </span>{typeof v==='string'? v : JSON.stringify(v)}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
