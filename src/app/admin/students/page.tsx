'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  KeyRound,
  GraduationCap,
  X,
  Mail,
  ShieldAlert,
  FileSpreadsheet,
  Download,
  UploadCloud,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';
import { DataProvider } from '@/lib/data-provider';
import { UserProfile, ClassItem } from '@/types';
import { formatDate } from '@/lib/utils';
import * as XLSX from 'xlsx';

interface ParsedStudentRow {
  fullName: string;
  email: string;
  nisn: string;
  className: string;
  classId: string;
  major: string;
  isValid: boolean;
  validationError?: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  // Single Student Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nisn: '',
    classId: '',
    major: 'Agribisnis Tanaman Pangan dan Hortikultura',
  });

  // Batch Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = () => {
    const allUsers = DataProvider.getUsers();
    setStudents(allUsers.filter((u) => u.role === 'student'));
    setClasses(DataProvider.getClasses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nisn && s.nisn.includes(searchQuery));
    const matchesClass =
      selectedClass === 'all' ||
      s.classId === selectedClass ||
      s.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Single Student Actions
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      fullName: '',
      email: '',
      nisn: '',
      classId: classes[0]?.id || 'cls-x-at-1',
      major: 'Agribisnis Tanaman Pangan dan Hortikultura',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: UserProfile) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      nisn: student.nisn || '',
      classId: student.classId || classes[0]?.id || '',
      major: student.major || 'Agribisnis Tanaman Pangan dan Hortikultura',
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      showNotification('Nama lengkap dan email wajib diisi', 'error');
      return;
    }

    const matchedClass = classes.find((c) => c.id === formData.classId);

    if (editingStudent) {
      DataProvider.updateUser(editingStudent.id, {
        fullName: formData.fullName,
        email: formData.email,
        nisn: formData.nisn,
        classId: formData.classId,
        className: matchedClass?.name || 'X AT 1',
        major: formData.major,
      });
      showNotification('Data siswa berhasil diperbarui');
    } else {
      DataProvider.addUser({
        fullName: formData.fullName,
        email: formData.email,
        nisn: formData.nisn,
        role: 'student',
        classId: formData.classId,
        className: matchedClass?.name || 'X AT 1',
        major: formData.major,
        isActive: true,
      });
      showNotification('Siswa baru berhasil didaftarkan');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleToggleStatus = (id: string, name: string) => {
    DataProvider.toggleUserStatus(id);
    loadData();
    showNotification(`Status akun ${name} berhasil diubah.`);
  };

  const handleResetPassword = (email: string) => {
    showNotification(`Tautan reset kata sandi telah dikirim ke ${email}.`);
  };

  // -------------------------------------------------------------
  // BATCH IMPORT & TEMPLATE DOWNLOAD FUNCTIONS
  // -------------------------------------------------------------
  const handleDownloadTemplate = (format: 'xlsx' | 'csv') => {
    if (format === 'csv') {
      const link = document.createElement('a');
      link.href = '/templates/template_siswa_atph.csv';
      link.download = 'format_import_siswa_atph.csv';
      link.click();
      showNotification('Template CSV berhasil diunduh.');
    } else {
      const link = document.createElement('a');
      link.href = '/templates/template_siswa_atph.xlsx';
      link.download = 'format_import_siswa_atph.xlsx';
      link.click();
      showNotification('Template Excel (.xlsx) berhasil diunduh.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsParsing(true);
    setParsedRows([]);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse to JSON array of objects
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          showNotification('File kosong atau format data tidak terbaca.', 'error');
          setIsParsing(false);
          return;
        }

        // Map and validate each row
        const mappedRows: ParsedStudentRow[] = rawJson.map((row: any, idx: number) => {
          // Normalize column keys (case-insensitive & fuzzy)
          const keys = Object.keys(row);
          const findValue = (aliases: string[]) => {
            const foundKey = keys.find((k) =>
              aliases.some((alias) => k.trim().toLowerCase().includes(alias.toLowerCase()))
            );
            return foundKey ? String(row[foundKey]).trim() : '';
          };

          const rawName = findValue(['nama lengkap', 'nama', 'fullname', 'name', 'siswa']);
          const rawNisn = findValue(['nisn', 'nomor induk', 'no_induk', 'id_siswa']);
          const rawClass = findValue(['kelas', 'class', 'tingkat', 'rombel']);
          const rawEmail = findValue(['email', 'surel', 'mail']);
          const rawMajor = findValue(['jurusan', 'major', 'program']) || 'Agribisnis Tanaman Pangan dan Hortikultura';

          // Match class ID
          let matchedClass = classes.find(
            (c) => c.name.toLowerCase() === rawClass.toLowerCase()
          );

          if (!matchedClass && rawClass) {
            if (rawClass.includes('10') || rawClass.toLowerCase().includes('x')) {
              matchedClass = classes.find((c) => c.gradeLevel === 'X');
            } else if (rawClass.includes('11') || rawClass.toLowerCase().includes('xi')) {
              matchedClass = classes.find((c) => c.gradeLevel === 'XI');
            } else if (rawClass.includes('12') || rawClass.toLowerCase().includes('xii')) {
              matchedClass = classes.find((c) => c.gradeLevel === 'XII');
            }
          }

          const targetClass = matchedClass || classes[0] || { id: 'cls-x-at-1', name: 'X AT 1' };

          // Generate default email if missing but name exists
          const resolvedEmail =
            rawEmail ||
            (rawName
              ? `${rawName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@siswa.eduatph.sch.id`
              : '');

          const isValid = Boolean(rawName && resolvedEmail);
          let validationError = '';
          if (!rawName) validationError = 'Nama lengkap kosong';
          else if (!resolvedEmail) validationError = 'Email tidak valid';

          return {
            fullName: rawName,
            email: resolvedEmail,
            nisn: rawNisn || '-',
            className: targetClass.name,
            classId: targetClass.id,
            major: rawMajor,
            isValid,
            validationError,
          };
        });

        setParsedRows(mappedRows);
        setIsParsing(false);
      } catch (err) {
        console.error('Error parsing file:', err);
        showNotification('Terjadi kesalahan saat membaca file. Pastikan format CSV/Excel sesuai.', 'error');
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      showNotification('Gagal membaca file.', 'error');
      setIsParsing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProcessImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      showNotification('Tidak ada baris data siswa yang valid untuk diimpor.', 'error');
      return;
    }

    setIsImporting(true);

    const newUsers = validRows.map((r) => ({
      fullName: r.fullName,
      email: r.email,
      nisn: r.nisn !== '-' ? r.nisn : '',
      role: 'student' as const,
      classId: r.classId,
      className: r.className,
      major: r.major,
      isActive: true,
    }));

    DataProvider.addUsers(newUsers);

    setTimeout(() => {
      setIsImporting(false);
      setIsImportModalOpen(false);
      setParsedRows([]);
      setImportFileName('');
      loadData();
      showNotification(`Sukses! ${validRows.length} siswa baru berhasil ditambahkan.`);
    }, 400);
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Manajemen Siswa ATPH"
        subtitle="Kelola akun, kelas, dan status keaktifan seluruh siswa Agribisnis Tanaman Pangan dan Hortikultura"
        onRefresh={loadData}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {notification && (
          <div
            className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Top Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama siswa, NISN, atau email..."
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
              <option value="all">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons: Import, Template, Single Add */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Format Template Buttons */}
            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shadow-xs">
              <button
                type="button"
                onClick={() => handleDownloadTemplate('xlsx')}
                title="Unduh Format Spreadsheet Excel (.xlsx)"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format Excel</span>
              </button>
              <span className="w-px bg-slate-200 dark:bg-slate-800 my-1" />
              <button
                type="button"
                onClick={() => handleDownloadTemplate('csv')}
                title="Unduh Format Nilai Koma CSV (.csv)"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Format CSV</span>
              </button>
            </div>

            {/* Import CSV / Excel Button */}
            <button
              onClick={() => {
                setParsedRows([]);
                setImportFileName('');
                setIsImportModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500/50 flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
            >
              <UploadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Import CSV / Excel</span>
            </button>

            {/* Single Add Button */}
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Siswa Manual</span>
            </button>
          </div>
        </div>

        {/* Quick Info Banner for Excel/CSV Import */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Mendukung Penambahan Siswa Massal via Excel & CSV</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Gunakan template resmi untuk memasukkan data siswa kelas X, XI, dan XII ATPH sekaligus secara otomatis.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleDownloadTemplate('xlsx')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100/50 font-bold text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Format .xlsx</span>
            </button>
            <button
              onClick={() => {
                setParsedRows([]);
                setImportFileName('');
                setIsImportModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-[11px] text-white flex items-center gap-1.5 shadow-2xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Mulai Import</span>
            </button>
          </div>
        </div>

        {/* Students Table Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Identitas Siswa</th>
                  <th className="py-4 px-6">Kelas & NISN</th>
                  <th className="py-4 px-6">Jurusan</th>
                  <th className="py-4 px-6">Status Akun</th>
                  <th className="py-4 px-6">Terdaftar</th>
                  <th className="py-4 px-6 text-right">Aksi Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Tidak ada siswa yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center">
                            {s.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {s.fullName}
                            </p>
                            <p className="text-[11px] text-slate-500">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {s.className || 'X ATPH'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          NISN: {s.nisn || '-'}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                        {s.major}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(s.id, s.fullName)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            s.isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {s.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-[11px]">
                        {formatDate(s.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            title="Edit Data Siswa"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(s.email)}
                            title="Reset Kata Sandi"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL 1: IMPORT CSV / EXCEL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Import Siswa Baru via CSV / Excel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unggah file daftar siswa untuk menambahkan data secara massal ke EduATPH
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Template Guide */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Langkah 1: Unduh Format Template
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel (.xlsx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('csv')}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV (.csv)</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                <p>
                  <strong>Kolom yang didukung dalam template:</strong>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                    Nama Lengkap (Wajib)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                    NISN (Opsional)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                    Kelas (X ATPH / XI ATPH / XII ATPH)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                    Email Siswa (Wajib)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                    Jurusan (Default: Agribisnis Tanaman...)
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: File Upload Dropzone */}
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                Langkah 2: Pilih atau Tarik File CSV / Excel
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {importFileName ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      File Terpilih: {importFileName}
                    </span>
                  ) : (
                    'Klik untuk memilih file spreadsheet (.xlsx, .xls, .csv)'
                  )}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mendukung file Microsoft Excel dan file CSV UTF-8
                </p>
              </div>
            </div>

            {/* Step 3: Live Preview Table */}
            {isParsing && (
              <div className="py-8 text-center text-xs text-slate-500">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span>Membaca dan memverifikasi data file...</span>
              </div>
            )}

            {!isParsing && parsedRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Pratinjau Data Siswa ({parsedRows.length} baris terbaca)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
                      ✓ {validCount} Siap Diimpor
                    </span>
                    {invalidCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        ⚠ {invalidCount} Tidak Lengkap
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Nama Lengkap</th>
                        <th className="py-2.5 px-4">NISN</th>
                        <th className="py-2.5 px-4">Kelas</th>
                        <th className="py-2.5 px-4">Email Akun</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {parsedRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={
                            row.isValid
                              ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              : 'bg-rose-50/40 dark:bg-rose-950/30'
                          }
                        >
                          <td className="py-2.5 px-4">
                            {row.isValid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <Check className="w-3 h-3" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600" title={row.validationError}>
                                <AlertCircle className="w-3 h-3" />
                                <span>{row.validationError || 'Kurang'}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                            {row.fullName || '-'}
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-500">
                            {row.nisn}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              {row.className}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                            {row.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                disabled={isImporting || validCount === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isImporting
                    ? 'Memproses Import...'
                    : `Simpan Semua Siswa (${validCount} Siswa)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH / EDIT SISWA MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingStudent ? 'Edit Data Siswa ATPH' : 'Tambah Siswa Baru Manual'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Muhammad Ihsan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Email Akun *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ihsan@siswa.eduatph.sch.id"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Induk Siswa (NISN)
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="0078129380"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas ATPH *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kompetensi Keahlian (Jurusan)
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
