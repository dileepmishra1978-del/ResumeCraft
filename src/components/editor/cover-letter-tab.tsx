'use client';

import React, { useState } from 'react';
import { ResumeData, CoverLetterData } from '@/types/resume';
import { Sparkles, Copy, Printer, Check, RefreshCw, FileText } from 'lucide-react';

interface CoverLetterTabProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
}

export function CoverLetterTab({ resume, onUpdateResume }: CoverLetterTabProps) {
  const initialLetter: CoverLetterData = resume.cover_letter || {
    company_name: '',
    job_title: resume.target_role || 'Software Engineer',
    content: '',
    skills_highlight: resume.skills[0]?.items?.slice(0, 4)?.join(', ') || '',
    selected_experience_id: resume.experience[0]?.id || '',
    selected_education_id: resume.education[0]?.id || '',
  };

  const [formData, setFormData] = useState<CoverLetterData>(initialLetter);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!formData.company_name.trim() || !formData.job_title.trim() || loading) return;
    setLoading(true);

    const chosenExp = resume.experience.find((e) => e.id === formData.selected_experience_id);
    const chosenEdu = resume.education.find((e) => e.id === formData.selected_education_id);

    const expText = chosenExp
      ? `${chosenExp.position} at ${chosenExp.company}: ${chosenExp.highlights?.slice(0, 2)?.join('. ')}`
      : undefined;

    const eduText = chosenEdu
      ? `${chosenEdu.degree} in ${chosenEdu.area} from ${chosenEdu.institution}`
      : undefined;

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: formData.company_name.trim(),
          job_title: formData.job_title.trim(),
          contact_name: resume.contact.name || 'Applicant',
          contact_email: resume.contact.email,
          contact_phone: resume.contact.phone,
          position_highlight: expText,
          education_highlight: eduText,
          key_skills: formData.skills_highlight,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate cover letter');
      }

      const data = await res.json();
      const updatedCoverLetter: CoverLetterData = {
        ...formData,
        content: data.cover_letter,
        updated_at: new Date().toISOString(),
      };

      setFormData(updatedCoverLetter);
      onUpdateResume({
        ...resume,
        cover_letter: updatedCoverLetter,
      });
    } catch (err: any) {
      alert(err.message || 'Error generating cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!formData.content) return;
    navigator.clipboard.writeText(formData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleContentChange = (val: string) => {
    const updated = { ...formData, content: val };
    setFormData(updated);
    onUpdateResume({
      ...resume,
      cover_letter: updated,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: Inputs form (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-xs">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-950 text-sm">Cover letter settings</h3>
            <p className="text-xs text-gray-500">Target a specific company and select resume highlights</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Company Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Company name *</label>
            <input
              type="text"
              placeholder="e.g. Stripe, Google, Acme Corp"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Target position / role *</label>
            <input
              type="text"
              placeholder="e.g. Senior Full Stack Engineer"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Experience Highlight Selector */}
          {resume.experience.length > 0 && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Key experience highlight</label>
              <select
                value={formData.selected_experience_id}
                onChange={(e) => setFormData({ ...formData, selected_experience_id: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
              >
                {resume.experience.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.position} — {exp.company}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Education Highlight Selector */}
          {resume.education.length > 0 && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Education highlight</label>
              <select
                value={formData.selected_education_id}
                onChange={(e) => setFormData({ ...formData, selected_education_id: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
              >
                {resume.education.map((edu) => (
                  <option key={edu.id} value={edu.id}>
                    {edu.degree} — {edu.institution}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Key Skills Highlight */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Key skills emphasis</label>
            <input
              type="text"
              placeholder="e.g. Distributed systems, React, Go, AWS"
              value={formData.skills_highlight || ''}
              onChange={(e) => setFormData({ ...formData, skills_highlight: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !formData.company_name.trim() || !formData.job_title.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Drafting cover letter...' : formData.content ? 'Regenerate with Gemini' : 'Generate cover letter'}</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Document Canvas (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Canvas Toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100 bg-gray-50/70">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Letter preview
          </span>
          <div className="flex items-center gap-2">
            {formData.content && (
              <>
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-700 hover:text-indigo-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="text-xs text-gray-700 hover:text-indigo-600 bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Paper Document */}
        <div id="cover-letter-paper" className="p-8 sm:p-12 min-h-[560px] text-sm text-gray-800 leading-relaxed font-sans space-y-6">
          {!formData.content ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-3 text-gray-400">
              <FileText className="w-12 h-12 text-gray-300 stroke-[1.2]" />
              <p className="text-sm font-medium text-gray-600">No cover letter drafted yet</p>
              <p className="text-xs text-gray-400 max-w-sm">
                Enter your target company and position on the left, then click Generate to draft a tailored letter.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4">
                <h1 className="text-xl font-bold text-gray-950">{resume.contact.name || 'Your Full Name'}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {[resume.contact.email, resume.contact.phone, resume.contact.location].filter(Boolean).join(' • ')}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-mono">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Editable Prose Content */}
              <textarea
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={16}
                className="w-full text-sm text-gray-800 leading-relaxed border-0 focus:outline-none focus:ring-0 p-0 resize-none font-sans bg-transparent"
                style={{ lineHeight: '1.7' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
