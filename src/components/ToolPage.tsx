'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { ToolPageConfig, DemoType } from '@/lib/tools/config';
import { ScoreGauge } from '@/components/editor/score-gauge';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileText, 
  Sliders, 
  Building2, 
  Briefcase, 
  FileCheck,
  UploadCloud,
  BarChart3,
  Layout,
  Download,
  Target,
  PlusCircle,
  Edit3,
  Maximize2,
  CheckCheck,
  ListOrdered,
  CopyCheck,
  Crosshair,
  FolderSync
} from 'lucide-react';

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  upload: UploadCloud,
  barchart: BarChart3,
  check: CheckCircle2,
  layout: Layout,
  sparkles: Sparkles,
  download: Download,
  file: FileText,
  target: Target,
  plus: PlusCircle,
  edit: Edit3,
  sliders: Sliders,
  maximize: Maximize2,
  checkcheck: CheckCheck,
  building: Building2,
  list: ListOrdered,
  copy: Copy,
  copycheck: CopyCheck,
  crosshair: Crosshair,
  foldersync: FolderSync,
};

import { calculateResumeScore, ResumeScoreResult } from '@/lib/scoring/resumeScore';
import { DEFAULT_RESUME } from '@/lib/utils';

// Real score result computed dynamically from sample resume
const SAMPLE_SCORE_RESULT: ResumeScoreResult = calculateResumeScore(DEFAULT_RESUME);

interface ToolPageProps {
  config: ToolPageConfig;
}

