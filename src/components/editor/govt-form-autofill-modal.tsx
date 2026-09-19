'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { 
  FileText, 
  Copy, 
  Check, 
  X, 
  Building2, 
  AlertCircle, 
  UserCheck, 
  GraduationCap, 
  Briefcase 
} from 'lucide-react';

interface GovtFormAutofillModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export function GovtFormAutofillModal({ isOpen, onClose, resume }: GovtFormAutofillModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const contact = resume.contact || ({} as any);
  const education = resume.education || [];
  const primaryEdu = education[0] || {};
  const secondaryEdu = education[1] || {};
  const tenthEdu = education[2] || {};

  const handleCopy = (key: string, val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleCopyAll = () => {
    const fullText = `=== GOVERNMENT APPLICATION FORM AUTOFILL DATA ===
Prepared via ResumeCraft (For SSC, IBPS, UPSC, and State PSC Online Portals)

--- 1. CANDIDATE PERSONAL DETAILS ---
Full Name: ${contact.name || ''}
Father's / Guardian's Name: ${contact.father_name || 'Not specified'}
Date of Birth (DOB): ${contact.dob || 'Not specified'}
Gender: ${contact.gender || 'Not specified'}
Social Category / Reservation: ${contact.category_reservation || 'General (Unreserved)'}
Mobile Phone: ${contact.phone || ''}
Email Address: ${contact.email || ''}
Permanent / Current Address: ${contact.location || ''}

--- 2. ACADEMIC CREDENTIALS ---
Graduation / Highest Degree:
• Degree & Stream: ${primaryEdu.degree || ''} (${primaryEdu.area || ''})
• University / Institute: ${primaryEdu.institution || ''}
• Passing Year: ${primaryEdu.end_date ? primaryEdu.end_date.slice(0, 4) : ''}
• Marks / CGPA: ${primaryEdu.cgpa_or_percentage || ''}
• Verification Status: ${primaryEdu.digilocker_verified ? 'DigiLocker Verified (' + primaryEdu.digilocker_doc_id + ')' : 'Self-declared'}

Higher Secondary (Class 12th / Diploma):
• Board / Council: ${secondaryEdu.institution || secondaryEdu.board_or_university || 'Not specified'}
• Stream: ${secondaryEdu.area || 'Science / Commerce / Arts'}
• Passing Year: ${secondaryEdu.end_date ? secondaryEdu.end_date.slice(0, 4) : ''}
• Marks / Percentage: ${secondaryEdu.cgpa_or_percentage || ''}

Matriculation (Class 10th / Secondary):
• Board: ${tenthEdu.institution || tenthEdu.board_or_university || 'CBSE / State Board'}
• Passing Year: ${tenthEdu.end_date ? tenthEdu.end_date.slice(0, 4) : ''}
• Marks / Percentage: ${tenthEdu.cgpa_or_percentage || ''}

--- 3. TECHNICAL SKILLS & OCCUPATIONAL EXPERIENCE ---
Key Technical Skills: ${resume.skills?.map(s => s.items?.join(', ')).filter(Boolean).join('; ') || ''}
Work / Internship Experience: ${resume.experience?.map(e => `${e.position} at ${e.company} (${e.start_date} to ${e.end_date})`).join('; ') || 'None (Fresher)'}

Notice Period / Availability: ${contact.notice_period || 'Immediate'}
=================================================`;

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const fields = [
    { key: 'name', label: 'Full Name (as on 10th cert)', val: contact.name || '' },
    { key: 'father', label: "Father's / Guardian's Name", val: contact.father_name || 'Not provided (optional)' },
    { key: 'dob', label: 'Date of Birth (DOB)', val: contact.dob || 'Not provided (optional)' },
    { key: 'gender', label: 'Gender', val: contact.gender || 'Not specified' },
    { key: 'category', label: 'Reservation / Category Status', val: contact.category_reservation || 'General (Unreserved)' },
    { key: 'phone', label: 'Mobile Phone (+91)', val: contact.phone || '' },
    { key: 'email', label: 'Email ID', val: contact.email || '' },
    { key: 'address', label: 'Address / Domicile City', val: contact.location || '' },
    { key: 'degree', label: 'Degree & University', val: `${primaryEdu.degree || ''} - ${primaryEdu.institution || ''}` },
    { key: 'degree_marks', label: 'Degree CGPA / Percentage', val: primaryEdu.cgpa_or_percentage || '' },
    { key: 'degree_year', label: 'Degree Passing Year', val: primaryEdu.end_date ? primaryEdu.end_date.slice(0, 4) : '' },
    { key: 'hsc_marks', label: 'Class 12th Marks / Stream', val: `${secondaryEdu.cgpa_or_percentage || ''} (${secondaryEdu.area || ''})` },
    { key: 'ssc_marks', label: 'Class 10th Marks / Board', val: `${tenthEdu.cgpa_or_percentage || ''} (${tenthEdu.institution || 'CBSE/State Board'})` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#E1E5EA] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-950 text-base">Government Application Form Autofill</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  SSC / IBPS / UPSC Ready
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Formatted rows of your resume data for swift manual copy-pasting into government recruitment portals.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Manual Entry Assistant:</strong> Government portals prohibit automated bot submissions. This view prepares your verified data so you can click <strong>Copy</strong> on any field and paste it directly into portal text boxes without retyping.
          </div>
        </div>

        {/* Copy All Button */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <span className="font-bold text-gray-900 text-xs">Copy Entire Sheet:</span>
            <p className="text-[11px] text-gray-500">Copy all candidate rows formatted in a clean text block.</p>
          </div>
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy All Data'}</span>
          </button>
        </div>

        {/* Grid of Copyable Fields */}
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider mb-1">
            Standard Application Fields
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fields.map((f) => {
              const isCopied = copiedKey === f.key;
              return (
                <div
                  key={f.key}
                  className="p-2.5 rounded-lg border border-gray-200 bg-white hover:border-gray-300 flex items-center justify-between gap-2 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">
                      {f.label}
                    </span>
                    <span className="block text-xs font-medium text-gray-900 truncate" title={f.val}>
                      {f.val || <em className="text-gray-400 font-normal">Not provided</em>}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(f.key, f.val)}
                    disabled={!f.val}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors shrink-0 disabled:opacity-30"
                    title="Copy to clipboard"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-400">
          <span>Confidentiality: Reservation category & DOB are never displayed on your public corporate PDF.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
