'use client';

import React from 'react';
import Link from 'next/link';
import { Copy, Trash2, ArrowRight } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { TEMPLATE_NAMES } from '@/components/editor/live-preview';
import { ResumeThumbnail } from '@/components/ResumeThumbnail';

export interface ResumeCardProps {
  resume: ResumeData;
  onDuplicate?: (e: React.MouseEvent, resume: ResumeData) => void;
  onDelete?: (e: React.MouseEvent, id: string, title: string) => void;
  readOnly?: boolean;
  className?: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export function ResumeCard({
  resume,
  onDuplicate,
  onDelete,
  readOnly = false,
  className = '',
  thumbnailWidth,
  thumbnailHeight,
}: ResumeCardProps) {
  if (readOnly) {
    return (
      <div
        className={`bg-white rounded-xl p-3.5 border border-gray-200 shadow-xs flex flex-col justify-between ${className}`}
      >
        <div>
          <div className="flex justify-center mb-2.5">
            <ResumeThumbnail
              resumeData={resume}
              width={thumbnailWidth ?? 160}
              height={thumbnailHeight ?? 215}
              className="shadow-2xs"
            />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {resume.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {resume.target_role || 'General Resume'}
          </p>
        </div>
      </div>
    );
  }

  const themeInfo = TEMPLATE_NAMES[resume.template] || { name: 'Engineering Resumes', tag: 'ATS Standard' };

  return (
    <div
      className={`group bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative ${className}`}
    >
      <div>
        <div className="relative mb-3 flex justify-center">
          <Link href={`/dashboard/resumes/${resume.id}`} className="block">
            <ResumeThumbnail
              resumeData={resume}
              width={thumbnailWidth ?? 180}
              height={thumbnailHeight ?? 240}
              className="shadow-xs group-hover:shadow-md transition-shadow"
            />
          </Link>
          <div className="absolute top-0 right-0 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-gray-200 shadow-xs z-10">
            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => onDuplicate(e, resume)}
                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                title="Duplicate for another job application"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => onDelete(e, resume.id, resume.title)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Delete resume"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <Link href={`/dashboard/resumes/${resume.id}`} className="block">
          <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors truncate">
            {resume.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {resume.target_role || 'General Resume'}
          </p>
        </Link>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium">
            {themeInfo.name}
          </span>
          {resume.ats_score ? (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
              ATS Score: {resume.ats_score}%
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 text-[11px]">
              Not Tailored Yet
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>
          {resume.experience?.length || 0} Jobs • {resume.skills?.length || 0} Skill Groups
        </span>
        <Link
          href={`/dashboard/resumes/${resume.id}`}
          className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          Edit <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
