'use client';

import React, { useState, useEffect } from 'react';
import { ReferralState } from '@/types/resume';
import { 
  Gift, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';

export function ReferralPanel() {
  const [referralState, setReferralState] = useState<ReferralState>({
    referral_code: 'RC-84920',
    referred_count: 1,
    unlocked: false,
    required_count: 3,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('resumecraft_referrals');
    if (saved) {
      try {
        setReferralState(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initial: ReferralState = {
        referral_code: 'RC-' + Math.floor(10000 + Math.random() * 90000),
        referred_count: 1,
        unlocked: false,
        required_count: 3,
      };
      localStorage.setItem('resumecraft_referrals', JSON.stringify(initial));
      setReferralState(initial);
    }
  }, []);

  const saveState = (newState: ReferralState) => {
    setReferralState(newState);
    localStorage.setItem('resumecraft_referrals', JSON.stringify(newState));
  };

  const inviteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/ref?code=${referralState.referral_code}`
    : `https://resumecraft.vercel.app/ref?code=${referralState.referral_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSignup = () => {
    const newCount = Math.min(referralState.required_count, referralState.referred_count + 1);
    const isUnlocked = newCount >= referralState.required_count;
    const updated: ReferralState = {
      ...referralState,
      referred_count: newCount,
      unlocked: isUnlocked,
    };
    saveState(updated);
  };

  const handleReset = () => {
    const reset: ReferralState = {
      ...referralState,
      referred_count: 0,
      unlocked: false,
    };
    saveState(reset);
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `Hey! I'm building my tech resume on ResumeCraft. It creates 100% ATS-compliant vector PDFs with live scoring. Sign up using my link to unlock pro features: ${inviteUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const remaining = Math.max(0, referralState.required_count - referralState.referred_count);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-[#13192B] to-[#0B0F19] text-white p-6 rounded-2xl border border-indigo-500/30 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-400 flex items-center justify-center">
            <Gift className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Refer Classmates & Unlock Pro</h3>
              {referralState.unlocked ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PRO UNLOCKED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  3 Referrals Required
                </span>
              )}
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              Built for campus circles: Invite 3 friends to ResumeCraft to permanently unlock AI rewrites & premium vector templates.
            </p>
          </div>
        </div>

        {/* WhatsApp Quick Share */}
        <button
          type="button"
          onClick={handleShareWhatsapp}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BE5C] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Invite on WhatsApp</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-200">
            {referralState.unlocked ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All 3 referrals complete — Pro features unlocked!
              </span>
            ) : (
              <span>
                <strong>{referralState.referred_count} of {referralState.required_count}</strong> friends joined —{' '}
                <span className="text-indigo-300 font-bold">{remaining} more unlocks Pro</span>
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-gray-400">
            {Math.round((referralState.referred_count / referralState.required_count) * 100)}%
          </span>
        </div>

        {/* Bar */}
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              referralState.unlocked
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-indigo-500 to-violet-400'
            }`}
            style={{ width: `${(referralState.referred_count / referralState.required_count) * 100}%` }}
          />
        </div>
      </div>

      {/* Referral Link Copy Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="w-full sm:flex-1 bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 text-xs font-mono text-gray-300">
          <span className="truncate">{inviteUrl}</span>
          <span className="text-[10px] uppercase font-bold text-indigo-400 px-1.5 py-0.5 bg-indigo-900/40 rounded shrink-0">
            {referralState.referral_code}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>

        {/* Simulator Button for Instant Demonstration */}
        <button
          type="button"
          onClick={handleSimulateSignup}
          disabled={referralState.unlocked}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-40 text-gray-200 text-xs font-medium rounded-xl transition-colors shrink-0"
          title="Simulate a friend joining to test the unlock mechanic"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Simulate +1 Join</span>
        </button>

        {referralState.unlocked && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-gray-400 hover:text-white underline px-1"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
