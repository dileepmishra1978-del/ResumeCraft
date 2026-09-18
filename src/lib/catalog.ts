import { 
  TEMPLATE_CATALOG as BASE_TEMPLATE_CATALOG, 
  TemplateCatalogEntry as BaseTemplateCatalogEntry, 
  TemplateStyleCategory, 
  RenderCVTheme 
} from '@/types/resume';

export { 
  type TemplateStyleCategory, 
  type RenderCVTheme 
};

export type ATSFontChoice = 'sans' | 'serif' | 'mono';

export interface StyleOverrides {
  accentColor?: string;
  fontFamily?: ATSFontChoice;
  showPhoto?: boolean;
  hasDividers?: boolean;
  tightIndent?: boolean;
}

export interface CatalogTemplateItem {
  id: string;
  name: string;
  category: TemplateStyleCategory;
  baseTheme: RenderCVTheme;
  description: string;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  isFlagship?: boolean;
  defaultOverrides?: StyleOverrides;
}

export const TEMPLATE_ITEMS: CatalogTemplateItem[] = [
  // SIMPLE (5 entries)
  {
    id: 'standard',
    name: 'Standard',
    category: 'simple',
    baseTheme: 'classic',
    description: 'Timeless corporate standard for multinational firms, PSU applications, and traditional finance.',
    rating: 4.9,
    reviewsCount: 1840,
    thumbnail: '/template-previews/classic.png',
    isFlagship: true,
  },
  {
    id: 'simple',
    name: 'Simple',
    category: 'simple',
    baseTheme: 'sb2nov',
    description: 'Minimalist single-page format favored by engineering grads and campus placement drives.',
    rating: 5.0,
    reviewsCount: 2310,
    thumbnail: '/template-previews/sb2nov.png',
    isFlagship: true,
  },
  {
    id: 'basic',
    name: 'Basic',
    category: 'simple',
    baseTheme: 'harvard',
    description: 'Ivy League academic structure with clean serif balance for research and education-first roles.',
    rating: 4.8,
    reviewsCount: 960,
    thumbnail: '/template-previews/harvard.png',
    defaultOverrides: { fontFamily: 'serif' },
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'simple',
    baseTheme: 'engineeringclassic',
    description: 'Compact linear hierarchy designed to maximize vertical space and bullet clarity.',
    rating: 4.9,
    reviewsCount: 1120,
    thumbnail: '/template-previews/engineeringclassic.png',
    defaultOverrides: { tightIndent: true },
  },
  {
    id: 'harvard',
    name: 'Harvard',
    category: 'simple',
    baseTheme: 'harvard',
    description: 'Prestigious academic layout highlighting coursework, publications, and university credentials.',
    rating: 4.9,
    reviewsCount: 1450,
    thumbnail: '/template-previews/harvard.png',
    defaultOverrides: { fontFamily: 'serif' },
  },

  // MODERN (5 entries)
  {
    id: 'modern',
    name: 'Modern',
    category: 'modern',
    baseTheme: 'moderncv',
    description: 'Clean contemporary dual-accent styling suited for IT consultants and technology leads.',
    rating: 4.9,
    reviewsCount: 1670,
    thumbnail: '/template-previews/moderncv.png',
    isFlagship: true,
  },
  {
    id: 'smart',
    name: 'Smart',
    category: 'modern',
    baseTheme: 'ember',
    description: 'Polished tech layout emphasizing cross-functional deliverables and product strategy.',
    rating: 4.8,
    reviewsCount: 880,
    thumbnail: '/template-previews/ember.png',
    defaultOverrides: { fontFamily: 'mono' },
  },
  {
    id: 'neat',
    name: 'Neat',
    category: 'modern',
    baseTheme: 'opal',
    description: 'Structured geometric hierarchy tailored for business intelligence and data analysts.',
    rating: 4.9,
    reviewsCount: 750,
    thumbnail: '/template-previews/opal.png',
    defaultOverrides: { showPhoto: false },
  },
  {
    id: 'trendy',
    name: 'Trendy',
    category: 'modern',
    baseTheme: 'ember',
    description: 'Fresh contemporary format with optional photo slot for modern creative tech roles.',
    rating: 4.7,
    reviewsCount: 620,
    thumbnail: '/template-previews/ember.png',
    defaultOverrides: { accentColor: '#1E40AF', showPhoto: true },
  },
  {
    id: 'jakes-resume',
    name: "Jake's Resume",
    category: 'modern',
    baseTheme: 'engineeringresumes',
    description: 'The legendary developer format engineered for ATS scanning and tech stack visibility.',
    rating: 5.0,
    reviewsCount: 3420,
    thumbnail: '/template-previews/engineeringresumes.png',
    isFlagship: true,
    defaultOverrides: { tightIndent: true },
  },

  // COMPACT (3 entries)
  {
    id: 'compact',
    name: 'Compact',
    category: 'compact',
    baseTheme: 'engineeringresumes',
    description: 'High-density single-page format built to pack extensive project portfolios.',
    rating: 4.9,
    reviewsCount: 1980,
    thumbnail: '/template-previews/engineeringresumes.png',
    isFlagship: true,
    defaultOverrides: { tightIndent: true },
  },
  {
    id: 'maximum',
    name: 'Maximum',
    category: 'compact',
    baseTheme: 'engineeringclassic',
    description: 'Ultra-dense technical layout engineered for senior systems engineers and architects.',
    rating: 4.8,
    reviewsCount: 840,
    thumbnail: '/template-previews/engineeringclassic.png',
    defaultOverrides: { tightIndent: true, hasDividers: true },
  },
  {
    id: 'structured',
    name: 'Structured',
    category: 'compact',
    baseTheme: 'sb2nov',
    description: 'High-yield layout with distinct section dividers for multi-project freshers.',
    rating: 4.9,
    reviewsCount: 1320,
    thumbnail: '/template-previews/sb2nov.png',
    defaultOverrides: { hasDividers: true },
  },

  // CREATIVE (5 entries)
  {
    id: 'bold',
    name: 'Bold',
    category: 'creative',
    baseTheme: 'ink',
    description: 'Editorial header format commanding attention for engineering managers and directors.',
    rating: 4.9,
    reviewsCount: 1410,
    thumbnail: '/template-previews/ink.png',
    isFlagship: true,
    defaultOverrides: { accentColor: '#4B3DF5' },
  },
  {
    id: 'accent',
    name: 'Accent',
    category: 'creative',
    baseTheme: 'ember',
    description: 'Distinct color framing highlighting major career milestones and leadership impacts.',
    rating: 4.8,
    reviewsCount: 710,
    thumbnail: '/template-previews/ember.png',
    defaultOverrides: { showPhoto: true, accentColor: '#159D73' },
  },
  {
    id: 'bright',
    name: 'Bright',
    category: 'creative',
    baseTheme: 'opal',
    description: 'Vibrant visual accents paired with rigorous ATS readability for modern digital specialists.',
    rating: 4.9,
    reviewsCount: 650,
    thumbnail: '/template-previews/opal.png',
    defaultOverrides: { accentColor: '#0F766E' },
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    category: 'creative',
    baseTheme: 'ink',
    description: 'Executive layout with strong typographic emphasis and modern profile accents.',
    rating: 4.8,
    reviewsCount: 590,
    thumbnail: '/template-previews/ink.png',
    defaultOverrides: { showPhoto: true, accentColor: '#9F1239' },
  },
  {
    id: 'highlight',
    name: 'Highlight',
    category: 'creative',
    baseTheme: 'moderncv',
    description: 'Sharp dual-tone contrast designed to guide recruiter eyes to critical achievements.',
    rating: 4.9,
    reviewsCount: 930,
    thumbnail: '/template-previews/moderncv.png',
    defaultOverrides: { accentColor: '#4B3DF5' },
  },
];

