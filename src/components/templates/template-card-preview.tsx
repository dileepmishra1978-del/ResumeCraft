'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Sparkles, 
  Loader2, 
  User, 
  Star 
} from 'lucide-react';
import { CatalogTemplateItem, StyleOverrides } from '@/lib/catalog';

interface TemplateCardPreviewProps {
  template: CatalogTemplateItem;
  globalStyles: StyleOverrides;
  onDownload: (template: CatalogTemplateItem) => void;
  isDownloading?: boolean;
}

export function TemplateCardPreview({
  template,
  globalStyles,
  onDownload,
  isDownloading = false,
}: TemplateCardPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Compute merged styles between template defaults and global overrides
  const accentColor = globalStyles.accentColor || template.defaultOverrides?.accentColor || '#090B10';
  const fontFamily = globalStyles.fontFamily || template.defaultOverrides?.fontFamily || 'sans';
  const showPhoto = globalStyles.showPhoto ?? template.defaultOverrides?.showPhoto ?? false;
  const hasDividers = globalStyles.hasDividers ?? template.defaultOverrides?.hasDividers ?? true;
  const tightIndent = globalStyles.tightIndent ?? template.defaultOverrides?.tightIndent ?? false;

  const fontClass = 
    fontFamily === 'serif' 
      ? 'font-serif' 
      : fontFamily === 'mono' 
      ? 'font-mono' 
      : 'font-sans';

  // Customize URL directly preloading template into editor
  const customizeHref = `/dashboard?template=${template.baseTheme}&preset=${template.id}`;

  return (
    <div className="flex flex-col group">
      {/* PREVIEW CARD FRAME */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full aspect-[1/1.34] bg-white rounded-xl border border-[#E1E5EA] shadow-xs group-hover:shadow-md group-hover:ring-2 group-hover:ring-[#4B3DF5] group-hover:border-transparent transition-all duration-200 overflow-hidden select-none cursor-pointer"
      >
        {/* MINI RESUME PAPER CONTENT */}
        <div 
          className={`w-full h-full p-4 sm:p-5 flex flex-col justify-between text-[8px] sm:text-[9px] leading-tight text-[#263D59] ${fontClass} ${tightIndent ? 'space-y-1.5' : 'space-y-2'}`}
        >
          {/* HEADER SECTION */}
          <div className="flex items-start justify-between border-b pb-2" style={{ borderColor: hasDividers ? '#E1E5EA' : 'transparent' }}>
            <div className="flex-1 min-w-0 pr-2">
              <h3 
                className="text-xs sm:text-[13px] font-extrabold tracking-tight truncate uppercase"
                style={{ color: accentColor }}
              >
                Alex Rivera
              </h3>
              <div className="text-[8.5px] sm:text-[9.5px] font-semibold text-[#090B10] tracking-wide mt-0.5">
                Senior Software Engineer
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[7px] sm:text-[8px] text-[#64748B] mt-1">
                <span>Seattle, WA</span>
                <span>•</span>
                <span>alex.rivera@example.com</span>
                <span>•</span>
                <span>github.com/alexrivera</span>
              </div>
            </div>

            {/* Profile Pic Toggle Slot */}
            {showPhoto && (
              <div 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center text-white text-[9px] font-bold shadow-2xs border border-white"
                style={{ backgroundColor: accentColor }}
              >
                <User className="w-4 h-4 text-white/90" />
              </div>
            )}
          </div>

          {/* SUMMARY */}
          <div>
            <div 
              className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider mb-0.5"
              style={{ color: accentColor }}
            >
              Professional Summary
            </div>
            {hasDividers && <div className="h-[1px] w-full bg-[#E1E5EA] mb-1" />}
            <p className="text-[#334155] line-clamp-2 leading-relaxed">
              Full-stack engineer with 5+ years designing distributed cloud architectures, low-latency microservices, and modern web applications.
            </p>
          </div>

          {/* EXPERIENCE */}
          <div>
            <div 
              className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider mb-0.5"
              style={{ color: accentColor }}
            >
              Experience
            </div>
            {hasDividers && <div className="h-[1px] w-full bg-[#E1E5EA] mb-1" />}
            <div className="space-y-1">
              <div>
                <div className="flex justify-between items-baseline font-bold text-[#090B10]">
                  <span>Senior Software Engineer — TechScale</span>
                  <span className="text-[7px] text-[#64748B] font-normal">2022 – Present</span>
                </div>
                <p className="text-[#334155] line-clamp-2 mt-0.5">
                  • Architected distributed microservices handling 1.5M+ requests/day.<br />
                  • Reduced p99 API latency by 38% using Redis caching and Next.js.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-bold text-[#090B10]">
                  <span>Software Engineer — CloudCore</span>
                  <span className="text-[7px] text-[#64748B] font-normal">2020 – 2022</span>
                </div>
                <p className="text-[#334155] line-clamp-1 mt-0.5">
                  • Built client telemetry dashboards in React & TypeScript.
                </p>
              </div>
            </div>
          </div>

          {/* EDUCATION */}
          <div>
            <div 
              className="text-[7.5px] sm:text-[8.5px] font-bold uppercase tracking-wider mb-0.5"
              style={{ color: accentColor }}
            >
              Education
            </div>
            {hasDividers && <div className="h-[1px] w-full bg-[#E1E5EA] mb-1" />}
            <div className="flex justify-between items-baseline">
              <span className="font-semibold text-[#090B10]">B.S. in Computer Science — UW</span>
              <span className="text-[7px] text-[#64748B]">2016 – 2020</span>
            </div>
          </div>

          {/* SKILLS */}
          <div className="pt-0.5 border-t border-gray-100">
            <div className="flex items-center gap-1 text-[7.5px] text-[#475569]">
              <span className="font-bold text-[#090B10]">Skills:</span>
              <span className="truncate">TypeScript, React, Next.js, Node.js, Go, Python, AWS, Docker</span>
            </div>
          </div>
        </div>

        {/* HOVER OVERLAY BUTTONS */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5 p-4 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Customize Button (Primary) */}
          <Link
            href={customizeHref}
            className="w-40 bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize</span>
          </Link>

          {/* Download Button (Secondary) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(template);
            }}
            disabled={isDownloading}
            className="w-40 bg-white hover:bg-gray-100 text-[#090B10] text-xs font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-200 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#4B3DF5]" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#263D59]" />
            )}
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* SUB-CARD ROW: Display name + 5-star rating + Description */}
      <div className="pt-3 px-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#090B10] tracking-tight">
            {template.name}
          </h4>

          {/* 5-Star Rating */}
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center text-[#F59E0B]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-bold text-[#090B10] text-[11px]">
              {template.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-[#64748B]">
              ({template.reviewsCount})
            </span>
          </div>
        </div>

        {/* 1-2 sentence description */}
        <p className="text-xs text-[#263D59] leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>
    </div>
  );
}
