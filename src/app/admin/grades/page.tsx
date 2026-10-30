'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Award,
  Download,
  Filter,
  Search,
  CheckCircle,
  SlidersHorizontal,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { GradeRecord, ClassItem } from '@/types';
import { exportToCSV } from '@/lib/utils';

export default function AdminGradesPage() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Weight configuration (bobot nilai fleksibel)
  const [assignmentWeight, setAssignmentWeight] = useState(60);
  const [quizWeight, setQuizWeight] = useState(40);
  const [kkmThreshold, setKkmThreshold] = useState(75);
  const [showConfig, setShowConfig] = useState(false);

  const loadData = async () => {
    const baseGrades = DataProvider.getGrades();
    setClasses(DataProvider.getClasses());

    try {
      const res = await fetch('/api/admin/quiz-attempts', { cache: 'no-store' });
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Group attempts by studentId
        const attemptsByStudent = new Map<string, any[]>();
        json.data.forEach((att: any) => {
          const list = attemptsByStudent.get(att.studentId) || [];
          list.push(att);
          attemptsByStudent.set(att.studentId, list);
        });

        // Merge or inject real grades from Supabase attempts
        const updatedGrades = [...baseGrades];
        attemptsByStudent.forEach((attempts, studentId) => {
          const avgQuiz = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length);
          const firstAtt = attempts[0];
          const existingIdx = updatedGrades.findIndex(
            (g) => g.studentId === studentId || g.studentName.toLowerCase() === firstAtt.studentName.toLowerCase()
          );

          if (existingIdx !== -1) {
            updatedGrades[existingIdx] = {
              ...updatedGrades[existingIdx],
              quizAverage: avgQuiz,
              nisn: firstAtt.studentNisn && firstAtt.studentNisn !== '-' ? firstAtt.studentNisn : updatedGrades[existingIdx].nisn,
              className: firstAtt.className || updatedGrades[existingIdx].className,
              notes: `Mengerjakan ${attempts.length} kuis di Supabase. Rata-rata kuis: ${avgQuiz}.`,
            };
          } else {
            // New student from Supabase
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
              notes: `Tercatat di Supabase (${attempts.length} kuis dikerjakan).`,
            });
          }
        });

        setGrades(updatedGrades);
        return;
      }
    } catch (err) {
      console.warn('Failed to fetch remote quiz attempts for grades:', err);
    }

    setGrades(baseGrades);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredGrades = grades
    .filter((g) => {
      const matchesClass = selectedClass === 'all' || g.classId === selectedClass;
      const matchesSearch =
        g.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.nisn.includes(searchQuery);
      return matchesClass && matchesSearch;
    })
    .map((g) => {
      // Dynamic weight calculation
      const calculatedFinal = Math.round(
        (g.assignmentAverage * assignmentWeight + g.quizAverage * quizWeight) / 100
      );
      return {
        ...g,
        finalScore: calculatedFinal,
        status: calculatedFinal >= kkmThreshold ? ('Tuntas' as const) : ('Belum Tuntas' as const),
      };
    });

  const handleExportCSV = () => {
    const exportData = filteredGrades.map((g, idx) => ({
      No: idx + 1,
      Nama_Siswa: g.studentName,
      NISN: g.nisn,
      Kelas: g.className,
      Rata_Tugas: g.assignmentAverage,
      Rata_Kuis: g.quizAverage,
      Nilai_Akhir: g.finalScore,
      Status: g.status,
      Catatan_Guru: g.notes || '-',
    }));

    exportToCSV(`Rekap_Nilai_ATPH_${new Date().toISOString().slice(0, 10)}.csv`, exportData);
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Rekapitulasi Nilai Siswa ATPH"
        subtitle="Pantau nilai tugas, kuis, nilai akhir berbobot, dan ekspor data nilai resmi format CSV/Excel"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari siswa atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            >
              <option value="all">Semua Kelas ATPH</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Atur Bobot Nilai</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap (CSV/Excel)</span>
          </button>
        </div>

        {/* Dynamic Weight Setting Box */}
        {showConfig && (
          <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                Konfigurasi Pembobotan Nilai Akhir
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
            <p className="text-[11px] text-slate-500">
              Perubahan persentase bobot langsung dihitung dan diperbarui pada tabel di bawah ini secara realtime.
            </p>
          </div>
        )}

        {/* Grades Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Identitas Siswa</th>
                  <th className="py-4 px-6">Kelas</th>
                  <th className="py-4 px-6 text-center">Rata Tugas ({assignmentWeight}%)</th>
                  <th className="py-4 px-6 text-center">Rata Kuis ({quizWeight}%)</th>
                  <th className="py-4 px-6 text-center">Nilai Akhir</th>
                  <th className="py-4 px-6 text-center">Status Ketuntasan</th>
                  <th className="py-4 px-6">Catatan Pembelajaran Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredGrades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Tidak ada data nilai yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredGrades.map((g) => (
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
      </div>
    </div>
  );
}
