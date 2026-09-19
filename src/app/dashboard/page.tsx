'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ResumeData, RenderCVTheme } from '@/types/resume';
import { DEFAULT_RESUME, generateId } from '@/lib/utils';
import { TEMPLATE_NAMES } from '@/components/editor/live-preview';
import { ResumeCard } from '@/components/ResumeCard';
import { ReferralPanel } from '@/components/dashboard/referral-panel';
import { ProfileImportModal } from '@/components/editor/profile-import-modal';
import { 
  Plus, 
  FileText, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileUp,
  Building2
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isProfileImportOpen, setIsProfileImportOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateParam = params.get('template');
    const isValidTheme = (val: string | null): val is RenderCVTheme =>
      Boolean(val && val in TEMPLATE_NAMES);

    const saved = localStorage.getItem('resumecraft_resumes');
    let currentResumes: ResumeData[] = [];
    if (saved) {
      try {
        currentResumes = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    } else {
      currentResumes = [{ ...DEFAULT_RESUME, id: 'res-1', title: 'Fullstack Engineer — Tech Focus' }];
      localStorage.setItem('resumecraft_resumes', JSON.stringify(currentResumes));
    }

    if (isValidTheme(templateParam)) {
      const themeKey = templateParam;
      const newId = `res-${Date.now()}`;
      const newResume: ResumeData = {
        ...DEFAULT_RESUME,
        id: newId,
        title: `${TEMPLATE_NAMES[themeKey].name} resume`,
        template: themeKey,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [newResume, ...currentResumes];
      setResumes(updated);
      localStorage.setItem('resumecraft_resumes', JSON.stringify(updated));
      router.replace(`/dashboard/resumes/${newId}`);
      return;
    }

    setResumes(currentResumes);
  }, [router]);

  const saveList = (list: ResumeData[]) => {
    setResumes(list);
    localStorage.setItem('resumecraft_resumes', JSON.stringify(list));
  };

  const handleCreateNew = () => {
    const newId = `res-${Date.now()}`;
    const newResume: ResumeData = {
      ...DEFAULT_RESUME,
      id: newId,
      title: `Resume ${resumes.length + 1}`,
      target_role: 'Software Engineer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveList([newResume, ...resumes]);
    router.push(`/dashboard/resumes/${newId}`);
  };

  const handleImportSuccess = (imported: Partial<ResumeData>) => {
    const newId = `res-${Date.now()}`;
    const newResume: ResumeData = {
      ...DEFAULT_RESUME,
      ...imported,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveList([newResume, ...resumes]);
    router.push(`/dashboard/resumes/${newId}`);
  };

  const handleDuplicate = (e: React.MouseEvent, resume: ResumeData) => {
    e.preventDefault();
    e.stopPropagation();
    const newId = `res-${Date.now()}`;
    const duplicate: ResumeData = {
      ...resume,
      id: newId,
      title: `${resume.title} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveList([duplicate, ...resumes]);
  };

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = resumes.filter((r) => r.id !== id);
      saveList(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAV */}
      <nav className="h-[58px] bg-white border-b border-[#E1E5EA] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-[#090B10] tracking-tight text-lg">
              Resume<span className="text-[#4B3DF5]">Craft</span>
            </span>
          </Link>
          <Link
            href="/placement"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-950 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-[#002D62]" />
            <span>Placement Cell (TPO)</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsProfileImportOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#263D59] hover:text-[#090B10] bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <FileUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Import Profile</span>
          </button>
          <Link
            href="/dashboard/resumes/res-1"
            className="text-xs font-semibold bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            Open Editor →
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* HERO SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">Your Resumes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create, tailor, and export 100% ATS-compliant Typst resumes for campus drives & MNC applications.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileImportOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-2xs transition-colors shrink-0"
            >
              <FileUp className="w-4 h-4 text-blue-600" />
              <span>Import Naukri / LinkedIn</span>
            </button>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>
        </div>

        {/* REFER A FRIEND & UNLOCK PRO PANEL */}
        <ReferralPanel />

        {/* RESUME GRID */}
        {resumes.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl p-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-base">No resumes yet</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto mb-6">
              Start by building your first ATS-optimized resume using our guided builder.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Resume</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* PROFILE IMPORT MODAL */}
      <ProfileImportModal
        isOpen={isProfileImportOpen}
        onClose={() => setIsProfileImportOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
