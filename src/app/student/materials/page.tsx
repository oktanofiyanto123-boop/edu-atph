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
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { TeachingMaterial, MaterialCategory, UserProfile } from '@/types';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<TeachingMaterial[]>([]);
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);
    setCategories(DataProvider.getCategories());

    // Only published materials for student's class
    const list = DataProvider.getMaterials().filter(
      (m) =>
        m.status === 'published' &&
        DataProvider.isClassMatch(m.targetClassId, user?.classId)
    );
    setMaterials(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Materi Pembelajaran ATPH"
        subtitle="Pelajari modul panduan teori dan praktik pertanian presisi sesuai kelas kejuruanmu"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
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
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              Belum ada materi pembelajaran yang diterbitkan untuk kategori ini.
            </div>
          ) : (
            filteredMaterials.map((mat) => {
              const isCompleted = currentUser
                ? DataProvider.isMaterialCompleted(currentUser.id, mat.id)
                : false;

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
                        <div className="absolute top-3 right-3">
                          {isCompleted ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Selesai</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white">
                              Belum Selesai
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
