'use client';

import React, { useState, useEffect } from 'react';
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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const loadData = () => {
    setStats(DataProvider.getDashboardStats());
    setSubmissions(DataProvider.getSubmissions().slice(0, 5));
    setMaterials(DataProvider.getMaterials().slice(0, 5));
    setAssignments(DataProvider.getAssignments().slice(0, 4));
    setGrades(DataProvider.getGrades());
  };

  useEffect(() => {
    loadData();
  }, []);

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
            title="Tugas Belum Dinilai"
            value={stats?.pendingGradingCount || 0}
            subtitle="Memerlukan Penilaian Guru"
            icon={Inbox}
            color="amber"
            badge="Perlu Respon"
          />
          <StatCard
            title="Rata-rata Nilai"
            value={`${stats?.averageGrade || 0} / 100`}
            subtitle="Ketuntasan Belajar 88%"
            icon={Award}
            color="navy"
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
          </div>
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
                  Pengumpulan Tugas Terbaru
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
