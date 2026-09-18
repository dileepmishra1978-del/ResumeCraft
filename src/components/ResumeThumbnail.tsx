'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { LivePreview, ACTUAL_PREVIEW_WIDTH } from '@/components/editor/live-preview';

export interface ResumeThumbnailProps {
  resumeData?: ResumeData;
  resume?: ResumeData;
  width?: number;
  height?: number;
  className?: string;
}

export const ResumeThumbnail = React.memo(function ResumeThumbnail({
  resumeData,
  resume,
  width = 180,
  height = 240,
  className = '',
}: ResumeThumbnailProps) {
  const data = resumeData || resume;
  if (!data) return null;

  const actualPreviewWidth = ACTUAL_PREVIEW_WIDTH || 794;
  const scale = width / actualPreviewWidth;

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '8px',
        border: '1px solid var(--border, #E5E7EB)',
        backgroundColor: '#FFFFFF',
      }}
      className={`shrink-0 select-none ${className}`}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${actualPreviewWidth}px`,
          pointerEvents: 'none',
        }}
      >
        <LivePreview resume={data} canvasOnly={true} />
      </div>
    </div>
  );
});
