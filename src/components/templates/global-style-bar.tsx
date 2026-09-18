'use client';

import React from 'react';
import { 
  Check, 
  ChevronDown, 
  Image as ImageIcon, 
  SplitSquareVertical, 
  Indent as IndentIcon,
  Palette,
  Type
} from 'lucide-react';
import { ATSFontChoice, StyleOverrides } from '@/lib/catalog';

interface GlobalStyleBarProps {
  styles: StyleOverrides;
  onChange: (updated: StyleOverrides) => void;
  onReset?: () => void;
}

const COLOR_SWATCHES = [
  { hex: '#090B10', label: 'Classic Slate' },
  { hex: '#4B3DF5', label: 'Brand Indigo' },
  { hex: '#1E40AF', label: 'Royal Blue' },
  { hex: '#159D73', label: 'Emerald Green' },
  { hex: '#9F1239', label: 'Deep Rose' },
  { hex: '#0F766E', label: 'Dark Teal' },
];

const ATS_FONTS: { value: ATSFontChoice; label: string }[] = [
  { value: 'sans', label: 'Inter (Modern Sans)' },
  { value: 'serif', label: 'Times New Roman (Academic)' },
  { value: 'mono', label: 'Source Sans Pro (Technical)' },
];

export function GlobalStyleBar({ styles, onChange, onReset }: GlobalStyleBarProps) {
  const currentColor = styles.accentColor || '#090B10';
  const currentFont = styles.fontFamily || 'sans';
  const showPhoto = styles.showPhoto ?? false;
  const hasDividers = styles.hasDividers ?? true;
  const tightIndent = styles.tightIndent ?? false;

  return (
    <div className="sticky top-[58px] sm:top-16 z-30 bg-white/95 backdrop-blur-md border-y border-[#E1E5EA] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* LEFT: COLOR SWATCHES + FONT DROPDOWN */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6">
          {/* Color swatches */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#4B3DF5]" />
              <span className="hidden xs:inline">Color</span>
            </span>
            <div className="flex items-center gap-1.5">
              {COLOR_SWATCHES.map((swatch) => {
                const isSelected = currentColor.toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => onChange({ ...styles, accentColor: swatch.hex })}
                    title={swatch.label}
                    className={`w-6 h-6 rounded-full transition-all flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-[#4B3DF5] ring-offset-2 scale-110'
                        : 'hover:scale-105 border border-black/10'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-4 w-[1px] bg-[#E1E5EA] hidden sm:block" />

          {/* Font dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#4B3DF5]" />
              <span className="hidden xs:inline">Font</span>
            </span>
            <div className="relative">
              <select
                value={currentFont}
                onChange={(e) => onChange({ ...styles, fontFamily: e.target.value as ATSFontChoice })}
                className="appearance-none bg-[#FAFBFC] hover:bg-white text-xs font-semibold text-[#090B10] border border-[#E1E5EA] hover:border-[#4B3DF5]/40 rounded-lg pl-3 pr-7 py-1.5 outline-none cursor-pointer transition-colors shadow-2xs"
              >
                {ATS_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE TOGGLES (Profile Pic, Dividers, Indent) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Profile Pic toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={showPhoto}
              onChange={(e) => onChange({ ...styles, showPhoto: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center ${
                showPhoto ? 'bg-[#4B3DF5]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  showPhoto ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-[#263D59] group-hover:text-[#090B10] transition-colors flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Profile Pic</span>
            </span>
          </label>

          {/* Dividers toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={hasDividers}
              onChange={(e) => onChange({ ...styles, hasDividers: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center ${
                hasDividers ? 'bg-[#4B3DF5]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  hasDividers ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-[#263D59] group-hover:text-[#090B10] transition-colors flex items-center gap-1">
              <SplitSquareVertical className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Dividers</span>
            </span>
          </label>

          {/* Indent toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={tightIndent}
              onChange={(e) => onChange({ ...styles, tightIndent: e.target.checked })}
              className="sr-only"
            />
            <div
              className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center ${
                tightIndent ? 'bg-[#4B3DF5]' : 'bg-[#D1D5DB]'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                  tightIndent ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-xs font-semibold text-[#263D59] group-hover:text-[#090B10] transition-colors flex items-center gap-1">
              <IndentIcon className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Indent</span>
            </span>
          </label>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-bold text-[#64748B] hover:text-[#4B3DF5] transition-colors underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
