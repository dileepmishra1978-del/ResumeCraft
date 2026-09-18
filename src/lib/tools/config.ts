export type DemoType = 
  | 'score'
  | 'keyword'
  | 'bullet'
  | 'autoadjust'
  | 'coverletter'
  | 'versions'
  | 'builder';

export interface ToolStep {
  icon: string;
  title: string;
  description: string;
}

export interface ToolPageConfig {
  slug: string;
  category: 'resume-tools' | 'application-tools';
  badge: string;
  headline: string;
  subhead: string;
  demoType: DemoType;
  steps: [ToolStep, ToolStep, ToolStep];
  ctaLabel: string;
  ctaHref: string;
}

export const TOOL_CONFIGS: Record<string, ToolPageConfig> = {
  'resume-checker': {
    slug: 'resume-checker',
    category: 'resume-tools',
    badge: 'Instant 0–100 ATS Analysis',
    headline: 'Check your resume strength in seconds',
    subhead: 'Run your resume through our automated diagnostic engine to catch formatting pitfalls, missing metrics, and ATS compatibility hurdles before recruiters do.',
    demoType: 'score',
    steps: [
      {
        icon: 'upload',
        title: 'Upload or Paste',
        description: 'Upload your current PDF or edit directly in our real-time guided workspace.',
      },
      {
        icon: 'barchart',
        title: 'Analyze',
        description: 'Instant multi-point scan across contact data, action verbs, quantifiable metrics, and section depth.',
      },
      {
        icon: 'check',
        title: 'Fix in One Click',
        description: 'Follow step-by-step actionable recommendations to raise your score into the 90+ interview tier.',
      },
    ],
    ctaLabel: 'Check My Resume Strength Free',
    ctaHref: '/dashboard?panel=score',
  },

  'ai-resume-builder': {
    slug: 'ai-resume-builder',
    category: 'resume-tools',
    badge: 'RenderCV Typst Vector Engine',
    headline: 'Build a resume that gets past the bots',
    subhead: 'Create machine-readable, mathematically typeset single-column resumes tailored for Indian freshers and international tech roles.',
    demoType: 'builder',
    steps: [
      {
        icon: 'layout',
        title: 'Choose a Template',
        description: 'Select from 18 single-column ATS layouts engineered with standard system fonts.',
      },
      {
        icon: 'sparkles',
        title: 'Let AI Write It',
        description: 'Generate high-impact bullet points and summaries formatted with the ResumeCraft XYZ formula.',
      },
      {
        icon: 'download',
        title: 'Download Vector PDF',
        description: 'Export true vector Typst PDFs that parse with 100% precision on Workday, Greenhouse, and Naukri.',
      },
    ],
    ctaLabel: 'Build My ATS Resume Now',
    ctaHref: '/dashboard?panel=builder',
  },

  'resume-keyword-scanner': {
    slug: 'resume-keyword-scanner',
    category: 'resume-tools',
    badge: 'Targeted ATS Optimization',
    headline: 'Find the keywords costing you interviews',
    subhead: 'Paste any job description to uncover missing hard skills, libraries, and certifications that determine whether your application clears corporate applicant tracking filters.',
    demoType: 'keyword',
    steps: [
      {
        icon: 'file',
        title: 'Paste the Job Description',
        description: 'Drop in the job requirements from LinkedIn, Naukri, or any company careers page.',
      },
      {
        icon: 'target',
        title: 'Review Missing Keywords',
        description: 'Our AI compares your resume to the posting and identifies critical missing keywords.',
      },
      {
        icon: 'plus',
        title: 'Add Them in One Click',
        description: 'Click to automatically integrate missing skills into relevant project or work experience bullets.',
      },
    ],
    ctaLabel: 'Scan Job Description Keywords',
    ctaHref: '/dashboard?panel=keywords',
  },

  'bullet-point-writer': {
    slug: 'bullet-point-writer',
    category: 'resume-tools',
    badge: 'ResumeCraft XYZ Formula',
    headline: 'Turn task lists into achievements',
    subhead: 'Eliminate passive, vague job responsibilities. Upgrade them into accomplishment statements: "Accomplished [X] as measured by [Y], by doing [Z]".',
    demoType: 'bullet',
    steps: [
      {
        icon: 'edit',
        title: 'Paste Your Bullet',
        description: 'Enter any basic or rough bullet point describing your previous role or academic project.',
      },
      {
        icon: 'sparkles',
        title: 'Pick a Rewrite',
        description: 'Review tailored options enriched with strong active verbs and realistic metric frameworks.',
      },
      {
        icon: 'check',
        title: 'Done',
        description: 'Apply the improved statement directly to your resume in a single click.',
      },
    ],
    ctaLabel: 'Rewrite My Bullets With AI',
    ctaHref: '/dashboard?panel=bullets',
  },

  'auto-adjust': {
    slug: 'auto-adjust',
    category: 'resume-tools',
    badge: 'Strict 1-Page Guarantee',
    headline: 'Fit your resume to one page, instantly',
    subhead: 'Never let your resume spill awkwardly onto a second page. Our intelligent spacing engine balances margins, font size, and section gaps for a crisp 1-page fit.',
    demoType: 'autoadjust',
    steps: [
      {
        icon: 'sliders',
        title: 'Click Auto Adjust',
        description: 'Trigger the algorithmic spacing optimizer directly from your editor toolbar.',
      },
      {
        icon: 'maximize',
        title: 'We Test Spacing Tiers',
        description: 'The engine tests typographic line-height, margin boundaries, and entry gaps in real time.',
      },
      {
        icon: 'checkcheck',
        title: 'Land on the Tightest Readable Fit',
        description: 'Your document cleanly locks into exactly one page without sacrificing ATS readability.',
      },
    ],
    ctaLabel: 'Try Auto Adjust on Your Resume',
    ctaHref: '/dashboard?panel=autoadjust',
  },

  'cover-letter-generator': {
    slug: 'cover-letter-generator',
    category: 'application-tools',
    badge: 'AI Tailored Letters',
    headline: 'A tailored cover letter in under a minute',
    subhead: 'Stop writing generic cover letters from scratch. Create compelling, targeted applications that directly connect your resume achievements to the company’s mission.',
    demoType: 'coverletter',
    steps: [
      {
        icon: 'building',
        title: 'Add Company and Role',
        description: 'Specify the employer and position you are targeting with a single click.',
      },
      {
        icon: 'list',
        title: 'Pick Your Highlights',
        description: 'Select which specific project or experience entries you want the cover letter to emphasize.',
      },
      {
        icon: 'copy',
        title: 'Copy or Export',
        description: 'Generate a focused 150-word letter ready for clipboard copy or instant PDF export.',
      },
    ],
    ctaLabel: 'Generate My Tailored Cover Letter',
    ctaHref: '/dashboard?tab=cover-letter',
  },

  'resume-versions': {
    slug: 'resume-versions',
    category: 'application-tools',
    badge: 'Multi-Role Organization',
    headline: 'One resume per job, zero retyping',
    subhead: 'Customize and maintain separate resume variations for different job profiles — like Full Stack Engineer, Backend Specialist, or Data Analyst.',
    demoType: 'versions',
    steps: [
      {
        icon: 'copycheck',
        title: 'Clone a Version',
        description: 'Duplicate any existing resume with one click to keep your master history intact.',
      },
      {
        icon: 'crosshair',
        title: 'Tailor It to the Role',
        description: 'Reorder skills and spotlight relevant capstones specific to the target job description.',
      },
      {
        icon: 'foldersync',
        title: 'Track Every Application',
        description: 'Keep your application history organized and always know which version you sent where.',
      },
    ],
    ctaLabel: 'Manage My Resume Versions',
    ctaHref: '/dashboard?panel=versions',
  },
};
