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
  Maximize2,
  Minimize2,
  Smartphone,
  PanelLeftClose,
  PanelLeft,
  Target,
  Layers,
  Sprout,
  ShieldCheck,
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
import { useStudentNav } from '@/context/StudentNavContext';

export default function StudentDashboardPage() {
  const studentNav = useStudentNav();
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
    <div className="flex-1 flex flex-col w-full min-h-screen">
      {/* Top Header */}
      <DashboardHeader
        title={`Halo, ${currentUser?.fullName || 'Siswa'}!`}
        subtitle="Selamat belajar di EduATPH. Pantau tugas, materi, dan capaian kompetensimu."
        onRefresh={loadData}
      />

      {/* FULL-SCREEN EXPANSIVE CONTENT CONTAINER */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 xl:px-10 2xl:px-12 py-6 sm:py-8 space-y-8">
        
        {/* PANORAMIC FULL-SCREEN HERO BANNER */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white shadow-2xl border border-emerald-500/25 p-6 sm:p-8 lg:p-10 transition-all">
          {/* Ambient glowing background orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
            {/* Left Column: Greeting & Description */}
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-xs backdrop-blur-md">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ruang Belajar Digital Agribisnis ATPH</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/10 backdrop-blur-md">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-300" />
                  <span>Kelas {currentUser?.className || 'X ATPH'} • NISN {currentUser?.nisn || '0078129381'}</span>
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
                  Selamat Belajar di EduATPH!
                </h2>
                <p className="text-sm sm:text-base text-emerald-100/90 font-normal mt-2 leading-relaxed">
                  Pantau tugas, materi, dan capaian kompetensimu secara penuh di semua layar. Guru Pengampu:{' '}
                  <strong className="text-white underline decoration-emerald-400 font-bold">Bapak Okta Nofiyanto</strong>.
                </p>
              </div>

              {/* Quick Action Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/student/materials"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <PlayCircle className="w-4 h-4 text-slate-950" />
                  <span>Lanjutkan Belajar Materi</span>
                </Link>
                <Link
                  href="/student/assignments"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <FileCheck2 className="w-4 h-4 text-emerald-300" />
                  <span>Kerjakan Tugas ({pendingAssignments.length})</span>
                </Link>
                <Link
                  href="/student/quizzes"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-900/60 hover:bg-teal-800/80 text-teal-200 border border-teal-500/40 backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>Evaluasi Kuis</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Screen Mode Controls & Quick Status Pill */}
            <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-auto xl:min-w-[280px]">
              {/* Fullscreen & Sidebar Controls */}
              <div className="p-4 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/15 backdrop-blur-md space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Kontrol Tampilan Layar</span>
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {/* Fullscreen Button */}
                  <button
                    onClick={studentNav?.toggleFullscreen}
                    className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/15 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-white"
                    title={studentNav?.isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
                  >
                    {studentNav?.isFullscreen ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>Keluar Full</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Layar Penuh</span>
                      </>
                    )}
                  </button>

                  {/* Hide Menu to iPhone Home Button */}
                  <button
                    onClick={studentNav?.toggleSidebar}
                    className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-emerald-200"
                    title={
                      studentNav?.isSidebarHidden
                        ? 'Tampilkan Menu Samping'
                        : 'Sembunyikan Menu (Mode iPhone Home)'
                    }
                  >
                    {studentNav?.isSidebarHidden ? (
                      <>
                        <PanelLeft className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Buka Menu</span>
                      </>
                    ) : (
                      <>
                        <PanelLeftClose className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Hide Menu</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Mode Home iPhone</span>
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                    {studentNav?.isSidebarHidden ? 'Aktif (Full)' : 'Siap'}
                  </span>
                </div>
              </div>

              {/* Status summary pill */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-300 font-semibold uppercase">Status Ketuntasan</p>
                    <p className="text-xs font-black text-white">
                      {gradeRecord?.status || 'Tuntas'} (Nilai {gradeRecord ? gradeRecord.finalScore : 88})
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  KKM 75
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS & SUMMARY CARDS (FULL-WIDTH 4-COLUMN RESPONSIVE GRID) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5">
          {/* Card 1: Progres Materi */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Progres Materi Modul
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {completedCount} <span className="text-base font-normal text-slate-400">/ {materials.length}</span>
              </h3>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completedCount} Bab Tuntas</span>
              <Link href="/student/materials" className="text-emerald-600 font-semibold hover:underline">
                Buka Materi →
              </Link>
            </div>
          </div>

          {/* Card 2: Tugas Perlu Dikerjakan */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tugas Praktik Aktif
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {pendingAssignments.length}
              </h3>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Tugas Menunggu
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {assignments.length - pendingAssignments.length} dari {assignments.length} tugas telah dikumpulkan
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Perhatikan deadline</span>
              </span>
              <Link href="/student/assignments" className="text-emerald-600 font-semibold hover:underline">
                Kerjakan →
              </Link>
            </div>
          </div>

          {/* Card 3: Kuis & Ujian */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Kuis & Evaluasi
              </span>
              <div className="w-9 h-9 rounded-2xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {quizzes.length}
              </h3>
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                Kuis Tersedia
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Evaluasi pemahaman konsep agronomi dan hortikultura
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-violet-600 dark:text-violet-400 font-semibold">
                KKM Kelulusan: 75
              </span>
              <Link href="/student/quizzes" className="text-emerald-600 font-semibold hover:underline">
                Mulai Ujian →
              </Link>
            </div>
          </div>

          {/* Card 4: Nilai Akhir Belajar */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Capaian Nilai Akhir
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {gradeRecord ? gradeRecord.finalScore : 88}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {gradeRecord ? gradeRecord.status : 'Tuntas'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dipublikasikan oleh Bapak Okta Nofiyanto
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-semibold">Predikat Sangat Baik</span>
              <Link href="/student/grades" className="text-emerald-600 font-semibold hover:underline">
                Transkrip Lengkap →
              </Link>
            </div>
          </div>
        </section>

        {/* PENGUMUMAN TERBARU BANNER */}
        {announcements.length > 0 && (
          <section className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <span>Pengumuman Pembelajaran Terkini</span>
              </div>
              <Link
                href="/student/announcements"
                className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>Semua Pengumuman</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {announcements[0].title}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {announcements[0].content}
            </p>
          </section>
        )}

        {/* TWO COLUMN EXPANSIVE CONTENT: TUGAS MENUNGGU & MATERI TERBARU */}
        <section className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-8">
          {/* Column 1: Tugas yang Harus Dikerjakan */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <span>Tugas yang Harus Dikerjakan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tenggat pengerjaan praktik kejuruan Agribisnis ATPH
                </p>
              </div>
              <Link
                href="/student/assignments"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {assignments.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>Semua tugas kejuruan telah selesai dikerjakan.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignments.map((asg) => {
                  const submitted = submissions.find((s) => s.assignmentId === asg.id);
                  return (
                    <div key={asg.id} className="py-4 space-y-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 p-2.5 rounded-2xl transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {asg.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {asg.description}
                          </p>
                        </div>
                        {submitted ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 whitespace-nowrap shadow-xs">
                            Sudah Dikumpulkan
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 whitespace-nowrap shadow-xs">
                            Belum Dikerjakan
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Tenggat: {formatDate(asg.dueDate)}</span>
                        </span>
                        <Link
                          href="/student/assignments"
                          className="font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          {submitted ? 'Lihat Nilai & Balasan Guru →' : 'Kirim Jawaban Sekarang →'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2: Modul Pembelajaran ATPH */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Modul Pembelajaran ATPH</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Materi teori dan panduan praktik lapangan terverifikasi
                </p>
              </div>
              <Link
                href="/student/materials"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {materials.map((mat) => {
                const isCompleted = currentUser
                  ? DataProvider.isMaterialCompleted(currentUser.id, mat.id)
                  : false;

                return (
                  <div key={mat.id} className="py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 p-2.5 rounded-2xl transition-colors">
                    <div className="space-y-1.5 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 dark:text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          {mat.categoryName}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tuntas</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {mat.title}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        Topik: {mat.topic}
                      </p>
                    </div>

                    <Link
                      href={`/student/materials/${mat.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-95"
                    >
                      Buka Materi
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM FULL-SCREEN CAPAIAN KOMPETENSI SECTION */}
        <section className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                <span>Pemantauan Capaian Kompetensi Belajar ATPH</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kesiapan praktik lapangan, agronomi, proteksi tanaman, dan teknologi hidroponik
              </p>
            </div>
            <Link
              href="/student/progress"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Detail Progres & Rekomendasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">1. Pembiakan Tanaman</span>
                <span className="font-black text-emerald-600">85% Tuntas</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <p className="text-[10px] text-slate-400">Teknik okulasi, cangkok, stek, dan pembibitan</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">2. Agribisnis Sayuran & Hortikultura</span>
                <span className="font-black text-teal-600">90% Tuntas</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '90%' }} />
              </div>
              <p className="text-[10px] text-slate-400">Pengolahan tanah, nutrisi tanaman, dan hidroponik</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">3. Pengendalian Hama & Penyakit</span>
                <span className="font-black text-amber-600">78% Tuntas</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <p className="text-[10px] text-slate-400">Pengelolaan hama terpadu (PHT) & pestisida nabati</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
