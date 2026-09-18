'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GuidedEditor } from '@/components/editor/guided-editor';
import { DEFAULT_RESUME } from '@/lib/utils';
import { ResumeData } from '@/types/resume';

export default function ResumeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [resume, setResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    // Try reading from localStorage first
    const saved = localStorage.getItem(`resumecraft_resumes`);
    if (saved) {
      try {
        const list: ResumeData[] = JSON.parse(saved);
        const found = list.find((r) => r.id === id);
        if (found) {
          setResume(found);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default fallback
    setResume({ ...DEFAULT_RESUME, id });
  }, [id]);

  const handleSave = async (updated: ResumeData) => {
    // Persist to localStorage
    const saved = localStorage.getItem(`resumecraft_resumes`);
    let list: ResumeData[] = saved ? JSON.parse(saved) : [];
    const index = list.findIndex((r) => r.id === updated.id);
    if (index >= 0) {
      list[index] = { ...updated, updated_at: new Date().toISOString() };
    } else {
      list.push({ ...updated, updated_at: new Date().toISOString() });
    }
    localStorage.setItem(`resumecraft_resumes`, JSON.stringify(list));
  };

  if (!resume) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Loading resume...
      </div>
    );
  }

  return <GuidedEditor initialResume={resume} onSave={handleSave} />;
}
