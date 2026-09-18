'use client';

import React from 'react';
import Link from 'next/link';
import { MEGA_MENU_CONFIG } from './mega-menu-data';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      aria-label="ResumeCraft Products Menu"
      className="absolute top-full left-0 mt-2 w-[720px] bg-white border border-[#E1E5EA] rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {/* TWO MAIN COLUMNS: Resume Tools & Application Tools */}
      <div className="grid grid-cols-12 divide-x divide-[#E1E5EA] p-5 gap-x-5">
        {/* LEFT COLUMN: Resume Tools (7 cols) */}
        <div className="col-span-7 space-y-1.5 pr-2">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="text-[11px] font-bold text-[#263D59]/80 uppercase tracking-wider">
              {MEGA_MENU_CONFIG.resumeTools.category}
            </span>
          </div>

          <div className="space-y-0.5">
            {MEGA_MENU_CONFIG.resumeTools.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-start gap-3 p-2 rounded-lg hover:bg-[#F0F3FF] transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-[#F5F7FA] group-hover:bg-white text-[#263D59] group-hover:text-[#4B3DF5] flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-transparent group-hover:border-[#E1E5EA]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#090B10] group-hover:text-[#4B3DF5] leading-snug flex items-center gap-1.5 transition-colors">
                      <span>{item.name}</span>
                    </div>
                    <p className="text-[12px] text-[#263D59] leading-tight font-normal line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Application Tools & Typst Engine Note (5 cols) */}
        <div className="col-span-5 space-y-3 pl-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[11px] font-bold text-[#263D59]/80 uppercase tracking-wider">
                {MEGA_MENU_CONFIG.applicationTools.category}
              </span>
            </div>

            <div className="space-y-0.5">
              {MEGA_MENU_CONFIG.applicationTools.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-[#F0F3FF] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-md bg-[#F5F7FA] group-hover:bg-white text-[#263D59] group-hover:text-[#4B3DF5] flex items-center justify-center shrink-0 mt-0.5 transition-colors border border-transparent group-hover:border-[#E1E5EA]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-[#090B10] group-hover:text-[#4B3DF5] leading-snug transition-colors">
                        {item.name}
                      </div>
                      <p className="text-[12px] text-[#263D59] leading-tight font-normal line-clamp-2 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Clean minimal callout card */}
          <div className="p-3 bg-[#F5F7FA] border border-[#E1E5EA] rounded-lg mt-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#090B10]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#159D73]" />
              <span>100% ATS Typst Engine</span>
            </div>
            <p className="text-[11px] text-[#263D59] mt-1 leading-snug">
              Generates genuine vector PDF typography passing screening on Naukri, Workday, and TCS iON.
            </p>
            <Link
              href="/dashboard"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4B3DF5] hover:underline mt-2"
            >
              <span>Explore Templates</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: MADE FOR INDIAN CANDIDATES */}
      <div className="bg-[#FAFBFC] border-t border-[#E1E5EA] px-5 py-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#090B10] uppercase tracking-wider">
              {MEGA_MENU_CONFIG.indianTools.category}
            </span>
            <span className="text-[10px] font-bold bg-[#E8F8F2] text-[#159D73] px-1.5 py-0.2 rounded">
              India First
            </span>
          </div>
          <span className="text-[11px] text-[#263D59] hidden sm:inline">
            {MEGA_MENU_CONFIG.indianTools.tagline}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MEGA_MENU_CONFIG.indianTools.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group flex items-start gap-2.5 p-2 rounded-lg bg-white border border-[#E1E5EA] hover:border-[#4B3DF5]/30 hover:bg-[#F0F3FF] transition-all"
              >
                <div className="w-6 h-6 rounded bg-[#F0F3FF] group-hover:bg-white text-[#4B3DF5] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#090B10] group-hover:text-[#4B3DF5] leading-snug truncate transition-colors flex items-center gap-1">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-[#F0F3FF] text-[#4B3DF5] px-1 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#263D59] leading-tight font-normal line-clamp-2 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
