'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  ShieldAlert,
  BookOpen,
  Eye,
  EyeOff,
  Download,
  Smartphone,
  Apple,
  Monitor,
  X,
  CheckCircle2,
  KeyRound,
  Info,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type InstallPlatform = 'android' | 'ios' | 'desktop' | null;

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAdminRedirect, setShowAdminRedirect] = useState(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>('android');
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installSuccessMessage, setInstallSuccessMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone mode (already installed)
    const isStandalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect OS
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Catch install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (platform === 'ios') {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setInstallSuccessMessage('Aplikasi EduATPH berhasil dipasang!');
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install error:', err);
      }
    } else {
      // Fallback instructions if prompt is unavailable
      if (platform === 'android') {
        alert(
          'Untuk memasang aplikasi: Ketuk tombol menu titik tiga (⋮) di browser Chrome Anda, lalu pilih "Tambahkan ke Layar Utama" atau "Install Aplikasi".'
        );
      } else {
        alert(
          'Untuk memasang aplikasi di Laptop/PC: Klik ikon Pasang/Install (tanda panah atau komputer kecil) di address bar browser Anda, atau buka Menu > Install EduATPH.'
        );
      }
    }
  }, [deferredPrompt, platform]);

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
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage('Silakan masukkan alamat email siswa Anda.');
      setShowAdminRedirect(false);
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Silakan masukkan kata sandi Anda (password resmi: skaneba123).');
      setShowAdminRedirect(false);
      return;
    }

    // Validasi kata sandi wajib skaneba123
    if (cleanPassword !== 'skaneba123') {
      setErrorMessage('Kata sandi salah! Password resmi siswa adalah: skaneba123');
      setShowAdminRedirect(false);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setShowAdminRedirect(false);

    setTimeout(() => {
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

      // Login akun siswa dengan email sendiri dan password skaneba123
      const user = DataProvider.login(cleanEmail, cleanPassword, 'student');
      if (user && user.role === 'student') {
        router.push('/student/dashboard');
      } else {
        setLoading(false);
        setErrorMessage('Gagal memproses masuk. Silakan periksa kembali email Anda.');
      }
    }, 400);
  };

  const PlatformIcon = platform === 'ios' ? Apple : platform === 'android' ? Smartphone : Monitor;
  const platformLabel =
    platform === 'ios' ? 'iPhone / iPad' : platform === 'android' ? 'HP Android' : 'Laptop / PC';

  return (
    <div className="min-h-screen flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/beranda" className="inline-flex items-center gap-2 mb-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 group-hover:scale-105 transition-all">
            <Sprout className="w-7 h-7" />
          </div>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Ruang Belajar Siswa ATPH</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Masuk Portal Siswa
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Gunakan email masing-masing dengan kata sandi <strong>skaneba123</strong>
        </p>

        {/* TOMBOL INSTALL APLIKASI (PWA) KHUSUS SISWA */}
        <div className="mt-4 mb-2">
          {isInstalled ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Aplikasi EduATPH Telah Terpasang di Perangkat Ini</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full group relative overflow-hidden p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 border border-emerald-400/40 transition-all hover:scale-[1.02] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-extrabold flex items-center gap-1.5 leading-tight">
                    <span>Pasang Aplikasi EduATPH</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/25 font-bold uppercase">
                      PWA
                    </span>
                  </p>
                  <p className="text-[11px] text-emerald-100/90 leading-tight">
                    Kompatibel di {platformLabel} • Akses Cepat & Ringan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 pr-1">
                <PlatformIcon className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 py-7 px-5 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 sm:px-9 space-y-5">
          {installSuccessMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{installSuccessMessage}</span>
            </div>
          )}

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
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="uppercase tracking-wider">Akses Langsung Siswa Demo</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                1-Klik
              </span>
            </div>

            <button
              type="button"
              onClick={handleStudentQuickLogin}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-50 text-emerald-950 dark:text-emerald-200 flex items-center justify-between text-left transition-all group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Masuk Cepat Siswa (Rizky Pratama)
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Kelas X ATPH • Tanpa input sandi
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
                Atau Masuk dengan Email Sendiri
              </span>
            </div>
          </div>

          {/* Form Login Siswa */}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama.kamu@gmail.com / email sekolah"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Bisa menggunakan email pribadi atau email resmi sekolah.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi Siswa
                </label>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3" />
                  <span>Password: skaneba123</span>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik password: skaneba123"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Petunjuk kata sandi default */}
            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2 text-[11px] text-emerald-900 dark:text-emerald-200">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                Gunakan kata sandi serentak: <strong className="font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300">skaneba123</strong> untuk masuk ke akun Anda.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memverifikasi Akun Siswa...' : 'Masuk ke Ruang Belajar'}</span>
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
        <div className="mt-5 text-center">
          <Link
            href="/beranda"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lihat Profil Jurusan & 15 Modul Kurikulum ATPH</span>
          </Link>
        </div>
      </div>

      {/* MODAL PANDUAN INSTALL IPHONE / IPAD (iOS) */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-slate-300" />
                <h3 className="text-white font-bold text-sm">Pasang di iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-400 text-xs">
                Safari di iPhone/iPad memerlukan 3 langkah mudah untuk menambahkan aplikasi ke Layar Utama:
              </p>
              {[
                {
                  icon: '⬆️',
                  title: '1. Ketuk ikon "Share" (Bagikan)',
                  desc: 'Tombol kotak dengan panah ke atas di bagian bawah Safari.',
                  color: 'bg-blue-900/40 border-blue-700/50',
                },
                {
                  icon: '➕',
                  title: '2. Pilih "Add to Home Screen"',
                  desc: 'Geser ke bawah dan pilih "Tambahkan ke Layar Utama".',
                  color: 'bg-emerald-900/40 border-emerald-700/50',
                },
                {
                  icon: '✅',
                  title: '3. Ketuk "Add" / "Tambah"',
                  desc: 'Ikon EduATPH akan muncul di homescreen layaknya aplikasi biasa!',
                  color: 'bg-emerald-900/60 border-emerald-600/50',
                },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className={`flex items-start gap-3 p-3 rounded-2xl border ${color}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">
                    {icon}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">{title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                Saya Mengerti, Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

