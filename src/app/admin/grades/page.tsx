'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Award,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  FileSpreadsheet,
  AlertTriangle,
  Database,
  RefreshCw,
  Eye,
  X,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { GradeRecord, ClassItem, Quiz } from '@/types';
import { exportToCSV, formatDate, formatDateOnly } from '@/lib/utils';

export interface SupabaseQuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  className: string;
  studentNisn: string;
  subjectName: string;
  topic: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  passed: boolean;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  startedAt: string;
  completedAt: string;
  status: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsAwarded: number;
    explanation?: string;
  }>;
  source?: string;
}

export default function AdminGradesPage() {
  const [activeTab, setActiveTab] = useState<'attempts' | 'aggregated'>('attempts');
  const [attempts, setAttempts] = useState<SupabaseQuizAttempt[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedQuiz, setSelectedQuiz] = useState('all');
  const [sortBy, setSortBy] = useState<'highest' | 'lowest' | 'newest' | 'oldest'>('newest');

  // Modal State for viewing student attempt details
  const [selectedAttemptModal, setSelectedAttemptModal] = useState<SupabaseQuizAttempt | null>(null);

  // Weight configuration (bobot nilai fleksibel untuk tab rapor agregat)
  const [assignmentWeight, setAssignmentWeight] = useState(60);
  const [quizWeight, setQuizWeight] = useState(40);
  const [kkmThreshold, setKkmThreshold] = useState(75);
  const [showConfig, setShowConfig] = useState(false);

  const fetchGradesData = useCallback(async () => {
    setIsLoading(true);
    setClasses(DataProvider.getClasses());
    setQuizzes(DataProvider.getQuizzes());

    try {
      // 1. Ambil data nilai kuis langsung dari Supabase tabel quiz_attempts
      const res = await fetch('/api/admin/quiz-attempts', { cache: 'no-store' });
      const json = await res.json();

      let remoteAttempts: SupabaseQuizAttempt[] = [];
      if (res.ok && json.success && Array.isArray(json.data)) {
        remoteAttempts = json.data;
      }

      setAttempts(remoteAttempts);

      // 2. Sinkronkan nilai kuis Supabase ke dalam buku nilai agregat siswa
      const baseGrades = DataProvider.getGrades();
      if (remoteAttempts.length > 0) {
        const attemptsByStudent = new Map<string, SupabaseQuizAttempt[]>();
        remoteAttempts.forEach((att) => {
          const list = attemptsByStudent.get(att.studentId) || [];
          list.push(att);
          attemptsByStudent.set(att.studentId, list);
        });

        const updatedGrades = [...baseGrades];
        attemptsByStudent.forEach((studentAttempts, studentId) => {
          const avgQuiz = Math.round(
            studentAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / studentAttempts.length
          );
          const firstAtt = studentAttempts[0];
          const existingIdx = updatedGrades.findIndex(
            (g) => g.studentId === studentId || g.studentName.toLowerCase() === firstAtt.studentName.toLowerCase()
          );

          if (existingIdx !== -1) {
            updatedGrades[existingIdx] = {
              ...updatedGrades[existingIdx],
              quizAverage: avgQuiz,
              nisn: firstAtt.studentNisn && firstAtt.studentNisn !== '-' ? firstAtt.studentNisn : updatedGrades[existingIdx].nisn,
              className: firstAtt.className || updatedGrades[existingIdx].className,
              notes: `Mengerjakan ${studentAttempts.length} kuis di Supabase. Rata-rata kuis: ${avgQuiz}.`,
            };
          } else {
            updatedGrades.unshift({
              id: `grd-${studentId}`,
              studentId,
              studentName: firstAtt.studentName,
              nisn: firstAtt.studentNisn || '-',
              classId: 'cls-10-atph',
              className: firstAtt.className || 'X ATPH',
              assignmentAverage: 80,
              quizAverage: avgQuiz,
              finalScore: Math.round(80 * 0.6 + avgQuiz * 0.4),
              status: avgQuiz >= 75 ? 'Tuntas' : 'Belum Tuntas',
              notes: `Tercatat di Supabase (${studentAttempts.length} kuis dikerjakan).`,
            });
          }
        });
        setGrades(updatedGrades);
      } else {
        setGrades(baseGrades);
      }
    } catch (err) {
      console.warn('Failed to load grades from Supabase:', err);
      setGrades(DataProvider.getGrades());
    } finally {
      setIsLoading(false);
      setLastRefreshedAt(
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }
  }, []);

  useEffect(() => {
    fetchGradesData();
  }, [fetchGradesData]);

  // FILTERED ATTEMPTS (Tab 1: Hasil Penilaian Kuis Supabase)
  const filteredAttempts = useMemo(() => {
    return attempts
      .filter((att) => {
        const matchesSearch =
          att.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          att.studentNisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          att.studentId.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesClass =
          selectedClass === 'all' ||
          att.className.toLowerCase().includes(selectedClass.toLowerCase()) ||
          selectedClass.toLowerCase().includes(att.className.toLowerCase());

        const matchesQuiz = selectedQuiz === 'all' || att.quizId === selectedQuiz;

        return matchesSearch && matchesClass && matchesQuiz;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.score - a.score;
        if (sortBy === 'lowest') return a.score - b.score;
        if (sortBy === 'newest') return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
        if (sortBy === 'oldest') return new Date(a.completedAt || 0).getTime() - new Date(b.completedAt || 0).getTime();
        return 0;
      });
  }, [attempts, searchQuery, selectedClass, selectedQuiz, sortBy]);

  // FILTERED AGGREGATED GRADES (Tab 2: Rapor Agregat)
  const filteredAggregatedGrades = useMemo(() => {
    return grades
      .filter((g) => {
        const matchesClass = selectedClass === 'all' || g.classId === selectedClass;
        const matchesSearch =
          g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.nisn.includes(searchQuery);
        return matchesClass && matchesSearch;
      })
      .map((g) => {
        const calculatedFinal = Math.round(
          (g.assignmentAverage * assignmentWeight + g.quizAverage * quizWeight) / 100
        );
        return {
          ...g,
          finalScore: calculatedFinal,
          status: calculatedFinal >= kkmThreshold ? ('Tuntas' as const) : ('Belum Tuntas' as const),
        };
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.finalScore - a.finalScore;
        if (sortBy === 'lowest') return a.finalScore - b.finalScore;
        return 0;
      });
  }, [grades, searchQuery, selectedClass, assignmentWeight, quizWeight, kkmThreshold, sortBy]);

  // EKSPOR REKAP HASIL KUIS (EXCEL / CSV)
  const handleExportAttemptsCSV = () => {
    if (activeTab === 'attempts') {
      const exportData = filteredAttempts.map((att, idx) => ({
        No: idx + 1,
        ID_Pengerjaan: att.id,
        ID_Siswa: att.studentId,
        Nama_Siswa: att.studentName,
        NISN: att.studentNisn,
        Kelas: att.className,
        Mata_Pelajaran: att.subjectName || 'Dasar-Dasar Agribisnis Tanaman',
        Nama_Kuis_Materi: att.quizTitle,
        Nilai: att.score,
        Jumlah_Soal: att.totalQuestions || 20,
        Jumlah_Jawaban_Benar: att.correctCount,
        Jumlah_Jawaban_Salah: att.wrongCount,
        Tanggal_Pengerjaan: formatDateOnly(att.completedAt),
        Waktu_Pengerjaan: formatDate(att.completedAt),
        Status_Pengerjaan: att.score >= kkmThreshold ? 'Tuntas' : 'Belum Tuntas (Remidi)',
      }));

      exportToCSV(`Rekap_Hasil_Kuis_Supabase_${new Date().toISOString().slice(0, 10)}.csv`, exportData);
    } else {
      const exportData = filteredAggregatedGrades.map((g, idx) => ({
        No: idx + 1,
        ID_Siswa: g.studentId,
        Nama_Siswa: g.studentName,
        NISN: g.nisn,
        Kelas: g.className,
        Mata_Pelajaran: 'Dasar-Dasar Agribisnis Tanaman',
        Rata_Tugas: g.assignmentAverage,
        Rata_Kuis: g.quizAverage,
        Nilai_Akhir: g.finalScore,
        Status: g.status,
        Catatan_Guru: g.notes || '-',
      }));

      exportToCSV(`Rekap_Nilai_Rapor_ATPH_${new Date().toISOString().slice(0, 10)}.csv`, exportData);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <DashboardHeader
        title="Rekapitulasi Nilai Siswa ATPH"
        subtitle="Pantau hasil pengerjaan kuis siswa tersimpan permanen di Supabase, cetak rekapitulasi, dan lihat detail lembar jawaban"
        onRefresh={fetchGradesData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* TOP STATUS BAR & TAB SELECTOR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Tab Switcher */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
            <button
              onClick={() => setActiveTab('attempts')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'attempts'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Daftar Nilai Kuis (Live Supabase)</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'attempts' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {attempts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('aggregated')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'aggregated'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rekap Rapor Berbobot</span>
            </button>
          </div>

          {/* Live Sync Status Info */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Supabase Aktif</span>
              {lastRefreshedAt && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">({lastRefreshedAt} WIB)</span>}
            </div>

            <button
              onClick={fetchGradesData}
              disabled={isLoading}
              title="Refresh data dari Supabase"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS, SORTING & EXPORT */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama siswa atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            {/* Filter Kelas */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="all">Semua Kelas ATPH</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Filter Kuis (Khusus Tab Attempts) */}
            {activeTab === 'attempts' && (
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs max-w-[200px] truncate cursor-pointer"
              >
                <option value="all">Semua Kuis / Materi</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title}
                  </option>
                ))}
              </select>
            )}

            {/* Pengurutan (Sorting) */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
            >
              <option value="newest">Paling Baru Dikerjakan</option>
              <option value="oldest">Paling Lama Dikerjakan</option>
              <option value="highest">Nilai Tertinggi (100 - 0)</option>
              <option value="lowest">Nilai Terendah (0 - 100)</option>
            </select>

            {/* Tombol Atur Bobot (Khusus Tab Agregat) */}
            {activeTab === 'aggregated' && (
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Atur Bobot Rapor</span>
              </button>
            )}
          </div>

          {/* Tombol Ekspor Excel */}
          <button
            onClick={handleExportAttemptsCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel ({activeTab === 'attempts' ? 'Daftar Kuis' : 'Rapor'})</span>
          </button>
        </div>

        {/* Dynamic Weight Setting Box (Aggregated View) */}
        {activeTab === 'aggregated' && showConfig && (
          <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Konfigurasi Pembobotan Nilai Akhir Rapor
              </h4>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                Total: {assignmentWeight + quizWeight}%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bobot Tugas Praktik (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={assignmentWeight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAssignmentWeight(val);
                    setQuizWeight(100 - val);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bobot Kuis & Evaluasi (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={quizWeight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setQuizWeight(val);
                    setAssignmentWeight(100 - val);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Batas KKM Ketuntasan
                </label>
                <input
                  type="number"
                  min={50}
                  max={90}
                  value={kkmThreshold}
                  onChange={(e) => setKkmThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DAFTAR NILAI KUIS LIVE SUPABASE (TUGAS 2 & TUGAS 4) */}
        {activeTab === 'attempts' && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Menampilkan <strong>{filteredAttempts.length}</strong> hasil penilaian tersimpan di Supabase</span>
              </div>
              <span className="text-[11px] text-slate-400">Klik &quot;Lihat Detail&quot; untuk memeriksa lembar pengerjaan siswa</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-5">Siswa</th>
                    <th className="py-3.5 px-4">Kelas</th>
                    <th className="py-3.5 px-4">Mata Pelajaran</th>
                    <th className="py-3.5 px-5">Kuis / Materi</th>
                    <th className="py-3.5 px-4 text-center">Soal</th>
                    <th className="py-3.5 px-4 text-center">Benar / Salah</th>
                    <th className="py-3.5 px-4 text-center">Nilai</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Waktu Pengerjaan</th>
                    <th className="py-3.5 px-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredAttempts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-16 text-center text-slate-400 space-y-3">
                        <Database className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                        <p className="font-semibold text-slate-600 dark:text-slate-300">
                          {isLoading ? 'Sedang mengambil data dari Supabase...' : 'Belum ada hasil penilaian kuis yang sesuai di Supabase.'}
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                          Ketika siswa menyelesaikan kuis melalui portal siswa, nilai, rincian jawaban, dan waktu pengerjaan akan tersimpan secara otomatis di sini.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAttempts.map((att) => {
                      const isPassed = att.score >= kkmThreshold || att.passed || att.isPassed;
                      const correctCount = att.correctCount ?? (att.answers?.filter((a) => a.isCorrect).length || Math.round((att.score / 100) * 20));
                      const totalQ = att.totalQuestions || 20;
                      const wrongCount = att.wrongCount ?? Math.max(0, totalQ - correctCount);

                      return (
                        <tr key={att.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          {/* Identitas Siswa */}
                          <td className="py-3.5 px-5">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {att.studentName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              NISN: {att.studentNisn || '-'}
                            </p>
                          </td>

                          {/* Kelas */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                              {att.className || 'X ATPH'}
                            </span>
                          </td>

                          {/* Mata Pelajaran */}
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium text-[11px] max-w-[150px] truncate">
                            {att.subjectName || 'Dasar-Dasar Agribisnis Tanaman'}
                          </td>

                          {/* Kuis / Materi */}
                          <td className="py-3.5 px-5 max-w-[220px]">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {att.quizTitle}
                            </p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                              ID: {att.id.slice(0, 16)}...
                            </p>
                          </td>

                          {/* Jumlah Soal */}
                          <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                            {totalQ} Soal
                          </td>

                          {/* Benar / Salah */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                                {correctCount} B
                              </span>
                              <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                                {wrongCount} S
                              </span>
                            </div>
                          </td>

                          {/* Nilai Akhir */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={`text-base font-black ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {att.score}
                            </span>
                            <span className="text-[10px] text-slate-400 block">/ 100</span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isPassed
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              }`}
                            >
                              {isPassed ? 'Tuntas' : 'Remidi'}
                            </span>
                          </td>

                          {/* Tanggal & Jam */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap text-[11px] text-slate-500">
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                              {formatDateOnly(att.completedAt || att.startedAt)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(att.completedAt || att.startedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </p>
                          </td>

                          {/* Aksi: Buka Detail */}
                          <td className="py-3.5 px-5 text-center whitespace-nowrap">
                            <button
                              onClick={() => setSelectedAttemptModal(att)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Lihat Detail</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: REKAP NILAI RAPOR BERBOBOT (AGREGAT) */}
        {activeTab === 'aggregated' && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Identitas Siswa</th>
                    <th className="py-4 px-6">Kelas</th>
                    <th className="py-4 px-6 text-center">Rata Tugas ({assignmentWeight}%)</th>
                    <th className="py-4 px-6 text-center">Rata Kuis ({quizWeight}%)</th>
                    <th className="py-4 px-6 text-center">Nilai Akhir Rapor</th>
                    <th className="py-4 px-6 text-center">Status Ketuntasan</th>
                    <th className="py-4 px-6">Catatan Pembelajaran Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredAggregatedGrades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Tidak ada data nilai rapor yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredAggregatedGrades.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {g.studentName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            NISN: {g.nisn}
                          </p>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">
                          {g.className}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-800 dark:text-slate-200">
                          {g.assignmentAverage}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-800 dark:text-slate-200">
                          {g.quizAverage}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                            {g.finalScore}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              g.status === 'Tuntas'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {g.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 max-w-xs text-slate-500 text-[11px]">
                          {g.notes || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL HASIL PENGERJAAN SISWA (TUGAS 4) */}
      {selectedAttemptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Detail Lembar Jawaban Siswa • Database Supabase
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedAttemptModal.studentName} ({selectedAttemptModal.className})
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedAttemptModal.quizTitle} • {formatDate(selectedAttemptModal.completedAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedAttemptModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Score Summary Banner */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Nilai Akhir</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {selectedAttemptModal.score} <span className="text-xs text-slate-400">/ 100</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Jawaban Benar</span>
                <span className="text-2xl font-black text-emerald-600">
                  {selectedAttemptModal.correctCount} Soal
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Jawaban Salah</span>
                <span className="text-2xl font-black text-rose-600">
                  {selectedAttemptModal.wrongCount} Soal
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Status KKM</span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold mt-1 ${
                  selectedAttemptModal.score >= kkmThreshold
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {selectedAttemptModal.score >= kkmThreshold ? 'Tuntas' : 'Perlu Remidi'}
                </span>
              </div>
            </div>

            {/* Modal Question Breakdown List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Rincian Evaluasi Soal demi Soal ({selectedAttemptModal.answers?.length || 0} Soal):
              </h4>

              {(!selectedAttemptModal.answers || selectedAttemptModal.answers.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Rincian lembar jawaban per nomor tidak tersedia untuk kuis ini.
                </div>
              ) : (
                selectedAttemptModal.answers.map((ans, idx) => (
                  <div
                    key={ans.questionId || idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                      ans.isCorrect
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-slate-900 dark:text-white leading-relaxed">
                        {idx + 1}. {ans.questionText}
                      </p>
                      {ans.isCorrect ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                          <CheckCircle className="w-3 h-3" />
                          <span>+{ans.pointsAwarded || 5} Poin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                          <XCircle className="w-3 h-3" />
                          <span>0 Poin</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
                      <span className="text-slate-600 dark:text-slate-400">
                        Jawaban Siswa: <strong className={ans.isCorrect ? 'text-emerald-600' : 'text-rose-600'}>{ans.userAnswer || '(Kosong / Tidak Menjawab)'}</strong>
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        Kunci Benar: <strong className="text-emerald-600">{ans.correctAnswer}</strong>
                      </span>
                    </div>

                    {ans.explanation && (
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong>Pembahasan:</strong> {ans.explanation}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end">
              <button
                onClick={() => setSelectedAttemptModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
