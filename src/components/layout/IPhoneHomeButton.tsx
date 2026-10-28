'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  TrendingUp,
  Megaphone,
  Home,
  Sidebar,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { useStudentNav } from '@/context/StudentNavContext';
import { DataProvider } from '@/lib/data-provider';
import { UserProfile } from '@/types';

const IPHONE_NAV_ITEMS = [
  {
    label: 'Dashboard',
    sublabel: 'Ringkasan',
    href: '/student/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-500/30',
  },
  {
    label: 'Materi ATPH',
    sublabel: 'Modul & Teori',
    href: '/student/materials',
    icon: BookOpen,
    gradient: 'from-teal-500 to-cyan-600',
    shadow: 'shadow-teal-500/30',
  },
  {
    label: 'Tugas Saya',
    sublabel: 'Praktik & LKPD',
    href: '/student/assignments',
    icon: FileText,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-500/30',
  },
  {
    label: 'Kuis & Ujian',
    sublabel: 'Evaluasi',
    href: '/student/quizzes',
    icon: HelpCircle,
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/30',
  },
  {
    label: 'Nilai Saya',
    sublabel: 'Transkrip',
    href: '/student/grades',
    icon: Award,
    gradient: 'from-rose-500 to-pink-600',
    shadow: 'shadow-rose-500/30',
  },
  {
    label: 'Progres',
    sublabel: 'Capaian Belajar',
    href: '/student/progress',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/30',
  },
  {
    label: 'Pengumuman',
    sublabel: 'Informasi Kelas',
    href: '/student/announcements',
    icon: Megaphone,
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-500/30',
  },
  {
    label: 'Web Utama',
    sublabel: 'Portal EduATPH',
    href: '/',
    icon: Home,
    gradient: 'from-slate-600 to-slate-800',
    shadow: 'shadow-slate-500/30',
  },
];

export default function IPhoneHomeButton() {
  const pathname = usePathname();
  const nav = useStudentNav();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(DataProvider.getCurrentUser());
  }, []);

  const isSidebarHidden = nav?.isSidebarHidden ?? false;
  const setIsSidebarHidden = nav?.setIsSidebarHidden ?? (() => {});
  const isIPhoneMenuOpen = nav?.isIPhoneMenuOpen ?? false;
  const setIsIPhoneMenuOpen = nav?.setIsIPhoneMenuOpen ?? (() => {});
  const toggleIPhoneMenu = nav?.toggleIPhoneMenu ?? (() => {});
  const isFullscreen = nav?.isFullscreen ?? false;
  const toggleFullscreen = nav?.toggleFullscreen ?? (() => {});

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isIPhoneMenuOpen) {
        setIsIPhoneMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIPhoneMenuOpen, setIsIPhoneMenuOpen]);

  return (
    <>
      {/* FLOATING IPHONE HOME BUTTON (ASSISTIVETOUCH ORB) */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <div className="relative group">
          {/* Tooltip on hover */}
          <div className="absolute bottom-full right-0 mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 whitespace-nowrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold backdrop-blur-md border border-white/15 shadow-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Tombol Home iPhone • Buka Menu Pembelajaran</span>
            </div>
          </div>

          {/* Authentic iPhone Home Button Element */}
          <button
            onClick={toggleIPhoneMenu}
            aria-label="Buka Menu Pembelajaran (Tombol Home iPhone)"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-900/85 dark:bg-black/90 backdrop-blur-xl border border-white/25 shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:border-emerald-400/80 hover:shadow-emerald-500/20 ring-4 ring-black/10 dark:ring-white/5"
          >
            {/* Outer concentric metallic ring (iPhone Touch ID ring) */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-300/40 group-hover:border-emerald-300/80 transition-colors flex items-center justify-center">
              {/* Inner iconic squircle / home button square */}
              <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-[5px] border-2 border-white/90 group-hover:border-emerald-200 bg-white/10 group-hover:bg-emerald-400/25 transition-all shadow-inner flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white/70 group-hover:bg-emerald-100" />
              </div>
            </div>

            {/* Glowing active indicator dot */}
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          </button>
        </div>
      </div>

      {/* IOS-STYLED ASSISTIVETOUCH / SPRINGBOARD LAUNCHER MODAL */}
      {isIPhoneMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsIPhoneMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[32px] bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl text-white animate-in zoom-in-95 duration-200"
          >
            {/* iOS Pill Handle */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base tracking-tight text-white">
                      Menu Pembelajaran
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      EduATPH
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {currentUser?.fullName || 'Siswa'} • {currentUser?.className || 'Kelas X ATPH'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsIPhoneMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* iOS App Grid (4 Columns x 2 Rows) */}
            <div className="grid grid-cols-4 gap-3.5 my-5">
              {IPHONE_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsIPhoneMenuOpen(false)}
                    className="flex flex-col items-center group text-center focus:outline-none"
                  >
                    {/* iOS App Icon Squircle */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white shadow-lg ${item.shadow} group-hover:scale-110 active:scale-95 transition-all duration-200 relative ${
                        isActive ? 'ring-2 ring-white shadow-emerald-500/50' : ''
                      }`}
                    >
                      <Icon className="w-6 h-6 drop-shadow-sm" />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white shadow-xs" />
                      )}
                    </div>
                    {/* App Label */}
                    <span className="mt-2 text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors truncate w-full">
                      {item.label}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate w-full hidden sm:block">
                      {item.sublabel}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Action Dock */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
              {/* Toggle Sidebar Button */}
              <button
                onClick={() => {
                  setIsSidebarHidden(!isSidebarHidden);
                  setIsIPhoneMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Sidebar className="w-4 h-4 text-emerald-400" />
                <span>{isSidebarHidden ? 'Tampilkan Menu Samping' : 'Sembunyikan Menu Samping'}</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => {
                  toggleFullscreen();
                  setIsIPhoneMenuOpen(false);
                }}
                className="py-2.5 px-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold flex items-center gap-2 transition-all"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Keluar Full</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-teal-400" />
                    <span className="hidden sm:inline">Layar Penuh</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
