'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

// ============================================================================
// INDIA-FIRST DEMO CANDIDATE DATA
// ============================================================================
interface DemoResumeCardData {
  id: string;
  name: string;
  role: string;
  templateStyle: 'engineering' | 'sb2nov' | 'modern' | 'classic';
  degree: string;
  college: string;
  cgpa: string;
  experienceCompany: string;
  experienceRole: string;
  experiencePeriod: string;
  experienceBullet: string;
  projectTitle: string;
  projectTech: string;
  projectDesc: string;
  skills: string[];
}

const DEMO_RESUMES: DemoResumeCardData[] = [
  {
    id: 'res-1',
    name: 'Yash Sharma',
    role: 'Software Engineer',
    templateStyle: 'engineering',
    degree: 'B.Tech Computer Science',
    college: 'Mumbai University',
    cgpa: '8.8 CGPA',
    experienceCompany: 'Razorpay',
    experienceRole: 'Backend Engineering Intern',
    experiencePeriod: 'Jan 2024 – Present',
    experienceBullet: 'Engineered high-throughput webhook ingest handling 12M+ daily events.',
    projectTitle: 'Distributed Ledger',
    projectTech: 'Go, Kafka, PostgreSQL',
    projectDesc: 'Double-entry settlement engine with idempotent event queues.',
    skills: ['Go', 'TypeScript', 'Java', 'Next.js', 'PostgreSQL'],
  },
  {
    id: 'res-2',
    name: 'Priya Sharma',
    role: 'Product Designer',
    templateStyle: 'sb2nov',
    degree: 'B.Des / Design',
    college: 'National Institute of Design (NID)',
    cgpa: '8.2 CGPA',
    experienceCompany: 'Swiggy',
    experienceRole: 'UI/UX Design Intern',
    experiencePeriod: 'May 2023 – Dec 2023',
    experienceBullet: 'Redesigned cart and checkout micro-interactions, reducing drop-off by 14%.',
    projectTitle: 'Design System 2.0',
    projectTech: 'Figma, WCAG 2.1',
    projectDesc: 'Multilingual token library supporting 6 regional Indian languages.',
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
  },
  {
    id: 'res-3',
    name: 'Arjun Mehta',
    role: 'Data Analyst',
    templateStyle: 'modern',
    degree: 'B.Tech Information Technology',
    college: 'VIT',
    cgpa: '9.1 CGPA',
    experienceCompany: 'Zomato',
    experienceRole: 'Data & Analytics Intern',
    experiencePeriod: 'Aug 2023 – Present',
    experienceBullet: 'Automated fleet delivery heatmaps and driver assignment analytics.',
    projectTitle: 'Customer Churn Predictor',
    projectTech: 'Python, SQL, Tableau',
    projectDesc: 'RandomForest classification pipeline with 87% retention accuracy.',
    skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'PowerBI'],
  },
  {
    id: 'res-4',
    name: 'Riya Patel',
    role: 'Cybersecurity Analyst',
    templateStyle: 'classic',
    degree: 'B.Tech CS & Cybersecurity',
    college: 'Thakur Institute',
    cgpa: '8.7 CGPA',
    experienceCompany: 'Infosys',
    experienceRole: 'Security Operations Intern',
    experiencePeriod: 'Jul 2023 – Jan 2024',
    experienceBullet: 'Monitored SIEM security logs and resolved 200+ vulnerability alerts.',
    projectTitle: 'Vulnerability Scanner',
    projectTech: 'Wireshark, Linux',
    projectDesc: 'Audited internal endpoints and automated firewall rule validation.',
    skills: ['Wireshark', 'SIEM', 'Cryptography', 'Linux', 'OWASP'],
  },
];

interface DemoCoverLetterData {
  id: string;
  role: string;
  company: string;
  candidateName: string;
  location: string;
  date: string;
  introSnippet: string;
  bodySnippet: string;
  closeSnippet: string;
}

