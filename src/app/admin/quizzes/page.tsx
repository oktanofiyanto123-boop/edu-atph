'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Award,
  CheckCircle,
  X,
  ListOrdered,
  Sparkles,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Quiz, QuizQuestion, ClassItem } from '@/types';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    targetClassId: 'all',
    topic: '',
    durationMinutes: 20,
    maxAttempts: 2,
    passingScore: 75,
    isPublished: true,
  });

  // Question Modal State
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    questionType: 'multiple_choice' as 'multiple_choice' | 'true_false' | 'short_answer' | 'essay',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    points: 20,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    setQuizzes(DataProvider.getQuizzes());
    setClasses(DataProvider.getClasses());
    setQuestions(DataProvider.getQuizQuestions());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAddQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      title: '',
      description: '',
      targetClassId: 'all',
      topic: '',
      durationMinutes: 20,
      maxAttempts: 2,
      passingScore: 75,
      isPublished: true,
    });
    setQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (q: Quiz) => {
    setEditingQuiz(q);
    setQuizForm({
      title: q.title,
      description: q.description,
      targetClassId: q.targetClassId,
      topic: q.topic,
      durationMinutes: q.durationMinutes,
      maxAttempts: q.maxAttempts,
      passingScore: q.passingScore,
      isPublished: q.isPublished,
    });
    setQuizModalOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedClass = classes.find((c) => c.id === quizForm.targetClassId);

    if (editingQuiz) {
      DataProvider.updateQuiz(editingQuiz.id, {
        ...quizForm,
        targetClassName: matchedClass?.name || 'Semua Kelas',
      });
      showNotification('Kuis evaluasi berhasil diperbarui');
    } else {
      DataProvider.addQuiz({
        ...quizForm,
        targetClassName: matchedClass?.name || 'Semua Kelas',
        questionCount: 0,
      });
      showNotification('Kuis baru berhasil dibuat');
    }

    setQuizModalOpen(false);
    loadData();
  };

  const handleDeleteQuiz = (id: string, title: string) => {
    if (confirm(`Hapus kuis "${title}"?`)) {
      DataProvider.deleteQuiz(id);
      showNotification(`Kuis "${title}" telah dihapus.`);
      loadData();
    }
  };

  const handleOpenAddQuestion = (quizId: string) => {
    setSelectedQuizId(quizId);
    setQuestionForm({
      questionText: '',
      questionType: 'multiple_choice',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
      points: 20,
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.questionText) return;

    let options = undefined;
    if (questionForm.questionType === 'multiple_choice') {
      options = [
        { id: 'A', text: questionForm.optionA },
        { id: 'B', text: questionForm.optionB },
        { id: 'C', text: questionForm.optionC },
        { id: 'D', text: questionForm.optionD },
      ];
    } else if (questionForm.questionType === 'true_false') {
      options = [
        { id: 'true', text: 'Benar' },
        { id: 'false', text: 'Salah' },
      ];
    }

    DataProvider.addQuizQuestion({
      quizId: selectedQuizId,
      questionText: questionForm.questionText,
      questionType: questionForm.questionType,
      options,
      correctAnswer: questionForm.correctAnswer,
      explanation: questionForm.explanation,
      points: Number(questionForm.points),
      orderIndex: questions.filter((q) => q.quizId === selectedQuizId).length + 1,
    });

    showNotification('Butir soal berhasil ditambahkan ke kuis');
    setQuestionModalOpen(false);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Manajemen Kuis & Evaluasi ATPH"
        subtitle="Rancang kuis pilihan ganda, benar/salah, isian, serta atur kunci jawaban dan auto-grading"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Daftar Kuis Pembelajaran
            </h2>
            <p className="text-xs text-slate-500">Evaluasi pemahaman siswa dengan penilaian instan otomatis</p>
          </div>
          <button
            onClick={handleOpenAddQuiz}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kuis Baru</span>
          </button>
        </div>

        {/* Quizzes List Cards */}
        <div className="space-y-6">
          {quizzes.map((quiz) => {
            const quizQuestions = questions.filter((q) => q.quizId === quiz.id);

            return (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                        {quiz.targetClassName || 'Semua Kelas'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Topik: {quiz.topic}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{quiz.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAddQuestion(quiz.id)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Soal</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditQuiz(quiz)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Durasi: <strong>{quiz.durationMinutes} Menit</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Passing Score (KKM): <strong>{quiz.passingScore}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-teal-600" />
                    <span>Jumlah Soal: <strong>{quizQuestions.length} Butir</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Maks Percobaan: <strong>{quiz.maxAttempts}x</strong></span>
                  </div>
                </div>

                {/* Questions Preview Accordion */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Daftar Soal Kuis ({quizQuestions.length}):
                  </p>
                  <div className="space-y-2">
                    {quizQuestions.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        Belum ada soal ditambahkan. Klik tombol "Tambah Soal" untuk membuat soal pilihan ganda.
                      </p>
                    ) : (
                      quizQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {idx + 1}. {q.questionText}
                            </p>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              {q.points} Poin
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Kunci Jawaban: <strong className="text-emerald-600">{q.correctAnswer}</strong> • Tipe: {q.questionType}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL BUAT / EDIT KUIS */}
      {quizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingQuiz ? 'Edit Kuis Evaluasi' : 'Buat Kuis Evaluasi Baru'}
              </h3>
              <button
                onClick={() => setQuizModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Kuis *
                </label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="Contoh: Evaluasi Tengah Semester Hidroponik NFT"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas Sasaran
                  </label>
                  <select
                    value={quizForm.targetClassId}
                    onChange={(e) => setQuizForm({ ...quizForm, targetClassId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="all">Semua Kelas</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Topik Pembelajaran
                  </label>
                  <input
                    type="text"
                    value={quizForm.topic}
                    onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })}
                    placeholder="Sistem Hidroponik"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={quizForm.durationMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nilai KKM
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={quizForm.passingScore}
                    onChange={(e) => setQuizForm({ ...quizForm, passingScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Maks Percobaan
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={quizForm.maxAttempts}
                    onChange={(e) => setQuizForm({ ...quizForm, maxAttempts: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Petunjuk Pengerjaan
                </label>
                <textarea
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Pilihlah salah satu jawaban yang paling tepat..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Simpan Kuis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH BUTIR SOAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tambah Soal Kuis Baru
              </h3>
              <button
                onClick={() => setQuestionModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teks Soal Pertanyaan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  placeholder="Tuliskan butir soal di sini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Soal
                  </label>
                  <select
                    value={questionForm.questionType}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        questionType: e.target.value as 'multiple_choice' | 'true_false',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  >
                    <option value="multiple_choice">Pilihan Ganda (A, B, C, D)</option>
                    <option value="true_false">Benar / Salah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bobot Poin Soal
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({ ...questionForm, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              {questionForm.questionType === 'multiple_choice' && (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Opsi Pilihan Jawaban:
                  </p>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Pilihan A</label>
                    <input
                      type="text"
                      required
                      value={questionForm.optionA}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Pilihan B</label>
                    <input
                      type="text"
                      required
                      value={questionForm.optionB}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Pilihan C</label>
                    <input
                      type="text"
                      required
                      value={questionForm.optionC}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500">Pilihan D</label>
                    <input
                      type="text"
                      required
                      value={questionForm.optionD}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kunci Jawaban Benar *
                </label>
                {questionForm.questionType === 'multiple_choice' ? (
                  <select
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-emerald-600"
                  >
                    <option value="A">Pilihan A</option>
                    <option value="B">Pilihan B</option>
                    <option value="C">Pilihan C</option>
                    <option value="D">Pilihan D</option>
                  </select>
                ) : (
                  <select
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-emerald-600"
                  >
                    <option value="true">Benar</option>
                    <option value="false">Salah</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pembahasan / Penjelasan Jawaban
                </label>
                <textarea
                  rows={2}
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  placeholder="Penjelasan ilmiah yang muncul saat pembahasan soal..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
                >
                  Simpan Butir Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