export interface StyleCategoryDefinition {
  key: TemplateStyleCategory;
  name: string;
  themeIds: RenderCVTheme[];
  representativeThemeId: RenderCVTheme;
  thumbnail: string;
  tablerIconName: string;
  count: number;
  audienceHeadline: string;
  audienceDescription: string;
}

export const STYLE_CATEGORIES: Record<TemplateStyleCategory, StyleCategoryDefinition> = {
  simple: {
    key: 'simple',
    name: 'Simple',
    themeIds: ['classic', 'sb2nov', 'harvard'],
    representativeThemeId: 'sb2nov',
    thumbnail: '/template-previews/sb2nov.png',
    tablerIconName: 'ti-align-left',
    count: 5,
    audienceHeadline: 'Simple & Minimalist Formats',
    audienceDescription: 'Clean, distraction-free layouts built for campus placements, Ivy League applications, and corporate MNCs.',
  },
  modern: {
    key: 'modern',
    name: 'Modern',
    themeIds: ['moderncv', 'ember', 'opal', 'engineeringresumes'],
    representativeThemeId: 'moderncv',
    thumbnail: '/template-previews/moderncv.png',
    tablerIconName: 'ti-feather',
    count: 5,
    audienceHeadline: 'Modern Professional Formats',
    audienceDescription: 'Contemporary dual-accent structures engineered for software developers, consultants, and growth leaders.',
  },
  compact: {
    key: 'compact',
    name: 'Compact',
    themeIds: ['engineeringresumes', 'engineeringclassic', 'sb2nov'],
    representativeThemeId: 'engineeringresumes',
    thumbnail: '/template-previews/engineeringresumes.png',
    tablerIconName: 'ti-stack-2',
    count: 3,
    audienceHeadline: 'High-Density Compact Formats',
    audienceDescription: 'Maximum space efficiency for dense engineering projects, code repositories, and systems architectures.',
  },
  creative: {
    key: 'creative',
    name: 'Creative',
    themeIds: ['ink', 'ember', 'opal', 'moderncv'],
    representativeThemeId: 'ink',
    thumbnail: '/template-previews/ink.png',
    tablerIconName: 'ti-sparkles',
    count: 5,
    audienceHeadline: 'Creative & Executive Formats',
    audienceDescription: 'Tasteful editorial accents and leadership hierarchy that maintain 100% ATS readability.',
  },
};

export const TEMPLATE_CATALOG = BASE_TEMPLATE_CATALOG;
export type { BaseTemplateCatalogEntry as TemplateCatalogEntry };
