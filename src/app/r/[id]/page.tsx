'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ResumeData } from '@/types/resume';
import { DEFAULT_RESUME } from '@/lib/utils';
import { LivePreview } from '@/components/editor/live-preview';
import { downloadVectorPdf } from '@/lib/pdf/vector-pdf';
import { 
  Download, 
  Share2, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function ReadOnlyResumePage() {
  const params = useParams();
  const id = params.id as string;
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Look up resume in localStorage
    const saved = localStorage.getItem('resumecraft_resumes');
    if (saved) {
      try {
        const list: ResumeData[] = JSON.parse(saved);
        const found = list.find((r) => r.id === id);
        if (found) {
          setResume(found);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Fallback sample resume
    setResume({
      ...DEFAULT_RESUME,
      id,
      title: 'Verified Candidate Profile',
    });
  }, [id]);

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs text-gray-500">
        Loading verified resume...
      </div>
    );
  }

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadVectorPdf(resume, resume.template);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsapp = () => {
    const shareUrl = window.location.href;
    const text = encodeURIComponent(
      `Check out ${resume.contact?.name || 'my'} verified ATS resume on ResumeCraft: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-14 bg-slate-950/80 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-white tracking-tight text-sm sm:text-base">
            Resume<span className="text-[#4B3DF5]">Craft</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" /> Read-Only Verified View
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsapp}
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BE5C] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share on WhatsApp</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 bg-[#4B3DF5] hover:bg-[#3B2DE6] disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloading ? 'Compiling...' : 'Download PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Vector Resume Display */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-4xl bg-slate-900/60 p-2 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center">
          <div className="w-full overflow-x-auto flex justify-center">
            <div className="w-full max-w-[800px] shadow-2xl">
              <LivePreview resume={resume} />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom CTA */}
      <footer className="py-3 px-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
        <span>Rendered with RenderCV true vector Typst compiler.</span>
        <Link
          href="/"
          className="font-bold text-[#4B3DF5] hover:underline flex items-center gap-1"
        >
          <span>Build your free ATS resume</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}
