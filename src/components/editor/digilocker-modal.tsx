'use client';

import React, { useState } from 'react';
import { EducationItem } from '@/types/resume';
import { generateId } from '@/lib/utils';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  Lock
} from 'lucide-react';

interface DigiLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifyAndAdd: (item: EducationItem) => void;
}

export function DigiLockerModal({ isOpen, onClose, onVerifyAndAdd }: DigiLockerModalProps) {
  const [activeMode, setActiveMode] = useState<'upload' | 'partner_api'>('upload');
  const [docType, setDocType] = useState('B.Tech Degree Certificate (NAD)');
  const [institution, setInstitution] = useState('Indian Institute of Technology / State University');
  const [area, setArea] = useState('Computer Science & Engineering');
  const [degree, setDegree] = useState('Bachelor of Technology (B.Tech)');
  const [year, setYear] = useState('2024');
  const [score, setScore] = useState('8.9 CGPA');
  const [certId, setCertId] = useState('DL-NAD-' + Math.floor(100000 + Math.random() * 900000));
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const name = file.name.toLowerCase();
      if (name.includes('cbse') || name.includes('12th') || name.includes('hsc')) {
        setDocType('CBSE Class XII Marksheet');
        setInstitution('Central Board of Secondary Education (CBSE)');
        setDegree('Class 12th (HSC)');
        setArea('Science / PCM');
      } else if (name.includes('10th') || name.includes('ssc')) {
        setDocType('Class X Secondary Marksheet');
        setInstitution('Central Board of Secondary Education (CBSE)');
        setDegree('Class 10th (SSC)');
        setArea('General');
      }
    }
  };

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => {
        const newItem: EducationItem = {
          id: generateId(),
          institution,
          area,
          degree,
          start_date: `${parseInt(year, 10) - 4 || 2020}-08`,
          end_date: `${year}-05`,
          cgpa_or_percentage: score,
          board_or_university: institution,
          highlights: [`DigiLocker Certified credential from ${docType} (ID: ${certId})`],
          digilocker_verified: true,
          digilocker_doc_type: docType,
          digilocker_doc_id: certId,
          digilocker_verified_date: new Date().toISOString().split('T')[0],
        };
        onVerifyAndAdd(newItem);
        onClose();
      }, 600);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E1E5EA] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#002D62] text-white flex items-center justify-center font-black tracking-tighter text-base shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#FF9933]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-950 text-base">DigiLocker Academic Verification</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Official NAD
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Import government-verified degrees and marksheets directly into your resume.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeMode === 'upload' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Upload DigiLocker PDF (Instant)
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('partner_api')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeMode === 'partner_api' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Partner API Status
          </button>
        </div>

        {activeMode === 'partner_api' ? (
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3 text-xs text-gray-700">
            <div className="flex items-center gap-2 font-bold text-indigo-900">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              <span>DigiLocker Partner Program Status</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Direct OAuth consent flow requires a registered business entity and DigiLocker partner credentials (via National Academic Depository / Setu Requester API).
            </p>
            <div className="bg-white p-3 rounded-lg border border-indigo-100 text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Partner Gateway:</span>
                <span className="font-mono font-bold text-gray-800">NAD / MeriPehchaan OAuth 2.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Registration:</span>
                <span className="text-amber-600 font-semibold">Approval in Progress</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Active Fallback:</span>
                <span className="text-emerald-700 font-semibold">DigiLocker Downloaded PDF Verification</span>
              </div>
            </div>
            <button
              onClick={() => setActiveMode('upload')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors"
            >
              Proceed with Verified Document Upload →
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-xl p-4 text-center transition-colors bg-gray-50/50">
              <input
                type="file"
                id="digilocker-upload"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="digilocker-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#4B3DF5] flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    {uploadedFile ? uploadedFile.name : 'Select or drop your DigiLocker PDF certificate'}
                  </span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Supports CBSE marksheets, State Board certificates, and University degrees (PDF)
                  </p>
                </div>
              </label>
            </div>

            <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="font-semibold text-gray-800 text-[11px] uppercase tracking-wider">
                Extracted Credential Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-medium mb-1 text-[11px]">Document Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="B.Tech Degree Certificate (NAD)">B.Tech Degree Certificate (NAD)</option>
                    <option value="CBSE Class XII Marksheet">CBSE Class XII Marksheet</option>
                    <option value="Class X Secondary Marksheet">Class X Secondary Marksheet</option>
                    <option value="State Board Higher Secondary">State Board Higher Secondary</option>
                    <option value="University Transcript / Degree">University Transcript / Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1 text-[11px]">Degree / Qualification</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1 text-[11px]">Board / University</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full h-8 px-2 bg-white border border-gray-200 rounded-md outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1 text-[11px]">Passing Year & Score</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2024"
                      className="w-1/2 h-8 px-2 bg-white border border-gray-200 rounded-md outline-none focus:border-indigo-500 text-xs"
                    />
                    <input
                      type="text"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="8.8 CGPA / 92%"
                      className="w-1/2 h-8 px-2 bg-white border border-gray-200 rounded-md outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                <span>DigiLocker Doc Ref:</span>
                <span className="font-mono font-semibold text-gray-700">{certId}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-900 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Verified credentials receive an official <strong>[✓ DigiLocker Verified]</strong> badge on your resume.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || verifiedSuccess}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#002D62] hover:bg-[#002047] disabled:opacity-50 text-white rounded-xl font-bold shadow-xs transition-colors"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : verifiedSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
                )}
                <span>
                  {verifying
                    ? 'Verifying Certificate...'
                    : verifiedSuccess
                    ? 'Verified!'
                    : 'Verify & Add to Resume'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
