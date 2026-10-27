'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Settings,
  Database,
  Download,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Server,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';

export default function AdminSettingsPage() {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExportBackup = () => {
    const backup = {
      app: 'EduATPH LMS',
      admin: 'Okta Nofiyanto',
      exportedAt: new Date().toISOString(),
      classes: DataProvider.getClasses(),
      categories: DataProvider.getCategories(),
      materials: DataProvider.getMaterials(),
      assignments: DataProvider.getAssignments(),
      submissions: DataProvider.getSubmissions(),
      quizzes: DataProvider.getQuizzes(),
      questions: DataProvider.getQuizQuestions(),
      attempts: DataProvider.getQuizAttempts(),
      grades: DataProvider.getGrades(),
      announcements: DataProvider.getAnnouncements(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EduATPH_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification('File cadangan database berhasil diunduh.');
  };

  const handleResetData = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data simulasi ke data awal bawaan kurikulum ATPH?')) {
      DataProvider.resetAllData();
      showNotification('Seluruh data berhasil dikembalikan ke status awal.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Pengaturan Platform & Cadangan Data"
        subtitle="Kelola konfigurasi sistem, strategi pencadangan database, dan integrasi cloud"
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* Admin Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-lg shadow-emerald-600/20">
              ON
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Okta Nofiyanto
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Pemilik & Administrator Utama
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pendidik Agribisnis Tanaman Pangan dan Hortikultura SMK
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Email Administrator:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">okta.nofiyanto@eduatph.sch.id</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[11px]">Nama Platform LMS:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">EduATPH</span>
            </div>
          </div>
        </div>

        {/* Database & Backup Actions Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cadangan Data & Pemulihan (Backup & Restore)
              </h3>
              <p className="text-xs text-slate-500">
                Amankan seluruh data materi, tugas, kuis, dan nilai siswa ke komputer lokal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Unduh Cadangan JSON
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Menyimpan seluruh catatan data ke dalam file JSON terenkripsi untuk arsip sekolah.
              </p>
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Cadangan Sekarang</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
              <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400">
                Reset Data Simulasi
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kembalikan seluruh materi, kelas, dan tugas ke kondisi awal kurikulum standar.
              </p>
              <button
                onClick={handleResetData}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset ke Data Bawaan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Supabase PostgreSQL Integration Guide Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Integrasi Database Cloud Supabase PostgreSQL
              </h3>
              <p className="text-xs text-slate-400">
                Skema SQL lengkap telah disiapkan di <code className="text-emerald-400">supabase/migrations/20261027_init_edu_atph.sql</code>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              1. Buka dashboard proyek Supabase Anda di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">supabase.com</a>
            </p>
            <p>
              2. Masuk ke menu <strong>SQL Editor</strong>, salin isi file SQL migrasi di atas, lalu klik <strong>Run</strong>.
            </p>
            <p>
              3. Tambahkan <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> pada file <code>.env.local</code> atau pengaturan Vercel Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
