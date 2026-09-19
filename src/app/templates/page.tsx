'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { GlobalStyleBar } from '@/components/templates/global-style-bar';
import { TemplateCardPreview } from '@/components/templates/template-card-preview';
import { 
  STYLE_CATEGORIES, 
  TEMPLATE_ITEMS, 
  CatalogTemplateItem, 
  StyleOverrides, 
  TemplateStyleCategory 
} from '@/lib/catalog';
import { DEFAULT_RESUME } from '@/lib/utils';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { 
  IconAlignLeft, 
  IconFeather, 
  IconStack2, 
  IconSparkles 
} from '@tabler/icons-react';

const CATEGORY_ICONS: Record<TemplateStyleCategory, React.ComponentType<{ size?: number; stroke?: number; className?: string }>> = {
  simple: IconAlignLeft,
  modern: IconFeather,
  compact: IconStack2,
  creative: IconSparkles,
};

function TemplatesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Selected category filter (or null for all)
  const [selectedCategory, setSelectedCategory] = useState<TemplateStyleCategory | null>(null);

  // Global style bar state
  const [globalStyles, setGlobalStyles] = useState<StyleOverrides>({
    accentColor: '#090B10',
    fontFamily: 'sans',
    showPhoto: false,
    hasDividers: true,
    tightIndent: false,
  });

  // Track downloading states per template id
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Sync category from URL search params on mount / change
  useEffect(() => {
    const cat = searchParams.get('category') as TemplateStyleCategory | null;
    if (cat && STYLE_CATEGORIES[cat]) {
      setSelectedCategory(cat);
      // Smooth scroll to target section
      const elem = document.getElementById(`category-${cat}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams]);

  // Handle clicking category card
  const handleCategoryClick = (key: TemplateStyleCategory) => {
    if (selectedCategory === key) {
      // Toggle off to show all
      setSelectedCategory(null);
      router.push('/templates', { scroll: false });
    } else {
      setSelectedCategory(key);
      router.push(`/templates?category=${key}`, { scroll: false });
      const elem = document.getElementById(`category-${key}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Download handler triggering RenderCV export
  const handleDownload = async (item: CatalogTemplateItem) => {
    setDownloadingId(item.id);
    try {
      const sampleResume = {
        ...DEFAULT_RESUME,
        template: item.baseTheme,
      };

      const res = await fetch('/api/resumes/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: sampleResume,
          theme: item.baseTheme,
        }),
      });

      if (!res.ok) {
        throw new Error(`Export failed: ${res.statusText}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ResumeCraft_${item.name.replace(/\s+/g, '_')}_Template.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.warn('Backend compiler unavailable, redirecting to editor:', err);
      window.location.href = `/dashboard?template=${item.baseTheme}&preset=${item.id}`;
    } finally {
      setDownloadingId(null);
    }
  };

  // Flagship latest arrivals (top cross-category items)
  const latestArrivals = useMemo(() => {
    return TEMPLATE_ITEMS.filter((t) => t.isFlagship);
  }, []);

  // Filter templates by category
  const simpleTemplates = useMemo(() => TEMPLATE_ITEMS.filter((t) => t.category === 'simple'), []);
  const modernTemplates = useMemo(() => TEMPLATE_ITEMS.filter((t) => t.category === 'modern'), []);
  const compactTemplates = useMemo(() => TEMPLATE_ITEMS.filter((t) => t.category === 'compact'), []);
  const creativeTemplates = useMemo(() => TEMPLATE_ITEMS.filter((t) => t.category === 'creative'), []);

  return (
    <div className="min-h-screen bg-[#FDFDFE] text-[#090B10] flex flex-col font-sans">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="border-b border-[#E1E5EA] bg-white pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Left: Eyebrow + Large Bold H1 */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 bg-[#F0F3FF] border border-[#4B3DF5]/20 text-[#4B3DF5] px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resume templates</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#090B10] leading-[1.15]">
                Discover the best ATS resume templates
              </h1>
            </div>

            {/* Right: Explanatory value prop paragraph */}
            <div className="lg:col-span-5 space-y-4 lg:pl-4">
              <p className="text-sm sm:text-[15px] text-[#263D59] leading-relaxed font-medium">
                Recruiter-tested templates engineered with mathematical Typst typesetting. 
                Built with 100% single-column ATS compliance, real-time live customization, 
                instant PDF downloads, and integrated AI keyword tailoring.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#64748B]">
                <div className="flex items-center gap-1.5 text-[#159D73]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% ATS Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#4B3DF5]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>RenderCV Typst Precision</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CATEGORY CARDS (Four large clickable cards in a row) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-12">
            {(Object.keys(STYLE_CATEGORIES) as TemplateStyleCategory[]).map((key) => {
              const cat = STYLE_CATEGORIES[key];
              const Icon = CATEGORY_ICONS[key];
              const isSelected = selectedCategory === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryClick(key)}
                  className={`flex flex-col items-start p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#4B3DF5] bg-[#F0F3FF] shadow-sm ring-2 ring-[#4B3DF5]/30'
                      : 'border-[#E1E5EA] bg-white hover:border-[#4B3DF5]/40 hover:bg-gray-50/80 shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? 'bg-[#4B3DF5] text-white'
                        : 'bg-[#F5F7FA] text-[#4F46E5] group-hover:bg-white'
                    }`}
                  >
                    <Icon size={18} stroke={2} />
                  </div>

                  <span className="font-bold text-sm sm:text-base text-[#090B10] tracking-tight">
                    {cat.name}
                  </span>

                  <span className="text-xs text-[#64748B] font-medium mt-0.5">
                    {cat.count} resumes
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. GLOBAL STYLE BAR (Sticky directly under category cards) */}
      <GlobalStyleBar
        styles={globalStyles}
        onChange={setGlobalStyles}
        onReset={() =>
          setGlobalStyles({
            accentColor: '#090B10',
            fontFamily: 'sans',
            showPhoto: false,
            hasDividers: true,
            tightIndent: false,
          })
        }
      />

      {/* 4 & 5. PER-CATEGORY SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20 flex-1 w-full">
        {/* CROSS-CATEGORY: LATEST ARRIVALS */}
        {!selectedCategory && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E1E5EA] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#090B10] tracking-tight flex items-center gap-2">
                  <span>Latest arrivals</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F0F3FF] text-[#4B3DF5] px-2 py-0.5 rounded-full">
                    Flagship
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#263D59] font-medium mt-0.5">
                  Our most popular, battle-tested templates used by candidates getting hired at top global tech and corporate firms.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {latestArrivals.map((tpl) => (
                <TemplateCardPreview
                  key={`flagship-${tpl.id}`}
                  template={tpl}
                  globalStyles={globalStyles}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === tpl.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 1: SIMPLE */}
        {(!selectedCategory || selectedCategory === 'simple') && (
          <section id="category-simple" className="space-y-6 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E1E5EA] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#090B10] tracking-tight">
                  {STYLE_CATEGORIES.simple.audienceHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-[#263D59] font-medium mt-0.5">
                  {STYLE_CATEGORIES.simple.audienceDescription}
                </p>
              </div>
              <span className="text-xs font-bold text-[#64748B]">
                {simpleTemplates.length} templates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {simpleTemplates.map((tpl) => (
                <TemplateCardPreview
                  key={tpl.id}
                  template={tpl}
                  globalStyles={globalStyles}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === tpl.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: MODERN */}
        {(!selectedCategory || selectedCategory === 'modern') && (
          <section id="category-modern" className="space-y-6 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E1E5EA] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#090B10] tracking-tight">
                  {STYLE_CATEGORIES.modern.audienceHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-[#263D59] font-medium mt-0.5">
                  {STYLE_CATEGORIES.modern.audienceDescription}
                </p>
              </div>
              <span className="text-xs font-bold text-[#64748B]">
                {modernTemplates.length} templates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {modernTemplates.map((tpl) => (
                <TemplateCardPreview
                  key={tpl.id}
                  template={tpl}
                  globalStyles={globalStyles}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === tpl.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: COMPACT */}
        {(!selectedCategory || selectedCategory === 'compact') && (
          <section id="category-compact" className="space-y-6 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E1E5EA] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#090B10] tracking-tight">
                  {STYLE_CATEGORIES.compact.audienceHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-[#263D59] font-medium mt-0.5">
                  {STYLE_CATEGORIES.compact.audienceDescription}
                </p>
              </div>
              <span className="text-xs font-bold text-[#64748B]">
                {compactTemplates.length} templates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {compactTemplates.map((tpl) => (
                <TemplateCardPreview
                  key={tpl.id}
                  template={tpl}
                  globalStyles={globalStyles}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === tpl.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: CREATIVE */}
        {(!selectedCategory || selectedCategory === 'creative') && (
          <section id="category-creative" className="space-y-6 scroll-mt-28">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E1E5EA] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#090B10] tracking-tight">
                  {STYLE_CATEGORIES.creative.audienceHeadline}
                </h2>
                <p className="text-xs sm:text-sm text-[#263D59] font-medium mt-0.5">
                  {STYLE_CATEGORIES.creative.audienceDescription}
                </p>
              </div>
              <span className="text-xs font-bold text-[#64748B]">
                {creativeTemplates.length} templates
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {creativeTemplates.map((tpl) => (
                <TemplateCardPreview
                  key={tpl.id}
                  template={tpl}
                  globalStyles={globalStyles}
                  onDownload={handleDownload}
                  isDownloading={downloadingId === tpl.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* BOTTOM CALL TO ACTION */}
        <section className="bg-gradient-to-br from-[#090B10] to-[#1E293B] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to create your high-impact resume?
            </h3>
            <p className="text-sm text-gray-300">
              Select any template to launch the guided editor. Add your college credentials, 
              projects, and target role with instant AI bullet point rewrites.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md transition-transform transform hover:scale-[1.03] active:scale-[0.98] shrink-0 flex items-center gap-2"
          >
            <span>Open Resume Editor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* SIMPLE FOOTER */}
      <footer className="border-t border-[#E1E5EA] bg-white py-8 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-[#090B10]">
            ResumeCraft &copy; {new Date().getFullYear()} — Built for Indian Tech & Campus Placements
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#4B3DF5] transition-colors">Home</Link>
            <Link href="/templates" className="hover:text-[#4B3DF5] transition-colors">Templates</Link>
            <Link href="/dashboard" className="hover:text-[#4B3DF5] transition-colors">Editor</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-sm font-semibold text-[#263D59]">Loading templates...</div>}>
      <TemplatesPageContent />
    </Suspense>
  );
}