const DEMO_COVER_LETTERS: DemoCoverLetterData[] = [
  {
    id: 'cl-1',
    role: 'Software Engineer',
    company: 'Google',
    candidateName: 'Yash Sharma',
    location: 'Bengaluru, India',
    date: 'March 18, 2026',
    introSnippet: 'I am applying for the Software Engineer role at Google India. With my foundational systems coursework at Mumbai University...',
    bodySnippet: 'At Razorpay, I architected distributed pipelines processing 12M+ events with sub-50ms latency. I thrive on core infrastructure challenges...',
    closeSnippet: 'I welcome the opportunity to bring my technical rigor to Google’s engineering teams.',
  },
  {
    id: 'cl-2',
    role: 'Frontend Developer',
    company: 'Microsoft',
    candidateName: 'Priya Sharma',
    location: 'Hyderabad, India',
    date: 'March 15, 2026',
    introSnippet: 'I am excited to apply for the Frontend Developer position at Microsoft IDC. Having specialized in design engineering at NID...',
    bodySnippet: 'During my internship at Swiggy, I led the component migration to React, cutting load latency by 22% while ensuring full accessibility...',
    closeSnippet: 'I look forward to discussing how my experience can empower Microsoft 365 web experiences.',
  },
  {
    id: 'cl-3',
    role: 'Data Analyst',
    company: 'Deloitte',
    candidateName: 'Arjun Mehta',
    location: 'Mumbai, India',
    date: 'March 12, 2026',
    introSnippet: 'Please accept my application for the Data Analyst role at Deloitte USI. As a final-year IT student at VIT with a 9.1 CGPA...',
    bodySnippet: 'My work at Zomato centered on automated ETL pipelines in Python and SQL, turning operational metrics into executive Tableau views...',
    closeSnippet: 'I am eager to contribute quantitative analysis and structured reporting to Deloitte clients.',
  },
  {
    id: 'cl-4',
    role: 'Cybersecurity Intern',
    company: 'Accenture',
    candidateName: 'Riya Patel',
    location: 'Pune, India',
    date: 'March 10, 2026',
    introSnippet: 'I am writing to apply for the Cybersecurity Intern opportunity at Accenture Security Labs. At Thakur Institute...',
    bodySnippet: 'At Infosys, I analyzed SIEM event streams and implemented intrusion detection rules that decreased incident response times...',
    closeSnippet: 'Thank you for your consideration. I look forward to contributing to Accenture’s defense operations.',
  },
];

