'use client';

import React, { useState } from 'react';
import { ResumeData, ExperienceItem } from '@/types/resume';
import { Target, Sparkles, Check, X, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface KeywordTargetingSidebarProps {
  resume: ResumeData;
  missingKeywords: string[];
  onAddBulletToExperience: (experienceId: string, bullet: string) => void;
  onDismissKeyword: (keyword: string) => void;
}

export function KeywordTargetingSidebar({
  resume,
  missingKeywords,
  onAddBulletToExperience,
  onDismissKeyword,
}: KeywordTargetingSidebarProps) {
  const dismissed = new Set(resume.dismissed_keywords || []);
  const activeKeywords = missingKeywords.filter((kw) => !dismissed.has(kw));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrafting, setIsDrafting] = useState(false);
  const [selectedExpId, setSelectedExpId] = useState<string>(
    resume.experience[0]?.id || ''
  );
  const [draftedBullet, setDraftedBullet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If index out of bounds, reset
  const currentKeyword = activeKeywords[currentIndex];

  const handleSkip = () => {
    if (!currentKeyword) return;
    onDismissKeyword(currentKeyword);
    setDraftedBullet(null);
    setIsDrafting(false);
  };

  const handleStartDraft = () => {
    setIsDrafting(true);
    if (!selectedExpId && resume.experience.length > 0) {
      setSelectedExpId(resume.experience[0].id);
    }
  };

  const handleGenerateBullet = async () => {
    if (!currentKeyword || !selectedExpId || loading) return;
    setLoading(true);

    const targetExp = resume.experience.find((e) => e.id === selectedExpId);
    if (!targetExp) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/ai/keyword-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: currentKeyword,
          position: targetExp.position,
          company: targetExp.company,
          current_highlights: targetExp.highlights,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate bullet');
      }

      const data = await res.json();
      setDraftedBullet(data.bullet);
    } catch (err: any) {
      alert(err.message || 'Error drafting bullet point');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBullet = () => {
    if (!draftedBullet || !selectedExpId || !currentKeyword) return;
    onAddBulletToExperience(selectedExpId, draftedBullet);
    onDismissKeyword(currentKeyword);
    setDraftedBullet(null);
    setIsDrafting(false);
  };

  const handleRejectBullet = () => {
    setDraftedBullet(null);
  };

  if (activeKeywords.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-gray-950">Keyword coverage complete</h4>
        <p className="text-xs text-gray-500 max-w-xs mx-auto">
          All identified target job keywords have been addressed or dismissed for this resume.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Missing keyword targeter
          </h4>
        </div>
        <span className="text-xs font-mono font-medium text-gray-400">
          {currentIndex + 1} of {activeKeywords.length}
        </span>
      </div>

      {/* Active Keyword Card */}
      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Target skill
          </span>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100 font-mono">
            {currentKeyword}
          </span>
        </div>

        {/* Step 1: Default actions */}
        {!isDrafting && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleStartDraft}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Yes, add bullet point</span>
            </button>
            <button
              onClick={handleSkip}
              className="text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-200/60 font-medium py-2 px-3 rounded-lg transition-colors"
            >
              Skip, not relevant
            </button>
          </div>
        )}

        {/* Step 2: Experience Selector & Generate */}
        {isDrafting && !draftedBullet && (
          <div className="space-y-3 pt-2 animate-fade-in border-t border-gray-200/60">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Attach bullet to role:
              </label>
              <select
                value={selectedExpId}
                onChange={(e) => setSelectedExpId(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-indigo-500"
              >
                {resume.experience.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.position} — {exp.company}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateBullet}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? 'Drafting XYZ bullet...' : 'Draft with Gemini'}</span>
              </button>
              <button
                onClick={() => setIsDrafting(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Accept / Reject Drafted Bullet */}
        {draftedBullet && (
          <div className="space-y-3 pt-2 animate-fade-in border-t border-gray-200/60">
            <div className="p-3 bg-white rounded-lg border border-indigo-100 text-xs text-gray-800 leading-relaxed font-sans">
              <p className="font-serif italic text-gray-900">"{draftedBullet}"</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAcceptBullet}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept & append</span>
              </button>
              <button
                onClick={handleRejectBullet}
                className="text-xs text-red-600 hover:bg-red-50 border border-red-200 font-medium py-2 px-3 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
