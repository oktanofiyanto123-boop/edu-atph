'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Sprout,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Award,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  Play,
  MonitorCheck,
  Users,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mock-data';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
          {/* Subtle background radial glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute top-24 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headlines */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Platform Pembelajaran Resmi SMK Pertanian • ATPH</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  EduATPH —{' '}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    Platform Pembelajaran Digital
                  </span>{' '}
                  Agribisnis Tanaman
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Belajar pertanian modern secara digital. Pelajari materi, ikuti evaluasi, kerjakan tugas, dan pantau perkembangan belajarmu dalam satu platform.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
                  >
                    <span>Masuk ke Pembelajaran</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="#kategori"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Jelajahi Materi</span>
                  </Link>
                </div>

                {/* Quick Trust Highlights */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 text-left">
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">15</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Modul Kompetensi ATPH</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">3 Jenjang</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kelas X, XI & XII SMK</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Terintegrasi Database</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Floating badge */}
                  <div className="absolute -top-4 -left-4 z-20 p-3.5 rounded-2xl glass-panel shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Pertanian Presisi</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">Smart Farming & NFT</p>
                    </div>
                  </div>

                  {/* Main graphic preview card */}
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
                        alt="Greenhouse Hidroponik Selada ATPH"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/90 text-white">
                          Praktik Kejuruan
                        </span>
                        <h4 className="text-base font-bold mt-1 text-white">
                          Laboratorium Greenhouse & Hidroponik SMK
                        </h4>
                      </div>
                    </div>

                    {/* Quick simulated preview widget */}
                    <div className="p-5 space-y-3 bg-slate-50 dark:bg-slate-900/60">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Administrator Pengampu</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Okta Nofiyanto</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-4/5 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Progres Kurikulum ATPH</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">80% Selesai</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating lower badge */}
                  <div className="absolute -bottom-5 -right-4 z-20 p-3.5 rounded-2xl glass-panel shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Evaluasi Terpadu</p>
                      <p className="text-[10px] text-teal-600 font-semibold">Auto-Grading & Analisis</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TENTANG PLATFORM & INFORMASI PEMBELAJARAN */}
        <section id="tentang" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Tentang EduATPH
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Membentuk Ahli Agribisnis Masa Depan
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Jurusan Agribisnis Tanaman Pangan dan Hortikultura (ATPH) membekali siswa SMK dengan kompetensi teknis budidaya, pengelolaan lahan, penanganan pascapanen, serta pemasaran komoditas pertanian berbasis teknologi informasi.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Struktur Belajar Terarah
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Materi disusun runtut dari teori dasar, penyiapan lahan, persemaian, pemeliharaan, hingga panen dan analisis kelayakan usaha tani.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Materi Multimedia Lengkap
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dilengkapi panduan teks terstruktur, infografik visual, modul PDF siap cetak, serta video tutorial praktik lapangan di greenhouse.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Penilaian Terintegrasi
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tugas mandiri, kuis interaktif, dan rekap nilai otomatis yang transparan dan dapat diekspor langsung ke format CSV oleh guru.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 15 KATEGORI MATERI ATPH */}
        <section id="kategori" className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Kurikulum Kejuruan
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                15 Kategori Kompetensi ATPH
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Seluruh spektrum keahlian agribisnis tanaman pangan dan hortikultura yang siap dipelajari siswa SMK.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Modul ATPH
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Link href="/login" className="flex items-center gap-1 group-hover:gap-2 transition-all">
                      <span>Buka Pembelajaran</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FITUR PEMBELAJARAN */}
        <section id="fitur" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Fitur Unggulan
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Dirancang Setara LMS Universitas Modern
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Pengalaman belajar interaktif yang nyaman, responsif di HP, dan terhubung langsung ke basis data PostgreSQL.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Manajemen Materi Dinamis</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Guru dapat menambah dan mempublikasikan modul pembelajaran tanpa coding, lengkap dengan status draf dan kelas sasaran.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Pengumpulan Tugas Online</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Siswa mengumpulkan laporan dan foto praktik secara digital, lengkap dengan batas waktu dan rubrik penilaian.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Kuis Interaktif & Auto-Score</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Soal pilihan ganda, benar/salah, dan isian dengan batas waktu serta penilaian otomatis saat pengerjaan selesai.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Pelacakan Progres Realtime</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Setiap materi yang diselesaikan tercatat di database sehingga siswa dapat melanjutkan dari modul terakhir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
              Mulai Pembelajaran Sekarang
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Siap Menjadi Generasi Penerus Agribisnis Pertanian Modern?
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Masuk ke akun siswa atau hubungi Bapak Okta Nofiyanto untuk verifikasi data kelas dan akses kurikulum lengkap.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-emerald-950 bg-white hover:bg-emerald-50 shadow-xl transition-all hover:scale-[1.02]"
              >
                Masuk ke EduATPH
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