// ============================================================================
// MINI RESUME PAPER (Centered inside card, crisp white paper)
// ============================================================================
function MiniResumePaper({ data }: { data: DemoResumeCardData }) {
  const isSb2nov = data.templateStyle === 'sb2nov';
  const isClassic = data.templateStyle === 'classic';

  return (
    <div 
      className="w-[160px] sm:w-[170px] h-[190px] sm:h-[200px] bg-white rounded-xs border border-gray-200 shadow-sm p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden select-none pointer-events-none"
      style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      {/* Header */}
      <div className={`border-b pb-1 ${isSb2nov ? 'border-[#090B10]' : 'border-[#E1E5EA]'}`}>
        <div className={`text-[9px] sm:text-[9.5px] font-bold tracking-tight text-[#090B10] ${isClassic ? 'text-center uppercase' : ''}`}>
          {data.name}
        </div>
        <div className={`text-[6px] sm:text-[6.5px] font-medium text-[#4B3DF5] mt-0.5 ${isClassic ? 'text-center' : ''}`}>
          {data.role}
        </div>
        <div className={`flex items-center gap-1 text-[5px] sm:text-[5.5px] text-[#667085] mt-0.5 ${isClassic ? 'justify-center' : ''}`}>
          <span>{data.college}</span>
          <span>•</span>
          <span className="font-semibold text-[#159D73]">{data.cgpa}</span>
        </div>
      </div>

      {/* Experience */}
      <div className="mt-1 space-y-0.5">
        <div className="text-[5.5px] font-bold uppercase tracking-wider text-[#263D59] border-b border-[#F0F3FF] pb-0.5">
          Experience
        </div>
        <div className="flex justify-between items-baseline text-[5.5px]">
          <span className="font-bold text-[#090B10] truncate max-w-[95px]">{data.experienceCompany}</span>
          <span className="text-[#8C95A8] text-[4.8px]">{data.experiencePeriod}</span>
        </div>
        <div className="text-[5px] italic text-[#4B3DF5]">{data.experienceRole}</div>
        <p className="text-[4.8px] sm:text-[5px] text-[#475467] leading-[1.3] line-clamp-2">
          {data.experienceBullet}
        </p>
      </div>

      {/* Projects */}
      <div className="mt-0.5 space-y-0.5">
        <div className="text-[5.5px] font-bold uppercase tracking-wider text-[#263D59] border-b border-[#F0F3FF] pb-0.5">
          Projects
        </div>
        <div className="flex justify-between items-baseline text-[5.5px]">
          <span className="font-semibold text-[#090B10] truncate max-w-[95px]">{data.projectTitle}</span>
          <span className="text-[#8C95A8] text-[4.8px]">{data.projectTech}</span>
        </div>
        <p className="text-[4.8px] sm:text-[5px] text-[#475467] leading-[1.3] line-clamp-2">
          {data.projectDesc}
        </p>
      </div>

      {/* Skills */}
      <div className="mt-1 pt-1 border-t border-[#E1E5EA]">
        <div className="flex flex-wrap gap-0.5">
          {data.skills.slice(0, 4).map((skill, idx) => (
            <span 
              key={idx} 
              className="text-[4.5px] bg-[#F7F8FA] text-[#263D59] border border-[#E1E5EA] px-1 py-[0.5px] rounded-[2px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MINI COVER LETTER PAPER (Crisp white paper)
// ============================================================================
function MiniCoverLetterPaper({ data }: { data: DemoCoverLetterData }) {
  return (
    <div 
      className="w-[160px] sm:w-[170px] h-[190px] sm:h-[200px] bg-white rounded-xs border border-gray-200 shadow-sm p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden select-none pointer-events-none"
      style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      {/* Letterhead */}
      <div className="border-b border-[#E1E5EA] pb-1">
        <div className="text-[8px] sm:text-[8.5px] font-bold text-[#090B10]">{data.candidateName}</div>
        <div className="text-[5px] text-[#667085] mt-0.5">{data.location} • {data.date}</div>
      </div>

      {/* Recipient */}
      <div className="text-[5.5px] text-[#263D59] font-medium leading-tight">
        <div>Hiring Team</div>
        <div className="font-bold text-[#4B3DF5]">{data.company}</div>
      </div>

      {/* Body */}
      <div className="space-y-1 text-[4.8px] text-[#475467] leading-[1.35]">
        <p className="line-clamp-2 font-medium text-[#090B10]">{data.introSnippet}</p>
        <p className="line-clamp-3">{data.bodySnippet}</p>
        <p className="line-clamp-2">{data.closeSnippet}</p>
      </div>

      {/* Sign-off */}
      <div className="pt-0.5 border-t border-[#E1E5EA] text-[5px] text-[#090B10]">
        <div>Sincerely,</div>
        <div className="font-bold">{data.candidateName}</div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN LOGIN PAGE CONTENT (#0F172A THEME, NO AI CARD PATCH)
// ============================================================================
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters'>('resumes');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createBrowserClient();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'register') {
      setAuthMode('register');
    }
  }, [searchParams]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(redirectUrl);
      }
    });
  }, [supabase, router, redirectUrl]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim() || undefined,
          },
          emailRedirectTo: `${window.location.origin}${redirectUrl}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push(redirectUrl);
      } else if (data.user) {
        setSuccessMsg('Account created successfully! You can now sign in or check your inbox if email confirmation is enabled.');
        setAuthMode('signin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row font-sans bg-[#0F172A] text-[#F8FAFC] lg:overflow-hidden"
      style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      {/* ================================================================= */}
      {/* LEFT SIDE: AUTHENTICATION (~46% width) */}
      {/* ================================================================= */}
      <div className="w-full lg:w-[46%] h-auto lg:h-full bg-[#0B0F19] flex flex-col justify-center px-6 sm:px-12 xl:px-16 py-8 lg:py-10 border-b lg:border-b-0 lg:border-r border-[#1E293B] overflow-y-auto">
        <div className="max-w-[360px] w-full mx-auto my-auto">
          {/* Logo row */}
          <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
            <div className="w-[32px] h-[32px] rounded-lg bg-[#4B3DF5] text-white flex items-center justify-center font-extrabold text-sm shadow-xs select-none">
              RC
            </div>
            <span className="font-extrabold text-[18px] text-[#F8FAFC] tracking-tight">
              Resume<span className="text-[#4B3DF5]">Craft</span>
            </span>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="flex rounded-lg bg-[#0F172A] p-1 border border-[#1E293B] mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#4B3DF5] text-white shadow-xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#4B3DF5] text-white shadow-xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Headline & Subline */}
          <div className="mb-5 sm:mb-6">
            <h1 className="text-[28px] sm:text-[30px] font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
              {authMode === 'signin' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-[13px] sm:text-[14px] font-medium text-[#94A3B8] mt-1">
              {authMode === 'signin'
                ? 'Sign in to continue'
                : 'Start building ATS-ready resumes in minutes'}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-lg bg-[#1E293B] hover:bg-[#28354D] text-[#F8FAFC] border border-[#334155] text-[13px] font-bold transition-all duration-150 shadow-2xs disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{authMode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative my-4 sm:my-5 flex items-center justify-center">
            <div className="w-full border-t border-[#1E293B]" />
            <span className="absolute px-3 text-[12px] font-semibold text-[#94A3B8] bg-[#0B0F19] uppercase tracking-wider">
              OR
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs leading-relaxed">
              {successMsg}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3 sm:space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="block text-[12px] font-semibold text-[#94A3B8] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Yash Sharma"
                  className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#334155] text-[#F8FAFC] text-[13px] placeholder:text-[#64748B] focus:outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-[12px] font-semibold text-[#94A3B8] mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#334155] text-[#F8FAFC] text-[13px] placeholder:text-[#64748B] focus:outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-[#94A3B8]">
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions sent to your email.')}
                    className="text-[12px] font-medium text-[#818CF8] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                placeholder={authMode === 'register' ? 'At least 6 characters' : ''}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#334155] text-[#F8FAFC] text-[13px] placeholder:text-[#64748B] focus:outline-none focus:border-[#4B3DF5] focus:ring-1 focus:ring-[#4B3DF5] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1.5 py-2.5 px-4 rounded-lg bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white font-bold text-[13px] transition-colors cursor-pointer shadow-md shadow-[#4B3DF5]/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : authMode === 'signin' ? (
                'Sign in'
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Terms notice */}
          <p className="text-[11px] text-[#64748B] text-center mt-3 leading-tight">
            By continuing you agree to our Terms and Privacy Policy
          </p>

          {/* Switch prompt */}
          <div className="text-center text-[12px] text-[#94A3B8] mt-3 sm:mt-4">
            {authMode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[#818CF8] hover:underline font-semibold cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[#818CF8] hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* RIGHT SIDE: PRODUCT SHOWCASE (~54% width, #0F172A BACKGROUND) */}
      {/* ================================================================= */}
      <div className="w-full lg:w-[54%] h-auto lg:h-full bg-[#0F172A] flex flex-col justify-center items-center px-6 sm:px-10 xl:px-12 py-6 lg:py-8 relative lg:overflow-hidden">
        <div className="max-w-[620px] w-full relative mx-auto flex flex-col items-center my-auto">
          {/* Top Gallery Navigation Tabs */}
          <div className="w-full flex items-center justify-start gap-2 mb-3.5 sm:mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('resumes')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === 'resumes'
                  ? 'bg-[#4B3DF5] text-white shadow-xs'
                  : 'bg-transparent text-[#94A3B8] hover:text-white'
              }`}
            >
              Resumes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cover-letters')}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === 'cover-letters'
                  ? 'bg-[#4B3DF5] text-white shadow-xs'
                  : 'bg-transparent text-[#94A3B8] hover:text-white'
              }`}
            >
              Cover Letters
            </button>
          </div>

          {/* Product Gallery (2x2 Grid) - NO PATCH OVERLAY */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 relative">
            {activeTab === 'resumes' ? (
              // 4 RESUME CARDS (Dark container with crisp white paper)
              DEMO_RESUMES.map((item) => (
                <div
                  key={item.id}
                  className="w-full max-w-[285px] sm:h-[265px] bg-[#1E293B] border border-[#334155] rounded-[13px] p-3 sm:p-3.5 shadow-lg hover:border-[#4B3DF5]/60 hover:shadow-xl transition-all duration-200 flex flex-col justify-between items-center mx-auto group cursor-pointer"
                >
                  <div className="w-full flex justify-center items-center flex-1">
                    <MiniResumePaper data={item} />
                  </div>
                  <div className="w-full text-left mt-2 px-1">
                    <h3 className="text-[13px] font-bold text-[#F8FAFC] group-hover:text-[#818CF8] transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-medium text-[#94A3B8] truncate">
                      {item.role}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // 4 COVER LETTER CARDS
              DEMO_COVER_LETTERS.map((cl) => (
                <div
                  key={cl.id}
                  className="w-full max-w-[285px] sm:h-[265px] bg-[#1E293B] border border-[#334155] rounded-[13px] p-3 sm:p-3.5 shadow-lg hover:border-[#4B3DF5]/60 hover:shadow-xl transition-all duration-200 flex flex-col justify-between items-center mx-auto group cursor-pointer"
                >
                  <div className="w-full flex justify-center items-center flex-1">
                    <MiniCoverLetterPaper data={cl} />
                  </div>
                  <div className="w-full text-left mt-2 px-1">
                    <h3 className="text-[13px] font-bold text-[#F8FAFC] group-hover:text-[#818CF8] transition-colors truncate">
                      {cl.role}
                    </h3>
                    <p className="text-[11px] font-medium text-[#94A3B8] truncate">
                      {cl.company}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A]">
          <div className="w-6 h-6 border-2 border-[#4B3DF5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
