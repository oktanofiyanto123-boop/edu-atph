'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sprout,
  Shield,
  GraduationCap,
  LogIn,
  Lock,
  Mail,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = (role: 'admin' | 'student') => {
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      const user = DataProvider.login('', role);
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        setErrorMessage('Gagal memuat profil pengguna.');
        setLoading(false);
      }
    }, 400);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Silakan masukkan email Anda.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      const user = DataProvider.login(email);
      if (user) {
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      } else {
        // Fallback: if email contains admin/okta, login as admin, otherwise student
        if (email.toLowerCase().includes('okta') || email.toLowerCase().includes('admin')) {
          DataProvider.login('', 'admin');
          router.push('/admin/dashboard');
        } else {
          DataProvider.login('', 'student');
          router.push('/student/dashboard');
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Masuk ke EduATPH
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Portal Pembelajaran Agribisnis Tanaman Pangan & Hortikultura
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Access Switchers */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
              Akses Cepat Pengguna
            </p>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-300 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    Masuk sebagai Administrator
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Okta Nofiyanto • Akses Penuh
                  </p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl border-2 border-teal-500/30 hover:border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-50 text-teal-900 dark:text-teal-300 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">
                    Masuk sebagai Siswa
                  </p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                    Rizky Pratama • Kelas X ATPH
                  </p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">
                Atau Masuk dengan Email
              </span>
            </div>
          </div>

          {/* Form Login */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@siswa.eduatph.sch.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
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
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memproses Masuk...' : 'Masuk ke Portal'}</span>
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <p>
              Akun siswa dibuat dan diotorisasi oleh administrator Okta Nofiyanto.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
