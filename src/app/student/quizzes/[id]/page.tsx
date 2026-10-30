'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  HelpCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  Send,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Quiz, QuizQuestion, QuizAttempt, UserProfile } from '@/types';

export default function StudentQuizTakerPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Quiz active state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<any | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'synced' | 'local_only' | 'failed'>('idle');
  const [syncErrorDetail, setSyncErrorDetail] = useState<string>('');
  const [quizStartTime] = useState<string>(new Date().toISOString());

  useEffect(() => {
    // 1. Ambil data sesi pengguna saat ini
    const user = DataProvider.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Coba cek dari session API cookie jika localStorage kosong
      fetch('/api/auth/student-session')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            DataProvider.setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    }

    const q = DataProvider.getQuizById(quizId);
    if (q) {
      setQuiz(q);
      setTimeLeft(q.durationMinutes * 60);
      const qList = DataProvider.getQuizQuestions(q.id);
      setQuestions(qList);
    }
  }, [quizId]);

  // Countdown timer ticker
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, answerValue: string) => {
    if (isSubmitted || isSubmitting) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting || isSubmitted) return;

    // Pastikan user aktif
    const activeUser = currentUser || DataProvider.getCurrentUser();
    if (!activeUser) {
      alert('Sesi Anda telah kedaluwarsa. Silakan masuk kembali ke portal siswa.');
      router.push('/login');
      return;
    }

    if (!quiz) return;

    setIsSubmitting(true);
    setSyncStatus('saving');
    setSyncErrorDetail('');

    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      userAnswer: selectedAnswers[q.id] || '',
    }));

    try {
      // 1. Kirim ke Server API untuk penilaian aman & penyimpanan ke Supabase
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          studentId: activeUser.id,
          studentName: activeUser.fullName,
          studentEmail: activeUser.email || '',
          studentNisn: activeUser.nisn || '-',
          className: activeUser.className || 'X ATPH',
          answers: formattedAnswers,
          startedAt: quizStartTime,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAttemptResult(data.attempt);
        setIsSubmitted(true);

        if (data.synced) {
          setSyncStatus('synced');
        } else {
          setSyncStatus('local_only');
          if (data.syncError) setSyncErrorDetail(data.syncError);
        }

        // Simpan juga ke DataProvider lokal sebagai sinkronisasi cadangan
        try {
          DataProvider.submitQuizAttempt(quiz.id, activeUser.id, formattedAnswers);
        } catch {}
      } else {
        // Fallback jika API route gagal
        throw new Error(data.error || 'Gagal mengirim data ke server');
      }
    } catch (err: any) {
      console.warn('Submission fallback to local:', err);
      // Fallback ke penyimpanan lokal aman
      const fallbackResult = DataProvider.submitQuizAttempt(quiz.id, activeUser.id, formattedAnswers);
      setAttemptResult(fallbackResult);
      setIsSubmitted(true);
      setSyncStatus('local_only');
      setSyncErrorDetail(err.message || 'Koneksi ke server terputus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetrySync = async () => {
    if (!attemptResult || !currentUser || !quiz) return;
    setSyncStatus('saving');
    setSyncErrorDetail('');

    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      userAnswer: selectedAnswers[q.id] || '',
    }));

    try {
      const response = await fetch('/api/quizzes/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          studentId: currentUser.id,
          studentName: currentUser.fullName,
          studentEmail: currentUser.email || '',
          studentNisn: currentUser.nisn || '-',
          className: currentUser.className || 'X ATPH',
          answers: formattedAnswers,
          startedAt: quizStartTime,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.synced) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('failed');
        setSyncErrorDetail(data.syncError || 'Gagal tersambung ke server');
      }
    } catch (err: any) {
      setSyncStatus('failed');
      setSyncErrorDetail(err.message || 'Koneksi gagal');
    }
  };

  if (!quiz) {
    return (
      <div className="flex-1 p-8 text-center text-xs text-slate-500">
        <p>Kuis tidak ditemukan.</p>
        <Link href="/student/quizzes" className="text-emerald-600 font-bold underline mt-2 inline-block">
          Kembali ke Daftar Kuis
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <DashboardHeader
        title={quiz.title}
        subtitle={`Kuis Evaluasi ATPH • Kelas ${quiz.targetClassName || 'Semua Kelas'}`}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {/* Top Floating Quiz Tracker */}
        <div className="p-4 rounded-2xl glass-panel flex items-center justify-between shadow-xs">
          <Link
            href="/student/quizzes"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar Kuis</span>
          </Link>

          {!isSubmitted && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-mono text-sm font-bold">
              <Clock className="w-4 h-4 animate-pulse" />
              <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
            </div>
          )}

          <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Terjawab: <span className="text-emerald-600">{answeredCount}</span> / {questions.length} Soal
          </div>
        </div>

        {/* QUIZ RESULT SCREEN (When submitted) */}
        {isSubmitted && attemptResult ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            {/* HONEST SERVER STORAGE STATUS BANNER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border text-xs">
              {syncStatus === 'saving' && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Menyimpan nilai ke server Supabase...</span>
                </div>
              )}

              {syncStatus === 'synced' && (
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Tersimpan ke server Supabase • Nilai otomatis tercatat di dashboard guru</span>
                </div>
              )}

              {syncStatus === 'local_only' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Belum tersinkronisasi ke server pusat (Nilai tersimpan aman di perangkat Anda).</span>
                  </div>
                  <button
                    onClick={handleRetrySync}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sinkronkan ke Server</span>
                  </button>
                </div>
              )}

              {syncStatus === 'failed' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-medium">
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Gagal menyimpan ke server {syncErrorDetail ? `(${syncErrorDetail})` : ''} — coba lagi</span>
                  </div>
                  <button
                    onClick={handleRetrySync}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Coba Lagi Sekarang</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Database className="w-3.5 h-3.5" />
                <span>ID Siswa: {currentUser?.id || attemptResult.studentId}</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div
                className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl ${
                  attemptResult.passed
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : 'bg-rose-600 shadow-rose-600/30'
                }`}
              >
                {attemptResult.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <div>
                <span
                  className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                    attemptResult.passed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  {attemptResult.passed ? 'Tuntas (Lulus KKM)' : 'Belum Tuntas (Perlu Remidi)'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3">
                  Skor Anda: {attemptResult.percentage} / 100
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  KKM Ketuntasan: {quiz.passingScore} • Nilai terhubung ke akun {currentUser?.fullName || attemptResult.studentName} ({currentUser?.className || 'X ATPH'})
                </p>
              </div>

              {/* Ringkasan Benar / Salah */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  Jawaban Benar: {attemptResult.correctCount ?? attemptResult.answers.filter((a: any) => a.isCorrect).length} Soal
                </div>
                <div className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold text-xs">
                  Jawaban Salah: {attemptResult.wrongCount ?? (questions.length - (attemptResult.correctCount ?? attemptResult.answers.filter((a: any) => a.isCorrect).length))} Soal
                </div>
              </div>
            </div>

            {/* Questions Review Breakdown */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pembahasan Hasil Pengerjaan Soal:
              </h3>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAnswer = attemptResult.answers.find((a: any) => a.questionId === q.id);
                  const isCorrect = userAnswer?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border text-xs space-y-3 ${
                        isCorrect
                          ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {idx + 1}. {q.questionText}
                        </p>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>+{q.points} Poin</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>0 Poin</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-[11px]">
                        <span className="text-slate-600 dark:text-slate-400">
                          Jawaban Anda: <strong className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>{userAnswer?.userAnswer || '(Tidak dijawab)'}</strong>
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          Kunci Benar: <strong className="text-emerald-600">{q.correctAnswer}</strong>
                        </span>
                      </div>

                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>Pembahasan Ilmiah:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link
                href="/student/quizzes"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Kembali ke Daftar Kuis
              </Link>
              <Link
                href="/student/grades"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                Lihat Nilai di Transkrip Saya
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE QUIZ QUESTION CARD */
          <div className="space-y-6">
            {/* Number Navigation Strip */}
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Card */}
            {currentQ && (
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <span className="font-bold uppercase tracking-wider text-emerald-600">
                    Soal Nomor {currentQuestionIndex + 1} dari {questions.length}
                  </span>
                  <span>Bobot: {currentQ.points} Poin</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.questionText}
                </h3>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ.options?.map((opt) => {
                    const isSelected = selectedAnswers[currentQ.id] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        disabled={isSubmitting}
                        onClick={() => handleSelectOption(currentQ.id, opt.id)}
                        className={`w-full p-4 rounded-2xl border text-left text-xs font-semibold flex items-center gap-4 transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 shadow-xs ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Navigation Buttons */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0 || isSubmitting}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                    >
                      <span>Berikutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyimpan ke Server...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim & Selesaikan Kuis</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
