import { 
  FileText, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Sliders, 
  Mail, 
  Layers, 
  GraduationCap, 
  MapPin, 
  FileCheck 
} from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface MegaMenuConfig {
  resumeTools: {
    category: string;
    items: ProductItem[];
  };
  applicationTools: {
    category: string;
    items: ProductItem[];
  };
  indianTools: {
    category: string;
    tagline: string;
    items: ProductItem[];
  };
}

export const MEGA_MENU_CONFIG: MegaMenuConfig = {
  resumeTools: {
    category: 'RESUME TOOLS',
    items: [
      {
        id: 'builder',
        name: 'AI Resume Builder',
        description: 'Build your resume in minutes with Indian-market templates',
        href: '/tools/ai-resume-builder',
        icon: FileText,
      },
      {
        id: 'checker',
        name: 'Resume Checker',
        description: 'Check your resume strength with instant 0–100 analysis',
        href: '/tools/resume-checker',
        icon: CheckCircle2,
      },
      {
        id: 'scanner',
        name: 'Resume Keyword Scanner',
        description: 'Scan job descriptions to find critical missing keywords',
        href: '/tools/resume-keyword-scanner',
        icon: Search,
      },
      {
        id: 'bullet-writer',
        name: 'AI Bullet Point Writer',
        description: 'Rewrite weak bullets into ResumeCraft XYZ achievement statements',
        href: '/tools/bullet-point-writer',
        icon: Sparkles,
      },
      {
        id: 'auto-adjust',
        name: 'Auto Adjust',
        description: 'Automatically fit your resume cleanly onto one page',
        href: '/tools/auto-adjust',
        icon: Sliders,
      },
    ],
  },
  applicationTools: {
    category: 'APPLICATION TOOLS',
    items: [
      {
        id: 'cover-letter',
        name: 'Cover Letter Generator',
        description: 'Create tailored cover letters for your target company & role',
        href: '/tools/cover-letter-generator',
        icon: Mail,
      },
      {
        id: 'versions',
        name: 'Resume Versions',
        description: 'Manage tailored resume variations for different job roles',
        href: '/tools/resume-versions',
        icon: Layers,
      },
    ],
  },
  indianTools: {
    category: 'MADE FOR INDIAN CANDIDATES',
    tagline: 'Campus & MNC Standard',
    items: [
      {
        id: 'fresher-mode',
        name: 'Fresher Mode',
        description: 'Optimize your resume for campus placement drives & freshers',
        href: '/dashboard',
        icon: GraduationCap,
        badge: 'Campus',
      },
      {
        id: 'indian-fields',
        name: 'Indian Resume Fields',
        description: 'Add CGPA, 10th/12th scores, board, university & notice period',
        href: '/dashboard',
        icon: MapPin,
      },
      {
        id: 'declaration-signature',
        name: 'Declaration & Digital Signature',
        description: 'Add placement declarations and an authentic digital signature',
        href: '/dashboard',
        icon: FileCheck,
      },
    ],
  },
};