export function ToolPage({ config }: ToolPageProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFE] text-[#090B10] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-20 sm:pt-16 sm:pb-24 space-y-16 sm:space-y-20">
        {/* 1. HERO SECTION (Badge -> H1 -> Subhead) */}
        <section className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-1.5 bg-[#F0F3FF] border border-[#4B3DF5]/20 text-[#4B3DF5] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{config.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#090B10] tracking-tight leading-[1.15]">
            {config.headline}
          </h1>

          <p className="text-base sm:text-lg text-[#263D59] font-normal leading-relaxed">
            {config.subhead}
          </p>
        </section>

        {/* 2. DEMO SECTION (Actual interactive/rendered feature inline) */}
        <section className="w-full max-w-4xl mx-auto">
          <div className="bg-white border border-[#E1E5EA] rounded-2xl shadow-sm p-5 sm:p-8 overflow-hidden">
            <DemoRenderer demoType={config.demoType} />
          </div>
        </section>

        {/* 3. THREE-STEP ROW */}
        <section className="space-y-8">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#090B10] tracking-tight">
              Three simple steps to interview-ready
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {config.steps.map((step, idx) => {
              const StepIcon = STEP_ICONS[step.icon] || Sparkles;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E1E5EA] rounded-2xl p-6 shadow-2xs relative flex flex-col justify-between hover:border-[#4B3DF5]/40 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F3FF] text-[#4B3DF5] flex items-center justify-center font-bold">
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#64748B] bg-gray-100 px-2 py-0.5 rounded-full">
                        Step {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#090B10]">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#263D59] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. SINGLE PRIMARY CTA BUTTON */}
        <section className="text-center space-y-3 pt-4">
          <Link
            href={config.ctaHref}
            className="inline-flex items-center justify-center gap-2 bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white font-bold text-sm sm:text-base px-8 sm:px-10 py-4 rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{config.ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-center gap-4 text-xs text-[#64748B] font-medium pt-1">
            <span className="flex items-center gap-1 text-[#159D73]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Free to start</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#4B3DF5]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% ATS compliant</span>
            </span>
            <span>•</span>
            <span>No credit card required</span>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E1E5EA] bg-white py-8 text-center text-xs text-[#64748B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-[#090B10]">
            ResumeCraft &copy; {new Date().getFullYear()} — Built for Indian Tech & Global Placements
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#4B3DF5] transition-colors">Home</Link>
            <Link href="/templates" className="hover:text-[#4B3DF5] transition-colors">Templates</Link>
            <Link href="/dashboard" className="hover:text-[#4B3DF5] transition-colors">Editor</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * DEMO RENDERER
 * Renders the actual inline interactive component based on demoType.
 */
function DemoRenderer({ demoType }: { demoType: DemoType }) {
  switch (demoType) {
    case 'score':
    case 'builder':
      return <ScoreGaugeDemo />;
    case 'keyword':
      return <KeywordScannerDemo />;
    case 'bullet':
      return <BulletComparisonDemo />;
    case 'autoadjust':
      return <AutoAdjustDemo />;
    case 'coverletter':
      return <CoverLetterPreviewDemo />;
    case 'versions':
      return <ResumeVersionsDemo />;
    default:
      return <ScoreGaugeDemo />;
  }
}

/** 1. SCORE GAUGE DEMO (Reuses real ScoreGauge component) */
function ScoreGaugeDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#E1E5EA] pb-3">
        <div>
          <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">Live Diagnostic Preview</span>
          <h4 className="text-sm font-bold text-[#090B10]">Resume Strength Scan</h4>
        </div>
        <span className="text-xs font-mono font-bold text-[#159D73] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          Candidate: Alex Rivera
        </span>
      </div>
      <ScoreGauge scoreResult={SAMPLE_SCORE_RESULT} resume={DEFAULT_RESUME} />
    </div>
  );
}

/** 2. KEYWORD SCANNER DEMO (Interactive missing-keyword component) */
function KeywordScannerDemo() {
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#E1E5EA] pb-3">
        <div>
          <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">Target Job Match Analysis</span>
          <h4 className="text-sm font-bold text-[#090B10]">Senior Full Stack Engineer — Stripe</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B]">Match Score:</span>
          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full transition-colors ${
            added ? 'bg-emerald-50 text-[#159D73] border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {added ? '94% (High Match)' : '76% (Missing Keywords)'}
          </span>
        </div>
      </div>

      <div className="p-4 bg-[#FAFBFC] border border-[#E1E5EA] rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-bold text-[#090B10]">Missing Keyword Detected:</span>
            <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#E1E5EA] text-[#4B3DF5]">
              Distributed Systems / Redis
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAdded(!added)}
            className="text-xs font-bold text-[#4B3DF5] hover:text-[#3B2DE6] bg-[#F0F3FF] hover:bg-[#E4E9FF] border border-[#4B3DF5]/20 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {added ? <Check className="w-3.5 h-3.5 text-[#159D73]" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{added ? 'Keyword Added!' : 'Add to Experience Bullet'}</span>
          </button>
        </div>

        <div className="p-3 bg-white border border-[#E1E5EA] rounded-lg text-xs leading-relaxed text-[#263D59]">
          <span className="font-bold text-[#090B10] block mb-1">Generated Suggested Bullet:</span>
          {added ? (
            <span className="text-emerald-900 font-medium">
              • Architected high-throughput distributed caching pipeline using <strong className="text-[#4B3DF5] font-bold">Redis</strong> and Next.js, reducing p99 response time by 38% across 40,000 active sessions.
            </span>
          ) : (
            <span className="text-gray-500 italic">
              Click &quot;Add to Experience Bullet&quot; to inject this keyword directly into your work highlights using the ResumeCraft XYZ format.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** 3. BULLET COMPARISON DEMO (Before vs. After XYZ Formula) */
function BulletComparisonDemo() {
  return (
    <div className="space-y-4">
      <div className="border-b border-[#E1E5EA] pb-3">
        <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">Before & After Transformation</span>
        <h4 className="text-sm font-bold text-[#090B10]">ResumeCraft XYZ Formula: Accomplished [X] as measured by [Y], by doing [Z]</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="p-4 bg-red-50/40 border border-red-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Before (Weak / Task-Oriented)</span>
          </div>
          <p className="text-xs text-red-950 leading-relaxed font-mono">
            &quot;Worked on an internal React dashboard to make it run faster and helped other developers fix bugs.&quot;
          </p>
          <div className="text-[11px] text-red-800/80 pt-1">
            ❌ Lacks quantifiable metrics, action verbs, and business outcome.
          </div>
        </div>

        {/* After */}
        <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>After (ResumeCraft XYZ Statement)</span>
          </div>
          <p className="text-xs text-emerald-950 leading-relaxed font-mono font-medium">
            &quot;Architected distributed React dashboard with virtualized rendering, cutting p95 page latency by 42% for 15,000 daily engineers.&quot;
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Action: Architected</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Metric: 42% cut</span>
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Scope: 15k engineers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 4. AUTO ADJUST DEMO (Page Spill vs. Exact 1-Page Fit) */
function AutoAdjustDemo() {
  const [isAdjusted, setIsAdjusted] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#E1E5EA] pb-3">
        <div>
          <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">Spacing Calibration Engine</span>
          <h4 className="text-sm font-bold text-[#090B10]">Automatic 1-Page Layout Lock</h4>
        </div>
        <button
          type="button"
          onClick={() => setIsAdjusted(!isAdjusted)}
          className="text-xs font-bold bg-[#F0F3FF] hover:bg-[#E4E9FF] text-[#4B3DF5] border border-[#4B3DF5]/30 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Toggle: {isAdjusted ? 'Show Unadjusted Spill' : 'Show Auto-Adjusted Fit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Visual representation */}
        <div className="p-4 border rounded-xl bg-[#FAFBFC] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#090B10]">Page Yield:</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
              isAdjusted ? 'bg-emerald-50 text-[#159D73] border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {isAdjusted ? '1.0 Page (Perfect ATS Density)' : '1.3 Pages (Spillover Disqualification)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-1/2 aspect-[1/1.3] bg-white border border-[#E1E5EA] rounded-md shadow-2xs p-2 space-y-1">
              <div className="h-1.5 w-1/3 bg-gray-900 rounded" />
              <div className="h-1 w-full bg-gray-200 rounded" />
              <div className="h-1 w-5/6 bg-gray-200 rounded" />
              <div className="h-1 w-full bg-gray-200 rounded" />
              <div className="h-1 w-2/3 bg-gray-200 rounded" />
              <div className="h-1 w-full bg-gray-200 rounded" />
              <div className="h-1 w-4/5 bg-gray-200 rounded" />
            </div>

            <div className="w-1/2 aspect-[1/1.3] bg-white border border-[#E1E5EA] rounded-md shadow-2xs p-2 flex flex-col justify-between">
              {isAdjusted ? (
                <div className="h-full flex items-center justify-center text-center p-2 text-emerald-800 text-xs font-bold bg-emerald-50/50 rounded border border-dashed border-emerald-300">
                  Tightened Spacing Fits 100% On Page 1
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="h-1 w-2/3 bg-red-300 rounded" />
                  <div className="h-1 w-1/2 bg-red-300 rounded" />
                  <span className="text-[9px] font-bold text-red-600 block pt-1">
                    Spillover onto Page 2
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 text-xs text-[#263D59]">
          <h5 className="font-bold text-[#090B10]">How RenderCV Spacing Calibration Works:</h5>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Iteratively tightens section entry margins by fractions of a millimeter.</li>
            <li>Balances line-height to maintain comfortable human readability.</li>
            <li>Guarantees strict single-page submission requirements for campus placement.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/** 5. COVER LETTER DEMO (Dual-column preview) */
function CoverLetterPreviewDemo() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#E1E5EA] pb-3">
        <div>
          <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">Dual-Column Workspace</span>
          <h4 className="text-sm font-bold text-[#090B10]">Targeted Cover Letter Generator</h4>
        </div>
        <span className="text-xs font-bold text-[#4B3DF5] bg-[#F0F3FF] px-2 py-0.5 rounded-full">
          Target: Google
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Input parameters */}
        <div className="md:col-span-4 p-3.5 bg-[#FAFBFC] border border-[#E1E5EA] rounded-xl space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Target Company</span>
            <div className="flex items-center gap-1.5 p-2 bg-white border border-[#E1E5EA] rounded-lg font-semibold text-[#090B10]">
              <Building2 className="w-3.5 h-3.5 text-[#4B3DF5]" />
              <span>Google</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Target Role</span>
            <div className="flex items-center gap-1.5 p-2 bg-white border border-[#E1E5EA] rounded-lg font-semibold text-[#090B10]">
              <Briefcase className="w-3.5 h-3.5 text-[#4B3DF5]" />
              <span>Software Engineer</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] uppercase block mb-1">Key Highlight</span>
            <div className="p-2 bg-white border border-[#E1E5EA] rounded-lg text-[#263D59] text-[11px] leading-tight">
              TechScale microservices (1.5M requests/day)
            </div>
          </div>
        </div>

        {/* Right: Generated letter */}
        <div className="md:col-span-8 p-4 bg-white border border-[#E1E5EA] rounded-xl space-y-2 text-xs text-[#263D59] leading-relaxed">
          <p className="font-bold text-[#090B10]">Dear Google Hiring Team,</p>
          <p>
            I am writing to express my enthusiastic interest in the Software Engineer position at Google. 
            With experience architecting distributed services that process over 1.5 million daily requests at TechScale, 
            I bring a demonstrated track record of low-latency systems engineering.
          </p>
          <p>
            I look forward to discussing how my background in Next.js, Redis caching, and Go can support Google’s 
            core infrastructure teams.
          </p>
          <p className="font-semibold text-[#090B10] pt-1">Sincerely,<br />Alex Rivera</p>
        </div>
      </div>
    </div>
  );
}

/** 6. RESUME VERSIONS DEMO (Static multi-version cards) */
function ResumeVersionsDemo() {
  const versions = [
    { title: 'Full Stack Engineer — General', updated: '2 hours ago', score: 94, pages: '1 page' },
    { title: 'Backend Distributed Systems — Cloud', updated: 'Yesterday', score: 91, pages: '1 page' },
    { title: 'Frontend UI/UX Specialist — React', updated: '3 days ago', score: 89, pages: '1 page' },
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-[#E1E5EA] pb-3">
        <span className="text-xs font-bold text-[#4B3DF5] uppercase tracking-wider">Multi-Role Application Hub</span>
        <h4 className="text-sm font-bold text-[#090B10]">Manage Targeted Variations Without Retyping</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {versions.map((ver, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-white border border-[#E1E5EA] rounded-xl hover:border-[#4B3DF5]/40 transition-all shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded bg-[#F0F3FF] text-[#4B3DF5] flex items-center justify-center font-bold text-[10px]">
                CV
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#159D73] border border-emerald-200 px-1.5 py-0.5 rounded">
                Score: {ver.score}
              </span>
            </div>

            <div className="text-xs font-bold text-[#090B10] leading-snug line-clamp-1">
              {ver.title}
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-gray-100">
              <span>{ver.updated}</span>
              <span>{ver.pages}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
