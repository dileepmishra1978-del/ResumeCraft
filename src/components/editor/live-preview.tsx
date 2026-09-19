'use client';

import React from 'react';
import { ResumeData, RenderCVTheme, TEMPLATE_CATALOG, TemplateCatalogEntry } from '@/types/resume';
import { Globe, Mail, Phone, MapPin, ExternalLink, Clock } from 'lucide-react';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export const ACTUAL_PREVIEW_WIDTH = 794;

interface LivePreviewProps {
  resume: ResumeData;
  scale?: number;
  canvasOnly?: boolean;
}

export type TemplateConfig = TemplateCatalogEntry;
export const TEMPLATE_NAMES = TEMPLATE_CATALOG;
export const TEMPLATE_CONFIGS = TEMPLATE_CATALOG;

export function LivePreview({ resume, canvasOnly = false }: LivePreviewProps) {
  const theme = resume.template || 'engineeringresumes';

  const isHarvard = theme === 'harvard';
  const isSb2nov = theme === 'sb2nov';
  const isModern = theme === 'moderncv';
  const isEmber = theme === 'ember';
  const isInk = theme === 'ink';
  const isOpal = theme === 'opal';
  const isEngClassic = theme === 'engineeringclassic';
  const isClassic = theme === 'classic';

  const isFresher = Boolean(
    resume.fresher_mode ?? (theme === 'harvard' || theme === 'sb2nov' || TEMPLATE_CATALOG[theme]?.fresher)
  );

  // Template-specific design tokens
  const themeConfig = (() => {
    switch (theme) {
      case 'moderncv':
        return {
          fontFamily: 'var(--font-outfit), sans-serif',
          primaryColor: '#004F90',
          headerAlign: 'left' as const,
          headerBorder: 'border-b-2 border-[#004F90]/25 pb-4 mb-5',
          nameClass: 'text-3xl font-extrabold text-[#004F90] tracking-tight',
          roleClass: 'inline-block text-xs font-semibold text-[#004F90] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded mt-1.5 uppercase tracking-wider',
          sectionTitle: 'font-bold uppercase tracking-wider text-xs text-[#004F90]',
          sectionBorder: 'border-b-2 border-[#004F90] pb-1 mb-3 flex items-center justify-between',
          dateColor: 'text-[#004F90] font-medium',
          badgeClass: 'font-semibold text-[#004F90] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-[11px]',
          topBar: 'h-1.5 w-full bg-[#004F90] -mt-10 sm:-mt-14 mb-6 rounded-t',
        };
      case 'ember':
        return {
          fontFamily: 'var(--font-outfit), sans-serif',
          primaryColor: '#9B2319',
          headerAlign: 'left' as const,
          headerBorder: 'border-b border-[#9B2319]/25 pb-4 mb-5',
          nameClass: 'text-3xl font-extrabold text-[#9B2319] tracking-tight',
          roleClass: 'text-xs font-semibold text-[#5A3C37] mt-1.5 uppercase tracking-widest italic',
          sectionTitle: 'font-bold uppercase tracking-widest text-xs text-[#9B2319]',
          sectionBorder: 'border-b-2 border-[#9B2319] pb-1 mb-3 flex items-center justify-between',
          dateColor: 'text-[#9B2319] font-medium',
          badgeClass: 'font-semibold text-[#9B2319] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[11px]',
          topBar: 'h-2 w-full bg-gradient-to-r from-[#9B2319] via-[#C2410C] to-[#EA580C] -mt-10 sm:-mt-14 mb-6 rounded-t',
        };
      case 'ink':
        return {
          fontFamily: 'Georgia, "Times New Roman", serif',
          primaryColor: '#2A1852',
          headerAlign: 'center' as const,
          headerBorder: 'border-y-2 border-[#2A1852] py-4 mb-6',
          nameClass: 'text-3xl font-serif font-black text-[#2A1852] tracking-tight uppercase',
          roleClass: 'text-xs font-serif font-semibold text-[#46326E] mt-1 uppercase tracking-widest',
          sectionTitle: 'font-serif font-bold uppercase tracking-widest text-xs text-[#2A1852]',
          sectionBorder: 'border-b-2 border-[#2A1852] pb-1 mb-3 flex items-center justify-between',
          dateColor: 'font-serif text-[#46326E] italic',
          badgeClass: 'font-serif font-semibold text-[#2A1852] bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded text-[11px]',
          topBar: null,
        };
      case 'opal':
        return {
          fontFamily: 'var(--font-outfit), sans-serif',
          primaryColor: '#00645A',
          headerAlign: 'left' as const,
          headerBorder: 'border-b border-[#00645A]/30 pb-4 mb-5',
          nameClass: 'text-3xl font-extrabold text-[#00645A] tracking-tight',
          roleClass: 'inline-block text-xs font-semibold text-[#00645A] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mt-1.5 tracking-wider uppercase',
          sectionTitle: 'font-bold uppercase tracking-wider text-xs text-[#00645A]',
          sectionBorder: 'border-b-2 border-[#00645A] pb-1 mb-3 flex items-center justify-between',
          dateColor: 'text-[#00645A] font-semibold',
          badgeClass: 'font-semibold text-[#00645A] bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded-full text-[11px]',
          topBar: 'h-1.5 w-full bg-[#00645A] -mt-10 sm:-mt-14 mb-6 rounded-t',
        };
      case 'engineeringclassic':
        return {
          fontFamily: 'var(--font-outfit), monospace, sans-serif',
          primaryColor: '#004F90',
          headerAlign: 'left' as const,
          headerBorder: 'border-b border-gray-400 pb-2 mb-4',
          nameClass: 'text-2xl font-black text-gray-950 tracking-tighter uppercase',
          roleClass: 'text-xs font-mono font-medium text-gray-700 mt-0.5 uppercase tracking-wider',
          sectionTitle: 'font-mono font-bold uppercase tracking-tight text-xs text-gray-950',
          sectionBorder: 'border-b border-gray-800 pb-0.5 mb-2.5 flex items-center justify-between',
          dateColor: 'font-mono text-[11px] text-gray-600',
          badgeClass: 'font-mono text-[11px] font-bold text-gray-900 bg-gray-100 border border-gray-300 px-1 py-0.5 rounded',
          topBar: null,
        };
      case 'classic':
        return {
          fontFamily: 'Georgia, serif',
          primaryColor: '#1E3A8A',
          headerAlign: 'center' as const,
          headerBorder: 'border-b border-[#1E3A8A]/30 pb-4 mb-5',
          nameClass: 'text-3xl font-serif font-bold text-[#1E3A8A] tracking-tight',
          roleClass: 'text-xs font-serif font-medium text-gray-700 mt-1 uppercase tracking-widest',
          sectionTitle: 'font-serif font-bold uppercase tracking-wider text-xs text-[#1E3A8A]',
          sectionBorder: 'border-b-2 border-[#1E3A8A] pb-1 mb-3 flex items-center justify-between',
          dateColor: 'font-serif text-xs text-gray-600',
          badgeClass: 'font-serif text-[11px] font-semibold text-[#1E3A8A] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded',
          topBar: null,
        };
      case 'harvard':
        return {
          fontFamily: 'Georgia, serif',
          primaryColor: '#111827',
          headerAlign: 'center' as const,
          headerBorder: 'border-b border-gray-800 pb-4 mb-5',
          nameClass: 'text-3xl uppercase font-serif tracking-widest text-gray-950',
          roleClass: 'text-xs font-serif font-medium text-gray-600 mt-1 uppercase tracking-wider',
          sectionTitle: 'font-serif font-bold uppercase tracking-wider text-xs text-gray-900 text-center',
          sectionBorder: 'border-b border-gray-800 pb-1 mb-3 flex items-center justify-center',
          dateColor: 'font-serif text-xs text-gray-600',
          badgeClass: 'font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]',
          topBar: null,
        };
      case 'sb2nov':
        return {
          fontFamily: 'Arial, sans-serif',
          primaryColor: '#111827',
          headerAlign: 'left' as const,
          headerBorder: 'border-b-2 border-gray-900 pb-3 mb-5',
          nameClass: 'text-3xl font-black text-gray-950 tracking-tight',
          roleClass: 'text-xs font-medium text-gray-600 mt-0.5 uppercase tracking-wider',
          sectionTitle: 'font-bold uppercase tracking-wider text-xs text-gray-950',
          sectionBorder: 'border-b-2 border-gray-900 pb-1 mb-3 flex items-center justify-between',
          dateColor: 'text-xs text-gray-600',
          badgeClass: 'font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]',
          topBar: null,
        };
      default: // engineeringresumes
        return {
          fontFamily: 'var(--font-outfit), sans-serif',
          primaryColor: '#030712',
          headerAlign: 'center' as const,
          headerBorder: 'border-b border-gray-200 pb-4 mb-5',
          nameClass: 'text-3xl font-bold text-gray-950 tracking-tight',
          roleClass: 'text-xs font-medium text-gray-600 mt-1 uppercase tracking-wider',
          sectionTitle: 'font-bold uppercase tracking-wider text-xs text-gray-950',
          sectionBorder: 'border-b border-gray-300 pb-1 mb-3 flex items-center justify-between',
          dateColor: 'text-xs text-gray-500 font-normal',
          badgeClass: 'font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px]',
          topBar: null,
        };
    }
  })();

  const renderExperience = () => {
    if (!resume.experience || resume.experience.length === 0) return null;
    return (
      <section className="mb-5">
        <h2 className={themeConfig.sectionBorder}>
          <span className={themeConfig.sectionTitle}>{isFresher ? 'Internships & Experience' : 'Work Experience'}</span>
        </h2>
        <div className="space-y-4">
          {resume.experience.map((exp) => (
            <div key={exp.id} className="text-xs">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span className={`text-sm font-semibold ${isModern || isOpal || isEmber ? 'text-gray-950 font-bold' : ''}`}>{exp.position}</span>
                <span className={themeConfig.dateColor}>{exp.start_date} – {exp.end_date || 'Present'}</span>
              </div>
              <div className="flex justify-between items-baseline text-gray-700 italic mb-1.5">
                <span className={isClassic || isInk ? 'font-serif not-italic font-medium text-gray-800' : ''}>{exp.company}</span>
                {exp.location && <span className="not-italic text-gray-500">{exp.location}</span>}
              </div>
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducation = () => {
    if (!resume.education || resume.education.length === 0) return null;
    return (
      <section className="mb-5">
        <h2 className={themeConfig.sectionBorder}>
          <span className={themeConfig.sectionTitle}>Education</span>
        </h2>
        <div className="space-y-3">
          {resume.education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{edu.institution}</span>
                  {edu.digilocker_verified && (
                    <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-1.5 py-0.2 rounded">
                      ✓ DigiLocker Verified
                    </span>
                  )}
                </div>
                <span className={themeConfig.dateColor}>{edu.start_date} – {edu.end_date}</span>
              </div>
              <div className="flex justify-between items-baseline text-gray-700 mt-0.5">
                <span>
                  {edu.degree}{edu.area ? ` in ${edu.area}` : ''}
                  {edu.board_or_university && <span className="text-gray-500 ml-1.5 font-normal">({edu.board_or_university})</span>}
                </span>
                <div className="flex items-center gap-2">
                  {edu.cgpa_or_percentage && (
                    <span className={themeConfig.badgeClass}>
                      {edu.cgpa_or_percentage}
                    </span>
                  )}
                  {edu.location && <span className="text-gray-500">{edu.location}</span>}
                </div>
              </div>
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-600 mt-1">
                  {edu.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjects = () => {
    if (!resume.projects || resume.projects.length === 0) return null;
    return (
      <section className="mb-5">
        <h2 className={themeConfig.sectionBorder}>
          <span className={themeConfig.sectionTitle}>{isFresher ? 'Academic & Technical Projects' : 'Projects & Achievements'}</span>
        </h2>
        <div className="space-y-3">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex justify-between items-baseline font-semibold text-gray-900">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{proj.name}</span>
                  {proj.tools && proj.tools.length > 0 && (
                    isEngClassic ? (
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-800 px-1 py-0.5 rounded border border-gray-300">
                        {proj.tools.join(', ')}
                      </span>
                    ) : (
                      <span className="font-normal text-gray-500 text-[11px]">| {proj.tools.join(', ')}</span>
                    )
                  )}
                </div>
                {proj.link && (
                  canvasOnly ? (
                    <span className="text-indigo-600 flex items-center gap-0.5 text-[11px]">
                      <span>View Project</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 flex items-center gap-0.5 hover:underline text-[11px]">
                      <span>View Project</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )
                )}
              </div>
              {proj.description && (
                <p className="text-gray-600 mt-0.5 text-[11.5px]">{proj.description}</p>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul className="list-disc list-outside pl-4 space-y-1 text-gray-700 mt-1">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkills = () => {
    if (!resume.skills || resume.skills.length === 0) return null;
    return (
      <section className="mb-4">
        <h2 className={themeConfig.sectionBorder}>
          <span className={themeConfig.sectionTitle}>Technical Skills & Proficiencies</span>
        </h2>
        <div className="space-y-1 text-xs">
          {resume.skills.map((skill) => (
            <div key={skill.id} className="flex gap-2">
              <span className="font-bold text-gray-900 min-w-[140px]">{skill.category}:</span>
              <span className="text-gray-700">{skill.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertifications = () => {
    if (!resume.certifications || resume.certifications.length === 0) return null;
    return (
      <section className="mb-4">
        <h2 className={themeConfig.sectionBorder}>
          <span className={themeConfig.sectionTitle}>Certifications & Accreditations</span>
        </h2>
        <div className="space-y-1 text-xs">
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between text-gray-700">
              <span className="font-medium text-gray-900">{c.name} {c.issuer ? `— ${c.issuer}` : ''}</span>
              {c.date && <span className="text-gray-500">{c.date}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const design = resume.design;
  const paddingStyle = design?.margins
    ? {
        paddingTop: design.margins.top || '2.5rem',
        paddingBottom: design.margins.bottom || '2.5rem',
        paddingLeft: design.margins.left || '2.5rem',
        paddingRight: design.margins.right || '2.5rem',
      }
    : {};

  const canvas = (
    <div 
      id="resume-canvas"
      className={`${canvasOnly ? 'w-[794px] shadow-none' : 'w-full max-w-[794px] shadow-2xl'} min-h-[1050px] bg-white text-gray-900 ${design?.margins ? '' : 'p-10 sm:p-14'} text-sm transition-all selection:bg-indigo-100`}
      style={{
        fontFamily: themeConfig.fontFamily,
        lineHeight: design?.line_spacing ? design.line_spacing : (isEngClassic ? '1.35' : '1.45'),
        fontSize: design?.font_size ? design.font_size : undefined,
        ...paddingStyle,
      }}
    >
        {/* TOP ACCENT BAR FOR MODERN / EMBER / OPAL */}
        {themeConfig.topBar && (
          <div className={themeConfig.topBar} />
        )}

        {/* HEADER */}
        <header className={`${themeConfig.headerBorder} ${themeConfig.headerAlign === 'center' ? 'text-center' : 'text-left'}`}>
          <h1 className={themeConfig.nameClass}>
            {resume.contact.name || 'Your Full Name'}
          </h1>
          {resume.target_role && (
            <div className={themeConfig.roleClass}>
              {resume.target_role}
            </div>
          )}

          {/* CONTACT INFO BAR */}
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600 mt-2.5 ${themeConfig.headerAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
            {resume.contact.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {resume.contact.location}
              </span>
            )}
            {resume.contact.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                {resume.contact.phone}
              </span>
            )}
            {resume.contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                {canvasOnly ? (
                  <span className="text-indigo-600">{resume.contact.email}</span>
                ) : (
                  <a href={`mailto:${resume.contact.email}`} className="hover:underline text-indigo-600">
                    {resume.contact.email}
                  </a>
                )}
              </span>
            )}
            {resume.contact.notice_period && (
              <span className="flex items-center gap-1 font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                <Clock className="w-3 h-3 text-indigo-600" />
                Notice: {resume.contact.notice_period}
              </span>
            )}
            {resume.contact.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-gray-400" />
                {canvasOnly ? (
                  <span className="text-indigo-600">{resume.contact.website.replace(/^https?:\/\//, '')}</span>
                ) : (
                  <a href={resume.contact.website} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600">
                    {resume.contact.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </span>
            )}
            {resume.contact.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedInIcon className="w-3 h-3 text-gray-400" />
                <span>LinkedIn</span>
              </span>
            )}
            {resume.contact.github && (
              <span className="flex items-center gap-1">
                <GitHubIcon className="w-3 h-3 text-gray-400" />
                <span>GitHub</span>
              </span>
            )}
          </div>
        </header>

        {/* SUMMARY */}
        {resume.summary && (
          <section className="mb-4">
            <h2 className={themeConfig.sectionBorder}>
              <span className={themeConfig.sectionTitle}>{isFresher ? 'Career Objective' : 'Professional Summary'}</span>
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* SECTIONS: Inverted for Fresher Mode */}
        {isFresher ? (
          <>
            {renderEducation()}
            {renderProjects()}
            {renderSkills()}
            {renderExperience()}
            {renderCertifications()}
          </>
        ) : (
          <>
            {renderExperience()}
            {renderEducation()}
            {renderProjects()}
            {renderSkills()}
            {renderCertifications()}
          </>
        )}

        {/* INDIAN PLACEMENT / PSU DECLARATION */}
        {resume.declaration?.enabled && (
          <section className="mt-6 pt-4 border-t border-gray-300 text-xs">
            <h2 className={`font-bold uppercase tracking-wider text-[11px] mb-2 ${isHarvard ? 'font-serif text-gray-900 text-center' : 'text-gray-950'}`}>
              Declaration
            </h2>
            <p className="text-gray-600 text-[11px] italic mb-3 leading-relaxed">
              {resume.declaration.text || 'I hereby declare that all information given above is true, complete, and correct to the best of my knowledge and belief.'}
            </p>
            <div className="flex justify-between items-end text-[11px] text-gray-700">
              <div>
                <div>Date: {resume.declaration.date || new Date().toISOString().slice(0, 10)}</div>
                <div>Place: {resume.declaration.place || resume.contact.location || 'Bengaluru, India'}</div>
              </div>
              <div className="text-right flex flex-col items-end">
                {resume.declaration.signature_image ? (
                  <img
                    src={resume.declaration.signature_image}
                    alt="Candidate Signature"
                    className="h-8 max-w-[130px] object-contain mb-0.5 filter contrast-125"
                  />
                ) : (
                  <div className="font-serif italic text-sm text-gray-800 tracking-wide mb-0.5 font-medium select-none">
                    {resume.declaration.signature_name || resume.contact.name}
                  </div>
                )}
                <div className="border-t border-gray-400 w-36 pt-0.5 font-semibold text-gray-900">
                  {resume.declaration.signature_name || resume.contact.name}
                </div>
                <div className="text-[10px] text-gray-400 font-mono">(Candidate Signature)</div>
              </div>
            </div>
          </section>
        )}
      </div>
  );

  if (canvasOnly) {
    return canvas;
  }

  return (
    <div className="w-full flex justify-center p-4 sm:p-6 bg-gray-200/80 rounded-2xl overflow-auto min-h-[842px]">
      {canvas}
    </div>
  );
}
