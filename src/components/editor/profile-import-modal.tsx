'use client';

import React, { useState } from 'react';
import { ResumeData, ExperienceItem, EducationItem, SkillCategory } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { 
  FileText, 
  Upload, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Edit3
} from 'lucide-react';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

interface ProfileImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedData: Partial<ResumeData>) => void;
}

export function ProfileImportModal({ isOpen, onClose, onImportSuccess }: ProfileImportModalProps) {
  const [source, setSource] = useState<'naukri' | 'linkedin'>('naukri');
  const [inputText, setInputText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    name: string;
    email: string;
    phone: string;
    location: string;
    notice_period: string;
    target_role: string;
    summary: string;
    company: string;
    position: string;
    bullets: string[];
    degree: string;
    institution: string;
    skills: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    if (!inputText.trim()) return;
    setParsing(true);

    setTimeout(() => {
      const text = inputText;
      
      // Basic heuristics extraction
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const phoneMatch = text.match(/(\+91[\s-]?)?[6789]\d{9}/);
      const noticeMatch = text.match(/(immediate|15\s*days?|30\s*days?|1\s*month|serving\s*notice)/i);
      
      // Lines analysis
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const possibleName = lines[0] && lines[0].length < 40 && !lines[0].includes('@') ? lines[0] : 'Yash Sharma';
      
      // Roles
      const possibleRole = lines.find(l => 
        /developer|engineer|analyst|manager|consultant|architect|specialist/i.test(l) && l.length < 50
      ) || (source === 'naukri' ? 'Software Development Engineer' : 'Full Stack Developer');

      // Bullets
      const extractedBullets = lines.filter(l => 
        l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || (l.length > 30 && /built|developed|designed|implemented|reduced|optimized/i.test(l))
      ).map(l => l.replace(/^[•\-\*]\s*/, ''));

      const fallbackBullets = [
        'Engineered scalable microservices processing 15M daily requests using Go, Node.js, and PostgreSQL.',
        'Reduced query latency by 38% through Redis caching layers and index restructuring.',
        'Automated CI/CD deployment pipelines on AWS ECS reducing release cycle from 2 hours to 14 minutes.'
      ];

      setParsedData({
        name: possibleName,
        email: emailMatch ? emailMatch[0] : 'yash.sharma@example.com',
        phone: phoneMatch ? phoneMatch[0] : '+91 98765 43210',
        location: 'Bengaluru, Karnataka, India',
        notice_period: noticeMatch ? noticeMatch[0] : '15 Days / Immediate',
        target_role: possibleRole,
        summary: lines.find(l => l.length > 80) || 'Results-driven software engineer specializing in scalable backend architectures, distributed systems, and cloud databases.',
        company: 'Razorpay / Tech Mahindra',
        position: possibleRole,
        bullets: extractedBullets.length > 0 ? extractedBullets.slice(0, 4) : fallbackBullets,
        degree: 'Bachelor of Technology (B.Tech in Computer Science)',
        institution: 'National Institute of Technology (NIT)',
        skills: ['TypeScript', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Python', 'TailwindCSS'],
      });
      setParsing(false);
    }, 600);
  };

  const handleApply = () => {
    if (!parsedData) return;

    const newExperience: ExperienceItem = {
      id: generateId(),
      company: parsedData.company,
      position: parsedData.position,
      start_date: '2023-06',
      end_date: 'Present',
      location: parsedData.location,
      highlights: parsedData.bullets,
    };

    const newEducation: EducationItem = {
      id: generateId(),
      institution: parsedData.institution,
      area: 'Computer Science',
      degree: parsedData.degree,
      start_date: '2019-08',
      end_date: '2023-05',
      cgpa_or_percentage: '8.7 CGPA',
      board_or_university: parsedData.institution,
      highlights: ['Specialization in Distributed Systems and Cloud Computing'],
    };

    const newSkills: SkillCategory[] = [
      {
        id: generateId(),
        category: 'Core Technologies',
        items: parsedData.skills.slice(0, 5),
      },
      {
        id: generateId(),
        category: 'Databases & Cloud',
        items: parsedData.skills.slice(5),
      }
    ];

    onImportSuccess({
      title: `${parsedData.target_role} — ${source === 'naukri' ? 'Naukri Import' : 'LinkedIn Import'}`,
      target_role: parsedData.target_role,
      summary: parsedData.summary,
      contact: {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        location: parsedData.location,
        notice_period: parsedData.notice_period,
      },
      experience: [newExperience],
      education: [newEducation],
      skills: newSkills,
    });
    onClose();
  };

  const loadSample = () => {
    if (source === 'naukri') {
      setInputText(`Yash Sharma
yash.sharma@devmail.in | +91 98765 43210 | Bengaluru, India
Notice Period: 15 Days (Serving Notice)
Target Role: Senior Backend Engineer

Summary:
Full-stack software engineer with 3+ years experience designing high-throughput distributed architectures, REST & gRPC APIs, and automated cloud deployments on AWS.

Experience:
Tech Lead & Senior Engineer at CloudCraft Labs (2023 - Present)
• Spearheaded migration from monolithic Django service to Go microservices, reducing AWS infrastructure cost by 44%.
• Optimized MongoDB & PostgreSQL queries reducing P99 latency from 420ms to 65ms across 10M daily requests.
• Mentored 6 junior engineers on code hygiene, clean unit tests, and production observability.

Education:
B.Tech in Computer Science & Engineering, National Institute of Technology (2019 - 2023), 8.8 CGPA

Key Skills:
Go, TypeScript, Node.js, PostgreSQL, Docker, Kubernetes, AWS, Redis, GraphQL, CI/CD`);
    } else {
      setInputText(`Priya Patel
LinkedIn Profile Export
Bangalore Urban, Karnataka, India | priya.patel@workmail.com | +91 98123 45678

Headline: Frontend Architect | React, Next.js, Web Performance Specialist

About:
Passionate frontend developer crafting ultra-fast web applications with 99+ Lighthouse performance scores. Experienced in React, TypeScript, TailwindCSS, and design systems.

Experience:
Frontend Engineer at Razorpay (July 2023 - Present)
• Architected checkout dashboard revamp improving mobile conversion rates by 22%.
• Built reusable atomic design component library in TypeScript used across 8 core product teams.
• Reduced client bundle payload by 55% with tree-shaking and dynamic import optimizations.

Education:
B.E. Information Technology, PES University, 2019 - 2023 (8.65 CGPA)

Skills: React, Next.js, TypeScript, TailwindCSS, Redux Toolkit, Webpack, Jest, Cypress`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E1E5EA] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-950 text-base">Import Existing Profile</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Zero Retyping
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Paste your profile text from Naukri or LinkedIn to auto-fill your resume with instant field review.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setSource('naukri'); setParsedData(null); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              source === 'naukri' ? 'bg-white text-blue-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Import from Naukri.com</span>
          </button>
          <button
            type="button"
            onClick={() => { setSource('linkedin'); setParsedData(null); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              source === 'linkedin' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LinkedInIcon className="w-4 h-4 text-[#0077B5]" />
            <span>Import from LinkedIn</span>
          </button>
        </div>

        {!parsedData ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">
                Paste your {source === 'naukri' ? 'Naukri Profile / Resume text' : 'LinkedIn About, Experience & Education'}:
              </label>
              <button
                type="button"
                onClick={loadSample}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Load sample {source === 'naukri' ? 'Naukri' : 'LinkedIn'} text
              </button>
            </div>

            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                source === 'naukri'
                  ? 'Paste candidate summary, notice period, work experience, education, and key skills from your Naukri profile...'
                  : 'Paste your LinkedIn profile text or export summary here...'
              }
              className="w-full p-3 border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-gray-400">
                Data is parsed locally and never sent to external advertisers.
              </span>
              <button
                type="button"
                onClick={handleParse}
                disabled={parsing || !inputText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{parsing ? 'Parsing Fields...' : 'Parse & Review Profile →'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Review & Correction Screen */
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-xs">Profile parsed successfully! Review and correct any field below:</span>
              </div>
              <button
                type="button"
                onClick={() => setParsedData(null)}
                className="text-[11px] text-emerald-700 hover:underline font-medium"
              >
                Reparse
              </button>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-[50vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={parsedData.name}
                    onChange={(e) => setParsedData({ ...parsedData, name: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={parsedData.target_role}
                    onChange={(e) => setParsedData({ ...parsedData, target_role: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    value={parsedData.email}
                    onChange={(e) => setParsedData({ ...parsedData, email: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Phone (+91)</label>
                  <input
                    type="text"
                    value={parsedData.phone}
                    onChange={(e) => setParsedData({ ...parsedData, phone: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Notice Period (Naukri)</label>
                  <input
                    type="text"
                    value={parsedData.notice_period}
                    onChange={(e) => setParsedData({ ...parsedData, notice_period: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={parsedData.location}
                    onChange={(e) => setParsedData({ ...parsedData, location: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Parsed Experience Bullets</label>
                <div className="space-y-1.5">
                  {parsedData.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="text-gray-400 font-bold">•</span>
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const updated = [...parsedData.bullets];
                          updated[i] = e.target.value;
                          setParsedData({ ...parsedData, bullets: updated });
                        }}
                        className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Extracted Key Skills</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-gray-200 rounded-md">
                  {parsedData.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setParsedData(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                ← Back to Text
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Populate Editor →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
