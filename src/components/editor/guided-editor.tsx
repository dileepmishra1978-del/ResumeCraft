'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData, RenderCVTheme, TEMPLATE_CATALOG } from '@/types/resume';
import { LivePreview, TEMPLATE_NAMES } from './live-preview';
import { AiTailorModal } from './ai-tailor-modal';
import { ScoreGauge } from './score-gauge';
import { calculateResumeScore, ResumeScoreResult } from '@/lib/scoring/resumeScore';
import { KeywordTargetingSidebar } from './keyword-targeting-sidebar';
import { CoverLetterTab } from './cover-letter-tab';
import { SignaturePad } from './signature-pad';
import { downloadResumeAsPdf } from '@/lib/pdf/client-pdf';
import { 
  Sparkles, 
  Download, 
  Save, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Wrench, 
  Award, 
  User, 
  Loader2, 
  Check, 
  ChevronRight, 
  Sliders,
  FileText,
  FileCheck,
  Eye,
  PenTool,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface GuidedEditorProps {
  initialResume: ResumeData;
  onSave?: (resume: ResumeData) => Promise<void>;
}

export function GuidedEditor({ initialResume, onSave }: GuidedEditorProps) {
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [mainView, setMainView] = useState<'resume' | 'cover_letter'>('resume');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [activeTab, setActiveTab] = useState<'contact' | 'summary' | 'education' | 'projects' | 'skills' | 'experience' | 'certifications' | 'declaration'>('contact');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [autoAdjusting, setAutoAdjusting] = useState(false);
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);

  // Phase A: Deterministic scoring state with 300ms debounce
  const [scoreResult, setScoreResult] = useState<ResumeScoreResult>(() => calculateResumeScore(initialResume));

  // Phase B: Missing keywords from JD analysis
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  
  // AI Rewrite state
  const [rewritingBullet, setRewritingBullet] = useState<{ expIndex: number; bulletIndex: number } | null>(null);
  const [aiVariations, setAiVariations] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScoreResult(calculateResumeScore(resume));
    }, 300);
    return () => clearTimeout(timer);
  }, [resume]);

  const handleAutoAdjust = async () => {
    setAutoAdjusting(true);
    try {
      const res = await fetch('/api/resumes/auto-adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: resume,
          target_pages: 1,
          theme: resume.template,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Auto adjust failed');
      }

      const data = await res.json();
      if (data.design) {
        setResume((prev) => ({
          ...prev,
          design: data.design,
        }));
      }
      alert(data.message || 'Auto adjust complete — 1-page fit optimized');
    } catch (e: any) {
      alert(e.message || 'Auto adjust failed');
    } finally {
      setAutoAdjusting(false);
    }
  };

  const handleAddBulletToExperience = (expId: string, bullet: string) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id === expId) {
          return { ...exp, highlights: [...exp.highlights, bullet] };
        }
        return exp;
      }),
    }));
  };

  const handleDismissKeyword = (kw: string) => {
    setResume((prev) => {
      const current = prev.dismissed_keywords || [];
      if (current.includes(kw)) return prev;
      return { ...prev, dismissed_keywords: [...current, kw] };
    });
  };

  const handleExportPdf = async () => {
    setDownloading(true);
    const safeTitle = (resume.contact.name || resume.title || 'Resume')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${safeTitle}_Resume.pdf`;

    try {
      // 1. Try backend RenderCV compiler if available
      try {
        const res = await fetch('/api/resumes/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_data: resume,
            theme: resume.template,
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          if (blob.size > 1500) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            return;
          }
        }
      } catch (backendErr) {
        console.warn("Backend compiler unavailable, using high-fidelity client-side PDF generator:", backendErr);
      }

      // 2. High-fidelity client-side PDF export (zero blank screens, works on Vercel, mobile & desktop)
      const exportTarget =
        document.getElementById('resume-export-container') ||
        document.getElementById('resume-canvas');

      if (!exportTarget) {
        throw new Error('Resume element not found');
      }

      await downloadResumeAsPdf(exportTarget, fileName);
    } catch (err: any) {
      console.error("Client PDF export error:", err);
      // Fallback to browser print if all else fails
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleRewriteBullet = async (expIndex: number, bulletIndex: number, text: string, role: string, company: string) => {
    if (!text.trim() || aiLoading) return;
    setRewritingBullet({ expIndex, bulletIndex });
    setAiLoading(true);
    setAiVariations([]);

    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: text, role, company }),
      });
      const data = await res.json();
      if (data.variations) {
        setAiVariations(data.variations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const applyVariation = (variation: string) => {
    if (!rewritingBullet) return;
    const { expIndex, bulletIndex } = rewritingBullet;
    const updated = { ...resume };
    updated.experience[expIndex].highlights[bulletIndex] = variation;
    setResume(updated);
    setRewritingBullet(null);
    setAiVariations([]);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(resume);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      alert(err.message || 'Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  // Indian academic presets for quick entry
  const handleAddPresetEducation = (type: 'degree' | 'hsc' | 'ssc') => {
    let newEdu;
    if (type === 'ssc') {
      newEdu = {
        id: `edu-ssc-${Date.now()}`,
        institution: 'Secondary High School',
        area: 'General Science & Mathematics',
        degree: 'Class 10th (SSC)',
        start_date: '2017-06',
        end_date: '2018-05',
        cgpa_or_percentage: '88%',
        board_or_university: 'CBSE / State Board',
      };
    } else if (type === 'hsc') {
      newEdu = {
        id: `edu-hsc-${Date.now()}`,
        institution: 'Junior College / Pre-University',
        area: 'Physics, Chemistry, Mathematics (PCM)',
        degree: 'Class 12th (HSC) / Diploma',
        start_date: '2018-06',
        end_date: '2020-05',
        cgpa_or_percentage: '85%',
        board_or_university: 'CBSE / State Board',
      };
    } else {
      newEdu = {
        id: `edu-deg-${Date.now()}`,
        institution: 'Engineering Institute / University',
        area: 'Computer Science & Engineering',
        degree: 'B.Tech / B.E.',
        start_date: '2020-08',
        end_date: '2024-05',
        cgpa_or_percentage: '8.5 CGPA',
        board_or_university: 'VTU / Anna Univ / Mumbai Univ',
      };
    }
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
    setActiveTab('education');
  };

  const isFresher = Boolean(
    resume.fresher_mode ?? (resume.template === 'harvard' || resume.template === 'sb2nov' || TEMPLATE_CATALOG[resume.template]?.fresher)
  );

  // Re-order tabs based on Fresher Mode (Campus standard puts Education & Projects at top)
  const tabs = isFresher
    ? [
        { id: 'contact', label: 'Contact', icon: User },
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'education', label: 'Education', icon: GraduationCap, badge: 'Key' },
        { id: 'projects', label: 'Projects', icon: Code2, badge: 'Key' },
        { id: 'skills', label: 'Skills', icon: Wrench },
        { id: 'experience', label: 'Internships', icon: Briefcase },
        { id: 'certifications', label: 'Certs', icon: Award },
        { id: 'declaration', label: 'Declaration', icon: FileCheck },
      ]
    : [
        { id: 'contact', label: 'Contact', icon: User },
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'projects', label: 'Projects', icon: Code2 },
        { id: 'skills', label: 'Skills', icon: Wrench },
        { id: 'certifications', label: 'Certs', icon: Award },
        { id: 'declaration', label: 'Declaration', icon: FileCheck },
      ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FFFFFF] text-[#090B10] font-sans antialiased">
      {/* 1. TOP TOOLBAR (Compact 58px, Clean, Professional) */}
      <header className="h-[58px] bg-white border-b border-[#E1E5EA] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        {/* Left: Navigation, Title & Save Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#263D59] hover:text-[#090B10] transition-colors flex items-center gap-1"
          >
            ← <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="text-[#E1E5EA]">|</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resume.title}
              onChange={(e) => setResume({ ...resume, title: e.target.value })}
              className="font-bold text-[#090B10] text-sm bg-transparent border-b border-transparent hover:border-[#DDE2E8] focus:border-[#4B3DF5] outline-none px-1 py-0.5 max-w-[160px] sm:max-w-[220px] transition-colors"
              title="Click to rename resume"
            />
            {lastSaved ? (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#159D73] font-medium">
                <CheckCircle2 className="w-3 h-3" /> Saved {lastSaved}
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#263D59]">
                Auto-saved
              </span>
            )}
          </div>
        </div>

        {/* Center: Resume / Cover Letter Segmented Switch */}
        <div className="flex items-center bg-[#F5F7FA] p-0.5 rounded-lg border border-[#E1E5EA]">
          <button
            onClick={() => setMainView('resume')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              mainView === 'resume'
                ? 'bg-white text-[#090B10] shadow-xs'
                : 'text-[#263D59] hover:text-[#090B10]'
            }`}
          >
            Resume
          </button>
          <button
            onClick={() => setMainView('cover_letter')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              mainView === 'cover_letter'
                ? 'bg-white text-[#090B10] shadow-xs'
                : 'text-[#263D59] hover:text-[#090B10]'
            }`}
          >
            Cover Letter
          </button>
        </div>

        {/* Right: Actions (Fresher Mode, Auto Adjust, Template, Tailor, PDF) */}
        <div className="flex items-center gap-2">
          {/* Fresher Mode Toggle */}
          <button
            onClick={() => setResume((prev) => ({ ...prev, fresher_mode: !prev.fresher_mode }))}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              resume.fresher_mode
                ? 'bg-[#F0F3FF] text-[#4B3DF5] border-[#4B3DF5]/30'
                : 'bg-white hover:bg-gray-50 text-[#263D59] border-[#DDE2E8]'
            }`}
            title="Toggle Fresher Mode: Prioritizes Education & Projects over Experience for campus drives."
          >
            <GraduationCap className={`w-3.5 h-3.5 ${resume.fresher_mode ? 'text-[#4B3DF5]' : 'text-[#263D59]'}`} />
            <span className="hidden sm:inline">Fresher Mode</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${resume.fresher_mode ? 'bg-[#4B3DF5] text-white' : 'bg-gray-100 text-[#263D59]'}`}>
              {resume.fresher_mode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Auto Adjust Spacing Button */}
          <button
            onClick={handleAutoAdjust}
            disabled={autoAdjusting}
            title="Auto-adjust Typst margins and line height to fit neatly on 1 page"
            className="hidden xl:inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#263D59] border border-[#DDE2E8] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            {autoAdjusting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4B3DF5]" />
            ) : (
              <Sliders className="w-3.5 h-3.5 text-[#263D59]" />
            )}
            <span>{autoAdjusting ? 'Reflowing...' : '1-Page Fit'}</span>
          </button>

          {/* Template Dropdown with Indian Market Names */}
          <div className="hidden lg:flex items-center border border-[#DDE2E8] bg-white rounded-lg px-2 py-1">
            <select
              value={resume.template}
              onChange={(e) => setResume({ ...resume, template: e.target.value as RenderCVTheme })}
              className="bg-transparent text-xs font-medium text-[#090B10] outline-none cursor-pointer max-w-[180px] truncate"
            >
              {Object.entries(TEMPLATE_NAMES).map(([key, info]) => {
                const cat = TEMPLATE_CATALOG[key as RenderCVTheme];
                const label = cat ? `${cat.name} (${cat.tag.split('(')[0].trim()})` : info.name;
                return (
                  <option key={key} value={key}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* AI Tailor Button */}
          <button
            onClick={() => setIsTailorModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#F0F3FF] hover:bg-[#E4E9FF] text-[#4B3DF5] border border-[#4B3DF5]/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4B3DF5]" />
            <span className="hidden sm:inline">Tailor for Job</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 bg-[#4B3DF5] hover:bg-[#3B2DE6] disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            {downloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{downloading ? 'Compiling...' : 'Download PDF'}</span>
          </button>

          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 text-[#263D59] hover:text-[#090B10] hover:bg-gray-100 rounded-lg transition-colors"
              title="Save changes to cloud"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#4B3DF5]" /> : <Save className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* MOBILE SWITCHER (< 1024px) */}
      <div className="lg:hidden flex items-center justify-center bg-[#F5F7FA] border-b border-[#E1E5EA] p-1.5 shrink-0">
        <div className="flex bg-white rounded-lg p-0.5 border border-[#E1E5EA] w-full max-w-xs">
          <button
            onClick={() => setMobileView('editor')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'editor'
                ? 'bg-[#4B3DF5] text-white'
                : 'text-[#263D59] hover:text-[#090B10]'
            }`}
          >
            <PenTool className="w-3 h-3" />
            <span>Edit Form</span>
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-1 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'preview'
                ? 'bg-[#4B3DF5] text-white'
                : 'text-[#263D59] hover:text-[#090B10]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN VIEW CONTENT */}
      {mainView === 'cover_letter' ? (
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto">
            <CoverLetterTab resume={resume} onUpdateResume={setResume} />
          </div>
        </div>
      ) : (
        /* DESKTOP SPLIT: 42% Editor | 58% Live Preview */
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: GUIDED FORM (42%) */}
          <div
            className={`w-full lg:w-[42%] flex flex-col border-r border-[#E1E5EA] bg-white overflow-hidden ${
              mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* SECTION TAB SELECTOR (Clean, Horizontal with Active Indicator) */}
            <div className="flex border-b border-[#E1E5EA] overflow-x-auto px-3 py-1.5 gap-1 shrink-0 bg-[#FAFBFC] no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-[#F0F3FF] text-[#4B3DF5] font-semibold'
                        : 'text-[#263D59] hover:bg-gray-100 hover:text-[#090B10]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#4B3DF5]' : 'text-[#263D59]'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${isActive ? 'bg-[#4B3DF5] text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* FORM BODY (Clean, Whitespace-Driven, 40px inputs) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-[#090B10]">
              {/* 1. CONTACT INFO */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3">
                    <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Personal & Contact Details</h3>
                    <p className="text-[11px] text-[#263D59] mt-0.5">
                      Recruiters and Indian job portals (Naukri, LinkedIn, Instahyre) screen candidates on contact, location, and notice period.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={resume.contact.name}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, name: e.target.value } })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">Target Role / Designation</label>
                      <input
                        type="text"
                        value={resume.target_role || ''}
                        onChange={(e) => setResume({ ...resume, target_role: e.target.value })}
                        placeholder="e.g. Software Engineer / SDE-1"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={resume.contact.email}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, email: e.target.value } })}
                        placeholder="rahul.sharma@example.com"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={resume.contact.phone || ''}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, phone: e.target.value } })}
                        placeholder="+91 98765 43210"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">Location</label>
                      <input
                        type="text"
                        value={resume.contact.location || ''}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, location: e.target.value } })}
                        placeholder="Bengaluru, Karnataka, India"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">Portfolio / Personal Website</label>
                      <input
                        type="text"
                        value={resume.contact.website || ''}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, website: e.target.value } })}
                        placeholder="https://rahulsharma.dev"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={resume.contact.linkedin || ''}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, linkedin: e.target.value } })}
                        placeholder="https://linkedin.com/in/rahul-sharma"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#090B10] mb-1">GitHub Profile</label>
                      <input
                        type="text"
                        value={resume.contact.github || ''}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, github: e.target.value } })}
                        placeholder="https://github.com/rahulsharma"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>

                    {/* Notice Period Chips (Indian Recruiter Essential) */}
                    <div className="sm:col-span-2 pt-2 border-t border-[#E1E5EA]">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <label className="block text-xs font-semibold text-[#090B10]">
                          Notice Period <span className="text-[#263D59] font-normal">(Primary recruiter search filter in India)</span>
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {['Immediate', '15 Days', '30 Days', '60 Days', '90 Days'].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setResume({
                                ...resume,
                                contact: { ...resume.contact, notice_period: preset }
                              })}
                              className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                                resume.contact.notice_period === preset
                                  ? 'bg-[#4B3DF5] text-white border-[#4B3DF5] font-semibold'
                                  : 'bg-[#F5F7FA] text-[#263D59] border-[#DDE2E8] hover:border-[#4B3DF5]'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={resume.contact.notice_period || ''}
                        onChange={(e) => setResume({ ...resume, contact: { ...resume.contact, notice_period: e.target.value } })}
                        placeholder="e.g. Immediate Joiner / Serving Notice (LWD: 15 Oct) / 30 Days"
                        className="w-full h-10 px-3 border border-[#DDE2E8] rounded-lg text-xs outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PROFESSIONAL SUMMARY */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3">
                    <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Professional Summary</h3>
                    <p className="text-[11px] text-[#263D59] mt-0.5">
                      A concise 20–60 word statement highlighting your technical core, campus projects, and quantitative achievements.
                    </p>
                  </div>
                  <textarea
                    rows={6}
                    value={resume.summary || ''}
                    onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                    placeholder="e.g. Dedicated Computer Science graduate with hands-on experience developing scalable full-stack web applications using React, Node.js, and PostgreSQL. Solved 350+ LeetCode problems with strong foundations in Data Structures, Algorithms, and System Design."
                    className="w-full text-xs p-3 border border-[#DDE2E8] rounded-lg focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] outline-none leading-relaxed bg-white text-[#090B10] shadow-2xs"
                  />
                  <div className="flex justify-between items-center text-[11px] font-mono text-[#263D59] pt-1">
                    <span>
                      Word count: {(resume.summary || '').trim() ? (resume.summary || '').trim().split(/\s+/).length : 0} words
                    </span>
                    <span className={(resume.summary || '').trim().split(/\s+/).length >= 20 && (resume.summary || '').trim().split(/\s+/).length <= 60 ? 'text-[#159D73] font-semibold' : 'text-amber-600'}>
                      Optimal: 20–60 words (+10 score points)
                    </span>
                  </div>
                </div>
              )}

              {/* 3. EDUCATION (Indian Campus & Placement Fields) */}
              {activeTab === 'education' && (
                <div className="space-y-5">
                  <div className="border-b border-[#E1E5EA] pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Education & Academics</h3>
                      <p className="text-[11px] text-[#263D59] mt-0.5">
                        Indian campus drives strictly filter on Degree, 12th, 10th marks and Cutoff CGPA/Percentage.
                      </p>
                    </div>
                  </div>

                  {/* Indian Academic Quick Add Shortcuts */}
                  <div className="flex items-center gap-2 flex-wrap p-2.5 bg-[#F5F7FA] border border-[#E1E5EA] rounded-lg">
                    <span className="text-[11px] font-semibold text-[#263D59]">Quick Add for Indian Resumes:</span>
                    <button
                      type="button"
                      onClick={() => handleAddPresetEducation('degree')}
                      className="text-[11px] font-medium bg-white hover:bg-[#F0F3FF] hover:text-[#4B3DF5] border border-[#DDE2E8] px-2.5 py-1 rounded transition-colors"
                    >
                      + B.Tech / Degree
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetEducation('hsc')}
                      className="text-[11px] font-medium bg-white hover:bg-[#F0F3FF] hover:text-[#4B3DF5] border border-[#DDE2E8] px-2.5 py-1 rounded transition-colors"
                    >
                      + Class 12th / Diploma
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddPresetEducation('ssc')}
                      className="text-[11px] font-medium bg-white hover:bg-[#F0F3FF] hover:text-[#4B3DF5] border border-[#DDE2E8] px-2.5 py-1 rounded transition-colors"
                    >
                      + Class 10th (SSC)
                    </button>
                  </div>

                  {resume.education.map((edu, eduIdx) => (
                    <div key={edu.id} className="p-4 border border-[#E1E5EA] rounded-lg bg-[#FFFFFF] shadow-2xs space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[11px] font-bold text-[#4B3DF5] uppercase tracking-wider">
                          Entry #{eduIdx + 1}: {edu.degree || 'Degree'}
                        </span>
                        <button
                          onClick={() => {
                            const updated = resume.education.filter((_, i) => i !== eduIdx);
                            setResume({ ...resume, education: updated });
                          }}
                          className="text-[#263D59] hover:text-red-600 p-1"
                          title="Remove education entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Degree / Certificate</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[eduIdx].degree = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            placeholder="e.g. B.Tech / Class 12th / B.E."
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Branch / Major / Stream</label>
                          <input
                            type="text"
                            value={edu.area}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[eduIdx].area = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            placeholder="e.g. Computer Science & Engineering / Science (PCM)"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">College / School Name</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[eduIdx].institution = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            placeholder="e.g. National Institute of Technology / Delhi Public School"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">
                            Board / University <span className="text-[#263D59] font-normal">(CBSE / State / VTU / Anna Univ)</span>
                          </label>
                          <input
                            type="text"
                            value={edu.board_or_university || ''}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[eduIdx].board_or_university = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            placeholder="e.g. VTU / CBSE / Autonomous"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>

                        {/* CGPA & Dates */}
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">
                            CGPA / Percentage <span className="text-[#159D73] font-medium">(Placement Cutoff)</span>
                          </label>
                          <input
                            type="text"
                            value={edu.cgpa_or_percentage || ''}
                            onChange={(e) => {
                              const updated = [...resume.education];
                              updated[eduIdx].cgpa_or_percentage = e.target.value;
                              setResume({ ...resume, education: updated });
                            }}
                            placeholder="e.g. 8.6 CGPA or 84.5%"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Start Date</label>
                            <input
                              type="text"
                              value={edu.start_date}
                              onChange={(e) => {
                                const updated = [...resume.education];
                                updated[eduIdx].start_date = e.target.value;
                                setResume({ ...resume, education: updated });
                              }}
                              placeholder="2020-08"
                              className="w-full h-9 px-2 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">End Date</label>
                            <input
                              type="text"
                              value={edu.end_date}
                              onChange={(e) => {
                                const updated = [...resume.education];
                                updated[eduIdx].end_date = e.target.value;
                                setResume({ ...resume, education: updated });
                              }}
                              placeholder="2024-05"
                              className="w-full h-9 px-2 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. PROJECTS (Critical for Freshers) */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Technical & Capstone Projects</h3>
                      <p className="text-[11px] text-[#263D59] mt-0.5">Highlight tech stack, problem solved, GitHub repository, and live links.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newProj = {
                          id: `proj-${Date.now()}`,
                          name: 'Project Name',
                          description: 'Key technical highlights and impact',
                          tools: ['React', 'Next.js', 'PostgreSQL'],
                          link: 'https://github.com/...',
                          highlights: ['Architected scalable application supporting 1,000+ test users with 99.9% uptime']
                        };
                        setResume({ ...resume, projects: [...resume.projects, newProj] });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3DF5] bg-[#F0F3FF] hover:bg-[#E4E9FF] px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                  </div>

                  {resume.projects.map((proj, pIdx) => (
                    <div key={proj.id} className="p-4 border border-[#E1E5EA] rounded-lg bg-white shadow-2xs space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Project Name</label>
                            <input
                              type="text"
                              value={proj.name}
                              onChange={(e) => {
                                const updated = [...resume.projects];
                                updated[pIdx].name = e.target.value;
                                setResume({ ...resume, projects: updated });
                              }}
                              placeholder="e.g. Distributed Task Queue"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Live Demo or GitHub URL</label>
                            <input
                              type="text"
                              value={proj.link || ''}
                              onChange={(e) => {
                                const updated = [...resume.projects];
                                updated[pIdx].link = e.target.value;
                                setResume({ ...resume, projects: updated });
                              }}
                              placeholder="https://github.com/username/project"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Tech Stack (comma separated)</label>
                            <input
                              type="text"
                              value={(proj.tools || []).join(', ')}
                              onChange={(e) => {
                                const updated = [...resume.projects];
                                updated[pIdx].tools = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setResume({ ...resume, projects: updated });
                              }}
                              placeholder="e.g. React, TypeScript, Tailwind, Node.js, Redis, Docker"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = resume.projects.filter((_, i) => i !== pIdx);
                            setResume({ ...resume, projects: updated });
                          }}
                          className="text-[#263D59] hover:text-red-600 p-1"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Project Bullet Points */}
                      <div className="space-y-2 pt-2 border-t border-[#E1E5EA]">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-[#263D59] uppercase tracking-wider">Bullet Points</span>
                          <button
                            onClick={() => {
                              const updated = [...resume.projects];
                              if (!updated[pIdx].highlights) updated[pIdx].highlights = [];
                              updated[pIdx].highlights.push('Engineered feature resulting in measurable outcome');
                              setResume({ ...resume, projects: updated });
                            }}
                            className="text-[11px] font-semibold text-[#4B3DF5] hover:underline flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>

                        {(proj.highlights || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...resume.projects];
                                updated[pIdx].highlights[bIdx] = e.target.value;
                                setResume({ ...resume, projects: updated });
                              }}
                              className="flex-1 h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...resume.projects];
                                updated[pIdx].highlights = updated[pIdx].highlights.filter((_, i) => i !== bIdx);
                                setResume({ ...resume, projects: updated });
                              }}
                              className="text-[#263D59] hover:text-red-600 p-2"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Technical Skills & Tools</h3>
                      <p className="text-[11px] text-[#263D59] mt-0.5">Categorized skills dramatically improve ATS parsing and keyword matches.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newSkill = {
                          id: `sk-${Date.now()}`,
                          category: 'Languages & Tools',
                          items: ['Java', 'C++', 'Python', 'Git']
                        };
                        setResume({ ...resume, skills: [...resume.skills, newSkill] });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3DF5] bg-[#F0F3FF] hover:bg-[#E4E9FF] px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </div>

                  {resume.skills.map((skill, sIdx) => (
                    <div key={skill.id} className="p-3.5 border border-[#E1E5EA] rounded-lg bg-white shadow-2xs flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Category Name</label>
                          <input
                            type="text"
                            value={skill.category}
                            onChange={(e) => {
                              const updated = [...resume.skills];
                              updated[sIdx].category = e.target.value;
                              setResume({ ...resume, skills: updated });
                            }}
                            placeholder="e.g. Programming Languages"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Skills (comma separated)</label>
                          <input
                            type="text"
                            value={skill.items.join(', ')}
                            onChange={(e) => {
                              const updated = [...resume.skills];
                              updated[sIdx].items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setResume({ ...resume, skills: updated });
                            }}
                            placeholder="e.g. Python, Java, JavaScript, TypeScript, SQL"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const updated = resume.skills.filter((_, i) => i !== sIdx);
                          setResume({ ...resume, skills: updated });
                        }}
                        className="text-[#263D59] hover:text-red-600 p-1"
                        title="Remove category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. WORK EXPERIENCE / INTERNSHIPS */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#090B10] text-sm sm:text-base">
                        {isFresher ? 'Internships & Work Experience' : 'Work Experience'}
                      </h3>
                      <p className="text-[11px] text-[#263D59] mt-0.5">Use ResumeCraft's XYZ formula: Action verb + metric + business result.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newExp = {
                          id: `exp-${Date.now()}`,
                          company: 'Company Name',
                          position: isFresher ? 'Software Engineer Intern' : 'Role Title',
                          start_date: '2023-01',
                          end_date: 'present',
                          location: 'Bengaluru, India',
                          highlights: ['Accomplished [X] as measured by [Y], by doing [Z]']
                        };
                        setResume({ ...resume, experience: [newExp, ...resume.experience] });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3DF5] bg-[#F0F3FF] hover:bg-[#E4E9FF] px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> {isFresher ? 'Add Internship' : 'Add Experience'}
                    </button>
                  </div>

                  {resume.experience.map((exp, expIdx) => (
                    <div key={exp.id} className="p-4 border border-[#E1E5EA] rounded-lg bg-white shadow-2xs space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Company / Organization</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...resume.experience];
                                updated[expIdx].company = e.target.value;
                                setResume({ ...resume, experience: updated });
                              }}
                              placeholder="e.g. Infosys / Razorpay"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Designation / Role Title</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const updated = [...resume.experience];
                                updated[expIdx].position = e.target.value;
                                setResume({ ...resume, experience: updated });
                              }}
                              placeholder="e.g. SDE Intern / Frontend Engineer"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Start Date</label>
                            <input
                              type="text"
                              value={exp.start_date}
                              onChange={(e) => {
                                const updated = [...resume.experience];
                                updated[expIdx].start_date = e.target.value;
                                setResume({ ...resume, experience: updated });
                              }}
                              placeholder="2023-01"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">End Date (or 'present')</label>
                            <input
                              type="text"
                              value={exp.end_date}
                              onChange={(e) => {
                                const updated = [...resume.experience];
                                updated[expIdx].end_date = e.target.value;
                                setResume({ ...resume, experience: updated });
                              }}
                              placeholder="present"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = resume.experience.filter((_, i) => i !== expIdx);
                            setResume({ ...resume, experience: updated });
                          }}
                          className="text-[#263D59] hover:text-red-600 p-1"
                          title="Remove entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Bullet Points */}
                      <div className="space-y-2 pt-2 border-t border-[#E1E5EA]">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-[#263D59] uppercase tracking-wider">Bullet Points</span>
                          <button
                            onClick={() => {
                              const updated = [...resume.experience];
                              updated[expIdx].highlights.push('Engineered feature resulting in measurable performance improvement');
                              setResume({ ...resume, experience: updated });
                            }}
                            className="text-[11px] font-semibold text-[#4B3DF5] hover:underline flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> Add Bullet
                          </button>
                        </div>

                        {exp.highlights.map((bullet, bIdx) => {
                          const isBeingRewritten = rewritingBullet?.expIndex === expIdx && rewritingBullet?.bulletIndex === bIdx;
                          return (
                            <div key={bIdx} className="space-y-2">
                              <div className="flex items-start gap-2">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => {
                                    const updated = [...resume.experience];
                                    updated[expIdx].highlights[bIdx] = e.target.value;
                                    setResume({ ...resume, experience: updated });
                                  }}
                                  className="flex-1 p-2 border border-[#DDE2E8] rounded-md text-xs leading-relaxed outline-none focus:border-[#4B3DF5] bg-white"
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRewriteBullet(expIdx, bIdx, bullet, exp.position, exp.company)}
                                    disabled={aiLoading}
                                    title="Rewrite with AI using ResumeCraft XYZ formula"
                                    className="px-2 py-1 bg-[#F0F3FF] hover:bg-[#E4E9FF] text-[#4B3DF5] border border-[#4B3DF5]/30 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                                  >
                                    {isBeingRewritten && aiLoading ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3 h-3" />
                                    )}
                                    <span>AI XYZ</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...resume.experience];
                                      updated[expIdx].highlights = updated[expIdx].highlights.filter((_, i) => i !== bIdx);
                                      setResume({ ...resume, experience: updated });
                                    }}
                                    className="text-[#263D59] hover:text-red-600 self-center p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Show AI Variations if active */}
                              {isBeingRewritten && aiVariations.length > 0 && (
                                <div className="p-3 bg-[#F0F3FF] border border-[#4B3DF5]/20 rounded-lg space-y-2 animate-fade-in">
                                  <div className="text-[11px] font-bold text-[#4B3DF5] flex items-center justify-between">
                                    <span>Select an AI XYZ variation:</span>
                                    <button onClick={() => setRewritingBullet(null)} className="text-[#263D59] hover:text-[#090B10]">
                                      ✕
                                    </button>
                                  </div>
                                  <div className="space-y-1.5">
                                    {aiVariations.map((v, vIdx) => (
                                      <button
                                        key={vIdx}
                                        onClick={() => applyVariation(v)}
                                        className="w-full text-left p-2 rounded bg-white hover:bg-[#E4E9FF] border border-[#DDE2E8] text-xs text-[#090B10] transition-colors flex items-start justify-between gap-2 group"
                                      >
                                        <span>{v}</span>
                                        <Check className="w-3.5 h-3.5 text-[#4B3DF5] opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. CERTIFICATIONS */}
              {activeTab === 'certifications' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Certifications & Licenses</h3>
                      <p className="text-[11px] text-[#263D59] mt-0.5">Industry certifications validate your domain readiness to recruiters.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newCert = {
                          id: `cert-${Date.now()}`,
                          name: 'AWS Certified Cloud Practitioner',
                          issuer: 'Amazon Web Services',
                          date: '2023'
                        };
                        setResume({ ...resume, certifications: [...(resume.certifications || []), newCert] });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3DF5] bg-[#F0F3FF] hover:bg-[#E4E9FF] px-2.5 py-1.5 rounded-md transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Certification
                    </button>
                  </div>

                  {(resume.certifications || []).map((cert, cIdx) => (
                    <div key={cert.id} className="p-3.5 border border-[#E1E5EA] rounded-lg bg-white shadow-2xs flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const updated = [...(resume.certifications || [])];
                              updated[cIdx].name = e.target.value;
                              setResume({ ...resume, certifications: updated });
                            }}
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Issuer / Authority</label>
                          <input
                            type="text"
                            value={cert.issuer || ''}
                            onChange={(e) => {
                              const updated = [...(resume.certifications || [])];
                              updated[cIdx].issuer = e.target.value;
                              setResume({ ...resume, certifications: updated });
                            }}
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Year</label>
                          <input
                            type="text"
                            value={cert.date || ''}
                            onChange={(e) => {
                              const updated = [...(resume.certifications || [])];
                              updated[cIdx].date = e.target.value;
                              setResume({ ...resume, certifications: updated });
                            }}
                            placeholder="2023"
                            className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs outline-none focus:border-[#4B3DF5]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const updated = (resume.certifications || []).filter((_, i) => i !== cIdx);
                          setResume({ ...resume, certifications: updated });
                        }}
                        className="text-[#263D59] hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 8. DECLARATION (Indian Campus & PSU Standard) */}
              {activeTab === 'declaration' && (
                <div className="space-y-4">
                  <div className="border-b border-[#E1E5EA] pb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[#090B10] text-sm sm:text-base">Formal Declaration & Signature</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F0F3FF] text-[#4B3DF5]">
                        Indian Campus & PSU Standard
                      </span>
                    </div>
                    <p className="text-[11px] text-[#263D59] mt-0.5">
                      Required for on-campus verification, tier-1 IT firms, and Public Sector Undertakings (PSUs).
                    </p>
                  </div>

                  <div className="p-4 border border-[#E1E5EA] rounded-lg bg-[#FAFBFC] space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(resume.declaration?.enabled)}
                        onChange={(e) => {
                          const isEnabled = e.target.checked;
                          setResume({
                            ...resume,
                            declaration: {
                              enabled: isEnabled,
                              text: resume.declaration?.text || 'I hereby declare that all information given above is true, complete, and correct to the best of my knowledge and belief.',
                              place: resume.declaration?.place || resume.contact.location || 'Bengaluru, India',
                              date: resume.declaration?.date || new Date().toISOString().split('T')[0],
                              signature_name: resume.declaration?.signature_name || resume.contact.name || '',
                            },
                          });
                        }}
                        className="mt-0.5 w-4 h-4 text-[#4B3DF5] rounded border-[#DDE2E8] focus:ring-[#4B3DF5]"
                      />
                      <div>
                        <span className="font-semibold text-xs text-[#090B10]">Include signed declaration block on resume</span>
                        <p className="text-[11px] text-[#263D59]">
                          Prints solemn verification statement, date, place, and online signature at the foot of your PDF.
                        </p>
                      </div>
                    </label>

                    {resume.declaration?.enabled && (
                      <div className="space-y-3.5 pt-3 border-t border-[#E1E5EA] animate-fade-in">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Declaration Statement</label>
                          <textarea
                            rows={2}
                            value={resume.declaration.text || ''}
                            onChange={(e) => setResume({
                              ...resume,
                              declaration: { ...resume.declaration!, text: e.target.value }
                            })}
                            className="w-full text-xs p-2.5 border border-[#DDE2E8] rounded-md bg-white outline-none focus:border-[#4B3DF5]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Place / City</label>
                            <input
                              type="text"
                              value={resume.declaration.place || ''}
                              onChange={(e) => setResume({
                                ...resume,
                                declaration: { ...resume.declaration!, place: e.target.value }
                              })}
                              placeholder="e.g. Bengaluru, India"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs bg-white outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Date</label>
                            <input
                              type="text"
                              value={resume.declaration.date || ''}
                              onChange={(e) => setResume({
                                ...resume,
                                declaration: { ...resume.declaration!, date: e.target.value }
                              })}
                              placeholder="YYYY-MM-DD"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs bg-white outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-[#090B10] mb-1">Signee Name</label>
                            <input
                              type="text"
                              value={resume.declaration.signature_name || ''}
                              onChange={(e) => setResume({
                                ...resume,
                                declaration: { ...resume.declaration!, signature_name: e.target.value }
                              })}
                              placeholder="Candidate Full Name"
                              className="w-full h-9 px-2.5 border border-[#DDE2E8] rounded-md text-xs bg-white outline-none focus:border-[#4B3DF5]"
                            />
                          </div>
                        </div>

                        {/* Candidate Online Signature Pad */}
                        <div className="pt-3 border-t border-[#E1E5EA]">
                          <label className="block text-[11px] font-semibold text-[#090B10] mb-0.5">
                            Candidate Online Signature <span className="text-[#263D59] font-normal">(Draw, Type Script, or Upload)</span>
                          </label>
                          <p className="text-[11px] text-[#263D59] mb-2">
                            Renders your authentic signature on campus placement submissions and official hard copies.
                          </p>
                          <SignaturePad
                            value={resume.declaration.signature_image}
                            defaultName={resume.declaration.signature_name || resume.contact.name}
                            initialMode={resume.declaration.signature_mode || 'draw'}
                            onChange={(sigDataUrl, sigMode) => {
                              setResume({
                                ...resume,
                                declaration: {
                                  ...resume.declaration!,
                                  signature_image: sigDataUrl,
                                  signature_mode: sigMode,
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE ATS PREVIEW (58% Hero View) */}
          <div
            className={`w-full lg:w-[58%] flex-1 flex-col bg-[#F5F7FA] overflow-hidden ${
              mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Engine Sub-header */}
            <div className="px-5 py-2 bg-white border-b border-[#E1E5EA] flex items-center justify-between text-xs text-[#263D59] shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#090B10]">RenderCV Typst:</span>
                <span className="px-2 py-0.5 rounded bg-[#F0F3FF] text-[#4B3DF5] font-semibold">
                  {TEMPLATE_NAMES[resume.template]?.name}
                </span>
                <span className="text-gray-400 hidden sm:inline">({TEMPLATE_NAMES[resume.template]?.tag})</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#159D73]">
                <span className="w-2 h-2 rounded-full bg-[#159D73] animate-pulse"></span>
                <span>Live ATS View</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center gap-5">
              {/* Score Gauge & Keyword Targeting */}
              <div className="w-full max-w-[850px] space-y-3">
                <ScoreGauge
                  scoreResult={scoreResult}
                  onFocusSection={(sec) => {
                    if (['contact', 'summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'declaration'].includes(sec)) {
                      setActiveTab(sec as any);
                    }
                  }}
                />
                {missingKeywords.length > 0 && (
                  <KeywordTargetingSidebar
                    resume={resume}
                    missingKeywords={missingKeywords}
                    onAddBulletToExperience={handleAddBulletToExperience}
                    onDismissKeyword={handleDismissKeyword}
                  />
                )}
              </div>

              {/* Live ATS Preview Canvas */}
              <div className="w-full flex justify-center pb-12">
                <div className="shadow-md rounded-sm border border-[#E1E5EA] bg-white transition-all">
                  <LivePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI TAILOR MODAL */}
      <AiTailorModal
        isOpen={isTailorModalOpen}
        onClose={() => setIsTailorModalOpen(false)}
        resume={resume}
        onApplyScore={(score) => setResume({ ...resume, ats_score: score })}
        onMissingKeywords={(kws) => setMissingKeywords(kws)}
        onAddBullet={(bullet) => {
          if (resume.experience.length > 0) {
            const updated = { ...resume };
            updated.experience[0].highlights.push(bullet);
            setResume(updated);
          }
        }}
      />

      {/* Dedicated Offscreen A4 Canvas for 100% Reliable Client-Side PDF Generation */}
      <div
        id="resume-export-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -9999,
          pointerEvents: 'none',
          width: '794px',
          background: '#ffffff',
          overflow: 'visible',
        }}
        aria-hidden="true"
      >
        <LivePreview resume={resume} canvasOnly={true} />
      </div>
    </div>
  );
}

