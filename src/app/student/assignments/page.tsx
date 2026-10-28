'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  FileCheck2,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Award,
  MessageSquare,
  X,
  Send,
  Sparkles,
  Paperclip,
  Trash2,
  Plus,
  Download,
  FileSpreadsheet,
  Image as ImageIcon,
  Presentation,
  FileArchive,
  FileUp,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { Assignment, Submission, SubmissionAttachment, UserProfile } from '@/types';
import { formatDate } from '@/lib/utils';
import FileBadge, { getFileStyle } from '@/components/common/FileBadge';
import { detectFileType, formatBytes } from '@/lib/storage';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Submit Modal State
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [textContent, setTextContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<SubmissionAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const user = DataProvider.getCurrentUser();
    setCurrentUser(user);

    // Published assignments for student's class
    const list = DataProvider.getAssignments().filter(
      (a) =>
        a.status === 'published' &&
        DataProvider.isClassMatch(a.targetClassId, user?.classId)
    );
    setAssignments(list);

    if (user) {
      const subs = DataProvider.getSubmissions().filter((s) => s.studentId === user.id);
      setSubmissions(subs);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenSubmit = (asg: Assignment) => {
    setActiveAssignment(asg);
    const existing = submissions.find((s) => s.assignmentId === asg.id);
    if (existing) {
      setTextContent(existing.textContent || '');
      if (existing.attachments && existing.attachments.length > 0) {
        setSelectedFiles(existing.attachments);
      } else if (existing.fileName) {
        setSelectedFiles([
          {
            id: 'att-existing',
            name: existing.fileName,
            fileUrl: existing.fileUrl || '',
            fileSize: existing.fileSize || '1.2 MB',
            fileType: (existing.fileType as any) || detectFileType(existing.fileName),
          },
        ]);
      } else {
        setSelectedFiles([]);
      }
    } else {
      setTextContent('');
      setSelectedFiles([]);
    }
    setSubmitModalOpen(true);
  };

  const processFileList = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const fileArray = Array.from(files);
    const processedAttachments: SubmissionAttachment[] = [];
    let processedCount = 0;

    fileArray.forEach((file) => {
      const type = detectFileType(file.name);
      const sizeStr = formatBytes(file.size);

      // Convert file into readable DataURL for session preview/download
      if (file.size <= 4 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          processedAttachments.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            fileUrl: (ev.target?.result as string) || URL.createObjectURL(file),
            fileSize: sizeStr,
            fileType: type,
          });
          processedCount++;
          if (processedCount === fileArray.length) {
            setSelectedFiles((prev) => [...prev, ...processedAttachments]);
            setIsProcessing(false);
          }
        };
        reader.onerror = () => {
          processedAttachments.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            fileUrl: URL.createObjectURL(file),
            fileSize: sizeStr,
            fileType: type,
          });
          processedCount++;
          if (processedCount === fileArray.length) {
            setSelectedFiles((prev) => [...prev, ...processedAttachments]);
            setIsProcessing(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        processedAttachments.push({
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          fileUrl: URL.createObjectURL(file),
          fileSize: sizeStr,
          fileType: type,
        });
        processedCount++;
        if (processedCount === fileArray.length) {
          setSelectedFiles((prev) => [...prev, ...processedAttachments]);
          setIsProcessing(false);
        }
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !currentUser) return;

    if (selectedFiles.length === 0 && !textContent.trim()) {
      showNotification('Mohon sertakan berkas tugas atau ketikkan ringkasan jawaban.');
      return;
    }

    const primaryFile = selectedFiles[0];

    DataProvider.submitAssignment({
      assignmentId: activeAssignment.id,
      assignmentTitle: activeAssignment.title,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      studentNisn: currentUser.nisn,
      classId: currentUser.classId,
      className: currentUser.className,
      textContent,
      fileName: primaryFile?.name || '',
      fileUrl: primaryFile?.fileUrl || '',
      fileSize: primaryFile?.fileSize || '',
      fileType: primaryFile?.fileType || 'other',
      attachments: selectedFiles,
    });

    showNotification(
      `Tugas berhasil dikirim ke guru! (${selectedFiles.length} berkas terlampir)`
    );
    setSubmitModalOpen(false);
    loadData();
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Tugas Pembelajaran ATPH"
        subtitle="Kerjakan instruksi praktik kejuruan, kirim dokumen laporan dalam berbagai format, dan pantau penilaian guru"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((asg) => {
            const submission = submissions.find((s) => s.assignmentId === asg.id);
            const isSubmitted = Boolean(submission);
            const isGraded = submission?.status === 'sudah_dinilai';

            return (
              <div
                key={asg.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      {asg.topic || 'Praktik ATPH'}
                    </span>
                    {isGraded ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Nilai: {submission.grade} / 100</span>
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        Sudah Terkumpul
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Belum Dikerjakan
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {asg.description}
                    </p>
                  </div>

                  {/* Petunjuk Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Instruksi Pengerjaan:
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                      {asg.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      Tenggat:{' '}
                      <strong className="text-slate-800 dark:text-slate-200">
                        {formatDate(asg.dueDate)}
                      </strong>
                    </span>
                  </div>

                  {/* Status Pengumpulan Siswa & Daftar Berkas */}
                  {isSubmitted && submission && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 text-[11px]">
                          Terkumpul: <strong>{formatDate(submission.submittedAt)}</strong>
                        </span>
                        {submission.attachments && submission.attachments.length > 0 && (
                          <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            {submission.attachments.length} Berkas Lampiran
                          </span>
                        )}
                      </div>

                      {/* Attached files list */}
                      {submission.attachments && submission.attachments.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {submission.attachments.map((att) => (
                            <a
                              key={att.id}
                              href={att.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:scale-[1.02] transition-transform"
                              title="Klik untuk membuka berkas di tab baru"
                            >
                              <FileBadge
                                fileName={att.name}
                                fileSize={att.fileSize}
                                fileType={att.fileType}
                              />
                            </a>
                          ))}
                        </div>
                      ) : submission.fileName ? (
                        <div className="pt-1">
                          <a
                            href={submission.fileUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:scale-[1.02] transition-transform inline-block"
                          >
                            <FileBadge
                              fileName={submission.fileName}
                              fileSize={submission.fileSize}
                              fileType={submission.fileType}
                            />
                          </a>
                        </div>
                      ) : null}

                      {submission.textContent && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-[10px] uppercase mb-1">
                            Uraian Jawaban Siswa:
                          </p>
                          <p className="whitespace-pre-line leading-relaxed">
                            {submission.textContent}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Guru Feedback if graded */}
                  {isGraded && submission?.feedback && (
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Catatan Evaluasi Guru (Okta Nofiyanto):</span>
                      </div>
                      <p className="text-emerald-950 dark:text-emerald-200 italic">
                        "{submission.feedback}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenSubmit(asg)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                      isSubmitted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {isSubmitted
                        ? 'Perbarui Pengumpulan / Tambah Berkas'
                        : 'Kumpulkan Tugas Sekarang'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL PENGUMPULAN TUGAS MULTI-FORMAT & MULTI-FILE */}
      {submitModalOpen && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Pengumpulan Tugas
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {activeAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Format Dukungan Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 space-y-2 text-xs">
                <p className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Mendukung Unggahan Berbagai Jenis File:</span>
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold">
                    📄 PDF (.pdf)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold">
                    📝 Word (.doc, .docx, .txt)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
                    📊 Excel / CSV (.xlsx, .xls, .csv)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold">
                    📽️ Presentasi (.ppt, .pptx)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold">
                    🖼️ Foto (.jpg, .jpeg, .png)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300 font-bold">
                    📦 Arsip (.zip, .rar)
                  </span>
                </div>
              </div>

              {/* Unggah Berkas Drag & Drop */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Berkas Lampiran Tugas ({selectedFiles.length} file dipilih)
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-2 transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01]'
                      : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <FileUp className="w-9 h-9 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Tarik & Letakkan Berkas di Sini, atau Pilih dari Perangkat
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Bisa memilih lebih dari 1 file sekaligus (maksimal 10 MB per berkas)
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.csv,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="student-multi-file-upload"
                  />
                  <label
                    htmlFor="student-multi-file-upload"
                    className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Komputer/HP</span>
                  </label>
                </div>

                {isProcessing && (
                  <p className="text-xs text-emerald-600 mt-2 font-bold animate-pulse">
                    Memproses berkas...
                  </p>
                )}

                {/* List of Attached Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      Daftar Berkas yang Akan Dikirim:
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedFiles.map((file) => {
                        const style = getFileStyle(file.fileType);
                        const Icon = style.icon;

                        return (
                          <div
                            key={file.id}
                            className={`flex items-center justify-between p-2.5 rounded-xl border ${style.bgClass} text-xs`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className={`w-4 h-4 shrink-0 ${style.colorClass}`} />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[240px] sm:max-w-xs">
                                  {file.name}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span className={`font-black uppercase ${style.colorClass}`}>
                                    {style.tag}
                                  </span>
                                  <span>• {file.fileSize}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFile(file.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Hapus berkas ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Jawaban Teks Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Uraian / Ringkasan Jawaban Teks (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Ketikkan ringkasan hasil pengamatan praktik, kendala lapangan, atau catatan untuk guru..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {selectedFiles.length > 0
                      ? `Kirim ${selectedFiles.length} Berkas ke Guru`
                      : 'Kirim Jawaban'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
