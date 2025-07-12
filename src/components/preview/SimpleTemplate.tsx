import React from 'react';
import { CoreProfile } from '../../types';

interface SimpleTemplateProps {
  profile: CoreProfile;
}

/**
 * A minimalist, single–column resume template that focuses on clarity.
 * This intentionally avoids icons and heavy styling so that users can
 * quickly see a very different look when they switch templates.
 */
export const SimpleTemplate: React.FC<SimpleTemplateProps> = ({ profile }) => {
  const { personalDetails, summary, experience, education, skills, projects, certifications } = profile;

  return (
    <div className="p-8 text-[11px] leading-normal font-sans text-black bg-white space-y-4">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{personalDetails.name || 'Your Name'}</h1>
        <p className="text-xs text-gray-700">
          {[personalDetails.email, personalDetails.phone].filter(Boolean).join(' | ')}
        </p>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 className="font-semibold text-sm uppercase border-b border-gray-300 mb-1">Summary</h2>
          <p className="whitespace-pre-line">{summary}</p>
        </section>
      )}

      {/* Skills */}
      {skills && Object.keys(skills).length > 0 && (
        <section>
          <h2 className="font-semibold text-sm uppercase border-b border-gray-300 mb-1">Skills</h2>
          <div className="space-y-1">
            {Object.entries(skills).map(([category, list]) => (
              <p key={category} className="pl-2 text-xs">
                <span className="font-semibold">{category}: </span>
                {list.join(', ')}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm uppercase border-b border-gray-300 mb-1">Experience</h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-semibold">
                  <span>{exp.title}</span>
                  <span className="italic text-gray-600">{exp.duration}</span>
                </div>
                <p className="text-gray-700">{exp.company}</p>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                  {exp.responsibilities.slice(0, 6).map((r, i) => (
                    <li key={i}>{typeof r === 'string' ? r : (r as any).description || JSON.stringify(r)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm uppercase border-b border-gray-300 mb-1">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <span className="font-semibold">{proj.title}</span>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-700 underline text-[10px]">
                    {proj.link}
                  </a>
                )}
                {proj.description && (
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5">
                    {(Array.isArray(proj.description) ? proj.description : [proj.description]).map((d, i) => (
                      <li key={i}>{typeof d === 'string' ? d : (d as any).description || JSON.stringify(d)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm uppercase border-b border-gray-300 mb-1">Education</h2>
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{edu.degree} – {edu.university}</span>
                <span className="italic text-gray-600">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <section>
          <h2 className="font-semibold text-sm uppercase border-b border-gray-300 mb-1">Certifications</h2>
          <ul className="list-disc list-inside ml-4 text-xs space-y-0.5">
            {certifications.map((cert, idx) => (
              <li key={idx}>{cert.name} – {cert.authority} {cert.year && `(${cert.year})`}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}; 