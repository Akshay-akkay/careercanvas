import React from 'react';
import { CoreProfile } from '../../types';
import { Mail, Phone, Linkedin, Github, Globe, Briefcase, GraduationCap, Lightbulb, Award, User, Wrench } from 'lucide-react';

const IconMap = {
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
  portfolio: Globe,
  other: Globe,
};

interface ModernTemplateProps {
  profile: CoreProfile;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ profile }) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications, additionalSections } = profile;

  return (
    <div className="bg-white text-black p-8 font-sans text-[11px] leading-normal">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold mb-1">{personalDetails.name}</h1>
        <div className="flex items-center gap-x-2 gap-y-1 text-[11px] flex-wrap">
          {personalDetails.email && (
            <a href={`mailto:${personalDetails.email}`} className="flex items-center gap-1.5 text-blue-800 hover:underline">
              <Mail size={12} />
              <span>{personalDetails.email}</span>
            </a>
          )}
          {personalDetails.phone && (
            <>
              {personalDetails.email && <span className="mx-1 text-gray-400">|</span>}
              <span className="flex items-center gap-1.5">
                <Phone size={12} />
                <span>{personalDetails.phone}</span>
              </span>
            </>
          )}
          {personalDetails.links && personalDetails.links.map((link, index) => {
            const Icon = IconMap[link.type] || Globe;
            const hasPreviousItem = personalDetails.email || personalDetails.phone || index > 0;
            let url = link.url;
            if (link.type === 'linkedin') {
              url = `https://linkedin.com/in/${link.text.replace('@', '')}`;
            } else if (link.type === 'github') {
              url = `https://github.com/${link.text.replace('@', '')}`;
            }
            return (
              <React.Fragment key={link.url}>
                {hasPreviousItem && <span className="mx-1 text-gray-400">|</span>}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-800 hover:underline"
                >
                  <Icon size={12} />
                  <span>{link.text}</span>
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
            <User size={12} className="text-gray-700" />
            <span>SUMMARY</span>
          </h2>
          <p className="text-[11px] leading-normal">{typeof summary === 'string' ? summary : String(summary)}</p>
        </section>
      )}

      {/* Skills */}
      {skills && Object.keys(skills).length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
            <Wrench size={12} className="text-gray-700" />
            <span>SKILLS</span>
          </h2>
          <div className="space-y-1">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category}>
                <div className="text-[11px] font-bold">• {category}:</div>
                <div className="text-[11px] ml-4">
                  {skillList.map((skill, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="mx-1">•</span>}
                      {typeof skill === 'string' ? skill : String(skill)}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
            <Briefcase size={12} className="text-gray-700" />
            <span>EXPERIENCE</span>
          </h2>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{typeof exp.company === 'string' ? exp.company : String(exp.company)}</span>
                    <span className="mx-1">|</span>
                    <span className="italic">{typeof exp.title === 'string' ? exp.title : String(exp.title)}</span>
                  </div>
                  <span className="text-[11px]">{typeof exp.duration === 'string' ? exp.duration : String(exp.duration)}</span>
                </div>
                <ul className="list-disc list-outside pl-4 mt-0.5 space-y-0.5 text-[11px]">
                  {exp.responsibilities.slice(0, 8).map((resp, i) => {
                    if (typeof resp === 'string') {
                      return <li key={i}>{resp}</li>;
                    } else if (resp && typeof resp === 'object') {
                      const desc = (resp as { description?: string })?.description;
                      return <li key={i}>{desc || JSON.stringify(resp)}</li>;
                    } else {
                      return <li key={i}>{String(resp)}</li>;
                    }
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
            <Lightbulb size={12} className="text-gray-700" />
            <span>PROJECTS</span>
          </h2>
          <div className="space-y-3">
            {projects.map((proj, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{typeof proj.title === 'string' ? proj.title : String(proj.title)}</span>
                    {proj.link && (
                      <>
                        <span className="mx-1">|</span>
                        <a href={typeof proj.link === 'string' ? proj.link : '#'} className="text-[10px] italic text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                          {typeof proj.link === 'string' ? proj.link : String(proj.link)}
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <ul className="list-disc list-outside pl-4 mt-0.5 space-y-0.5 text-[11px]">
                  {proj.description && (
                    Array.isArray(proj.description)
                      ? proj.description.slice(0, 8).map((desc, i) => {
                          if (typeof desc === 'string') {
                            return <li key={i}>{desc}</li>;
                          } else if (desc && typeof desc === 'object') {
                            const d = (desc as { description?: string })?.description;
                            return <li key={i}>{d || JSON.stringify(desc)}</li>;
                          } else {
                            return <li key={i}>{String(desc)}</li>;
                          }
                        })
                      : (typeof proj.description === 'object' && proj.description !== null
                          ? <li>{(proj.description as { description?: string })?.description || JSON.stringify(proj.description)}</li>
                          : <li>{String(proj.description)}</li>
                        )
                  )}
                </ul>
                {proj.techStack?.length > 0 && <p className="text-[10px] mt-0.5 italic">Tech: {proj.techStack.map(tech => typeof tech === 'string' ? tech : String(tech)).join(', ')}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
            <GraduationCap size={12} className="text-gray-700" />
            <span>EDUCATION</span>
          </h2>
          <div className="space-y-1">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{typeof edu.university === 'string' ? edu.university : String(edu.university)}</span>
                  <div className="text-[11px] italic">{typeof edu.degree === 'string' ? edu.degree : String(edu.degree)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px]">{typeof edu.year === 'string' ? edu.year : String(edu.year)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
            <Award size={12} className="text-gray-700" />
            <span>CERTIFICATIONS</span>
          </h2>
          <div className="space-y-1">
            {certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{typeof cert.name === 'string' ? cert.name : String(cert.name)}</span>
                  <div className="text-[11px]">{typeof cert.authority === 'string' ? cert.authority : String(cert.authority)}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px]">{typeof cert.year === 'string' ? cert.year : String(cert.year)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional dynamic sections */}
      {additionalSections && Object.keys(additionalSections).length > 0 && (
        Object.entries(additionalSections).map(([heading, content]) => (
          <section key={heading} className="mb-4">
            <h2 className="text-[11px] font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5 flex items-center gap-1">
              <Lightbulb size={12} className="text-gray-700" />
              <span>{heading.toUpperCase()}</span>
            </h2>
            {typeof content === 'string' ? (
              <p className="text-[11px] leading-normal whitespace-pre-line">{content}</p>
            ) : Array.isArray(content) ? (
              <ul className="list-disc list-outside pl-4 mt-0.5 space-y-0.5 text-[11px]">
                {(content as Array<unknown>).map((item,index)=> (
                  <li key={index}>{typeof item==='string'? item : JSON.stringify(item)}</li>
                ))}
              </ul>
            ) : (
              <pre className="text-[10px] whitespace-pre-wrap break-words">{JSON.stringify(content,null,2)}</pre>
            )}
          </section>
        ))
      )}
    </div>
  );
};
