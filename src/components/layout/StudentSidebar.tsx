'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  TrendingUp,
  Megaphone,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { UserProfile } from '@/types';

const STUDENT_NAV_ITEMS = [
  { label: 'Dashboard Siswa', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Materi Pembelajaran', href: '/student/materials', icon: BookOpen },
  { label: 'Tugas Saya', href: '/student/assignments', icon: FileText },
  { label: 'Kuis & Evaluasi', href: '/student/quizzes', icon: HelpCircle },
  { label: 'Nilai & Transkrip', href: '/student/grades', icon: Award },
  { label: 'Progres Belajar', href: '/student/progress', icon: TrendingUp },
  { label: 'Pengumuman Kelas', href: '/student/announcements', icon: Megaphone },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(DataProvider.getCurrentUser());
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 min-h-screen bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight">EduATPH</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  SISWA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Ruang Belajar Digital</p>
            </div>
          </Link>

          {/* Student badge */}
          <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {currentUser?.fullName || 'Rizky Pratama'}
              </p>
              <p className="text-[10px] text-teal-400 font-medium truncate">
                {currentUser?.className || 'Kelas X ATPH'} • NISN {currentUser?.nisn || '0078129381'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Menu Pembelajaran
          </p>
          <nav className="space-y-1">
            {STUDENT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer link to landing page */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </div>
    </aside>
  );
}
