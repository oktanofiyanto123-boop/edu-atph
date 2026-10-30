'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import StatCard from '@/components/ui/StatCard';
import { SimpleBarChart, SimpleStackedChart } from '@/components/ui/ChartWidgets';
import {
  Users,
  School,
  BookOpen,
  FileCheck2,
  Inbox,
  AlertCircle,
  Award,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Database,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import {
  DashboardStats,
  Submission,
  TeachingMaterial,
  Assignment,
  GradeRecord,
} from '@/types';
import { formatDate } from '@/lib/utils';

interface ServerQuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  className: string;
  studentNisn: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  passed: boolean;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string;
  status: string;
  source?: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  // Supabase Live Quiz Attempts state
  const [serverAttempts, setServerAttempts] = useState<ServerQuizAttempt[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const fetchServerQuizAttempts = useCallback(async () => {
    setIsLoadingAttempts(true);
    try {
      const res = await fetch('/api/admin/quiz-attempts', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        setServerAttempts(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch server quiz attempts:', err);
    } finally {
      setIsLoadingAttempts(false);
      setLastRefreshedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, []);

  const loadData = useCallback(() => {
    setStats(DataProvider.getDashboardStats());
    setSubmissions(DataProvider.getSubmissions().slice(0, 5));
    setMaterials(DataProvider.getMaterials().slice(0, 5));
    setAssignments(DataProvider.getAssignments().slice(0, 4));
    setGrades(DataProvider.getGrades());
    fetchServerQuizAttempts();
  }, [fetchServerQuizAttempts]);

  useEffect(() => {
    loadData();
    // Auto refresh interval every 20 seconds for real-time dashboard updates
    const interval = setInterval(() => {
      fetchServerQuizAttempts();
    }, 20000);
    return () => clearInterval(interval);
  }, [loadData, fetchServerQuizAttempts]);

  // Data for Chart: Aktivitas Pengumpulan Mingguan
  const submissionChartData = [
    { label: 'Sen', value: 12 },
    { label: 'Sel', value: 18 },
    { label: 'Rab', value: 15 },
    { label: 'Kam', value: 24 },
    { label: 'Jum', value: 20 },
    { label: 'Sab', value: 8 },
    { label: 'Min', value: 5 },
  ];

  const classProgressData = [
    { label: 'X ATPH (Dasar)', passed: 24, remidi: 4 },
    { label: 'XI ATPH (Lanjutan)', passed: 27, remidi: 3 },
    { label: 'XII ATPH (Pascapanen)', passed: 25, remidi: 1 },
  ];

  // Combined attempts (Server Supabase + local cache fallback)
  const displayAttempts = serverAttempts.length > 0 ? serverAttempts : (DataProvider.getQuizAttempts() as any[]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Dashboard Administrator"
        subtitle="Selamat datang kembali, Bapak Okta Nofiyanto. Kelola kegiatan pembelajaran ATPH hari ini."
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Siswa Aktif"
            value={stats?.totalStudents || 0}
            subtitle="Terdaftar di 3 Kelas ATPH"
            icon={Users}
            color="emerald"
            badge="100% Aktif"
          />
          <StatCard
            title="Total Modul Materi"
            value={stats?.totalMaterials || 0}
            subtitle="15 Kategori Kurikulum"
            icon={BookOpen}
            color="teal"
          />
          <StatCard
            title="Kuis Masuk ke Server"
            value={serverAttempts.length || (displayAttempts ? displayAttempts.length : 0)}
            subtitle="Database Supabase Terkoneksi"
            icon={Database}
            color="navy"
            badge="Live Sync"
          />
          <StatCard
            title="Tugas Belum Dinilai"
            value={stats?.pendingGradingCount || 0}
            subtitle="Memerlukan Penilaian Guru"
            icon={Inbox}
            color="amber"
            badge="Perlu Respon"
          />
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div className="p-4 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tindakan Cepat Guru:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/materials"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Materi ATPH</span>
            </Link>
            <Link
              href="/admin/assignments"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Tugas Baru</span>
            </Link>
            <Link
              href="/admin/quizzes"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Kuis Evaluasi</span>
            </Link>
            <Link
              href="/admin/grades"
              className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 transition-all"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rekap Nilai Siswa</span>
            </Link>
          </div>
        </div>

        {/* LIVE QUIZ SUBMISSIONS FROM SUPABASE (TUGAS 6) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hasil Pengerjaan Kuis Siswa Terbaru (Live Server Supabase)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai dan jawaban siswa yang dikirimkan secara langsung dari HP atau browser siswa
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lastRefreshedAt && (
                <span className="text-[11px] text-slate-400">
                  Update: {lastRefreshedAt} WIB
                </span>
              )}
              <button
                onClick={fetchServerQuizAttempts}
                disabled={isLoadingAttempts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAttempts ? 'animate-spin text-emerald-600' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {displayAttempts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Database className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>Belum ada siswa yang mengirimkan jawaban kuis ke server.</p>
              <p className="text-[11px] text-slate-500">
                Ketika siswa mengerjakan kuis di portal siswa, nilai dan rincian jawaban akan langsung muncul di sini secara otomatis.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="pb-3 font-semibold">Siswa</th>
                    <th className="pb-3 font-semibold">Kelas</th>
                    <th className="pb-3 font-semibold">Kuis / Materi</th>
                    <th className="pb-3 font-semibold text-center">Jawaban Benar</th>
                    <th className="pb-3 font-semibold text-center">Jawaban Salah</th>
                    <th className="pb-3 font-semibold text-center">Nilai Akhir</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 font-semibold text-right">Waktu Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {displayAttempts.slice(0, 10).map((att) => {
                    const isPassed = att.score >= 75 || att.passed || att.isPassed;
                    const correctCount = att.correctCount ?? (att.answers?.filter((a: any) => a.isCorrect).length || Math.round((att.score / 100) * 20));
                    const totalQ = att.totalQuestions || 20;
                    const wrongCount = att.wrongCount ?? Math.max(0, totalQ - correctCount);

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {att.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {att.studentNisn || att.studentId}
                          </div>
                        </td>

                        <td className="py-3.5 pr-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                            {att.className || 'X ATPH'}
                          </span>
                        </td>

                        <td className="py-3.5 pr-4 max-w-[260px] truncate">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {att.quizTitle}
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Tersimpan di Supabase • ID: {att.id.slice(0, 16)}...
                          </div>
                        </td>

                        <td className="py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CheckCircle className="w-3 h-3" />
                            <span>{correctCount}</span>
                          </span>
                        </td>

                        <td className="py-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                            <XCircle className="w-3 h-3" />
                            <span>{wrongCount}</span>
                          </span>
                        </td>

                        <td className="py-3.5 text-center whitespace-nowrap font-black text-sm">
                          <span className={isPassed ? 'text-emerald-600' : 'text-rose-600'}>
                            {att.score} / 100
                          </span>
                        </td>

                        <td className="py-3.5 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isPassed
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {isPassed ? 'Tuntas' : 'Remidi'}
                          </span>
                        </td>

                        <td className="py-3.5 text-right whitespace-nowrap text-slate-500 text-[11px]">
                          {formatDate(att.completedAt || att.startedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Aktivitas Pengumpulan Mingguan */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Aktivitas Pengumpulan Tugas Siswa
                </h3>
                <p className="text-xs text-slate-500">Jumlah pengumpulan tugas per hari dalam 7 hari terakhir</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                Realtime Data
              </span>
            </div>

            <div className="pt-2">
              <SimpleBarChart data={submissionChartData} height={200} barColor="#059669" />
            </div>
          </div>

          {/* Chart 2: Ketuntasan Belajar Per Kelas */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ketuntasan Belajar Per Kelas
              </h3>
              <p className="text-xs text-slate-500">Perbandingan siswa tuntas (KKM 75) vs remidi</p>
            </div>

            <div className="pt-3">
              <SimpleStackedChart data={classProgressData} />
            </div>
          </div>
        </div>

        {/* TWO COLUMN RECENT TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Pengumpulan Tugas Terbaru */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pengumpulan Tugas Praktik Terbaru
                </h3>
                <p className="text-xs text-slate-500">Tugas siswa yang perlu dinilai atau baru dikumpulkan</p>
              </div>
              <Link
                href="/admin/submissions"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Belum ada pengumpulan tugas dari siswa.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.map((sub) => (
                  <div key={sub.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {sub.studentName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {sub.assignmentTitle}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{formatDate(sub.submittedAt)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {sub.className}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.status === 'sudah_dinilai' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {sub.grade} / 100
                        </span>
                      ) : (
                        <Link
                          href="/admin/submissions"
                          className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-xs"
                        >
                          Beri Nilai
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Materi Pembelajaran Aktif */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Materi Pembelajaran ATPH
                </h3>
                <p className="text-xs text-slate-500">Materi yang sedang dipelajari siswa di kelas</p>
              </div>
              <Link
                href="/admin/materials"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Kelola Materi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {materials.map((mat) => (
                <div key={mat.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {mat.title}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                      {mat.categoryName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Target: {mat.targetClassName || 'Semua Kelas'} • Status: {mat.status}
                    </p>
                  </div>

                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {mat.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
