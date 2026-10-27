'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
  GraduationCap,
  Sparkles,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { UserProfile } from '@/types';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export default function DashboardHeader({ title, subtitle, onRefresh }: DashboardHeaderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  useEffect(() => {
    setCurrentUser(DataProvider.getCurrentUser());
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document === 'undefined') return;
    const isNowDark = !isDark;
    setIsDark(isNowDark);
    if (isNowDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const switchRole = (role: 'admin' | 'student') => {
    setMenuOpen(false);
    const users = DataProvider.getUsers();
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || users[0];
      DataProvider.setCurrentUser(admin);
      setCurrentUser(admin);
      router.push('/admin/dashboard');
    } else {
      const student = users.find((u) => u.role === 'student') || users[1];
      DataProvider.setCurrentUser(student);
      setCurrentUser(student);
      router.push('/student/dashboard');
    }
  };

  const handleLogout = () => {
    DataProvider.logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-panel border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Refresh if provided */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Muat Ulang Data"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setUnreadNotifications(0)}
            title="Notifikasi"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {currentUser?.role === 'admin' ? (
                <Shield className="w-4 h-4" />
              ) : (
                <GraduationCap className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser?.fullName || 'Pengguna'}
              </p>
              <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {currentUser?.role === 'admin' ? 'Administrator' : `Siswa (${currentUser?.className || 'X ATPH'})`}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser?.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>{currentUser?.role === 'admin' ? 'Akses Penuh Guru' : 'Akun Siswa'}</span>
                </div>
              </div>

              {/* Role switcher for easy paired testing */}
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                  Beralih Mode Tampilan:
                </p>
                <button
                  onClick={() => switchRole('admin')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    currentUser?.role === 'admin'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Okta Nofiyanto (Admin)</span>
                  </span>
                  {currentUser?.role === 'admin' && <span className="text-[10px]">Aktif</span>}
                </button>
                <button
                  onClick={() => switchRole('student')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between mt-1 ${
                    currentUser?.role === 'student'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                    <span>Rizky Pratama (Siswa)</span>
                  </span>
                  {currentUser?.role === 'student' && <span className="text-[10px]">Aktif</span>}
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
