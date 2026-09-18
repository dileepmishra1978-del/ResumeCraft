'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { Sparkles, X, Check, Loader2, Target, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface AiTailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onApplyScore?: (score: number) => void;
  onAddBullet?: (bullet: string) => void;
  onMissingKeywords?: (keywords: string[]) => void;
}

export function AiTailorModal({
  isOpen,
  onClose,
  resume,
  onApplyScore,
  onAddBullet,
  onMissingKeywords,
}: AiTailorModalProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [appliedIndices, setAppliedIndices] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleTailor = async () => {
    if (!jobDescription.trim() || loading) return;
    setLoading(true);

    try {
      // Build plain text representation of resume
      const resumeText = `
Name: ${resume.contact.name}
Role: ${resume.target_role || ''}
Experience:
${resume.experience.map(e => `${e.position} at ${e.company}:\n${e.highlights.join('\n')}`).join('\n\n')}
Education:
${resume.education.map(e => `${e.degree} in ${e.area} from ${e.institution}`).join('\n')}
Skills:
${resume.skills.map(s => `${s.category}: ${s.items.join(', ')}`).join('\n')}
      `.trim();

      const res = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to tailor resume');
      }

      const data = await res.json();
      setResult(data);
      if (onApplyScore && typeof data.match_score === 'number') {
        onApplyScore(data.match_score);
      }
      if (onMissingKeywords && Array.isArray(data.missing_keywords)) {
        onMissingKeywords(data.missing_keywords);
      }
    } catch (err: any) {
      alert(err.message || 'Tailoring failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedBullet = (bullet: string, index: number) => {
    if (onAddBullet) {
      onAddBullet(bullet);
      setAppliedIndices(prev => [...prev, index]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Job Description Matcher</h3>
              <p className="text-xs text-gray-500">Calculate ATS Match Score and bridge missing keyword gaps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Paste the Target Job Description
                </label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job posting here (job requirements, responsibilities, preferred qualifications)..."
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleTailor}
                  disabled={loading || !jobDescription.trim()}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium text-xs shadow-sm transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                  {loading ? 'Analyzing with Gemini...' : 'Analyze & Calculate ATS Score'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* ATS SCORE CARD */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    ATS Match Score
                  </div>
                  <div className="text-3xl font-black text-gray-900 mt-1">
                    {result.match_score}<span className="text-lg text-gray-500 font-normal">/100</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 max-w-sm">
                    {result.analysis || 'Based on keyword frequency, technical requirements, and core job criteria.'}
                  </p>
                </div>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl border-4 ${
                  result.match_score >= 80 ? 'border-emerald-500 text-emerald-700 bg-emerald-50' :
                  result.match_score >= 60 ? 'border-amber-500 text-amber-700 bg-amber-50' :
                  'border-red-500 text-red-700 bg-red-50'
                }`}>
                  {result.match_score}%
                </div>
              </div>

              {/* KEYWORDS COMPARISON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matching */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matching Keywords ({result.matching_keywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matching_keywords?.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 text-[11px] font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Missing Keywords to Add ({result.missing_keywords?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords?.map((kw: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[11px] font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECOMMENDED TAILORED BULLETS */}
              {result.suggested_bullets && result.suggested_bullets.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Recommended Bullet Points for this Job
                  </h4>
                  <div className="space-y-2">
                    {result.suggested_bullets.map((b: string, i: number) => {
                      const isApplied = appliedIndices.includes(i);
                      return (
                        <div key={i} className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 transition-colors flex items-start justify-between gap-3">
                          <p className="text-xs text-gray-800 leading-relaxed">{b}</p>
                          <button
                            onClick={() => handleAddSuggestedBullet(b, i)}
                            disabled={isApplied}
                            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                              isApplied
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {isApplied ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                            <span>{isApplied ? 'Added' : 'Add'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={() => setResult(null)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  ← Test another Job Description
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
