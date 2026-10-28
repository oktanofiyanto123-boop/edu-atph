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
  ExternalLink,
  Eye,
  Maximize2,
  Minimize2,
  X,
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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
  // Only show PDF viewer mode when the material is genuinely PDF-only
  // (has a pdfUrl but no rich text content, no video, and no learning objectives)
  const isPdfOnly = !!material.pdfUrl && !material.content && !material.videoUrl && (!material.learningObjectives || material.learningObjectives.length === 0);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen">
      <DashboardHeader
        title={material.title}
        subtitle={`${material.categoryName || 'ATPH'} • Topik: ${material.topic}`}
      />

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && isPdfOnly && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-2 sm:p-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold truncate max-w-md sm:max-w-xl">
                {material.title}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                Layar Penuh
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={material.pdfUrl}
                download
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh</span>
              </a>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Tutup Layar Penuh</span>
              </button>
            </div>
          </div>
          <div className="flex-1 w-full mt-2 rounded-xl overflow-hidden bg-slate-900">
            <iframe
              src={`${material.pdfUrl}#toolbar=1&navpanes=1&zoom=page-fit`}
              title={`PDF Viewer - ${material.title}`}
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      <div
        className={
          isPdfOnly
            ? 'p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full'
            : 'p-6 sm:p-8 space-y-8 max-w-4xl mx-auto w-full'
        }
      >
        {/* Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/student/materials"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Katalog</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {material.categoryName || 'ATPH'}
                </span>
                {isPdfOnly && (
                  <span className="text-[10px] font-bold text-slate-400">
                    • Dokumen PDF Resmi
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {material.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {isPdfOnly && (
              <>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Lihat Layar Penuh"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Layar Penuh</span>
                </button>
                <a
                  href={material.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tab Baru</span>
                </a>
                <a
                  href={material.pdfUrl}
                  download
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </a>
              </>
            )}

            <button
              onClick={handleMarkCompleted}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Selesai' : 'Tandai Selesai'}</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        {/* IF PDF AVAILABLE: SHOW PURE LARGE PDF VIEWER FILLING SCREEN */}
        {isPdfOnly ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="relative w-full h-[85vh] min-h-[750px] bg-slate-900">
              <iframe
                src={`${material.pdfUrl}#toolbar=1&navpanes=1&zoom=page-width`}
                title={`PDF Viewer - ${material.title}`}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : (
          /* STANDARD TEXT / VIDEO MODULE */
          <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
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

              {material.content && (
                <div className="prose-atph whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {material.content}
                </div>
              )}

              {/* Embedded PDF Viewer (for materials with both content AND pdfUrl) */}
              {!isPdfOnly && material.pdfUrl && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Dokumen PDF Modul Pembelajaran:</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900">
                    <div className="relative w-full h-[60vh] min-h-[500px]">
                      <iframe
                        src={`${material.pdfUrl}#toolbar=1&navpanes=1&zoom=page-width`}
                        title={`PDF Viewer - ${material.title}`}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={material.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka di Tab Baru</span>
                    </a>
                    <a
                      href={material.pdfUrl}
                      download
                      className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh PDF</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Attachments / Berkas Lampiran */}
              {material.attachments && material.attachments.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Berkas Lampiran ({material.attachments.length} File):</span>
                  </div>
                  <div className="grid gap-2">
                    {material.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {att.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {att.fileSize} • {att.fileType.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                            title="Buka file di tab baru"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Buka</span>
                          </a>
                          <a
                            href={att.fileUrl}
                            download={att.name}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                            title="Unduh file ke perangkat"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        )}

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
