export type RenderCVTheme = 
  | 'classic'
  | 'engineeringresumes'
  | 'harvard'
  | 'sb2nov'
  | 'moderncv'
  | 'ember'
  | 'ink'
  | 'opal'
  | 'engineeringclassic';

export interface ResumeContact {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  notice_period?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  // Optional & private fields for Government Application Form Autofill (never shown on corporate resumes)
  dob?: string;
  category_reservation?: 'General' | 'OBC-NCL' | 'SC' | 'ST' | 'EWS' | 'PwD';
  father_name?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface EducationItem {
  id: string;
  institution: string;
  area: string;
  degree: string;
  start_date: string;
  end_date: string;
  location?: string;
  cgpa_or_percentage?: string;
  board_or_university?: string;
  highlights?: string[];
  // DigiLocker Verified credentials
  digilocker_verified?: boolean;
  digilocker_doc_type?: string;
  digilocker_doc_id?: string;
  digilocker_verified_date?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  location?: string;
  highlights: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  tools?: string[];
  link?: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer?: string;
  date?: string;
}

export interface ResumeDesign {
  font_size?: string;
  line_spacing?: string;
  margins?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  space_between_entries?: string;
  target_pages?: number;
}

export interface CoverLetterData {
  company_name: string;
  job_title: string;
  content: string;
  skills_highlight?: string;
  selected_experience_id?: string;
  selected_education_id?: string;
  updated_at?: string;
}

export interface ResumeData {
  id: string;
  user_id?: string;
  title: string;
  target_role?: string;
  summary?: string;
  template: RenderCVTheme;
  theme_color?: string;
  contact: ResumeContact;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
  certifications?: CertificationItem[];
  ats_score?: number;
  dismissed_keywords?: string[];
  design?: ResumeDesign;
  cover_letter?: CoverLetterData;
  fresher_mode?: boolean;
  declaration?: {
    enabled: boolean;
    text?: string;
    place?: string;
    date?: string;
    signature_name?: string;
    signature_image?: string;
    signature_mode?: 'draw' | 'type' | 'upload';
  };
  created_at?: string;
  updated_at?: string;
}

export type TemplateStyleCategory = 'simple' | 'modern' | 'compact' | 'creative';

export interface TemplateCatalogEntry {
  id: RenderCVTheme;
  name: string;
  tag: string;
  category: 'Campus & Tech Fresher' | 'Harvard Academic & Placement' | 'Engineering Projects & Stack' | 'Corporate & Banking Standard' | 'Modern IT Consultant' | 'Executive & Senior';
  styleCategory: TemplateStyleCategory;
  columns: 1 | 2;
  hasPhoto: boolean;
  accentColorUsed: boolean;
  fresher: boolean;
  claimedBestFor: string;
}

export const TEMPLATE_CATALOG: Record<RenderCVTheme, TemplateCatalogEntry> = {
  sb2nov: {
    id: 'sb2nov',
    name: 'FAANG Minimalist',
    tag: 'Campus & Tech Fresher (FAANG / MNC)',
    category: 'Campus & Tech Fresher',
    styleCategory: 'simple',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: false,
    fresher: true,
    claimedBestFor: 'Indian engineering students, coding bootcamp grads, and IT placement drives (TCS, Infosys, Wipro, FAANG, startups)',
  },
  harvard: {
    id: 'harvard',
    name: 'Harvard Academic',
    tag: 'Education-First Campus Placement',
    category: 'Harvard Academic & Placement',
    styleCategory: 'simple',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: false,
    fresher: true,
    claimedBestFor: 'College students, campus placement drives, research internships, and university applications',
  },
  engineeringresumes: {
    id: 'engineeringresumes',
    name: 'Engineering Resumes',
    tag: 'Engineering Projects & Stack',
    category: 'Engineering Projects & Stack',
    styleCategory: 'compact',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: false,
    fresher: true,
    claimedBestFor: 'Software developers and engineering freshers highlighting tech stacks, GitHub repos, and capstone projects',
  },
  classic: {
    id: 'classic',
    name: 'Classic Corporate',
    tag: 'Corporate & PSU Standard',
    category: 'Corporate & Banking Standard',
    styleCategory: 'simple',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: false,
    fresher: false,
    claimedBestFor: 'Banking, finance, consulting, corporate MNCs, and Indian Government / PSU applications',
  },
  moderncv: {
    id: 'moderncv',
    name: 'Modern CV',
    tag: 'Clean Dual Accent IT Standard',
    category: 'Modern IT Consultant',
    styleCategory: 'modern',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: true,
    fresher: false,
    claimedBestFor: 'Mid-to-senior IT consultants, offshore delivery leads, and technical project managers',
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    tag: 'Warm Contemporary Layout',
    category: 'Modern IT Consultant',
    styleCategory: 'modern',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: true,
    fresher: false,
    claimedBestFor: 'Product managers, marketing strategists, and digital consultants',
  },
  ink: {
    id: 'ink',
    name: 'Ink',
    tag: 'Editorial Bold Header',
    category: 'Executive & Senior',
    styleCategory: 'creative',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: false,
    fresher: false,
    claimedBestFor: 'Engineering managers, Vice Presidents, Directors, and senior enterprise leads',
  },
  opal: {
    id: 'opal',
    name: 'Opal',
    tag: 'Structured Geometric Layout',
    category: 'Modern IT Consultant',
    styleCategory: 'modern',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: true,
    fresher: false,
    claimedBestFor: 'Operations managers, data analysts, and business analysts',
  },
  engineeringclassic: {
    id: 'engineeringclassic',
    name: 'Engineering Classic',
    tag: 'Dense Technical Standard',
    category: 'Engineering Projects & Stack',
    styleCategory: 'compact',
    columns: 1,
    hasPhoto: false,
    accentColorUsed: false,
    fresher: false,
    claimedBestFor: 'Senior systems architects, hardware engineers, and researchers with dense technical histories',
  },
};

export interface UserUsage {
  user_id: string;
  is_pro: boolean;
  ai_rewrites_used: number;
  resumes_count: number;
}

export interface BatchStudent {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  department: string;
  status: 'Draft' | 'Complete';
  ats_score: number;
  digilocker_verified: boolean;
  last_updated: string;
}

export interface PlacementBatch {
  id: string;
  name: string;
  academic_year: string;
  department: string;
  target_companies?: string[];
  created_at: string;
  students: BatchStudent[];
}

export interface ReferralState {
  referral_code: string;
  referred_count: number;
  unlocked: boolean;
  required_count: number;
}

