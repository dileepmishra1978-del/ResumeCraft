'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { MegaMenu } from './mega-menu';
import { ResumeFormatsDropdown } from './resume-formats-dropdown';
import { MEGA_MENU_CONFIG } from './mega-menu-data';

export function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isFormatsOpen, setIsFormatsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProductsExpanded, setIsMobileProductsExpanded] = useState(true);
  const [isMobileFormatsExpanded, setIsMobileFormatsExpanded] = useState(false);

  const productsRef = useRef<HTMLDivElement>(null);
  const formatsRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdowns on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
      if (formatsRef.current && !formatsRef.current.contains(event.target as Node)) {
        setIsFormatsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProductsOpen(false);
        setIsFormatsOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="h-[58px] sm:h-16 border-b border-[#E1E5EA] bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        {/* LEFT: LOGO & PRIMARY NAV */}
        <div className="flex items-center gap-8 h-full">
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-bold text-[#090B10] tracking-tight text-lg sm:text-xl">
              Resume<span className="text-[#4B3DF5]">Craft</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-6 h-full text-sm font-medium text-[#263D59]">
            {/* Products Mega-Menu Trigger */}
            <div ref={productsRef} className="relative h-full flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsProductsOpen(!isProductsOpen);
                  setIsFormatsOpen(false);
                }}
                onMouseEnter={() => {
                  setIsProductsOpen(true);
                  setIsFormatsOpen(false);
                }}
                aria-expanded={isProductsOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors ${
                  isProductsOpen
                    ? 'text-[#4B3DF5] bg-[#F0F3FF] font-semibold'
                    : 'text-[#263D59] hover:text-[#090B10] hover:bg-gray-50'
                }`}
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isProductsOpen ? 'rotate-180 text-[#4B3DF5]' : 'text-[#263D59]'
                  }`}
                />
              </button>

              {/* Mega-Menu Dropdown */}
              <div onMouseLeave={() => setIsProductsOpen(false)}>
                <MegaMenu isOpen={isProductsOpen} onClose={() => setIsProductsOpen(false)} />
              </div>
            </div>

            {/* Resume Formats Dropdown Trigger */}
            <div ref={formatsRef} className="relative h-full flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsFormatsOpen(!isFormatsOpen);
                  setIsProductsOpen(false);
                }}
                onMouseEnter={() => {
                  setIsFormatsOpen(true);
                  setIsProductsOpen(false);
                }}
                aria-expanded={isFormatsOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors ${
                  isFormatsOpen
                    ? 'text-[#4F46E5] bg-[#F0F3FF] font-semibold'
                    : 'text-[#263D59] hover:text-[#090B10] hover:bg-gray-50'
                }`}
              >
                <span>Resume formats</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isFormatsOpen ? 'rotate-180 text-[#4F46E5]' : 'text-[#263D59]'
                  }`}
                />
              </button>

              {/* Formats Dropdown */}
              <div onMouseLeave={() => setIsFormatsOpen(false)}>
                <ResumeFormatsDropdown isOpen={isFormatsOpen} onClose={() => setIsFormatsOpen(false)} />
              </div>
            </div>

            <Link
              href="/templates"
              className="px-2 py-1 hover:text-[#090B10] transition-colors"
            >
              Templates
            </Link>

            <a
              href="/#pricing"
              className="px-2 py-1 hover:text-[#090B10] transition-colors"
            >
              Pricing
            </a>

            <a
              href="#features"
              className="px-2 py-1 hover:text-[#090B10] transition-colors"
            >
              Resources
            </a>
          </nav>
        </div>

        {/* RIGHT: ACTIONS (Login & Get Started) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-[#263D59] hover:text-[#090B10] px-3 py-2 transition-colors"
          >
            Login
          </Link>

          <Link
            href="/login"
            className="bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE (< 768px) */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/login"
            className="bg-[#4B3DF5] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs"
          >
            Get Started
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[#263D59] hover:text-[#090B10] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[58px] bottom-0 bg-white border-t border-[#E1E5EA] overflow-y-auto p-4 space-y-4 z-50">
          {/* Products Accordion Section */}
          <div className="border border-[#E1E5EA] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setIsMobileProductsExpanded(!isMobileProductsExpanded)}
              className="w-full flex items-center justify-between p-3.5 bg-[#FAFBFC] font-semibold text-sm text-[#090B10]"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4B3DF5]" />
                <span>Products & Tools</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#263D59] transition-transform ${
                  isMobileProductsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMobileProductsExpanded && (
              <div className="p-3 space-y-4 border-t border-[#E1E5EA] bg-white">
                {/* Resume Tools */}
                <div>
                  <span className="text-[11px] font-bold text-[#263D59]/70 uppercase tracking-wider block mb-2 px-1">
                    {MEGA_MENU_CONFIG.resumeTools.category}
                  </span>
                  <div className="space-y-1">
                    {MEGA_MENU_CONFIG.resumeTools.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F0F3FF] transition-colors"
                        >
                          <div className="w-6 h-6 rounded bg-[#F5F7FA] text-[#4B3DF5] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-[13.5px] font-semibold text-[#090B10]">
                              {item.name}
                            </div>
                            <p className="text-[11.5px] text-[#263D59] leading-tight mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Application Tools */}
                <div className="pt-3 border-t border-[#E1E5EA]">
                  <span className="text-[11px] font-bold text-[#263D59]/70 uppercase tracking-wider block mb-2 px-1">
                    {MEGA_MENU_CONFIG.applicationTools.category}
                  </span>
                  <div className="space-y-1">
                    {MEGA_MENU_CONFIG.applicationTools.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F0F3FF] transition-colors"
                        >
                          <div className="w-6 h-6 rounded bg-[#F5F7FA] text-[#4B3DF5] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-[13.5px] font-semibold text-[#090B10]">
                              {item.name}
                            </div>
                            <p className="text-[11.5px] text-[#263D59] leading-tight mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Made for Indian Candidates */}
                <div className="pt-3 border-t border-[#E1E5EA]">
                  <span className="text-[11px] font-bold text-[#159D73] uppercase tracking-wider block mb-2 px-1">
                    {MEGA_MENU_CONFIG.indianTools.category}
                  </span>
                  <div className="space-y-1">
                    {MEGA_MENU_CONFIG.indianTools.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-[#FAFBFC] border border-[#E1E5EA] transition-colors"
                        >
                          <div className="w-6 h-6 rounded bg-[#F0F3FF] text-[#4B3DF5] flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-[13.5px] font-semibold text-[#090B10] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] bg-[#F0F3FF] text-[#4B3DF5] px-1 rounded font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11.5px] text-[#263D59] leading-tight mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resume Formats Accordion Section */}
          <div className="border border-[#E1E5EA] rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setIsMobileFormatsExpanded(!isMobileFormatsExpanded)}
              className="w-full flex items-center justify-between p-3.5 bg-[#FAFBFC] font-semibold text-sm text-[#090B10]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                <span>Resume Formats</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#263D59] transition-transform ${
                  isMobileFormatsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMobileFormatsExpanded && (
              <div className="p-3 border-t border-[#E1E5EA] bg-white space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/templates?category=simple"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 border border-[#E1E5EA] rounded-lg hover:bg-[#F0F3FF]/40 text-center flex flex-col items-center group"
                  >
                    <img src="/template-previews/sb2nov.png" alt="Simple" className="w-full h-16 object-cover object-top rounded mb-1.5 border border-[#E1E5EA]" />
                    <span className="text-xs font-bold text-[#090B10] group-hover:text-[#4F46E5]">Simple</span>
                  </Link>
                  <Link
                    href="/templates?category=modern"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 border border-[#E1E5EA] rounded-lg hover:bg-[#F0F3FF]/40 text-center flex flex-col items-center group"
                  >
                    <img src="/template-previews/moderncv.png" alt="Modern" className="w-full h-16 object-cover object-top rounded mb-1.5 border border-[#E1E5EA]" />
                    <span className="text-xs font-bold text-[#090B10] group-hover:text-[#4F46E5]">Modern</span>
                  </Link>
                  <Link
                    href="/templates?category=compact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 border border-[#E1E5EA] rounded-lg hover:bg-[#F0F3FF]/40 text-center flex flex-col items-center group"
                  >
                    <img src="/template-previews/engineeringresumes.png" alt="Compact" className="w-full h-16 object-cover object-top rounded mb-1.5 border border-[#E1E5EA]" />
                    <span className="text-xs font-bold text-[#090B10] group-hover:text-[#4F46E5]">Compact</span>
                  </Link>
                  <Link
                    href="/templates?category=creative"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 border border-[#E1E5EA] rounded-lg hover:bg-[#F0F3FF]/40 text-center flex flex-col items-center group"
                  >
                    <img src="/template-previews/ink.png" alt="Creative" className="w-full h-16 object-cover object-top rounded mb-1.5 border border-[#E1E5EA]" />
                    <span className="text-xs font-bold text-[#090B10] group-hover:text-[#4F46E5]">Creative</span>
                  </Link>
                </div>
                <Link
                  href="/templates"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] pt-1"
                >
                  View all templates →
                </Link>
              </div>
            )}
          </div>

          {/* Other Nav Links */}
          <div className="space-y-1 pt-1">
            <Link
              href="/templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#090B10] hover:bg-gray-100"
            >
              Templates
            </Link>
            <a
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#090B10] hover:bg-gray-100"
            >
              Pricing
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#090B10] hover:bg-gray-100"
            >
              Resources & Placement Guide
            </a>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#263D59] hover:bg-gray-100"
            >
              Login
            </Link>
          </div>

          {/* Full CTA */}
          <div className="pt-2">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-[#4B3DF5] hover:bg-[#3B2DE6] text-white font-bold text-sm py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
