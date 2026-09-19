'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlacementBatch, BatchStudent } from '@/types/resume';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Plus, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  ChevronRight
} from 'lucide-react';

const INITIAL_BATCHES: PlacementBatch[] = [
  {
    id: 'batch-cse-2027',
    name: 'CSE Batch 2027 (FAANG & IT Services)',
    academic_year: '2026-2027',
    department: 'Computer Science & Engineering',
    target_companies: ['TCS Digital', 'Infosys', 'Amazon', 'Google', 'Persistent'],
    created_at: '2026-08-15',
    students: [
      {
        id: 'std-1',
        name: 'Aarav Mehta',
        email: 'aarav.mehta@college.edu.in',
        roll_number: '21CS042',
        department: 'CSE',
        status: 'Complete',
        ats_score: 94,
        digilocker_verified: true,
        last_updated: '2026-09-18',
      },
      {
        id: 'std-2',
        name: 'Sneha Kulkarni',
        email: 'sneha.k@college.edu.in',
        roll_number: '21CS089',
        department: 'CSE',
        status: 'Complete',
        ats_score: 91,
        digilocker_verified: true,
        last_updated: '2026-09-17',
      },
      {
        id: 'std-3',
        name: 'Rohan Deshmukh',
        email: 'rohan.d@college.edu.in',
        roll_number: '21CS114',
        department: 'CSE',
        status: 'Draft',
        ats_score: 58,
        digilocker_verified: false,
        last_updated: '2026-09-12',
      },
      {
        id: 'std-4',
        name: 'Ananya Verma',
        email: 'ananya.v@college.edu.in',
        roll_number: '21CS015',
        department: 'CSE',
        status: 'Complete',
        ats_score: 88,
        digilocker_verified: true,
        last_updated: '2026-09-19',
      },
      {
        id: 'std-5',
        name: 'Vikram Nair',
        email: 'vikram.n@college.edu.in',
        roll_number: '21CS102',
        department: 'CSE',
        status: 'Draft',
        ats_score: 46,
        digilocker_verified: false,
        last_updated: '2026-09-08',
      },
      {
        id: 'std-6',
        name: 'Pooja Iyer',
        email: 'pooja.i@college.edu.in',
        roll_number: '21CS077',
        department: 'CSE',
        status: 'Complete',
        ats_score: 96,
        digilocker_verified: true,
        last_updated: '2026-09-19',
      },
    ],
  },
  {
    id: 'batch-it-2027',
    name: 'Information Technology 2027',
    academic_year: '2026-2027',
    department: 'Information Technology',
    target_companies: ['Cognizant', 'Capgemini', 'Wipro', 'Accenture'],
    created_at: '2026-08-20',
    students: [
      {
        id: 'std-it-1',
        name: 'Rahul Joshi',
        email: 'rahul.j@college.edu.in',
        roll_number: '21IT023',
        department: 'IT',
        status: 'Complete',
        ats_score: 89,
        digilocker_verified: true,
        last_updated: '2026-09-15',
      },
      {
        id: 'std-it-2',
        name: 'Divya Sharma',
        email: 'divya.s@college.edu.in',
        roll_number: '21IT045',
        department: 'IT',
        status: 'Draft',
        ats_score: 52,
        digilocker_verified: false,
        last_updated: '2026-09-10',
      },
    ],
  },
];

