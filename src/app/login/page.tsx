'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sprout,
  GraduationCap,
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShieldAlert,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAdminRedirect, setShowAdminRedirect] = useState(false);

  const handleStudentQuickLogin = () => {
    setLoading(true);
    setErrorMessage('');
    setShowAdminRedirect(false);

    setTimeout(() => {
      const user = DataProvider.login('', 'student');
      if (user) {
        router.push('/student/dashboard');
      } else {
        setErrorMessage('Gagal memuat data akun siswa.');
        setLoading(false);
      }
    }, 350);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Silakan masukkan alamat email siswa Anda.');
      setShowAdminRedirect(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setShowAdminRedirect(false);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();

      // Cek apakah akun yang diinput adalah administrator
      const users = DataProvider.getUsers();
      const targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

      const isAdminAttempt =
        (targetUser && targetUser.role === 'admin') ||
        cleanEmail.includes('admin') ||
        cleanEmail.includes('okta.nofiyanto');

      if (isAdminAttempt) {
        setLoading(false);
        setErrorMessage(
          'Akses Ditolak: Akun Administrator tidak diizinkan masuk melalui portal siswa. Silakan gunakan Portal Administrator khusus guru.'
        );
        setShowAdminRedirect(true);
        return;
      }

      // Login akun siswa
      const user = DataProvider.login(cleanEmail, 'student');
      if (user && user.role === 'student') {
        router.push('/student/dashboard');
      } else {
        // Fallback default student
        DataProvider.login('', 'student');
        router.push('/student/dashboard');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/beranda" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Ruang Belajar Siswa ATPH</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Masuk Portal Siswa
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Akses materi agribisnis, evaluasi kuis, dan pengumpulan tugas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span className="font-semibold leading-relaxed">{errorMessage}</span>
              </div>
              {showAdminRedirect && (
                <div className="pt-2">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <span>Buka Portal Administrator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quick Access Switcher (Student Only) */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
              Akses Cepat Siswa
            </p>

            <button
              type="button"
              onClick={handleStudentQuickLogin}
              disabled={loading}
              className="w-full p-4 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-50 text-emerald-950 dark:text-emerald-200 flex items-center justify-between text-left transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Masuk sebagai Siswa
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Rizky Pratama • Kelas X ATPH
                  </p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold tracking-wider">
                Atau Email Siswa
              </span>
            </div>
          </div>

          {/* Form Login */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Email Siswa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rizky.pratama@siswa.eduatph.sch.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memproses Masuk...' : 'Masuk ke Ruang Belajar'}</span>
            </button>
          </form>

          {/* Teacher link notice */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guru / Administrator?{' '}
              <Link
                href="/admin/login"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Masuk Portal Administrator</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Link to Information & Curriculum */}
        <div className="mt-6 text-center">
          <Link
            href="/beranda"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lihat Profil Jurusan & 15 Modul Kurikulum ATPH</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
