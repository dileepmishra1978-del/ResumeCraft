'use client';

import React, { useState } from 'react';
import { ResumeScoreResult } from '@/lib/scoring/resumeScore';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface ScoreGaugeProps {
  scoreResult: ResumeScoreResult;
  onFocusSection?: (sectionKey: string) => void;
}

export function ScoreGauge({ scoreResult, onFocusSection }: ScoreGaugeProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { score, label, breakdown } = scoreResult;

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

        {/* Right: Toggle Button */}
        <button
          type="button"
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B3DF5] hover:text-[#3C2FE0] py-1 px-2.5 rounded-lg hover:bg-indigo-50/60 transition-colors shrink-0"
        >
          <span>{showBreakdown ? 'Close tips' : 'Improve score'}</span>
          {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Breakdown Drawer */}
      {showBreakdown && (
        <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 space-y-2 animate-fade-in text-xs">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Deterministic ATS Checklist (0 ms latency)
          </div>
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
        </div>
      )}
    </div>
  );
}
