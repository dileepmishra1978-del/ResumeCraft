'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeScoreResult } from '@/lib/scoring/resumeScore';
import { calculateNaukriScore } from '@/lib/scoring/naukriScore';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  Share2, 
  Award,
  Briefcase,
  Layers
} from 'lucide-react';

interface ScoreGaugeProps {
  scoreResult: ResumeScoreResult;
  resume?: ResumeData;
  onFocusSection?: (sectionKey: string) => void;
  onOpenScoreBadge?: () => void;
}

export function ScoreGauge({ scoreResult, resume, onFocusSection, onOpenScoreBadge }: ScoreGaugeProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'naukri'>('general');
  const { score, label, breakdown } = scoreResult;

  const naukriResult = resume ? calculateNaukriScore(resume) : null;

  // Color selection matching landing page
  let strokeColor = '#ef4444'; // Red (0-49)
  let badgeColor = 'bg-red-50 text-red-700 border-red-200';
  let arcEnd = '70 80'; // dynamic arc point
  if (score >= 80) {
    strokeColor = '#159D73'; // Landing page signature green (80-100)
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    arcEnd = '148 42';
  } else if (score >= 50) {
    strokeColor = '#f59e0b'; // Amber (50-79)
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    arcEnd = '95 24';
  }

  return (
    <div className="w-full bg-white border border-[#E1E5EA] rounded-xl shadow-2xs transition-all overflow-hidden">
      {/* Compact Header Bar (~46px) */}
      <div className="px-3.5 py-2 flex items-center justify-between gap-3">
        {/* Left: Mini Semicircle Gauge & Strength Status */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mini Semicircle SVG Gauge */}
          <div className="relative w-8 h-6 shrink-0">
            <svg viewBox="0 0 190 120" className="w-full h-full overflow-visible" aria-hidden="true">
              <path
                d="M 25 94 A 70 70 0 0 1 165 94"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d={`M 25 94 A 70 70 0 0 1 ${arcEnd}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2 flex-wrap min-w-0 text-xs">
            <span className="font-semibold text-gray-900">Resume Strength:</span>
            <span className="font-bold text-gray-950 font-mono">{score}/100</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
              {label}
            </span>
            <span className="hidden xl:inline text-gray-400 text-[11px]">
              {score >= 80
                ? '· Exceeds Indian campus & ATS screening benchmarks'
                : '· Needs quantifiable XYZ action bullets'}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenScoreBadge && (
            <button
              type="button"
              onClick={onOpenScoreBadge}
              className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 py-1 px-2.5 rounded-lg border border-gray-200 transition-colors"
              title="Generate 1080x1080 social proof score badge"
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Share score</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3DF5] hover:text-[#3C2FE0] py-1 px-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors"
          >
            <span>{showBreakdown ? 'Close tips' : 'Improve score'}</span>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Breakdown Drawer */}
      {showBreakdown && (
        <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 space-y-3 animate-fade-in text-xs">
          {/* Subcategory Switcher: General ATS vs Naukri-Specific */}
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-gray-200/70 p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'general' ? 'bg-white text-gray-950 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Standard ATS Rubric</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('naukri')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'naukri' ? 'bg-white text-blue-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Briefcase className="w-3 h-3 text-blue-600" />
                <span>Naukri ATS Guidelines</span>
                {naukriResult && (
                  <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-blue-100 text-blue-800 font-mono">
                    {naukriResult.score}%
                  </span>
                )}
              </button>
            </div>
            
            <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
              Deterministic (0ms latency)
            </span>
          </div>

          {activeTab === 'general' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {breakdown.map((item, i) => {
                const isFull = item.points === item.maxPoints;
                return (
                  <div
                    key={i}
                    className={`p-2 rounded-lg border bg-white flex flex-col justify-between gap-1 transition-colors ${
                      isFull ? 'border-gray-200' : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-[11px]">
                        {isFull ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#159D73] shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-500 shrink-0 font-semibold">
                        {item.points}/{item.maxPoints} pts
                      </span>
                    </div>
                    {item.tip && (
                      <p className="text-[10px] text-gray-500 pl-5 leading-relaxed">
                        {item.tip}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Naukri.com Specific Checklist */
            <div className="space-y-2">
              <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg text-blue-900 text-[11px] leading-relaxed">
                <strong>Naukri Recruiter Indexing Rules:</strong> Over 80M Indian job searches filter candidates by explicit notice period, +91 mobile verification, and comma-delimited technical skills.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {naukriResult?.checklist.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg border bg-white flex flex-col justify-between gap-1.5 ${
                      item.passed ? 'border-gray-200' : 'border-blue-200 bg-blue-50/15'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-900 text-[11px]">
                        {item.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                        <span>{item.title}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {item.impact} Impact
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-5 leading-relaxed">
                      {item.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
