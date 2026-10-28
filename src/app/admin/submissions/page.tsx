'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Award,
  MessageSquare,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Submission, ClassItem, Assignment } from '@/types';
import { formatDate } from '@/lib/utils';
import FileBadge from '@/components/common/FileBadge';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Grading Modal State
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    setSubmissions(DataProvider.getSubmissions());
    setClasses(DataProvider.getClasses());
    setAssignments(DataProvider.getAssignments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      (s.studentName && s.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.assignmentTitle && s.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleOpenGrading = (sub: Submission) => {
    setActiveSubmission(sub);
    setGradeInput(sub.grade || 85);
    setFeedbackInput(sub.feedback || 'Kerja bagus, perhatikan kerapian penulisan dan ketepatan satuan.');
    setGradingModalOpen(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    DataProvider.gradeSubmission(
      activeSubmission.id,
      Number(gradeInput),
      feedbackInput,
      'Okta Nofiyanto'
    );
    showNotification(`Nilai untuk ${activeSubmission.studentName} berhasil disimpan dan dipublikasikan.`);
    setGradingModalOpen(false);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Pemeriksaan & Penilaian Tugas Siswa"
        subtitle="Periksa berkas jawaban, berikan skor angka, dan tuliskan umpan balik evaluasi belajar"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa atau tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              <option value="all">Semua Status</option>
              <option value="sudah_dikumpulkan">Belum Dinilai (Menunggu Guru)</option>
              <option value="sudah_dinilai">Sudah Dinilai</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Identitas Siswa</th>
                  <th className="py-4 px-6">Judul Tugas</th>
                  <th className="py-4 px-6">Waktu Pengumpulan</th>
                  <th className="py-4 px-6">Lampiran Jawaban</th>
                  <th className="py-4 px-6">Nilai Guru</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada pengumpulan tugas yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {sub.studentName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {sub.className} • NISN {sub.studentNisn || '-'}
                        </p>
                      </td>
                      <td className="py-4 px-6 max-w-xs font-semibold text-slate-700 dark:text-slate-300">
                        {sub.assignmentTitle}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-[11px]">
                        {formatDate(sub.submittedAt)}
                      </td>
                      <td className="py-4 px-6">
                        {sub.attachments && sub.attachments.length > 0 ? (
                          <div className="flex flex-col gap-1.5 max-w-[200px]">
                            {sub.attachments.slice(0, 2).map((att) => (
                              <a
                                key={att.id}
                                href={att.fileUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={att.name}
                                className="hover:opacity-80 transition-opacity"
                                title={att.name}
                              >
                                <FileBadge fileName={att.name} fileSize={att.fileSize} fileType={att.fileType} />
                              </a>
                            ))}
                            {sub.attachments.length > 2 && (
                              <span className="text-[10px] text-emerald-600 font-bold">
                                +{sub.attachments.length - 2} berkas lainnya
                              </span>
                            )}
                          </div>
                        ) : sub.fileName ? (
                          <a
                            href={sub.fileUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity inline-block"
                          >
                            <FileBadge fileName={sub.fileName} fileSize={sub.fileSize} fileType={sub.fileType} />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Hanya jawaban teks</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {sub.status === 'sudah_dinilai' ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {sub.grade} / 100
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">Tuntas</span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Menunggu Penilaian
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenGrading(sub)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all hover:scale-[1.01]"
                        >
                          {sub.status === 'sudah_dinilai' ? 'Ubah Nilai' : 'Beri Nilai'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL PENILAIAN & FEEDBACK GURU */}
      {gradingModalOpen && activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Form Penilaian Guru: Okta Nofiyanto
                </h3>
                <p className="text-xs text-slate-500">
                  Siswa: {activeSubmission.studentName} ({activeSubmission.className})
                </p>
              </div>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Jawaban Siswa Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Isi Uraian Siswa:
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {activeSubmission.textContent || 'Tidak ada teks tambahan.'}
              </p>

              {/* Berkas Lampiran Siswa */}
              {activeSubmission.attachments && activeSubmission.attachments.length > 0 ? (
                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Berkas Lampiran Siswa ({activeSubmission.attachments.length} berkas):
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {activeSubmission.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                      >
                        <FileBadge fileName={att.name} fileSize={att.fileSize} fileType={att.fileType} />
                        <a
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={att.name}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeSubmission.fileName ? (
                <div className="pt-2 flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FileBadge
                    fileName={activeSubmission.fileName}
                    fileSize={activeSubmission.fileSize}
                    fileType={activeSubmission.fileType}
                  />
                  <a
                    href={activeSubmission.fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={activeSubmission.fileName}
                    className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Unduh & Buka</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : null}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skor Nilai Angka (Skala 0 - 100) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-lg font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Komentar & Umpan Balik Guru (Feedback)
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Tuliskan catatan perbaikan dan apresiasi untuk siswa..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Simpan & Publikasikan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
