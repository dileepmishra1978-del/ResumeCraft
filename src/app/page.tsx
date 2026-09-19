'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Building2,
  Award,
  Sparkles,
  FileSpreadsheet,
  FileUp,
  GraduationCap,
  ArrowUpRight,
  Check
} from 'lucide-react';

import { Header } from '@/components/layout/header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR WITH MEGA-MENU */}
      <Header />

      {/* HERO SECTION */}
      <section className="pt-14 sm:pt-20 pb-16 px-6 sm:px-12 max-w-6xl mx-auto text-center space-y-8 relative">
        {/* Subtle mesh background accent */}
        <div className="absolute inset-x-0 -top-10 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#4b3df5] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        {/* Floating Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs hover:border-indigo-300 transition-all group">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>New: DigiLocker Verified Marksheets &amp; Placement Cell (TPO) Portal Live</span>
          <Link href="/placement" className="font-bold underline underline-offset-2 ml-1 flex items-center gap-0.5 hover:text-indigo-900">
            Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-950 tracking-tight leading-[1.08] max-w-5xl mx-auto">
          The AI resume builder engineered to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">beat the ATS</span> and land the offer.
        </h1>

        <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed">
          Ditch flimsy visual templates that get silently filtered by corporate ATS parsers. 
          ResumeCraft compiles mathematically crisp vector Typst typography while AI refines your impact metrics with the Google XYZ formula — backed by native DigiLocker academic verification.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/dashboard/resumes/res-1"
            className="w-full sm:w-auto bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Building Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/placement"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4 text-[#002D62]" />
            <span>Placement Cell (TPO) Demo</span>
          </Link>
        </div>

        {/* TRUST BADGES */}
        <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% ATS-Compliant Typst</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> DigiLocker &amp; NAD Verified</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-600" /> Naukri &amp; MNC Keyword Ready</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-600" /> 1-Page Auto Precision Fit</span>
        </div>
      </section>

      {/* INDIA DIFFERENTIATORS SHOWCASE SECTION */}
      <section className="py-16 px-6 sm:px-12 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/40 border-y border-gray-200/70">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              Engineered For India &amp; Global MNCs
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              Purpose-built features other resume tools overlook
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              From college placement drives to government portal applications, ResumeCraft gives Indian engineers and students an unfair advantage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: DigiLocker */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Official Integration
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                    DigiLocker Verified Marksheets
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Connect directly to NAD / DigiLocker. Embed verified badges on your degree &amp; CGPA that HR recruiters instantly trust.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Tamper-Proof Badges
                </span>
              </div>
            </div>

            {/* Card 2: Govt Form Autofill */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    UPSC / SSC / IBPS
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                    Govt Application Autofill
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    1-click copy pre-formatted DOB, Father&apos;s Name, Category, and 10th/12th Board roll numbers directly into PSU &amp; Sarkari portals.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Zero Manual Copy-Paste
                </span>
              </div>
            </div>

            {/* Card 3: Naukri & LinkedIn Import */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FileUp className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    1-Click Sync
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">
                    Naukri &amp; LinkedIn Import
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Paste your profile or existing resume to populate experience, projects, education, and skills in under 3 seconds with automated parsing.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Instant Review &amp; Edit
                </span>
              </div>
            </div>

            {/* Card 4: Placement Cell (TPO) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    For Colleges &amp; TPOs
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-700 transition-colors">
                    Placement Cell Portal
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Campus placement teams track cohort readiness, audit ATS compliance, and export verified batch rosters for visiting recruiters.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <Link href="/placement" className="font-semibold text-purple-700 flex items-center gap-1 hover:underline">
                  Launch Portal <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FEATURE SHOWCASE */}
      <section id="features" className="rc-features">
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

          .rc-features {
            --rc-text: #090b10;
            --rc-body: #263d59;
            --rc-border: #e1e5ea;
            --rc-card: #ffffff;
            --rc-purple: #4b3df5;
            --rc-purple-bg: #f0f3ff;
            --rc-green: #159d73;

            width: 100%;
            max-width: 1212px;
            margin: 0 auto;
            padding: 34px 51px 60px;
            box-sizing: border-box;

            font-family: "Manrope", -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
            color: var(--rc-text);
            background: #fff;
          }

          .rc-features *,
          .rc-features *::before,
          .rc-features *::after {
            box-sizing: border-box;
          }

          /* Exact two-column structure from the reference */
          .rc-feature-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 57px;
            align-items: center;
            margin-bottom: 64px;
          }

          .rc-feature-row:last-child {
            margin-bottom: 0;
          }

          .rc-copy h2 {
            margin: 0 0 15px;
            max-width: 490px;
            color: var(--rc-text);
            font-size: 29px;
            line-height: 1.38;
            letter-spacing: -0.035em;
            font-weight: 800;
          }

          .rc-copy p {
            margin: 0;
            max-width: 485px;
            color: var(--rc-body);
            font-size: 14px;
            line-height: 1.9;
            letter-spacing: -0.005em;
            font-weight: 500;
          }

          /* Score panel */
          .rc-score-panel {
            height: 177px;
            border: 1px solid var(--rc-border);
            border-radius: 15px;
            background: var(--rc-card);
            box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .rc-score {
            position: relative;
            width: 190px;
            height: 135px;
          }

          .rc-score svg {
            display: block;
            width: 190px;
            height: 120px;
          }

          .rc-score-number {
            position: absolute;
            top: 58px;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 29px;
            line-height: 1;
            font-weight: 500;
            letter-spacing: -0.035em;
            color: #080b10;
          }

          .rc-score-label {
            position: absolute;
            top: 89px;
            left: 50%;
            transform: translateX(-50%);
            color: var(--rc-green);
            font-size: 11px;
            line-height: 1;
            font-weight: 600;
          }

          /* Keyword suggestion panel */
          /* Feature 02: Job Description & Keyword Scanner */
          .rc-f2-card {
            background: #fff;
            border: 1px solid #E5E7EB;
            border-radius: 18px;
            padding: 22px;
            box-shadow: 0 2px 8px rgba(15, 23, 42, .04);
          }
          .rc-f2-jd {
            background: #F8FAFC;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            padding: 18px;
          }
          .rc-f2-badge {
            display: inline-block;
            background: #EEF2FF;
            color: #4F46E5;
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 14px;
          }
          .rc-f2-job {
            font-size: 13px;
            color: #334155;
            line-height: 1.6;
            margin-bottom: 16px;
          }
          .rc-f2-divider {
            height: 1px;
            background: #E5E7EB;
            margin: 16px 0;
          }
          .rc-f2-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
          }
          .rc-f2-label {
            font-size: 13px;
            font-weight: 600;
            color: #0F172A;
          }
          .rc-f2-miss {
            font-size: 12px;
            color: #64748B;
          }
          .rc-f2-add {
            background: #4F46E5;
            color: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: background 0.15s ease;
          }
          .rc-f2-add:hover {
            background: #4338CA;
          }
          .rc-f2-title {
            font-size: 32px;
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: -.03em;
            margin-bottom: 16px;
            color: #0F172A;
          }
          .rc-f2-desc {
            font-size: 15px;
            color: #475569;
            line-height: 1.8;
          }

          /* Keep the visual order exactly like the screenshot */
          .rc-row-keywords .rc-visual {
            order: 1;
          }

          .rc-row-keywords .rc-copy {
            order: 2;
          }

          @media (max-width: 800px) {
            .rc-features {
              padding: 40px 24px;
            }

            .rc-feature-row {
              grid-template-columns: 1fr;
              gap: 28px;
              margin-bottom: 54px;
            }

            .rc-row-keywords .rc-visual,
            .rc-row-keywords .rc-copy {
              order: initial;
            }

            .rc-copy h2 {
              max-width: 100%;
              font-size: 27px;
              line-height: 1.3;
            }

            .rc-copy p {
              max-width: 100%;
              font-size: 14px;
              line-height: 1.75;
            }
          }

          @media (max-width: 480px) {
            .rc-features {
              padding: 32px 16px;
            }

            .rc-score-panel {
              height: 155px;
            }
          }
        ` }} />

        {/* Feature 01 */}
        <div className="rc-feature-row">
          <div className="rc-copy">
            <h2>See exactly how strong your resume is</h2>
            <p>
              No guesswork. Every edit updates your score instantly, scored across
              seven things recruiters and parsers both check for.
            </p>
          </div>

          <div className="rc-visual">
            <div className="rc-score-panel">
              <div className="rc-score" aria-label="Resume score 92, Excellent">
                <svg viewBox="0 0 190 120" aria-hidden="true">
                  <path
                    d="M 25 94 A 70 70 0 0 1 165 94"
                    fill="none"
                    stroke="#e3e6eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 25 94 A 70 70 0 0 1 145 38"
                    fill="none"
                    stroke="#159d73"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="rc-score-number">92</span>
                <span className="rc-score-label">Excellent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 02 */}
        <div className="rc-feature-row rc-row-keywords">
          <div className="rc-visual">
            <div className="rc-f2-card">
              <div className="rc-f2-jd">
                <span className="rc-f2-badge">Job Description</span>
                <div className="rc-f2-job">
                  <strong>Software Engineer Intern</strong>
                  <br />
                  Looking for candidates with React, TypeScript, REST APIs and System Design knowledge.
                </div>
                <div className="rc-f2-divider"></div>
                <div className="rc-f2-row">
                  <div>
                    <div className="rc-f2-label">System Design</div>
                    <div className="rc-f2-miss">Missing keyword</div>
                  </div>
                  <button type="button" className="rc-f2-add">+ Add</button>
                </div>
                <div className="rc-f2-divider"></div>
                <div className="rc-f2-row">
                  <div>
                    <div className="rc-f2-label">REST APIs</div>
                    <div className="rc-f2-miss">Suggested bullet ready</div>
                  </div>
                  <button type="button" className="rc-f2-add">+ Add</button>
                </div>
              </div>
            </div>
          </div>

          <div className="rc-copy">
            <h2 className="rc-f2-title">Never miss a keyword that gets you filtered out</h2>
            <p className="rc-f2-desc">
              Paste any job description and ResumeCraft instantly finds the skills and ATS keywords missing from your resume. Add suggested bullet points with one click while staying fully in control.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE 03: PRECISION TYPESETTING & ONE-PAGE FIT */}
      <section className="rc-feature-03">
        <style dangerouslySetInnerHTML={{ __html: `
          .rc-feature-03 {
            width: 100%;
            max-width: 1212px;
            margin: 0 auto;
            padding: 48px 51px 60px;
            box-sizing: border-box;
            font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #090b10;
            background: #fff;
          }

          .rc-feature-03 *,
          .rc-feature-03 *::before,
          .rc-feature-03 *::after {
            box-sizing: border-box;
          }

          .rc-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 57px;
            align-items: center;
            margin-bottom: 64px;
          }

          .rc-row:last-child {
            margin-bottom: 0;
          }

          .rc-copy h2 {
            margin: 0 0 15px;
            max-width: 490px;
            font-size: 30px;
            line-height: 1.35;
            font-weight: 800;
            letter-spacing: -0.035em;
            color: #090b10;
          }

          .rc-copy p {
            margin: 0;
            max-width: 485px;
            color: #263d59;
            font-size: 14px;
            line-height: 1.9;
            font-weight: 500;
          }

          /* Resume preview */
          .rc-preview-card {
            height: 315px;
            padding: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e1e5ea;
            border-radius: 15px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
          }

          .rc-paper {
            width: 245px;
            height: 265px;
            padding: 19px 20px;
            border: 1px solid #dfe3e8;
            background: #fff;
            box-shadow: 0 7px 18px rgba(15, 23, 42, 0.08);
            position: relative;
          }

          .rc-paper-name {
            font-size: 13px;
            line-height: 1.2;
            font-weight: 800;
            margin-bottom: 4px;
          }

          .rc-paper-role {
            font-size: 7px;
            line-height: 1.4;
            color: #687384;
            margin-bottom: 13px;
          }

          .rc-line {
            height: 4px;
            border-radius: 2px;
            background: #dfe3e8;
            margin-bottom: 5px;
          }

          .rc-line.dark { background: #9ca5b1; }
          .rc-line.short { width: 55%; }
          .rc-line.medium { width: 74%; }
          .rc-line.long { width: 100%; }

          .rc-section-title {
            margin: 11px 0 6px;
            font-size: 7px;
            font-weight: 800;
            letter-spacing: 0.04em;
            color: #303846;
          }

          .rc-link {
            position: absolute;
            bottom: 14px;
            left: 20px;
            right: 20px;
            font-size: 6px;
            line-height: 1.2;
            color: #4b3df5;
            white-space: nowrap;
            text-align: left;
          }

          /* One-page fit */
          .rc-fit-card {
            padding: 24px;
            border: 1px solid #e1e5ea;
            border-radius: 15px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
          }

          .rc-fit-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 17px;
          }

          .rc-fit-title {
            font-size: 13px;
            font-weight: 700;
            color: #090b10;
          }

          .rc-fit-status {
            padding: 5px 9px;
            border-radius: 6px;
            background: #eef9f5;
            color: #159d73;
            font-size: 10px;
            font-weight: 700;
          }

          .rc-page-area {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            gap: 14px;
          }

          .rc-mini-page {
            width: 126px;
            height: 150px;
            padding: 12px;
            border: 1px solid #dfe3e8;
            background: #fff;
            box-shadow: 0 3px 9px rgba(15, 23, 42, 0.06);
          }

          .rc-mini-page.old {
            height: 169px;
            opacity: 0.58;
          }

          .rc-mini-name {
            height: 7px;
            width: 48%;
            border-radius: 2px;
            background: #9ca5b1;
            margin-bottom: 9px;
          }

          .rc-mini-line {
            height: 3px;
            border-radius: 2px;
            background: #e0e4e9;
            margin-bottom: 4px;
          }

          .rc-mini-line:nth-child(3) { width: 90%; }
          .rc-mini-line:nth-child(4) { width: 78%; }
          .rc-mini-line:nth-child(5) { width: 94%; }
          .rc-mini-line:nth-child(6) { width: 68%; }

          .rc-arrow {
            align-self: center;
            color: #4b3df5;
            font-size: 18px;
            font-weight: 700;
          }

          .rc-fit-caption {
            margin-top: 15px;
            text-align: center;
            color: #687384;
            font-size: 10px;
            line-height: 1.5;
            font-weight: 500;
          }

          .rc-engine {
            margin-top: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #687384;
            font-size: 10px;
          }

          .rc-engine-dot {
            width: 7px;
            height: 7px;
            flex: 0 0 7px;
            border-radius: 50%;
            background: #159d73;
          }

          @media (max-width: 800px) {
            .rc-feature-03 { padding: 40px 24px; }
            .rc-row {
              grid-template-columns: 1fr;
              gap: 28px;
              margin-bottom: 54px;
            }
            .rc-copy h2 {
              font-size: 27px;
              line-height: 1.3;
            }
          }

          @media (max-width: 480px) {
            .rc-feature-03 { padding: 32px 16px; }
            .rc-preview-card { height: 290px; }
            .rc-paper { transform: scale(0.92); }
          }
        ` }} />

        {/* Feature 03A: Precision typesetting */}
        <div className="rc-row">
          <div className="rc-copy">
            <h2>Beautiful resumes, perfectly typeset every time</h2>
            <p>
              ResumeCraft uses a precision typesetting engine to turn your resume
              into a clean, professional PDF with sharp text, consistent spacing,
              and clickable links.
            </p>
          </div>

          <div className="rc-preview-card">
            <div className="rc-paper" aria-label="Professional one-page resume preview">
              <div className="rc-paper-name">Yash Sharma</div>
              <div className="rc-paper-role">Computer Science &amp; Cybersecurity</div>

              <div className="rc-line long dark"></div>
              <div className="rc-line medium"></div>

              <div className="rc-section-title">EDUCATION</div>
              <div className="rc-line long"></div>
              <div className="rc-line medium"></div>

              <div className="rc-section-title">PROJECTS</div>
              <div className="rc-line long"></div>
              <div className="rc-line long"></div>
              <div className="rc-line short"></div>

              <div className="rc-section-title">SKILLS</div>
              <div className="rc-line long"></div>
              <div className="rc-line medium"></div>

              <div className="rc-section-title">EXPERIENCE</div>
              <div className="rc-line long"></div>
              <div className="rc-line medium"></div>

              <div className="rc-link">linkedin.com/in/yash-sharma</div>
            </div>
          </div>
        </div>

        {/* Feature 03B: One-page auto fit */}
        <div className="rc-row">
          <div className="rc-fit-card">
            <div className="rc-fit-header">
              <span className="rc-fit-title">One-page fit</span>
              <span className="rc-fit-status">✓ Fits perfectly</span>
            </div>

            <div className="rc-page-area">
              <div className="rc-mini-page old">
                <div className="rc-mini-name"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
              </div>

              <div className="rc-arrow">→</div>

              <div className="rc-mini-page">
                <div className="rc-mini-name"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
                <div className="rc-mini-line"></div>
              </div>
            </div>

            <div className="rc-fit-caption">
              Automatically adjusts spacing and layout to keep your resume on one page.
            </div>
          </div>

          <div className="rc-copy">
            <h2>Fit everything on one page without fighting the layout</h2>
            <p>
              When your resume spills onto a second page, ResumeCraft automatically
              reflows spacing and sizing to create a clean one-page version.
            </p>

            <div className="rc-engine">
              <span className="rc-engine-dot"></span>
              Fast live preview · No waiting for PDF generation
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 04: AI BULLET REWRITER (GOOGLE XYZ FORMULA) */}
      <section className="rc-feature-04">
        <style dangerouslySetInnerHTML={{ __html: `
          .rc-feature-04 {
            width: 100%;
            max-width: 1212px;
            margin: 0 auto;
            padding: 48px 51px 60px;
            box-sizing: border-box;
            font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #090b10;
            background: #fff;
          }

          .rc-feature-04 *,
          .rc-feature-04 *::before,
          .rc-feature-04 *::after {
            box-sizing: border-box;
          }

          .rc-f4-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 57px;
            align-items: center;
          }

          .rc-f4-copy h2 {
            margin: 0 0 15px;
            max-width: 490px;
            font-size: 30px;
            line-height: 1.35;
            font-weight: 800;
            letter-spacing: -0.035em;
            color: #090b10;
          }

          .rc-f4-copy p {
            margin: 0;
            max-width: 485px;
            color: #263d59;
            font-size: 14px;
            line-height: 1.9;
            font-weight: 500;
          }

          /* AI bullet rewriter */
          .rc-f4-card {
            width: 100%;
            padding: 24px;
            border: 1px solid #e1e5ea;
            border-radius: 15px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
          }

          .rc-f4-inner {
            padding: 20px;
            border: 1px solid #e1e5ea;
            border-radius: 10px;
            background: #fbfcfd;
          }

          .rc-f4-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            color: #596577;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .rc-f4-ai-tag {
            padding: 4px 8px;
            border-radius: 6px;
            background: #eef2ff;
            color: #4338e8;
            font-size: 10px;
            font-weight: 700;
            text-transform: none;
            letter-spacing: 0;
          }

          .rc-f4-before,
          .rc-f4-after {
            padding: 11px 12px;
            margin-bottom: 10px;
            border-radius: 7px;
            font-size: 11px;
            line-height: 1.55;
          }

          .rc-f4-before {
            border: 1px solid #e4e7eb;
            background: #fff;
            color: #667085;
          }

          .rc-f4-after {
            border: 1px solid #dcefe8;
            background: #f8fcfa;
            color: #263d59;
            margin-bottom: 13px;
          }

          .rc-f4-before span,
          .rc-f4-after span {
            display: block;
            margin-bottom: 4px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .rc-f4-before span { color: #929aa6; }
          .rc-f4-after span { color: #159d73; }

          .rc-f4-action {
            width: 100%;
            height: 36px;
            border: 1px solid #4b3df5;
            border-radius: 7px;
            background: #4b3df5;
            color: #fff;
            font: 700 11px "Manrope", sans-serif;
            cursor: pointer;
            transition: background 0.15s ease;
          }

          .rc-f4-action:hover {
            background: #3c2fe0;
          }

          @media (max-width: 800px) {
            .rc-feature-04 { padding: 40px 24px; }
            .rc-f4-row {
              grid-template-columns: 1fr;
              gap: 28px;
            }
            .rc-f4-copy h2 {
              font-size: 27px;
              line-height: 1.3;
            }
          }

          @media (max-width: 480px) {
            .rc-feature-04 { padding: 32px 16px; }
            .rc-f4-card { padding: 16px; }
            .rc-f4-inner { padding: 15px; }
          }
        ` }} />

        <div className="rc-f4-row">
          <div className="rc-f4-copy">
            <h2>Turn ordinary bullets into achievements recruiters notice</h2>
            <p>
              ResumeCraft rewrites weak experience and project bullets using the
              XYZ formula — making your impact clearer, more specific, and easier
              for recruiters to understand.
            </p>
          </div>

          <div className="rc-f4-card">
            <div className="rc-f4-inner">
              <div className="rc-f4-label">
                <span>Bullet rewriter</span>
                <span className="rc-f4-ai-tag">AI rewrite</span>
              </div>

              <div className="rc-f4-before">
                <span>Before</span>
                Worked on a website using React and improved its performance.
              </div>

              <div className="rc-f4-after">
                <span>Suggested</span>
                Improved website performance by 35% by building reusable React
                components and optimizing API requests.
              </div>

              <button className="rc-f4-action" type="button">
                Use this bullet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 05: COVER LETTERS & MULTIPLE RESUME VERSIONS */}
      <section className="rc-feature-05">
        <style dangerouslySetInnerHTML={{ __html: `
          .rc-feature-05 {
            width: 100%;
            max-width: 1212px;
            margin: 0 auto;
            padding: 48px 51px 60px;
            box-sizing: border-box;
            font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: #090b10;
            background: #fff;
          }

          .rc-feature-05 *,
          .rc-feature-05 *::before,
          .rc-feature-05 *::after {
            box-sizing: border-box;
          }

          .rc-f5-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 57px;
            align-items: center;
            margin-bottom: 64px;
          }

          .rc-f5-row:last-child {
            margin-bottom: 0;
          }

          .rc-f5-copy h2 {
            margin: 0 0 15px;
            max-width: 490px;
            font-size: 30px;
            line-height: 1.35;
            font-weight: 800;
            letter-spacing: -0.035em;
            color: #090b10;
          }

          .rc-f5-copy p {
            margin: 0;
            max-width: 485px;
            color: #263d59;
            font-size: 14px;
            line-height: 1.9;
            font-weight: 500;
          }

          /* Shared product card */
          .rc-f5-card {
            width: 100%;
            padding: 24px;
            border: 1px solid #e1e5ea;
            border-radius: 15px;
            background: #fff;
            box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
          }

          /* Cover letter */
          .rc-f5-letter {
            padding: 20px;
            border: 1px solid #e1e5ea;
            border-radius: 10px;
            background: #fbfcfd;
          }

          .rc-f5-letter-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }

          .rc-f5-letter-title {
            font-size: 13px;
            font-weight: 700;
            color: #090b10;
          }

          .rc-f5-letter-tag {
            padding: 5px 9px;
            border-radius: 6px;
            background: #eef2ff;
            color: #4338e8;
            font-size: 10px;
            font-weight: 700;
          }

          .rc-f5-field {
            margin-bottom: 10px;
            padding: 9px 11px;
            border: 1px solid #e3e7ec;
            border-radius: 7px;
            background: #fff;
            color: #263d59;
            font-size: 11px;
          }

          .rc-f5-field span {
            display: block;
            margin-bottom: 3px;
            color: #8a93a0;
            font-size: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .rc-f5-letter-body {
            min-height: 88px;
            padding: 11px;
            border: 1px solid #e3e7ec;
            border-radius: 7px;
            background: #fff;
          }

          .rc-f5-text-line {
            height: 4px;
            margin-bottom: 6px;
            border-radius: 3px;
            background: #dce1e7;
          }

          .rc-f5-text-line.long { width: 100%; }
          .rc-f5-text-line.medium { width: 82%; }
          .rc-f5-text-line.short { width: 57%; }

          .rc-f5-generate {
            width: 100%;
            height: 36px;
            margin-top: 12px;
            border: 1px solid #4b3df5;
            border-radius: 7px;
            background: #4b3df5;
            color: #fff;
            font: 700 11px "Manrope", sans-serif;
            cursor: pointer;
            transition: background 0.15s ease;
          }

          .rc-f5-generate:hover {
            background: #3c2fe0;
          }

          /* Resume versions */
          .rc-f5-versions {
            padding: 20px;
            border: 1px solid #e1e5ea;
            border-radius: 10px;
            background: #fbfcfd;
          }

          .rc-f5-version-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 13px;
          }

          .rc-f5-version-title {
            font-size: 13px;
            font-weight: 700;
            color: #090b10;
          }

          .rc-f5-count {
            color: #159d73;
            font-size: 10px;
            font-weight: 700;
          }

          .rc-f5-version {
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 11px 12px;
            margin-bottom: 8px;
            border: 1px solid #e3e7ec;
            border-radius: 8px;
            background: #fff;
          }

          .rc-f5-version:last-child {
            margin-bottom: 0;
          }

          .rc-f5-file-icon {
            width: 31px;
            height: 31px;
            flex: 0 0 31px;
            display: grid;
            place-items: center;
            border-radius: 7px;
            background: #eef2ff;
            color: #4b3df5;
            font-size: 12px;
            font-weight: 800;
          }

          .rc-f5-version-info {
            min-width: 0;
            flex: 1;
          }

          .rc-f5-version-info strong {
            display: block;
            margin-bottom: 3px;
            color: #1c2736;
            font-size: 11px;
            font-weight: 700;
          }

          .rc-f5-version-info span {
            color: #87909d;
            font-size: 9px;
          }

          .rc-f5-version-arrow {
            color: #9aa2ad;
            font-size: 14px;
          }

          .rc-f5-add-version {
            width: 100%;
            height: 34px;
            margin-top: 11px;
            border: 1px solid #d4d9e0;
            border-radius: 7px;
            background: #fff;
            color: #303b4a;
            font: 700 10px "Manrope", sans-serif;
            cursor: pointer;
            transition: background 0.15s ease;
          }

          .rc-f5-add-version:hover {
            background: #f8fafc;
          }

          @media (max-width: 800px) {
            .rc-feature-05 { padding: 40px 24px; }
            .rc-f5-row {
              grid-template-columns: 1fr;
              gap: 28px;
              margin-bottom: 54px;
            }
            .rc-f5-copy h2 {
              font-size: 27px;
              line-height: 1.3;
            }
          }

          @media (max-width: 480px) {
            .rc-feature-05 { padding: 32px 16px; }
            .rc-f5-card { padding: 16px; }
            .rc-f5-letter, .rc-f5-versions { padding: 15px; }
          }
        ` }} />

        {/* Feature 05A: Cover letters */}
        <div className="rc-f5-row">
          <div className="rc-f5-copy">
            <h2>Write a cover letter that actually matches the job</h2>
            <p>
              ResumeCraft uses your resume and the job you're applying for to create
              a tailored cover letter without making you start from a blank page.
            </p>
          </div>

          <div className="rc-f5-card">
            <div className="rc-f5-letter">
              <div className="rc-f5-letter-top">
                <span className="rc-f5-letter-title">Cover letter</span>
                <span className="rc-f5-letter-tag">Tailored</span>
              </div>

              <div className="rc-f5-field">
                <span>Company</span>
                Google
              </div>

              <div className="rc-f5-field">
                <span>Role</span>
                Software Engineer
              </div>

              <div className="rc-f5-letter-body">
                <div className="rc-f5-text-line long"></div>
                <div className="rc-f5-text-line medium"></div>
                <div className="rc-f5-text-line long"></div>
                <div className="rc-f5-text-line short"></div>
                <div className="rc-f5-text-line medium"></div>
                <div className="rc-f5-text-line long"></div>
              </div>

              <button className="rc-f5-generate" type="button">
                Generate tailored cover letter
              </button>
            </div>
          </div>
        </div>

        {/* Feature 05B: Multiple resume versions */}
        <div className="rc-f5-row">
          <div className="rc-f5-card">
            <div className="rc-f5-versions">
              <div className="rc-f5-version-head">
                <span className="rc-f5-version-title">My resume versions</span>
                <span className="rc-f5-count">3 versions</span>
              </div>

              <div className="rc-f5-version">
                <div className="rc-f5-file-icon">CV</div>
                <div className="rc-f5-version-info">
                  <strong>Frontend Engineer</strong>
                  <span>Updated 2 hours ago · 1 page</span>
                </div>
                <span className="rc-f5-version-arrow">→</span>
              </div>

              <div className="rc-f5-version">
                <div className="rc-f5-file-icon">CV</div>
                <div className="rc-f5-version-info">
                  <strong>Backend Developer</strong>
                  <span>Updated yesterday · 1 page</span>
                </div>
                <span className="rc-f5-version-arrow">→</span>
              </div>

              <div className="rc-f5-version">
                <div className="rc-f5-file-icon">CV</div>
                <div className="rc-f5-version-info">
                  <strong>Data Analyst</strong>
                  <span>Updated 3 days ago · 1 page</span>
                </div>
                <span className="rc-f5-version-arrow">→</span>
              </div>

              <button className="rc-f5-add-version" type="button">
                + Create new version
              </button>
            </div>
          </div>

          <div className="rc-f5-copy">
            <h2>Keep a tailored resume for every role</h2>
            <p>
              Create multiple versions of your resume for different jobs and
              customize each one without rebuilding your resume from scratch.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="py-20 px-6 sm:px-12 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/80">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-tr from-[#090B10] via-[#0F172A] to-[#1E1B4B] p-8 sm:p-14 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              100% Free · No Credit Card Required
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to land your dream placement or tech job?
            </h2>

            <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
              Create an ATS-proof Typst resume with verified DigiLocker credentials and AI XYZ-formula bullets in less than 5 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
              <Link
                href="/dashboard/resumes/res-1"
                className="w-full sm:w-auto bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Launch Free Editor Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/placement"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-indigo-300" />
                <span>Placement Cell Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-gray-100 px-6 sm:px-12 text-center text-xs text-gray-500 space-y-2">
        <p>© 2026 ResumeCraft. Built with Next.js 15, RenderCV (Typst), and Google Gemini.</p>
        <p>RenderCV is an open-source project by Sina Atalay licensed under MIT.</p>
      </footer>
    </div>
  );
}
