'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { TeachingMaterial, MaterialCategory, UserProfile, Submission, QuizAttempt } from '@/types';

export default function StudentProgressPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    setCategories(DataProvider.getCategories());
    const allMaterials = DataProvider.getMaterials().filter(
      (m) =>
        m.status === 'published' &&
        DataProvider.isClassMatch(m.targetClassId, user?.classId)
    );
    setMaterials(allMaterials);

    if (user) {
      setSubmissions(DataProvider.getSubmissions().filter((s) => s.studentId === user.id));
      setAttempts(DataProvider.getQuizAttempts(user.id));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedMaterials = materials.filter((m) =>
    currentUser ? DataProvider.isMaterialCompleted(currentUser.id, m.id) : false
  );

  const completionPercentage =
    materials.length > 0 ? Math.round((completedMaterials.length / materials.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <DashboardHeader
        title="Progres & Aktivitas Belajar ATPH"
        subtitle="Pelacakan otomatis capaian modul kurikulum pertanian, tugas, dan evaluasi siswa"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Main Progress Bar Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Pencapaian Kurikulum ATPH
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Tingkat Penyelesaian Modul Belajar
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {completionPercentage}%
              </span>
              <span className="block text-[11px] text-slate-400">
                {completedMaterials.length} dari {materials.length} Modul Selesai
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">Modul Tuntas</span>
              <strong className="text-base text-slate-900 dark:text-white">{completedMaterials.length} Modul</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">Tugas Dikirim</span>
              <strong className="text-base text-slate-900 dark:text-white">{submissions.length} Tugas</strong>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 block text-[10px]">Kuis Diikuti</span>
              <strong className="text-base text-slate-900 dark:text-white">{attempts.length} Percobaan</strong>
            </div>
          </div>
        </div>

        {/* 15 ATPH Categories Checklist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftar 15 Kompetensi Kejuruan ATPH
              </h3>
              <p className="text-xs text-slate-500">
                Status pembelajaran per kategori materi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, idx) => {
              const catMaterials = materials.filter((m) => m.categoryId === cat.id);
              const isAnyCompleted = catMaterials.some((m) =>
                currentUser ? DataProvider.isMaterialCompleted(currentUser.id, m.id) : false
              );

              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {catMaterials.length} Modul Tersedia
                      </p>
                    </div>
                  </div>

                  {isAnyCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </span>
                  ) : (
                    <Link
                      href="/student/materials"
                      className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 whitespace-nowrap"
                    >
                      Pelajari →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
