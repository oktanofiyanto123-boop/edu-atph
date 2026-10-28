'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  GraduationCap,
  LogIn,
  Lock,
  Mail,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  KeyRound,
  Users,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';

export default function AdminLoginPage() {
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
    }, 350);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Silakan masukkan alamat email administrator atau akun siswa.');
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
          // Portal admin diperbolehkan login siswa
          router.push('/student/dashboard');
        }
      } else {
        // Fallback email logic
        if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('okta')) {
          DataProvider.login('', 'admin');
          router.push('/admin/dashboard');
        } else {
          DataProvider.login('', 'student');
          router.push('/student/dashboard');
        }
      }
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Portal Khusus Administrator</span>
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight">
          EduATPH — Admin
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Akses manajemen kurikulum, penilaian, dan administrasi siswa
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Access Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="uppercase tracking-wider">Akses Langsung Sistem</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                Otentikasi Siap
              </span>
            </div>

            {/* Admin Fast Button */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="w-full p-4 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/30 text-emerald-200 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Masuk sebagai Administrator
                  </p>
                  <p className="text-xs text-emerald-400 font-medium">
                    Okta Nofiyanto • Hak Akses Penuh
                  </p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </button>

            {/* Student Preview Button (Admin Portal can log in as Student) */}
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl border border-slate-700 hover:border-teal-500/50 bg-slate-800/60 hover:bg-slate-800 text-slate-300 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-700/80 text-white flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    Mode Pengujian / Siswa
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Rizky Pratama • Kelas X ATPH
                  </p>
                </div>
              </div>
              <Users className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-bold tracking-wider">
                Atau Kredensial Email
              </span>
            </div>
          </div>

          {/* Form Login */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Alamat Email Pengajar / Siswa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="okta.nofiyanto@eduatph.sch.id"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memverifikasi Akses...' : 'Masuk ke Konsol Administrasi'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800/80">
            <p>
              Portal ini ditujukan untuk dewan guru dan tim pengelola jurusan ATPH.
            </p>
          </div>
        </div>

        {/* Return to Student Portal Link */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portal Masuk Siswa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
