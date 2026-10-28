'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Video,
  FileText,
  Sparkles,
  Folder,
  FolderOpen,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { TeachingMaterial, MaterialCategory, UserProfile } from '@/types';

type GradeFolder = 'all' | 'X' | 'XI' | 'XII';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState<GradeFolder>('all');

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);
    setCategories(DataProvider.getCategories());

    // Auto-select folder matching student's grade level if available
    if (user?.className) {
      if (user.className.includes('XII')) setSelectedFolder('XII');
      else if (user.className.includes('XI')) setSelectedFolder('XI');
      else if (user.className.includes('X')) setSelectedFolder('X');
    }

    // Published materials
    const list = DataProvider.getMaterials().filter((m) => m.status === 'published');
    setMaterials(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate count per folder
  const countX = materials.filter(
    (m) => DataProvider.getMaterialGradeLevel(m.targetClassId, m.targetClassName) === 'X'
  ).length;

  const countXI = materials.filter(
    (m) => DataProvider.getMaterialGradeLevel(m.targetClassId, m.targetClassName) === 'XI'
  ).length;

  const countXII = materials.filter(
    (m) => DataProvider.getMaterialGradeLevel(m.targetClassId, m.targetClassName) === 'XII'
  ).length;

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || m.categoryId === selectedCategory;

    const gradeLevel = DataProvider.getMaterialGradeLevel(m.targetClassId, m.targetClassName);
    const matchesFolder = selectedFolder === 'all' || gradeLevel === selectedFolder;

    return matchesSearch && matchesCategory && matchesFolder;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen">
      <DashboardHeader
        title="Materi Pembelajaran ATPH"
        subtitle="Pelajari modul panduan teori dan praktik pertanian presisi sesuai folder kelas kejuruanmu"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* FOLDER NAVIGASI KELAS X, XI, XII */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Direktori Folder Materi Kejuruan ATPH
              </h2>
            </div>
            {selectedFolder !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedFolder('all')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Semua Folder ({materials.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* FOLDER KELAS X */}
            <button
              type="button"
              onClick={() => setSelectedFolder(selectedFolder === 'X' ? 'all' : 'X')}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group shadow-sm ${
                selectedFolder === 'X'
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 ring-4 ring-emerald-500/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/60 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                    selectedFolder === 'X'
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/30'
                      : 'bg-emerald-600/80 group-hover:bg-emerald-600'
                  }`}
                >
                  {selectedFolder === 'X' ? (
                    <FolderOpen className="w-6 h-6" />
                  ) : (
                    <Folder className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                    selectedFolder === 'X'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                  }`}
                >
                  {countX} Modul
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Fase E • Rombel X AT 1, 2, 3</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Folder Kelas X
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Dasar-Dasar Agribisnis Tanaman, Media Tanam (PDF), Benih & Bibit, Dasar Hidroponik NFT.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedFolder === 'X' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400'}>
                  {selectedFolder === 'X' ? '✓ Folder Sedang Dibuka' : 'Klik untuk Membuka Folder'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* FOLDER KELAS XI */}
            <button
              type="button"
              onClick={() => setSelectedFolder(selectedFolder === 'XI' ? 'all' : 'XI')}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group shadow-sm ${
                selectedFolder === 'XI'
                  ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 ring-4 ring-teal-500/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500/60 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                    selectedFolder === 'XI'
                      ? 'bg-gradient-to-tr from-teal-600 to-cyan-500 shadow-teal-600/30'
                      : 'bg-teal-600/80 group-hover:bg-teal-600'
                  }`}
                >
                  {selectedFolder === 'XI' ? (
                    <FolderOpen className="w-6 h-6" />
                  ) : (
                    <Folder className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                    selectedFolder === 'XI'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300'
                  }`}
                >
                  {countXI} Modul
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Fase F • Rombel XI AT 1, 2, 3</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Folder Kelas XI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Pembiakan Vegetatif (Okulasi & Grafting), Fertigasi Presisi Melon, PHT Cabai Merah.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedFolder === 'XI' ? 'text-teal-700 dark:text-teal-300' : 'text-slate-400'}>
                  {selectedFolder === 'XI' ? '✓ Folder Sedang Dibuka' : 'Klik untuk Membuka Folder'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* FOLDER KELAS XII */}
            <button
              type="button"
              onClick={() => setSelectedFolder(selectedFolder === 'XII' ? 'all' : 'XII')}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group shadow-sm ${
                selectedFolder === 'XII'
                  ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-4 ring-amber-500/10 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/60 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                    selectedFolder === 'XII'
                      ? 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-amber-600/30'
                      : 'bg-amber-600/80 group-hover:bg-amber-600'
                  }`}
                >
                  {selectedFolder === 'XII' ? (
                    <FolderOpen className="w-6 h-6" />
                  ) : (
                    <Folder className="w-6 h-6" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                    selectedFolder === 'XII'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {countXII} Modul
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-0.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Fase F • Rombel XII AT 1, 2, 3</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Folder Kelas XII
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Standardisasi Mutu Pascapanen SNI, Kemasan Vakum, Kelayakan Finansial & E-Commerce.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedFolder === 'XII' ? 'text-amber-700 dark:text-amber-300' : 'text-slate-400'}>
                  {selectedFolder === 'XII' ? '✓ Folder Sedang Dibuka' : 'Klik untuk Membuka Folder'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* STATUS FOLDER AKTIF */}
        {selectedFolder !== 'all' && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Menampilkan Berkas di Dalam: <span className="text-emerald-700 dark:text-emerald-300 font-extrabold">Folder Kelas {selectedFolder}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Ditemukan {filteredMaterials.length} modul materi pembelajaran.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFolder('all')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Tampilkan Semua
            </button>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul materi, topik, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          >
            <option value="all">Semua Kategori (15 Modul)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs space-y-2">
              <Folder className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p>Belum ada materi pembelajaran yang sesuai di folder ini.</p>
              {selectedFolder !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedFolder('all')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  Lihat Semua Folder
                </button>
              )}
            </div>
          ) : (
            filteredMaterials.map((mat) => {
              const isCompleted = currentUser
                ? DataProvider.isMaterialCompleted(currentUser.id, mat.id)
                : false;

              const gradeLevel = DataProvider.getMaterialGradeLevel(
                mat.targetClassId,
                mat.targetClassName
              );

              return (
                <div
                  key={mat.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-emerald-500/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Image */}
                    {mat.imageUrl && (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={mat.imageUrl}
                          alt={mat.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {/* Folder Tag */}
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black shadow-md ${
                              gradeLevel === 'XII'
                                ? 'bg-amber-600 text-white'
                                : gradeLevel === 'XI'
                                ? 'bg-teal-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            📁 Folder Kelas {gradeLevel}
                          </span>

                          {isCompleted && (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Selesai</span>
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                          {mat.categoryName}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {mat.targetClassName || `Kelas ${gradeLevel}`}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                        {mat.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {mat.description}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                        {mat.attachments && mat.attachments.length > 0 && (
                          <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold text-[11px] bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{mat.attachments.length} Berkas</span>
                          </span>
                        )}
                        {mat.videoUrl && (
                          <span className="flex items-center gap-1 text-rose-500 font-semibold text-[11px]">
                            <Video className="w-3.5 h-3.5" />
                            <span>Video</span>
                          </span>
                        )}
                        {mat.pdfUrl && !mat.attachments?.length && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4">
                    <Link
                      href={`/student/materials/${mat.id}`}
                      className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Buka Modul Belajar</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

