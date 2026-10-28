'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  HelpCircle,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Quiz, QuizAttempt, UserProfile } from '@/types';

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    // Published quizzes for student's class
    const list = DataProvider.getQuizzes().filter(
      (q) =>
        q.isPublished &&
        DataProvider.isClassMatch(q.targetClassId, user?.classId)
    );
    setQuizzes(list);

    if (user) {
      const myAttempts = DataProvider.getQuizAttempts(user.id);
      setAttempts(myAttempts);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Kuis & Evaluasi Pembelajaran ATPH"
        subtitle="Uji pemahaman konsep materi dan peroleh nilai instan terintegrasi dengan rapor siswa"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => {
            const quizAttempts = attempts.filter((a) => a.quizId === quiz.id);
            const bestAttempt = quizAttempts.sort((a, b) => b.percentage - a.percentage)[0];
            const attemptsLeft = quiz.maxAttempts - quizAttempts.length;

            return (
              <div
                key={quiz.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      {quiz.topic}
                    </span>
                    {bestAttempt ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                          bestAttempt.passed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Skor Terbaik: {bestAttempt.percentage}%</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Belum Dikerjakan
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Info stats */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Durasi</span>
                      <strong className="text-slate-800 dark:text-slate-200">{quiz.durationMinutes} Menit</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nilai KKM</span>
                      <strong className="text-emerald-600">{quiz.passingScore}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sisa Percobaan</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {attemptsLeft > 0 ? `${attemptsLeft}x` : 'Habis'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/student/quizzes/${quiz.id}`}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <span>{quizAttempts.length > 0 ? 'Kerjakan Ulang Kuis' : 'Mulai Kerjakan Kuis'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
