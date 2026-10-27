'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Megaphone,
  Calendar,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Announcement, UserProfile } from '@/types';
import { formatDate } from '@/lib/utils';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const list = DataProvider.getAnnouncements(user.classId);
      setAnnouncements(list);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <DashboardHeader
        title="Pengumuman & Pemberitahuan Kelas"
        subtitle="Informasi penting mengenai jadwal praktik greenhouse, tugas kejuruan, dan evaluasi ATPH"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {announcements.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            Belum ada pengumuman terbaru untuk kelas Anda.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : ann.priority === 'important'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {ann.priority === 'urgent' ? 'Mendesak' : ann.priority === 'important' ? 'Penting' : 'Informasi'}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(ann.createdAt)}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                Disampaikan oleh: <strong className="text-slate-800 dark:text-slate-200">{ann.authorName}</strong> (Guru Pengampu)
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
