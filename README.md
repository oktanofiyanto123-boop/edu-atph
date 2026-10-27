# EduATPH — Platform Pembelajaran Digital Agribisnis Tanaman (LMS SMK)

> **EduATPH** adalah Learning Management System (LMS) modern standar universitas khusus mata pelajaran **Agribisnis Tanaman Pangan dan Hortikultura (ATPH)** untuk siswa Sekolah Menengah Kejuruan (SMK). Didesain dan dikembangkan dengan Next.js App Router, TypeScript, Tailwind CSS, serta Supabase PostgreSQL dengan Row Level Security (RLS).

---

## 👨‍💼 Administrator & Pengampu
- **Nama Administrator**: **Okta Nofiyanto**
- **Fokus Keilmuan**: Agribisnis Tanaman Pangan dan Hortikultura (ATPH)
- **Role Akun**: Administrator Tunggal (Akses Penuh Pengelolaan Konten & Penilaian)

---

## 🌟 Fitur Utama Platform

### 1. Hak Akses Admin (Okta Nofiyanto)
- **Dashboard Statistik Realtime:** Monitor jumlah siswa aktif, modul materi, tugas belum dinilai, rata-rata nilai rapor, dan grafik pengumpulan harian.
- **Manajemen Akun Siswa:** Tambah siswa baru, cari siswa berdasarkan NISN/nama, filter kelas, aktivasi/nonaktifkan akun, dan reset sandi.
- **Manajemen Kelas:** Pengelolaan rombongan belajar tingkat X ATPH, XI ATPH, dan XII ATPH.
- **Manajemen Materi ATPH:** Editor modul kaya fitur (gambar tanaman, tautan video YouTube embed, lampiran PDF, tujuan pembelajaran, status draft/published/archived).
- **15 Kategori Kurikulum ATPH:** Terstruktur dari Dasar Agribisnis, Media Tanam, Hidroponik NFT/DFT, PHT, hingga Agripreneurship.
- **Manajemen Tugas Praktik:** Atur instruksi pengerjaan, tenggat waktu, jenis lampiran dokumen, bobot poin, dan kriteria rubrik penilaian.
- **Pemeriksaan & Penilaian Tugas:** Berikan skor angka (0-100), komentar apresiasi/evaluasi, dan publikasi nilai secara instan.
- **Kuis & Evaluasi Interaktif:** Pembuat butir soal (pilihan ganda, benar/salah), durasi menit, batas percobaan, nilai KKM, dan auto-grading.
- **Rekapitulasi Nilai & Ekspor CSV:** Tabel nilai akhir dengan pembobotan dinamis (misal 60% tugas + 40% kuis), status ketuntasan KKM, dan ekspor CSV/Excel satu kali klik.
- **Pengumuman Kelas:** Siarkan jadwal praktik greenhouse ke kelas sasaran spesifik atau semua kelas.
- **Pencadangan Database:** Ekspor seluruh data platform dalam format JSON dan panduan integrasi Supabase.

### 2. Hak Akses Siswa
- **Dashboard Pribadi:** Salam personal, pengingat tugas terdekat, progres materi kurikulum, dan pengumuman kelas.
- **Katalog & Pembaca Materi:** Tampilan artikel nyaman dibaca, video tutorial praktik terintegrasi, unduhan PDF, navigasi materi sebelumnya/berikutnya, dan tombol **"Tandai sebagai Selesai"** yang menyimpan progres ke basis data.
- **Pengumpulan Tugas Online:** Pengisian uraian teks, unggah dokumen (PDF/Word/Foto), monitoring status pengumpulan, dan melihat nilai serta umpan balik guru.
- **Pengerjaan Kuis Interaktif:** Timer countdown langsung, navigasi nomor soal, lembar peninjauan, penilaian otomatis seketika, dan pembahasan ilmiah setiap butir soal.
- **Transkrip Nilai:** Melihat perolehan nilai resmi yang telah disahkan guru Okta Nofiyanto, status KKM, dan fitur cetak rapor.
- **Pelacakan Progres Belajar:** Checklist capaian modul pada 15 kategori kompetensi kejuruan ATPH.

---

