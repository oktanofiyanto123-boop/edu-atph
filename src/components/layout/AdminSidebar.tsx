'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  FileCheck2,
  Inbox,
  HelpCircle,
  Award,
  Megaphone,
  Settings,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Manajemen Siswa', href: '/admin/students', icon: Users },
  { label: 'Manajemen Kelas', href: '/admin/classes', icon: School },
  { label: 'Materi ATPH', href: '/admin/materials', icon: BookOpen },
  { label: 'Manajemen Tugas', href: '/admin/assignments', icon: FileCheck2 },
  { label: 'Pengumpulan Tugas', href: '/admin/submissions', icon: Inbox },
  { label: 'Kuis & Evaluasi', href: '/admin/quizzes', icon: HelpCircle },
  { label: 'Rekap Nilai Siswa', href: '/admin/grades', icon: Award },
  { label: 'Pengumuman', href: '/admin/announcements', icon: Megaphone },
  { label: 'Pengaturan & Backup', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

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
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Digital Learning Management</p>
            </div>
          </Link>

          {/* Admin badge */}
          <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              ON
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Okta Nofiyanto</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">Administrator Utama</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Menu Administrator
          </p>
          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
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
          <span>Kembali ke Halaman Publik</span>
        </Link>
      </div>
    </aside>
  );
}
