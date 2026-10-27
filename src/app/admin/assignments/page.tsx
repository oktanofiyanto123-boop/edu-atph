'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  FileCheck2,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Inbox,
  CheckCircle,
  X,
  AlertCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Assignment, ClassItem, Submission } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    targetClassId: 'all',
    topic: '',
    startDate: '',
    dueDate: '',
    submissionType: 'text_and_file' as 'text_and_file' | 'file_only' | 'text_only',
    points: 100,
    status: 'published' as 'published' | 'draft' | 'closed',
  });
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    setAssignments(DataProvider.getAssignments());
    setClasses(DataProvider.getClasses());
    setSubmissions(DataProvider.getSubmissions());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingAssignment(null);
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    setFormData({
      title: '',
      description: '',
      instructions: '1. Pelajari panduan modul materi terkait\n2. Lakukan pengamatan atau perhitungan sesuai petunjuk\n3. Unggah laporan dalam format PDF atau ketik jawaban langsung',
      targetClassId: 'all',
      topic: '',
      startDate: `${today}T08:00`,
      dueDate: `${nextWeek}T23:59`,
      submissionType: 'text_and_file',
      points: 100,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormData({
      title: asg.title,
      description: asg.description,
      instructions: asg.instructions,
      targetClassId: asg.targetClassId,
      topic: asg.topic,
      startDate: asg.startDate.slice(0, 16),
      dueDate: asg.dueDate.slice(0, 16),
      submissionType: asg.submissionType,
      points: asg.points,
      status: asg.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedClass = classes.find((c) => c.id === formData.targetClassId);

    if (editingAssignment) {
      DataProvider.updateAssignment(editingAssignment.id, {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        targetClassId: formData.targetClassId,
        targetClassName: matchedClass?.name || 'Semua Kelas',
        topic: formData.topic,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        submissionType: formData.submissionType,
        points: Number(formData.points),
        status: formData.status,
      });
      showNotification('Tugas pembelajaran berhasil diperbarui');
    } else {
      DataProvider.addAssignment({
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        targetClassId: formData.targetClassId,
        targetClassName: matchedClass?.name || 'Semua Kelas',
        topic: formData.topic,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        submissionType: formData.submissionType,
        points: Number(formData.points),
        rubricCriteria: [
          { criteria: 'Kelengkapan Laporan', weight: 50, description: 'Sesuai instruksi pengerjaan' },
          { criteria: 'Analisis & Kesimpulan', weight: 50, description: 'Ketepatan hasil praktik' },
        ],
        status: formData.status,
      });
      showNotification('Tugas baru berhasil dibagikan kepada siswa');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus tugas "${title}"?`)) {
      DataProvider.deleteAssignment(id);
      showNotification(`Tugas "${title}" telah dihapus.`);
      loadData();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Manajemen Tugas Pembelajaran ATPH"
        subtitle="Rancang instruksi praktik, tenggat waktu, jenis lampiran, dan monitor progres pengumpulan"
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
              Daftar Tugas Siswa
            </h2>
            <p className="text-xs text-slate-500">Seluruh tugas praktik dan teori agribisnis tanaman</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tugas Baru</span>
          </button>
        </div>

        {/* Assignments Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((asg) => {
            const assignmentSubs = submissions.filter((s) => s.assignmentId === asg.id);
            const gradedCount = assignmentSubs.filter((s) => s.status === 'sudah_dinilai').length;
            const pendingCount = assignmentSubs.length - gradedCount;

            return (
              <div
                key={asg.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                      {asg.targetClassName || 'Semua Kelas'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {asg.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(asg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(asg.id, asg.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tenggat: <strong className="text-slate-800 dark:text-slate-200">{formatDate(asg.dueDate)}</strong></span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Maks {asg.points} Poin
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {assignmentSubs.length} Terkumpul
                    </span>
                    {pendingCount > 0 && (
                      <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {pendingCount} Perlu Dinilai
                      </span>
                    )}
                  </div>

                  <Link
                    href="/admin/submissions"
                    className="font-bold text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Periksa Pengumpulan</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL FORM TUGAS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingAssignment ? 'Edit Tugas Pembelajaran' : 'Buat Tugas Praktik Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Tugas Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Logbook Kalibrasi Nutrisi NFT Hari ke-3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas Sasaran *
                  </label>
                  <select
                    value={formData.targetClassId}
                    onChange={(e) => setFormData({ ...formData, targetClassId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Contoh: Nutrisi AB Mix & pH Meter"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan tugas yang dibaca siswa sebelum mulai..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Petunjuk & Instruksi Pengerjaan Rinci *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="1. Langkah kerja...\n2. Format laporan...\n3. Hal yang harus dilampirkan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Batas Waktu (Tenggat) *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Jawaban
                  </label>
                  <select
                    value={formData.submissionType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        submissionType: e.target.value as 'text_and_file' | 'file_only' | 'text_only',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="text_and_file">Teks & Unggah File</option>
                    <option value="file_only">Hanya Unggah File (PDF/Doc)</option>
                    <option value="text_only">Hanya Jawaban Teks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bobot Nilai Maksimal
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  {editingAssignment ? 'Perbarui Tugas' : 'Terbitkan Tugas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
