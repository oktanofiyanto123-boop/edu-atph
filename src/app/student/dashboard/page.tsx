'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  BookOpen,
  FileCheck2,
  HelpCircle,
  Award,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Sparkles,
  PlayCircle,
  GraduationCap,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import {
  UserProfile,
  TeachingMaterial,
  Assignment,
  Quiz,
  GradeRecord,
  Announcement,
  Submission,
} from '@/types';
import { formatDate } from '@/lib/utils';

export default function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [gradeRecord, setGradeRecord] = useState<GradeRecord | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    // Published materials for student's class
    const allMaterials = DataProvider.getMaterials().filter(
      (m) =>
        m.status === 'published' &&
        DataProvider.isClassMatch(m.targetClassId, user?.classId)
    );
    setMaterials(allMaterials);

    // Assignments for student's class
    const allAssignments = DataProvider.getAssignments().filter(
      (a) =>
        a.status === 'published' &&
        DataProvider.isClassMatch(a.targetClassId, user?.classId)
    );
    setAssignments(allAssignments);

    // Quizzes for student's class
    const allQuizzes = DataProvider.getQuizzes().filter(
      (q) =>
        q.isPublished &&
        DataProvider.isClassMatch(q.targetClassId, user?.classId)
    );
    setQuizzes(allQuizzes);

    // Submissions by this student
    if (user) {
      const studentSubs = DataProvider.getSubmissions().filter(
        (s) => s.studentId === user.id
      );
      setSubmissions(studentSubs);

      // Student grade
      const grades = DataProvider.getGrades();
      const myGrade = grades.find((g) => g.studentId === user.id);
      setGradeRecord(myGrade || null);

      // Announcements
      const annList = DataProvider.getAnnouncements(user.classId);
      setAnnouncements(annList.slice(0, 2));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedCount = materials.filter((m) =>
    currentUser ? DataProvider.isMaterialCompleted(currentUser.id, m.id) : false
  ).length;

  const progressPercent = materials.length > 0 ? Math.round((completedCount / materials.length) * 100) : 0;

  // Unsubmitted assignments
  const pendingAssignments = assignments.filter((a) => {
    return !submissions.some((s) => s.assignmentId === a.id);
  });

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title={`Halo, ${currentUser?.fullName || 'Siswa'}!`}
        subtitle="Selamat belajar di EduATPH. Pantau tugas, materi, dan capaian kompetensimu."
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* HERO BANNER SISWA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Kelas {currentUser?.className || 'X ATPH'} • {currentUser?.major}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Mata Pelajaran: Agribisnis Tanaman Pangan & Hortikultura
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Guru Pengampu: <strong>Bapak Okta Nofiyanto</strong>. Selesaikan modul materi dan kumpulkan tugas tepat waktu untuk meraih nilai tuntas.
              </p>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/student/materials"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-emerald-950 hover:bg-emerald-50 shadow-md transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <span>Lanjutkan Belajar</span>
              </Link>
              <Link
                href="/student/assignments"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/40 transition-all flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Kerjakan Tugas</span>
              </Link>
            </div>
          </div>
        </div>

        {/* PROGRESS & SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Progres Materi Selesai</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {completedCount} / {materials.length}
              </h3>
              <span className="text-xs font-bold text-emerald-600">
                ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Tugas Perlu Dikerjakan</span>
              <FileCheck2 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {pendingAssignments.length}
              </h3>
              <span className="text-xs text-slate-400">Tugas Aktif</span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              Perhatikan batas tenggat waktu
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Kuis & Evaluasi</span>
              <HelpCircle className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {quizzes.length}
              </h3>
              <span className="text-xs text-slate-400">Kuis Tersedia</span>
            </div>
            <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
              KKM Ketuntasan: 75
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Nilai Akhir Belajar</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {gradeRecord ? gradeRecord.finalScore : 88}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {gradeRecord ? gradeRecord.status : 'Tuntas'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dipublikasikan oleh Okta Nofiyanto
            </p>
          </div>
        </div>

        {/* PENGUMUMAN TERBARU BANNER */}
        {announcements.length > 0 && (
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Megaphone className="w-4 h-4 text-amber-600" />
              <span>Pengumuman Pembelajaran Terkini:</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {announcements[0].title}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {announcements[0].content}
            </p>
          </div>
        )}

        {/* TWO COLUMN CONTENT: TUGAS MENUNGGU & MATERI TERBARU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Tugas Menunggu */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Tugas yang Harus Dikerjakan
                </h3>
                <p className="text-xs text-slate-500">Tenggat terdekat praktik kejuruan ATPH</p>
              </div>
              <Link
                href="/student/assignments"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {assignments.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                Tidak ada tugas yang menunggu pengerjaan.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignments.map((asg) => {
                  const submitted = submissions.find((s) => s.assignmentId === asg.id);
                  return (
                    <div key={asg.id} className="py-4 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {asg.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {asg.description}
                          </p>
                        </div>
                        {submitted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap">
                            Sudah Dikumpulkan
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 whitespace-nowrap">
                            Belum Dikerjakan
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>Tenggat: {formatDate(asg.dueDate)}</span>
                        </span>
                        <Link
                          href="/student/assignments"
                          className="font-bold text-emerald-600 hover:underline"
                        >
                          {submitted ? 'Lihat Nilai & Balasan' : 'Kirim Jawaban →'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Materi Pembelajaran ATPH */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Modul Pembelajaran ATPH
                </h3>
                <p className="text-xs text-slate-500">Materi teori dan panduan praktik lapangan</p>
              </div>
              <Link
                href="/student/materials"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Lihat Semua Materi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {materials.map((mat) => {
                const isCompleted = currentUser
                  ? DataProvider.isMaterialCompleted(currentUser.id, mat.id)
                  : false;

                return (
                  <div key={mat.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                          {mat.categoryName}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-teal-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Selesai</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        Topik: {mat.topic}
                      </p>
                    </div>

                    <Link
                      href={`/student/materials/${mat.id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs whitespace-nowrap"
                    >
                      Buka Materi
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
