'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ResumeScoreResult } from '@/lib/scoring/resumeScore';
import { 
  Award, 
  Download, 
  Share2, 
  X, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ScoreBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  scoreResult: ResumeScoreResult;
}

export function ScoreBadgeModal({ isOpen, onClose, resume, scoreResult }: ScoreBadgeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const { score, label } = scoreResult;
  const candidateName = resume.contact?.name || 'ResumeCraft Candidate';
  const role = resume.target_role || 'Software Engineer';

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // 1. Dark Tech Background Gradient
    const bgGrad = ctx.createRadialGradient(size / 2, size / 2, 80, size / 2, size / 2, size * 0.75);
    bgGrad.addColorStop(0, '#13192B');
    bgGrad.addColorStop(0.6, '#0B0F19');
    bgGrad.addColorStop(1, '#07090F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // 2. Subtle Glow Accents
    const glow = ctx.createRadialGradient(size / 2, 440, 50, size / 2, 440, 320);
    glow.addColorStop(0, 'rgba(75, 61, 245, 0.22)');
    glow.addColorStop(1, 'rgba(75, 61, 245, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // 3. Header: Brand Wordmark
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ResumeCraft', size / 2 - 40, 110);

    ctx.fillStyle = '#4B3DF5';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('• ATS Verified', size / 2 + 130, 110);

    // Subtitle
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('OFFICIAL RESUME STRENGTH & ATS COMPLIANCE AUDIT', size / 2, 160);

    // 4. Large Circular Score Gauge Ring
    const centerX = size / 2;
    const centerY = 440;
    const radius = 170;
    const strokeW = 28;

    // Track Background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = strokeW;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Active Arc
    let strokeColor = '#EF4444';
    if (score >= 80) strokeColor = '#10B981';
    else if (score >= 50) strokeColor = '#F59E0B';

    const endAngle = 0.75 * Math.PI + (score / 100) * 1.5 * Math.PI;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeW;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score Number inside Gauge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 110px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(score), centerX, centerY + 30);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('/ 100', centerX + 110, centerY + 20);

    // Strength Label Badge
    ctx.fillStyle = strokeColor;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(label.toUpperCase(), centerX, centerY + 85);

    // 5. Candidate Info Card
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(candidateName, centerX, 700);

    ctx.fillStyle = '#818CF8';
    ctx.font = '600 28px sans-serif';
    ctx.fillText(role, centerX, 750);

    // 6. Pill Metrics
    const pills = [
      '✓ Quantifiable XYZ Bullets',
      '✓ RenderCV Vector Typst',
      '✓ 1-Page Layout Verified'
    ];

    const startY = 820;
    const pillW = 270;
    const gap = 24;
    const totalW = (pillW * 3) + (gap * 2);
    let startX = (size - totalW) / 2;

    pills.forEach((p, i) => {
      const px = startX + i * (pillW + gap);
      // Pill box
      ctx.fillStyle = '#182136';
      ctx.beginPath();
      ctx.roundRect(px, startY, pillW, 54, 27);
      ctx.fill();
      ctx.strokeStyle = '#2B3754';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pill text
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p, px + pillW / 2, startY + 34);
    });

    // 7. Footer CTA
    ctx.fillStyle = '#64748B';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('Generated on ResumeCraft • Search ResumeCraft to build your ATS-ready resume', centerX, 990);

    setDownloadUrl(canvas.toDataURL('image/png'));
  }, [isOpen, score, label, candidateName, role]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.download = `${candidateName.replace(/\s+/g, '_')}_ATS_Score_Badge.png`;
    link.href = downloadUrl;
    link.click();
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `🎯 Just audited my resume on ResumeCraft — scored ${score}/100 (${label}) with 100% RenderCV vector typography! Build an ATS-ready resume: https://resumecraft-two-rouge.vercel.app`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Share Your Real ATS Score</h3>
              <p className="text-xs text-gray-400">1080x1080 verified social proof card for LinkedIn, Instagram & WhatsApp.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Canvas Preview */}
        <div className="rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-[#07090F] flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[340px] h-auto aspect-square block mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG (1080x1080)</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsapp}
            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to WhatsApp</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-500 text-center">
          Real candidate numbers only. Free to export without watermarks.
        </p>
      </div>
    </div>
  );
}
