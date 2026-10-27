'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Award,
  CheckCircle,
  Clock,
  Printer,
  FileText,
  HelpCircle,
  Sparkles,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { GradeRecord, Submission, QuizAttempt, UserProfile } from '@/types';
import { formatDate } from '@/lib/utils';

export default function StudentGradesPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [gradeRecord, setGradeRecord] = useState<GradeRecord | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    if (user) {
      const allGrades = DataProvider.getGrades();
      const myGrade = allGrades.find((g) => g.studentId === user.id);
      setGradeRecord(myGrade || null);

      const mySubs = DataProvider.getSubmissions().filter((s) => s.studentId === user.id);
      setSubmissions(mySubs);

      const myAttempts = DataProvider.getQuizAttempts(user.id);
      setAttempts(myAttempts);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <DashboardHeader
        title="Transkrip Nilai & Capaian Belajar"
        subtitle="Rekap nilai resmi tugas praktik dan kuis teori yang telah dipublikasikan guru"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Print Action Row */}
        <div className="flex items-center justify-between no-print">
          <p className="text-xs text-slate-500">
            Nilai dievaluasi dan disahkan oleh Administrator: <strong>Bapak Okta Nofiyanto</strong>
          </p>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 flex items-center gap-2 shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Cetak Rapor Nilai</span>
          </button>
        </div>

        {/* Big Official Score Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Transkrip Nilai Resmi • EduATPH
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {currentUser?.fullName}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                NISN: {currentUser?.nisn || '-'} • Kelas: {currentUser?.className || 'X ATPH'} • {currentUser?.major}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Nilai Akhir Rapor
              </span>
              <div className="flex items-baseline justify-center sm:justify-end gap-1.5 mt-0.5">
                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                  {gradeRecord ? gradeRecord.finalScore : 92}
                </span>
                <span className="text-xs text-slate-400 font-bold">/ 100</span>
              </div>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                {gradeRecord ? gradeRecord.status : 'Tuntas KKM'}
              </span>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Rata-Rata Tugas Praktik (60%)</span>
                </span>
                <strong className="text-base text-slate-900 dark:text-white">
                  {gradeRecord ? gradeRecord.assignmentAverage : 90}
                </strong>
              </div>
              <p className="text-[11px] text-slate-400">
                Berdasarkan {submissions.length} tugas praktik yang telah dinilai guru
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Rata-Rata Kuis & Evaluasi (40%)</span>
                </span>
                <strong className="text-base text-slate-900 dark:text-white">
                  {gradeRecord ? gradeRecord.quizAverage : 95}
                </strong>
              </div>
              <p className="text-[11px] text-slate-400">
                Berdasarkan {attempts.length} evaluasi interaktif yang dikerjakan
              </p>
            </div>
          </div>

          {/* Teacher Remarks */}
          {gradeRecord?.notes && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Catatan Guru Pengampu (Okta Nofiyanto):</span>
              </div>
              <p className="text-emerald-950 dark:text-emerald-200 italic leading-relaxed">
                "{gradeRecord.notes}"
              </p>
            </div>
          )}

          {/* Detailed Submissions History Table */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Rincian Perolehan Nilai Tugas Mandiri:
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {submissions.length === 0 ? (
                <p className="py-4 text-slate-400 text-center">Belum ada tugas yang dinilai.</p>
              ) : (
                submissions.map((sub) => (
                  <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {sub.assignmentTitle}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Dikumpulkan: {formatDate(sub.submittedAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      {sub.status === 'sudah_dinilai' ? (
                        <div>
                          <span className="font-black text-sm text-emerald-600">
                            {sub.grade} / 100
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Dinilai oleh {sub.gradedBy || 'Okta Nofiyanto'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          Menunggu Penilaian Guru
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
