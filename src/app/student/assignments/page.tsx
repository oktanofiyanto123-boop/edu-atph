'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  FileCheck2,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Award,
  MessageSquare,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Assignment, Submission, UserProfile } from '@/types';
import { formatDate } from '@/lib/utils';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Submit Modal State
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [textContent, setTextContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    // Published assignments for student's class
    const list = DataProvider.getAssignments().filter(
      (a) =>
        a.status === 'published' &&
        (a.targetClassId === 'all' || a.targetClassId === user?.classId)
    );
    setAssignments(list);

    if (user) {
      const subs = DataProvider.getSubmissions().filter((s) => s.studentId === user.id);
      setSubmissions(subs);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenSubmit = (asg: Assignment) => {
    setActiveAssignment(asg);
    const existing = submissions.find((s) => s.assignmentId === asg.id);
    if (existing) {
      setTextContent(existing.textContent || '');
      setFileName(existing.fileName || '');
    } else {
      setTextContent('');
      setFileName('');
    }
    setSubmitModalOpen(true);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !currentUser) return;

    DataProvider.submitAssignment({
      assignmentId: activeAssignment.id,
      assignmentTitle: activeAssignment.title,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      studentNisn: currentUser.nisn,
      classId: currentUser.classId,
      className: currentUser.className,
      textContent,
      fileName: fileName || 'Laporan_Praktik_Siswa.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileSize: '1.2 MB',
    });

    showNotification('Tugas berhasil dikirim ke guru! Status telah diperbarui.');
    setSubmitModalOpen(false);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Tugas Pembelajaran ATPH"
        subtitle="Kerjakan instruksi praktik kejuruan, kirim dokumen laporan, dan pantau penilaian guru"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((asg) => {
            const submission = submissions.find((s) => s.assignmentId === asg.id);
            const isSubmitted = Boolean(submission);
            const isGraded = submission?.status === 'sudah_dinilai';

            return (
              <div
                key={asg.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      {asg.topic || 'Praktik ATPH'}
                    </span>
                    {isGraded ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Nilai: {submission.grade} / 100</span>
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        Sudah Terkumpul
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Belum Dikerjakan
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {asg.description}
                    </p>
                  </div>

                  {/* Petunjuk Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Instruksi Pengerjaan:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                      {asg.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tenggat: <strong className="text-slate-800 dark:text-slate-200">{formatDate(asg.dueDate)}</strong></span>
                  </div>

                  {/* Guru Feedback if graded */}
                  {isGraded && submission?.feedback && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Catatan Evaluasi Guru (Okta Nofiyanto):</span>
                      </div>
                      <p className="text-emerald-950 dark:text-emerald-200 italic">
                        "{submission.feedback}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenSubmit(asg)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isSubmitted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isSubmitted ? 'Perbarui Pengumpulan Tugas' : 'Kumpulkan Tugas Sekarang'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL PENGUMPULAN TUGAS */}
      {submitModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Kirim Jawaban Tugas
                </h3>
                <p className="text-xs text-slate-500">{activeAssignment.title}</p>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Uraian / Ringkasan Jawaban Teks
                </label>
                <textarea
                  rows={4}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Ketikkan ringkasan hasil pengamatan, tabel data, atau jawaban tugas..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Unggah Berkas Laporan (PDF, Word, atau Foto Praktik)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-2 hover:border-emerald-500 transition-colors">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {fileName ? fileName : 'Klik untuk memilih berkas dari perangkat'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Maksimal 10 MB (Format: .pdf, .docx, .jpg, .png)
                  </p>
                  <input
                    type="file"
                    onChange={handleSimulateFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block mt-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200"
                  >
                    Pilih File
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke Guru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
