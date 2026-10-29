'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ExternalLink,
  Eye,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { TeachingMaterial, UserProfile } from '@/types';

function FormattedContent({ content }: { content: string }) {
  const blocks = useMemo(() => {
    const rawLines = content.split('\n');
    const result: Array<
      | { type: 'h1'; text: string }
      | { type: 'h2'; text: string }
      | { type: 'h3'; text: string }
      | { type: 'h4'; text: string }
      | { type: 'hr' }
      | { type: 'image_callout'; text: string }
      | { type: 'table'; headers: string[]; rows: string[][] }
      | { type: 'list'; items: string[]; ordered: boolean }
      | { type: 'p'; text: string }
    > = [];

    let i = 0;
    while (i < rawLines.length) {
      const line = rawLines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      if (line === '---') {
        result.push({ type: 'hr' });
        i++;
        continue;
      }

      if (line.startsWith('# ')) {
        result.push({ type: 'h1', text: line.slice(2).trim() });
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        result.push({ type: 'h2', text: line.slice(3).trim() });
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        result.push({ type: 'h3', text: line.slice(4).trim() });
        i++;
        continue;
      }

      if (line.startsWith('#### ')) {
        result.push({ type: 'h4', text: line.slice(5).trim() });
        i++;
        continue;
      }

      // Image or figure callout: *(Gambar ...)* or (Gambar ...)
      if (
        (line.startsWith('*(') && line.endsWith(')*')) ||
        (line.startsWith('(') && line.includes('Gambar') && line.endsWith(')'))
      ) {
        const text = line.replace(/^\*\(/, '(').replace(/\)\*$/, ')');
        result.push({ type: 'image_callout', text });
        i++;
        continue;
      }

      // Table block: starts with |
      if (line.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|')) {
          tableLines.push(rawLines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const parseRow = (r: string) =>
            r
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim());
          const headers = parseRow(tableLines[0]);
          // filter out separator line |---|---|
          const contentRows = tableLines.slice(1).filter((l) => !l.includes('---'));
          const rows = contentRows.map(parseRow);
          result.push({ type: 'table', headers, rows });
        }
        continue;
      }

      // List items
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const items: string[] = [];
        while (i < rawLines.length && (rawLines[i].trim().startsWith('- ') || rawLines[i].trim().startsWith('* '))) {
          items.push(rawLines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        result.push({ type: 'list', items, ordered: false });
        continue;
      }

      // Regular paragraph
      result.push({ type: 'p', text: line });
      i++;
    }

    return result;
  }, [content]);

  const renderInline = (str: string) => {
    // Replace markdown bold **text** and links
    const parts = str.split(/(\*\*.*?\*\*|https?:\/\/[^\s)]+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        const isYoutube = part.includes('youtube.com') || part.includes('youtu.be');
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 break-all ${
              isYoutube
                ? 'text-red-600 hover:text-red-700 dark:text-red-400 font-bold'
                : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {isYoutube ? '▶ Buka Video di YouTube' : part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {blocks.map((b, idx) => {
        if (b.type === 'hr') {
          return <hr key={idx} className="my-6 border-slate-200 dark:border-slate-800" />;
        }
        if (b.type === 'h1') {
          return (
            <h1
              key={idx}
              className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-3 pb-1"
            >
              {renderInline(b.text)}
            </h1>
          );
        }
        if (b.type === 'h2') {
          return (
            <h2
              key={idx}
              className="text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-300 pt-5 pb-1.5 border-b border-emerald-100 dark:border-emerald-900/60"
            >
              {renderInline(b.text)}
            </h2>
          );
        }
        if (b.type === 'h3') {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pt-4">
              {renderInline(b.text)}
            </h3>
          );
        }
        if (b.type === 'h4') {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 pt-2.5">
              {renderInline(b.text)}
            </h4>
          );
        }
        if (b.type === 'image_callout') {
          return (
            <div
              key={idx}
              className="my-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 italic flex items-start gap-2.5 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{renderInline(b.text)}</span>
            </div>
          );
        }
        if (b.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <tr>
                    {b.headers.map((h, i) => (
                      <th key={i} className="p-3 font-bold border border-slate-200 dark:border-slate-700">
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {b.rows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {row.map((cell, ci) => (
                        <td key={ci} className="p-3 border border-slate-200 dark:border-slate-700 align-top">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (b.type === 'list') {
          return (
            <ul key={idx} className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {b.items.map((item, ii) => (
                <li key={ii} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}

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
  const [viewTab, setViewTab] = useState<'reader' | 'pdf'>('reader');

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

  // Pure PDF mode only when no text content was written
  const isPdfOnly = !!material.pdfUrl && !material.content;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 min-h-screen">
      <DashboardHeader
        title={material.title}
        subtitle={`${material.categoryName || 'ATPH'} • Topik: ${material.topic}`}
      />

      {/* Fullscreen Overlay Mode for PDF */}
      {isFullscreen && !!material.pdfUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col p-2 sm:p-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold truncate max-w-md sm:max-w-xl">
                {material.title}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                Layar Penuh PDF
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={material.pdfUrl}
                download
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
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
            : 'p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full'
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
                {material.pdfUrl && (
                  <span className="text-[10px] font-bold text-slate-400">
                    • Berkas PDF Resmi
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {material.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {material.pdfUrl && (
              <>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Lihat Layar Penuh Dokumen PDF"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Layar Penuh PDF</span>
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

        {/* View Mode Switcher if both Content and PDF exist */}
        {material.content && material.pdfUrl && (
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl w-fit">
            <button
              onClick={() => setViewTab('reader')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                viewTab === 'reader'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Mode Baca Lengkap (24 Halaman)</span>
            </button>
            <button
              onClick={() => setViewTab('pdf')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                viewTab === 'pdf'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Dokumen PDF Asli</span>
            </button>
          </div>
        )}

        {/* IF PDF ONLY: SHOW PURE LARGE PDF VIEWER */}
        {isPdfOnly || (material.pdfUrl && viewTab === 'pdf') ? (
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
          /* STANDARD FULL READING MODE */
          <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {material.imageUrl && (
              <div className="relative h-60 sm:h-80 w-full overflow-hidden bg-slate-900">
                <img
                  src={material.imageUrl}
                  alt={material.title}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-600">
                    {material.categoryName}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black leading-tight text-white">
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
                <div className="pt-2">
                  <FormattedContent content={material.content} />
                </div>
              )}

              {/* Attachments / Berkas Lampiran */}
              {material.attachments && material.attachments.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Berkas Lampiran ({material.attachments.length} File):</span>
                  </div>
                  <div className="grid gap-2">
                    {material.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-all"
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
