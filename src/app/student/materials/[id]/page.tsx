'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Download,
  Video,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Award,
  Share2,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { TeachingMaterial, UserProfile } from '@/types';

export default function StudentMaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const materialId = params.id as string;

  const [material, setMaterial] = useState<TeachingMaterial | null>(null);
  const [allMaterials, setAllMaterials] = useState<TeachingMaterial[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    const mat = DataProvider.getMaterialById(materialId);
    if (mat) {
      setMaterial(mat);
      if (user) {
        setIsCompleted(DataProvider.isMaterialCompleted(user.id, mat.id));
      }
    }

    const list = DataProvider.getMaterials().filter((m) => m.status === 'published');
    setAllMaterials(list);
  }, [materialId]);

  const handleMarkCompleted = () => {
    if (!currentUser || !material) return;
    DataProvider.markMaterialCompleted(currentUser.id, material.id);
    setIsCompleted(true);
    setNotification('Modul pembelajaran ini telah ditandai selesai! Progres Anda tersimpan di database.');
    setTimeout(() => setNotification(null), 3500);
  };

  if (!material) {
    return (
      <div className="flex-1 p-8 text-center text-xs text-slate-500">
        <p>Materi pembelajaran tidak ditemukan.</p>
        <Link href="/student/materials" className="mt-4 inline-block text-emerald-600 font-bold underline">
          Kembali ke Daftar Materi
        </Link>
      </div>
    );
  }

  // Prev & Next navigation
  const currentIndex = allMaterials.findIndex((m) => m.id === material.id);
  const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
      <DashboardHeader
        title={material.title}
        subtitle={`${material.categoryName || 'ATPH'} • Topik: ${material.topic}`}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/student/materials"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Materi ATPH</span>
          </Link>

          <button
            onClick={handleMarkCompleted}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Sudah Selesai Dipelajari' : 'Tandai sebagai Selesai'}</span>
          </button>
        </div>

        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* Content Card Container */}
        <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          {/* Header Image */}
          {material.imageUrl && (
            <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
              <img
                src={material.imageUrl}
                alt={material.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-600">
                  {material.categoryName}
                </span>
                <h1 className="text-xl sm:text-3xl font-black leading-tight text-white">
                  {material.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-8">
            {/* Tujuan Pembelajaran Box */}
            {material.learningObjectives && material.learningObjectives.length > 0 && (
              <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Tujuan Pembelajaran Modul:</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-200 list-disc list-inside">
                  {material.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Video Player Embed (if YouTube available) */}
            {material.videoUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>Video Tutorial Praktik Lapangan:</span>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md">
                  <iframe
                    src={material.videoUrl}
                    title={material.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Main Reading Content (formatted typography) */}
            <div className="prose-atph whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {material.content}
            </div>

            {/* Lampiran PDF Section */}
            {(material.pdfUrl || (material.attachments && material.attachments.length > 0)) && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dokumen & Lampiran Materi PDF:
                </h4>
                <div className="space-y-2">
                  {material.pdfUrl && (
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Modul_Lengkap_{material.slug}.pdf
                          </p>
                          <p className="text-[10px] text-slate-400">Dokumen PDF Resmi</p>
                        </div>
                      </div>
                      <a
                        href={material.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh PDF</span>
                      </a>
                    </div>
                  )}

                  {material.attachments?.map((att) => (
                    <div key={att.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {att.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{att.fileSize}</p>
                        </div>
                      </div>
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Previous & Next Material Navigation */}
        <div className="flex items-center justify-between pt-4">
          {prevMaterial ? (
            <Link
              href={`/student/materials/${prevMaterial.id}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500/50 shadow-xs transition-all max-w-xs"
            >
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" />
                <span>Materi Sebelumnya</span>
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                {prevMaterial.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {nextMaterial ? (
            <Link
              href={`/student/materials/${nextMaterial.id}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right hover:border-emerald-500/50 shadow-xs transition-all max-w-xs"
            >
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-end gap-1">
                <span>Materi Berikutnya</span>
                <ChevronRight className="w-3 h-3" />
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                {nextMaterial.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
