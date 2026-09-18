'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { 
  IconAlignLeft, 
  IconFeather, 
  IconStack2, 
  IconSparkles 
} from '@tabler/icons-react';

interface ResumeFormatsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORMAT_CATEGORIES = [
  {
    key: 'simple',
    name: 'Simple',
    thumbnail: '/template-previews/sb2nov.png',
    Icon: IconAlignLeft,
  },
  {
    key: 'modern',
    name: 'Modern',
    thumbnail: '/template-previews/moderncv.png',
    Icon: IconFeather,
  },
  {
    key: 'compact',
    name: 'Compact',
    thumbnail: '/template-previews/engineeringresumes.png',
    Icon: IconStack2,
  },
  {
    key: 'creative',
    name: 'Creative',
    thumbnail: '/template-previews/ink.png',
    Icon: IconSparkles,
  },
] as const;

export function ResumeFormatsDropdown({ isOpen, onClose }: ResumeFormatsDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      aria-label="Resume Formats Menu"
      className="absolute top-full left-0 mt-2 w-[370px] bg-white border border-[#E1E5EA] rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 p-4"
    >
      {/* HEADER ROW: Label + View all link */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E1E5EA]">
        <span className="text-[11px] font-bold text-[#263D59]/70 uppercase tracking-wider">
          Resume formats
        </span>
        <Link
          href="/templates"
          onClick={onClose}
          className="group inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
        >
          <span>View all</span>
          <ChevronRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 2x2 GRID */}
      <div className="grid grid-cols-2 gap-3 pt-3">
        {FORMAT_CATEGORIES.map((cat) => {
          const Icon = cat.Icon;
          return (
            <Link
              key={cat.key}
              href={`/templates?category=${cat.key}`}
              onClick={onClose}
              className="group flex flex-col p-2 rounded-xl border border-[#E1E5EA] hover:border-[#4F46E5]/40 hover:bg-[#F0F3FF]/40 transition-all shadow-2xs hover:shadow-xs"
            >
              {/* Mini-preview thumbnail */}
              <div className="w-full h-24 rounded-lg bg-[#F8FAFC] border border-[#E1E5EA] overflow-hidden relative mb-2">
                <img
                  src={cat.thumbnail}
                  alt={`${cat.name} resume format preview`}
                  className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              {/* Icon + Label row */}
              <div className="flex items-center gap-2 px-0.5">
                <Icon
                  size={16}
                  stroke={2}
                  className="text-[#4F46E5] shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[13px] font-semibold text-[#090B10] group-hover:text-[#4F46E5] transition-colors">
                  {cat.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