export default function PlacementDashboardPage() {
  const [batches, setBatches] = useState<PlacementBatch[]>(INITIAL_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch-cse-2027');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Complete' | 'Draft'>('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchDept, setNewBatchDept] = useState('Computer Engineering');

  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Calculations
  const students = currentBatch.students;
  const totalStudents = students.length;
  const completedCount = students.filter((s) => s.status === 'Complete').length;
  const completionPct = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
  const avgScore = totalStudents > 0 
    ? Math.round(students.reduce((acc, s) => acc + s.ats_score, 0) / totalStudents) 
    : 0;
  const verifiedCount = students.filter((s) => s.digilocker_verified).length;
  const verifiedPct = totalStudents > 0 ? Math.round((verifiedCount / totalStudents) * 100) : 0;

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const batchInviteLink = typeof window !== 'undefined'
    ? `${window.location.origin}/placement/join?batch=${currentBatch.id}`
    : `https://resumecraft.vercel.app/placement/join?batch=${currentBatch.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(batchInviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Email', 'Department', 'Status', 'ATS Score (out of 100)', 'DigiLocker Verified', 'Last Updated'];
    const rows = students.map((s) => [
      `"${s.roll_number}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.department}"`,
      `"${s.status}"`,
      s.ats_score,
      s.digilocker_verified ? 'Yes' : 'No',
      `"${s.last_updated}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentBatch.name.replace(/[^a-zA-Z0-9]/g, '_')}_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    const newBatch: PlacementBatch = {
      id: `batch-${Date.now()}`,
      name: newBatchName,
      academic_year: '2026-2027',
      department: newBatchDept,
      created_at: new Date().toISOString().split('T')[0],
      students: [
        {
          id: `std-${Date.now()}`,
          name: 'Prakash Kulkarni',
          email: 'prakash.k@college.edu.in',
          roll_number: '21DEP01',
          department: newBatchDept,
          status: 'Draft',
          ats_score: 62,
          digilocker_verified: false,
          last_updated: new Date().toISOString().split('T')[0],
        },
      ],
    };

    const updated = [...batches, newBatch];
    setBatches(updated);
    setSelectedBatchId(newBatch.id);
    setIsNewBatchModalOpen(false);
    setNewBatchName('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Institutional Top Navbar */}
      <nav className="h-16 bg-[#002D62] text-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FF9933] text-gray-950 flex items-center justify-center font-black">
              TPO
            </span>
            <span>Resume<span className="text-[#FF9933]">Craft</span></span>
          </Link>
          <span className="hidden md:inline-block text-xs bg-white/15 px-2.5 py-0.5 rounded-full text-gray-200">
            Institutional Placement Portal
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white transition-colors"
          >
            ← Candidate Dashboard
          </Link>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-[#FF9933] hover:bg-[#E68524] text-gray-950 font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Batch CSV</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Header & Batch Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
                Training & Placement Cell
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#002D62] border border-blue-200">
                Placement Season 2026-27
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 max-w-2xl">
              Track real-time candidate resume readiness, ATS scores, and DigiLocker education verification across academic cohorts.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Batch Selector */}
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 outline-none cursor-pointer focus:border-[#002D62]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.students.length} students)
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsNewBatchModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Batch</span>
            </button>
          </div>
        </div>

        {/* Shareable Batch Invite Link Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-[#002D62] text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#FF9933]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold block">Batch Student Invite Link:</span>
              <p className="text-[11px] text-gray-300 font-mono truncate max-w-xl">
                {batchInviteLink}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 bg-white text-[#002D62] hover:bg-gray-100 px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Batch Link'}</span>
          </button>
        </div>

        {/* 4 Key Institutional Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Total Enrolled</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-950">{totalStudents}</span>
              <span className="text-xs text-gray-400">candidates</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Drive Ready</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">{completionPct}%</span>
              <span className="text-xs text-gray-400">({completedCount}/{totalStudents})</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Batch Avg ATS Score</span>
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-600">{avgScore}/100</span>
              <span className="text-xs text-emerald-600 font-semibold">+14 vs standard</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">DigiLocker Verified</span>
              <ShieldCheck className="w-4 h-4 text-[#FF9933]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-950">{verifiedPct}%</span>
              <span className="text-xs text-gray-400">({verifiedCount} records)</span>
            </div>
          </div>
        </div>

        {/* Privacy Safeguard Notice */}
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-700">
          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Institutional Privacy Safeguard:</strong> Placement officers can inspect readiness status, ATS compliance scores, and verified marksheets. Private candidate resume content remains strictly personal unless shared.
          </span>
        </div>

        {/* Student Roster Table Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-3 p-4 sm:p-6">
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 text-base">Candidate Roster</h2>
              <span className="text-xs text-gray-400">({filteredStudents.length} of {totalStudents})</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#002D62] w-48 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Complete">Drive Ready Only</option>
                <option value="Draft">Draft Only</option>
              </select>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Readiness Status</th>
                  <th className="py-3 px-4">ATS Score</th>
                  <th className="py-3 px-4">DigiLocker</th>
                  <th className="py-3 px-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      No candidates matching search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-gray-900">{s.roll_number}</td>
                      <td className="py-3 px-4 font-semibold text-gray-950">
                        {s.name}
                        <span className="block text-[11px] font-normal text-gray-400">{s.email}</span>
                      </td>
                      <td className="py-3 px-4">{s.department}</td>
                      <td className="py-3 px-4">
                        {s.status === 'Complete' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Drive Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" /> In Progress
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded text-xs ${
                            s.ats_score >= 80
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.ats_score >= 50
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {s.ats_score}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {s.digilocker_verified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Unverified</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{s.last_updated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Batch Creation Modal */}
      {isNewBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-gray-950 text-base">Create New Placement Batch</h3>
            <form onSubmit={handleCreateBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Engineering 2027"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full h-9 px-3 border border-gray-200 rounded-lg outline-none focus:border-[#002D62]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical"
                  value={newBatchDept}
                  onChange={(e) => setNewBatchDept(e.target.value)}
                  className="w-full h-9 px-3 border border-gray-200 rounded-lg outline-none focus:border-[#002D62]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewBatchModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#002D62] hover:bg-[#002047] text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Create Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