## 🛠️ Stack Teknologi
- **Framework:** Next.js 16 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + Glassmorphism + Dark Mode
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Bar & Line Charts)
- **Database & Auth:** Supabase PostgreSQL + Row Level Security (RLS)
- **Deployment Target:** Vercel

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### 1. Prasyarat
- Node.js versi 18.18 atau lebih baru
- npm, pnpm, atau yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel lingkungan pada `.env.local`:
```env
NEXT_PUBLIC_ADMIN_NAME="Okta Nofiyanto"
NEXT_PUBLIC_APP_NAME="EduATPH"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Hubungkan dengan Supabase Anda jika siap live:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Catatan Mode Standalone/Demo:** Aplikasi dilengkapi *Dual-Engine Data Provider*. Jika kredensial Supabase belum diisi, EduATPH langsung aktif dengan penyimpanan reaktif lokal terisi penuh kurikulum ATPH, sehingga seluruh tombol, form, filter, kuis, dan ekspor berfungsi 100% tanpa error!

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser pada: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Panduan Migrasi Database Supabase

Struktur tabel, relasi, constraint, enum, dan kebijakan Row Level Security (RLS) telah disiapkan secara lengkap pada file:
`supabase/migrations/20261027_init_edu_atph.sql`

Tabel-tabel yang dibuat:
1. `profiles` — Profil pengguna (Role: `admin` | `student`)
2. `classes` — Kelas X, XI, XII ATPH
3. `subjects` — Mata Pelajaran ATPH
4. `material_categories` — 15 Kategori kurikulum kejuruan ATPH
5. `teaching_materials` — Modul materi pembelajaran
6. `material_attachments` — Lampiran berkas materi
7. `learning_progress` — Progres pembacaan materi siswa
8. `assignments` — Tugas praktik kejuruan
9. `submissions` — Pengumpulan laporan tugas siswa
10. `quizzes` — Kuis evaluasi pembelajaran
11. `quiz_questions` — Butir soal dan kunci jawaban
12. `quiz_attempts` — Hasil percobaan pengerjaan kuis siswa
13. `grades` — Rekapitulasi nilai dan status KKM
14. `announcements` — Pengumuman kelas

### Langkah Menerapkan ke Supabase Cloud:
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat proyek baru (misal: `edu-atph-lms`)
3. Buka menu **SQL Editor** pada sidebar kiri
4. Buka file `supabase/migrations/20261027_init_edu_atph.sql`, salin seluruh kodenya, lalu tempelkan ke SQL Editor
5. Klik tombol **Run** untuk mengeksekusi migrasi
6. Buka **Project Settings** > **API**, salin `Project URL` dan `anon public key` ke dalam `.env.local`

---

## ☁️ Panduan Deployment ke Vercel

1. **Dorong kode ke Git Repository (GitHub / GitLab / Bitbucket):**
   ```bash
   git add .
   git commit -m "feat: complete EduATPH LMS implementation"
   git push origin main
   ```
2. **Impor Proyek ke Vercel:**
   - Kunjungi [vercel.com](https://vercel.com) dan login
   - Klik **Add New** > **Project**
   - Pilih repositori `edu-atph`
3. **Atur Environment Variables di Vercel Dashboard:**
   - `NEXT_PUBLIC_ADMIN_NAME`: `Okta Nofiyanto`
   - `NEXT_PUBLIC_APP_NAME`: `EduATPH`
   - `NEXT_PUBLIC_SUPABASE_URL`: (URL Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Anon Key Supabase Anda)
4. **Deploy:** Klik tombol **Deploy**. Vercel akan otomatis melakukan proses build dan website siap diakses publik!

---

## 🔒 Kebijakan Keamanan (Security Policy)
- Pendaftaran publik tidak menyediakan akses sebagai Admin.
- Hanya satu Administrator utama: **Okta Nofiyanto**.
- Siswa hanya dapat membaca materi dan tugas untuk kelasnya.
- Siswa hanya dapat melihat nilai dan pengumpulan miliknya sendiri setelah dipublikasikan oleh guru.
- Kunci jawaban kuis tidak dikirimkan ke peramban siswa sebelum kuis diselesaikan dan dinilai.

---

Dikelola dengan bangga oleh **Okta Nofiyanto** untuk kemajuan pendidikan kejuruan pertanian Indonesia.
