import {
  UserProfile,
  ClassItem,
  MaterialCategory,
  TeachingMaterial,
  Assignment,
  Submission,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  GradeRecord,
  Announcement,
} from '@/types';

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'cls-10-atph',
    name: 'X ATPH',
    gradeLevel: 'X',
    description: 'Kelas 10 Agribisnis Tanaman Pangan dan Hortikultura - Dasar Kejuruan',
    academicYear: '2025/2026',
    studentCount: 28,
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'cls-11-atph',
    name: 'XI ATPH',
    gradeLevel: 'XI',
    description: 'Kelas 11 Agribisnis Tanaman Pangan dan Hortikultura - Praktik Budidaya Lanjutan',
    academicYear: '2025/2026',
    studentCount: 30,
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'cls-12-atph',
    name: 'XII ATPH',
    gradeLevel: 'XII',
    description: 'Kelas 12 Agribisnis Tanaman Pangan dan Hortikultura - Pascapanen & Kewirausahaan',
    academicYear: '2025/2026',
    studentCount: 26,
    createdAt: '2026-07-15T08:00:00Z',
  },
];

export const INITIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'cat-1',
    name: 'Dasar-Dasar Agribisnis Tanaman',
    slug: 'dasar-dasar-agribisnis-tanaman',
    description: 'Pengenalan prinsip ekologi pertanian, fisiologi tanaman, dan keselamatan kerja di kebun.',
    iconName: 'BookOpen',
    orderIndex: 1,
  },
  {
    id: 'cat-2',
    name: 'Penyiapan Media Tanam',
    slug: 'penyiapan-media-tanam',
    description: 'Formula media tanam tanah, kompos matang, arang sekam, cocopeat, dan sterilisasi media.',
    iconName: 'Layers',
    orderIndex: 2,
  },
  {
    id: 'cat-3',
    name: 'Penyiapan Benih dan Bibit',
    slug: 'penyiapan-benih-dan-bibit',
    description: 'Seleksi benih bersertifikat, perlakuan benih (seed treatment), dan uji daya berkecambah.',
    iconName: 'CheckCircle',
    orderIndex: 3,
  },
  {
    id: 'cat-4',
    name: 'Pembibitan Tanaman',
    slug: 'pembibitan-tanaman',
    description: 'Teknik persemaian di tray, pemeliharaan bibit muda di greenhouse, dan adaptasi lingkungan.',
    iconName: 'Sprout',
    orderIndex: 4,
  },
  {
    id: 'cat-5',
    name: 'Budidaya Tanaman Pangan',
    slug: 'budidaya-tanaman-pangan',
    description: 'Teknologi budidaya padi sawah intensif, jagung hibrida, kedelai, dan ubi jalar bermutu.',
    iconName: 'Wheat',
    orderIndex: 5,
  },
  {
    id: 'cat-6',
    name: 'Budidaya Tanaman Hortikultura',
    slug: 'budidaya-tanaman-hortikultura',
    description: 'Sayuran daun (pakcoy, selada), sayuran buah (cabai, tomat), tanaman hias, dan biofarmaka.',
    iconName: 'Apple',
    orderIndex: 6,
  },
  {
    id: 'cat-7',
    name: 'Pertanian Lahan Basah',
    slug: 'pertanian-lahan-basah',
    description: 'Sistem irigasi teknis sawah, tata kelola air pasang surut, dan penanganan tanah masam.',
    iconName: 'Droplets',
    orderIndex: 7,
  },
  {
    id: 'cat-8',
    name: 'Pertanian Lahan Kering',
    slug: 'pertanian-lahan-kering',
    description: 'Teknik konservasi air tanah, mulsa jerami/plastik hitam perak, dan pola tanam tumpang sari.',
    iconName: 'Sun',
    orderIndex: 8,
  },
  {
    id: 'cat-9',
    name: 'Sistem Hidroponik',
    slug: 'sistem-hidroponik',
    description: 'Teknik NFT, DFT, Wick System, manajemen larutan nutrisi AB Mix, dan kalibrasi pH/EC meter.',
    iconName: 'Pipette',
    orderIndex: 9,
  },
  {
    id: 'cat-10',
    name: 'Pemeliharaan Tanaman',
    slug: 'pemeliharaan-tanaman',
    description: 'Teknik penyulaman, penyiangan, pemangkasan pucuk/tunas air (pruning), dan pemasangan ajir.',
    iconName: 'Scissors',
    orderIndex: 10,
  },
  {
    id: 'cat-11',
    name: 'Pemupukan',
    slug: 'pemupukan',
    description: 'Penerapan prinsip 5T (Tepat Jenis, Dosis, Waktu, Cara, Tempat), POC, dan pupuk berimbang.',
    iconName: 'FlaskConical',
    orderIndex: 11,
  },
  {
    id: 'cat-12',
    name: 'Pengendalian Hama dan Penyakit Tanaman',
    slug: 'pengendalian-hama-dan-penyakit-tanaman',
    description: 'Penerapan Pengendalian Hama Terpadu (PHT), perangkap likat kuning, pestisida nabati.',
    iconName: 'ShieldAlert',
    orderIndex: 12,
  },
  {
    id: 'cat-13',
    name: 'Panen dan Pascapanen',
    slug: 'panen-dan-pascapanen',
    description: 'Penentuan waktu petik optimum, sortasi, grading SNI, pengemasan vakum, dan cold chain.',
    iconName: 'PackageCheck',
    orderIndex: 13,
  },
  {
    id: 'cat-14',
    name: 'Keselamatan dan Kesehatan Kerja Pertanian',
    slug: 'keselamatan-dan-kesehatan-kerja-pertanian',
    description: 'Penggunaan APD pertanian, SOP pengoperasian traktor/sprayer, dan penanganan pestisida.',
    iconName: 'HardHat',
    orderIndex: 14,
  },
  {
    id: 'cat-15',
    name: 'Agripreneurship',
    slug: 'agripreneurship',
    description: 'Analisis kelayakan usaha tani (R/C ratio, BEP), branding produk hortikultura, pemasaran online.',
    iconName: 'TrendingUp',
    orderIndex: 15,
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-okta',
    email: 'okta.nofiyanto@eduatph.sch.id',
    fullName: 'Okta Nofiyanto',
    role: 'admin',
    major: 'Agribisnis Tanaman Pangan dan Hortikultura',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-student-rizky',
    email: 'rizky.pratama@siswa.eduatph.sch.id',
    fullName: 'Rizky Pratama',
    role: 'student',
    nisn: '0078129381',
    classId: 'cls-10-atph',
    className: 'X ATPH',
    major: 'Agribisnis Tanaman Pangan dan Hortikultura',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    isActive: true,
    createdAt: '2026-07-16T09:00:00Z',
  },
  {
    id: 'usr-student-siti',
    email: 'siti.rahma@siswa.eduatph.sch.id',
    fullName: 'Siti Rahmawati',
    role: 'student',
    nisn: '0078129382',
    classId: 'cls-10-atph',
    className: 'X ATPH',
    major: 'Agribisnis Tanaman Pangan dan Hortikultura',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    isActive: true,
    createdAt: '2026-07-16T09:15:00Z',
  },
  {
    id: 'usr-student-dimas',
    email: 'dimas.anggoro@siswa.eduatph.sch.id',
    fullName: 'Dimas Anggoro',
    role: 'student',
    nisn: '0068129401',
    classId: 'cls-11-atph',
    className: 'XI ATPH',
    major: 'Agribisnis Tanaman Pangan dan Hortikultura',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    isActive: true,
    createdAt: '2026-07-16T10:00:00Z',
  },
];

export const INITIAL_MATERIALS: TeachingMaterial[] = [
  {
    id: 'mat-manajemen-agribisnis-tanaman-x',
    title: 'Bab 1: Manajemen Agribisnis Tanaman (Dasar-Dasar Agribisnis Tanaman Kelas X)',
    slug: 'manajemen-agribisnis-tanaman-kelas-x',
    description: 'Panduan lengkap modul pembelajaran Bab 1: Mengenal alur 4 subsistem agribisnis, 10 karakteristik agribisnis, 5 fungsi manajemen (POACE & 6M), perencanaan produksi tanaman, serta implementasi SMK3LH di SMK Pertanian.',
    categoryId: 'cat-1',
    categoryName: 'Dasar-Dasar Agribisnis Tanaman',
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Sistem Agribisnis, Fungsi Manajemen (6M & POACE), dan SMK3LH',
    learningObjectives: [
      'Mampu mengidentifikasi proses dan alur bisnis bidang agribisnis tanaman serta 4 subsistem utamanya (hulu, budi daya, hilir, dan layanan pendukung).',
      'Menganalisis 10 karakteristik khas agribisnis menurut Downey & Erickson yang membedakannya dengan industri manufaktur lain.',
      'Mendeskripsikan 5 fungsi manajemen (Perencanaan 6W/1H, Pengorganisasian, Pengarahan/Motivasi, Pengawasan Preventif-Represif, dan Evaluasi).',
      'Menerapkan perencanaan produksi pertanian (pemilihan komoditas, lokasi, skala usaha, penjadwalan hitung mundur panen cabai, serta sistem pengadaan buat vs beli).',
      'Menerapkan Sistem Manajemen Keselamatan dan Kesehatan Kerja Serta Lingkungan Hidup (SMK3LH) berdasarkan PP No. 50 Tahun 2012 di lingkungan kebun dan laboratorium agribisnis.',
    ],
    content: `
# BAB I: MANAJEMEN AGRIBISNIS TANAMAN
**Mata Pelajaran:** Dasar-Dasar Agribisnis Tanaman  
**Jenjang:** SMK/MAK Kelas X (Fase E) — Program Keahlian Agribisnis Tanaman  
**Buku Referensi Resmi:** Ani Susanti & Yustinanda Rahma Dewi (Kemendikbudristek RI, 2023)

---

## 🌾 Pertanyaan Pemantik
Setiap hari di meja makan kita selalu tersedia nasi hangat lengkap dengan lauk pauk seperti tempe, tahu, sayuran, dan sambal cabai segar. Pernahkah kalian membayangkan perjalanan panjang makanan tersebut hingga tersaji di meja makan?

Produk pertanian tersebut mengalami proses yang panjang sebelum sampai ke tangan konsumen:
1. Mulai dari pemuliaan dan pengadaan **benih** unggul,
2. Pengolahan lahan dan **budi daya** di sawah atau greenhouse,
3. Pemanenan, penyortiran, dan **pengolahan hasil**, hingga
4. Distribusi rantai pasok dan **pemasaran** ke supermarket atau pasar tradisional.

Banyak sekali pihak yang terlibat dalam mata rantai ini. Diperlukan sebuah **sistem agribisnis yang terencana dan terkelola secara terpadu** agar produk pertanian dapat sampai ke tangan konsumen dengan mutu prima, kuantitas terjaga, dan harga yang menguntungkan petani.

---

## A. Sistem Agribisnis Tanaman

### 1. Definisi Agribisnis
Istilah agribisnis pertama kali diperkenalkan oleh **Davis dan Golberg (1957)**:
> *"Agribisnis adalah penjumlahan keseluruhan dari semua kegiatan yang menyangkut manufaktur dan distribusi dari sarana produksi pertanian, kegiatan yang dilakukan usaha tani, serta penyimpanan, pengolahan, dan distribusi produk pertanian, serta produk-produk lain yang dihasilkan dari produk pertanian."*

Agribisnis bukan hanya sekadar bercocok tanam (budi daya), melainkan suatu **sistem utuh** yang terdiri atas subsistem yang saling terkait, tersinkronisasi, dan berkesinambungan.

### 2. Empat Subsistem Agribisnis Tanaman
Berdasarkan alur proses bisnisnya, sistem agribisnis terbagi menjadi 3 subsistem utama dan 1 subsistem pendukung:

1. **Subsistem Agribisnis Hulu (Up-stream Agribusiness):**
   - Mencakup seluruh kegiatan industri penyedia sarana produksi pertanian (saprotan).
   - *Contoh:* Industri benih/bibit bermutu, produsen pupuk organik & anorganik, produsen pestisida nabati/kimia, serta industri alat dan mesin pertanian (alsintan seperti traktor, cultivator, sprayer).

2. **Subsistem Budi Daya / Usaha Tani (On-farm Agribusiness):**
   - Sering disebut sebagai **pertanian primer**.
   - Meliputi seluruh kegiatan teknis budi daya tanaman di lahan terbuka maupun greenhouse: penyiapan lahan/media tanam, pembibitan, penanaman, pemeliharaan, irigasi, pemupukan berimbang, pengendalian Organisme Pengganggu Tanaman (OPT), hingga panen.
   - *Pelaku:* Petani mandiri, kelompok tani (Poktan/Gapoktan), perkebunan rakyat, hingga Perseroan Terbatas Perkebunan (PTPN/swasta).

3. **Subsistem Agribisnis Hilir (Down-stream Agribusiness):**
   - Mencakup kegiatan penanganan pascapanen, pengolahan hasil pertanian (agroindustri), penyimpanan (cold storage), pengemasan, distribusi logistik, dan pemasaran.
   - *Contoh:* Penggilingan gabah menjadi beras kemasan premium, pabrik pengolahan cabai menjadi saus sambal, industri tepung tapioka, pedagang besar, grosir, pasar modern/supermarket, dan pengecer.

4. **Subsistem Layanan Pendukung Agribisnis (Supporting Services):**
   - Menyediakan jasa penunjang yang vital agar ketiga subsistem di atas dapat berjalan optimal.
   - *Contoh:*
     - Lembaga Keuangan (Bank & Koperasi Pertanian) untuk modal usaha.
     - Lembaga Penelitian dan Pengembangan (R&D / Balai Penelitian Tanaman) untuk teknologi baru.
     - Lembaga Penyuluhan Pertanian untuk transfer teknologi kepada petani.
     - Lembaga Pendidikan & Pelatihan (SMK Pertanian, Perguruan Tinggi).
     - Jasa Transportasi & Distribusi Rantai Dingin.

### 💡 Pojok Info: Peran Koperasi Unit Desa (KUD)
Koperasi memiliki peran bersejarah dalam agribisnis pedesaan Indonesia:
- **1963:** Pembentukan *Koperta* untuk memenuhi kebutuhan bahan pangan pokok (khususnya beras).
- **1966–1967:** Berkembang menjadi *BUUD (Badan Usaha Unit Desa)* yang bertugas mengatasi kendala produksi, penyaluran pupuk, pembelian gabah, dan penggilingan beras ke Dolog.
- **Transformasi KUD:** Melalui 3 tahap pembinaan pemerintah:
  1. *Ofisialisasi* (didampingi penuh oleh pemerintah),
  2. *Deofisialisasi/Debirokratisasi* (ketergantungan mulai dikurangi), dan
  3. *Otonomi* (kemandirian penuh koperasi desa).

---

## B. Fungsi Manajemen dalam Agribisnis

### 1. Karakteristik Khusus Manajemen Agribisnis
Menurut **Hasibuan (2017)**, manajemen adalah ilmu dan seni yang mengatur pemanfaatan sumber daya manusia dan sumber daya lainnya secara efektif dan efisien guna mencapai target tertentu.

Menurut **Downey dan Erickson (1992)**, manajemen agribisnis memiliki karakteristik unik yang membedakannya secara mendasar dari manajemen industri manufaktur lainnya:
1. Keanekaragaman jenis bisnis yang luar biasa luas (dari hulu hingga hilir).
2. Jumlah pelaku usaha yang sangat besar (jutaan petani dan pelaku UMKM).
3. Terkait sangat erat dengan usaha tani primer (on-farm).
4. Keragaman skala usaha (dari skala pekarangan/rumah tangga hingga korporasi multinasional).
5. Persaingan pasar yang sangat ketat, khususnya pada komoditas segar.
6. Falsafah cara hidup (*the way of life*) tradisional yang masih kuat di kalangan petani.
7. Badan usaha agribisnis cenderung berbasis keluarga (*family farming*).
8. **Produksi bersifat musiman (*seasonality*).**
9. **Sangat tergantung pada faktor alam dan iklim (biologis & cuaca).**
10. Berdampak langsung terhadap kebijakan pangan strategis pemerintah.

### 2. Lima Fungsi Manajemen dalam Agribisnis (Rahim & Hastuti, 2005)
Untuk menggerakkan roda agribisnis, wajib diterapkan 5 fungsi manajerial:

#### a. Fungsi Perencanaan (Planning)
Menurut **Manullang (1996)**, perencanaan yang baik memuat unsur 6W/1H:
- **Way (Cara):** Penjabaran perincian langkah kegiatan dan pemanfaatan faktor-faktor produksi untuk menghasilkan produk.
- **Why (Mengapa):** Alasan pemilihan komoditas dan strategi untuk mencapai target profit serta kepuasan konsumen (*customer satisfaction*).
- **Where (Di mana):** Pemilihan lokasi fisik usaha tani/pabrik (mempertimbangkan akses bahan baku, ketersediaan air, dan pasar).
- **When (Kapan):** Ketetapan jadwal mulai dan selesainya tiap tahap pekerjaan.
- **Who (Siapa):** Penetapan kualifikasi tenaga kerja (manajer kebun, mandor, operator greenhouse, pekerja lapang).
- **How (Bagaimana):** Penetapan SOP teknis budidaya, standar mutu, dan efisiensi mekanisasi vs manual.

#### b. Fungsi Pengorganisasian (Organizing)
Menurut **Terry dan Rue (1993)**, pengorganisasian adalah mengelompokkan kegiatan penting dan mendelegasikan wewenang kerja.
- Menyusun bagan struktur organisasi yang jelas (alur komando, koordinasi, dan pembinaan).
- Menempatkan SDM sesuai kompetensinya (*the right man on the right place*). Contoh: Operator greenhouse harus memiliki kompetensi budidaya hidroponik bersertifikat.

#### c. Fungsi Pengarahan / Penggerakan (Actuating / Leading)
Pemimpin perusahaan memberikan instruksi kerja, briefing harian, dan motivasi.
Menurut **Hasibuan (2010)**, terdapat dua jenis motivasi kerja:
1. **Motivasi Positif (Insentif Positif):** Penghargaan berupa pujian, sertifikat karyawan teladan, bonus, atau kenaikan upah atas prestasi kerja baik. Dampak: Semangat kerja meningkat secara berkelanjutan.
2. **Motivasi Negatif (Insentif Negatif):** Pemberian teguran tertulis atau sanksi bagi pekerja yang lalai. Efektif dalam jangka pendek tetapi kurang baik untuk hubungan kerja jangka panjang.

#### d. Fungsi Pengawasan (Controlling)
Mengukur ketercapaian target dan melakukan tindakan koreksi bila terjadi deviasi/penyimpangan:
- **Pengawasan Preventif:** Dilakukan *sebelum* pekerjaan berlangsung untuk mencegah kesalahan (misal: kalibrasi sprayer sebelum aplikasi pestisida).
- **Pengawasan Represif:** Dilakukan *setelah* kegiatan selesai diukur berdasarkan standar baku yang ditetapkan (misal: grading berat buah cabai hasil panen).

#### e. Fungsi Evaluasi (Evaluation)
Menilai keberhasilan sistem usaha tani secara berkala dari aspek rasio input-output, efisiensi biaya, dan kendala lapangan untuk perbaikan musim tanam berikutnya.

### ⚙️ Mekanisme Kerja 6M dalam Agribisnis:
Sistem manajerial mengelola 6 sumber daya utama:
1. **Man (Manusia):** Tenaga kerja terampil, mandor bersertifikat LSP, agronomis.
2. **Money (Uang):** Modal kerja, arus kas, pembiayaan kredit perbankan.
3. **Material (Bahan Baku):** Benih bersertifikat, pupuk, media tanam, mulsa plastik.
4. **Machines (Mesin):** Traktor roda dua, transplanter, pompa irigasi tetes, combine harvester.
5. **Methods (Metode):** Standar Operasional Prosedur (SOP) dan Good Agricultural Practices (GAP).
6. **Market (Pasar):** Saluran pemasaran, kontrak suplai supermarket, pasar lelang cabai.

---

## C. Penerapan Manajemen dalam Proses Bisnis Tanaman

Menurut **Said dan Intan (2001)**, penerapan manajemen operasional mencakup:

### 1. Perencanaan Produksi Pertanian
- **Pemilihan Komoditas:** Mempertimbangkan permintaan pasar tinggi, kesesuaian iklim (ketinggian tempat, curah hujan), dan ketersediaan modal.
- **Pemilihan Lokasi:** Dekat dengan sumber air melimpah, aksesibilitas transportasi jalan raya, serta ketersediaan tenaga kerja sekitar.
- **Penentuan Skala Usaha:** Skala kecil (pekarangan/sayuran daun), menengah, atau skala luas (perkebunan PIR - Perkebunan Inti Rakyat).

### 2. Penjadwalan Produksi Mundur (Contoh Kasus Agribisnis Cabai)
Harga cabai merah di Indonesia cenderung melonjak tinggi pada bulan **Desember dan Januari** (musim perayaan akhir tahun dan musim hujan).
- Agribisnis cabai memerlukan waktu panen **3 bulan** setelah tanam.
- Pembibitan dan pengolahan lahan memerlukan **1,5 bulan**.
- **Perhitungan Mundur Penjadwalan:**
  - Target panen: Bulan Desember.
  - Tanam bibit di lahan: Akhir Agustus hingga awal September.
  - Semai benih di persemaian tray: **Pertengahan bulan Juli**.

### 3. Pengorganisasian Sarana: Buat Sendiri vs Membeli
Manajer harus menghitung rasio biaya ekonomis:
- Contoh bibit: Apakah lebih hemat membuat persemaian sendiri (membutuhkan greenhouse semai dan tenaga terampil) atau membeli bibit siap tanam dari nursery tersertifikasi?

---

## D. Sistem Manajemen K3LH (SMK3LH) di Agribisnis Tanaman

Sektor pertanian memiliki potensi bahaya kerja yang cukup tinggi:
- Paparan zat kimia beracun (insektisida, fungisida, herbisida),
- Bahaya pengoperasian alat mekanis (traktor, mesin perontok padi, pemotong rumput),
- Ergonomi kerja (beban angkat berat, posisi membungkuk seharian).

### Regulasi SMK3 di Indonesia:
- **Permenaker No. 05 Tahun 1996**, diperkuat dengan
- **Peraturan Pemerintah (PP) No. 50 Tahun 2012** tentang Penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja.

> **Ketentuan Wajib SMK3:** Wajib diterapkan oleh perusahaan yang mempekerjakan minimal **100 tenaga kerja** ATAU memiliki **potensi bahaya tinggi** (seperti penggunaan bahan kimia beracun dan alat berat).

### Tujuan Utama Penerapan SMK3LH:
1. Mencegah terjadinya kecelakaan kerja (*zero accident*).
2. Mencegah timbulnya **Penyakit Akibat Kerja (PAK)** seperti keracunan pestisida kronis atau gangguan saluran pernapasan.
3. Menciptakan lingkungan kebun dan laboratorium yang aman, sehat, nyaman, serta produktif.
4. Menjaga kelestarian lingkungan hidup dari pencemaran residu kimiawi.

---

## 📌 Rangkuman Intisari Bab 1
1. Agribisnis terdiri dari 4 subsistem: **Hulu**, **Budi Daya (On-farm)**, **Hilir**, dan **Layanan Pendukung**.
2. Manajemen agribisnis bersifat unik karena produknya bersifat musiman, mudah rusak (*perishable*), dan sangat dipengaruhi iklim biologis.
3. Lima pilar fungsi manajemen adalah: **Perencanaan (6W/1H)**, **Pengorganisasian**, **Pengarahan (Motivasi Positif/Negatif)**, **Pengawasan (Preventif & Represif)**, dan **Evaluasi**.
4. Pengelolaan 6M (Man, Money, Material, Machines, Methods, Market) adalah kunci efisiensi agribisnis modern.
5. Penerapan **SMK3LH** melindungi kesehatan petani dan pekerja agribisnis dari bahaya bahan kimia dan mekanisasi pertanian.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/-H1ZTKuj7eI',
    pdfUrl: '/templates/template_siswa_atph.csv',
    attachments: [
      {
        id: 'att-buku-dasar-atph-x',
        name: 'Modul_Bab_1_Manajemen_Agribisnis_Tanaman_Kelas_X.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: '3.8 MB',
        fileType: 'pdf',
      },
    ],
    status: 'published',
    orderIndex: 1,
    createdAt: '2026-08-01T07:00:00Z',
    updatedAt: '2026-10-27T08:00:00Z',
  },
  {
    id: 'mat-hidroponik-nft',
    title: 'Teknologi Budidaya Hidroponik Sistem NFT pada Tanaman Selada',
    slug: 'teknologi-budidaya-hidroponik-nft-selada',
    description: 'Panduan komprehensif budidaya selada (Lactuca sativa) dengan Nutrient Film Technique (NFT), mulai dari persemaian rockwool hingga panen.',
    categoryId: 'cat-9',
    categoryName: 'Sistem Hidroponik',
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Instalasi & Manajemen Nutrisi NFT',
    learningObjectives: [
      'Memahami prinsip sirkulasi tipis nutrisi pada sistem Nutrient Film Technique (NFT)',
      'Mampu mengukur dan mengatur pH (5.5 - 6.5) serta nilai EC larutan AB Mix (1.2 - 1.6 mS/cm)',
      'Menerapkan tahapan semai rockwool dan pemindahan bibit (transplanting) pada netpot',
      'Mengidentifikasi gejala kekurangan nutrisi (defisiensi hara) pada selada hidroponik',
    ],
    content: `
### 1. Pengenalan Sistem NFT (Nutrient Film Technique)
Sistem NFT adalah salah satu teknik hidroponik di mana akar tanaman tumbuh pada lapisan aliran larutan nutrisi yang dangkal dan bersirkulasi terus-menerus. Lapisan nutrisi dibuat sangat tipis (seperti lapisan film tipis, sekitar 1–3 mm) agar bagian atas akar tetap terpapar oksigen udara bebas sementara ujung bawahnya menyerap air dan unsur hara.

#### Keunggulan Sistem NFT:
1. **Pasokan Oksigen Optimal:** Karena lapisan nutrisi tipis, akar tanaman memperoleh aerasi yang melimpah sehingga perakaran berkembang putih dan sehat.
2. **Efisiensi Penggunaan Air & Pupuk:** Sistem tertutup (re-sirkulasi) meminimalkan evaporasi dan pemborosan hara.
3. **Pertumbuhan Lebih Cepat:** Tanaman selada dapat dipanen dalam waktu 30–35 hari setelah semai, lebih singkat dibandingkan media tanah.

---

### 2. Parameter Kritis Larutan Nutrisi AB Mix
Untuk mencapai kualitas selada krispi dan bebas rasa pahit:
- **Tingkat Keasaman (pH):** Rentang ideal adalah **5.5 – 6.5**. Jika pH terlalu tinggi (>7.0), zat besi (Fe) dan fosfat (P) akan mengendap dan tidak terserap.
- **Nilai EC (Electrical Conductivity):**
  - Fase Bibit (Hari 1–10 setelah pindah): **800 – 1.000 μS/cm**
  - Fase Vegetatif Cepat (Hari 11–25): **1.200 – 1.400 μS/cm**
  - Fase Menjelang Panen: **1.000 – 1.200 μS/cm**
- **Suhu Air Tandon:** Usahakan tidak melebihi **28°C**. Suhu air yang terlalu panas memicu kebusukan akar (*pythium root rot*).

---

### 3. Langkah Kerja Praktik di Greenhouse SMK
1. **Perendaman Benih & Semai:** Potong dadu media rockwool ukuran 2.5 x 2.5 cm. Lubangi sedalam 0.5 cm, letakkan 1 benih selada per lubang. Basahi sampai lembap (tidak menggenang).
2. **Pencahayaan:** Segera kenakan sinar matahari pagi setelah benih pecah (sprout) untuk mencegah *etiolasi* (kutilang - kurus tinggi langsing).
3. **Pindah Tanam:** Setelah bibit memiliki 3–4 helai daun sejati (umur 10–14 HSS), masukkan ke dalam netpot dan pasang pada pipa/gully NFT.
4. **Monitoring Rutin:** Lakukan pengecekan pH dan EC setiap pagi pukul 07.30 WIB dan sore pukul 16.00 WIB. Catat pada logbook pertanian digital.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/n3H8k3dJzQ0',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    attachments: [
      {
        id: 'att-1',
        name: 'Modul_Praktik_NFT_Selada_SMK.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: '2.4 MB',
        fileType: 'pdf',
      },
      {
        id: 'att-2',
        name: 'Tabel_Standar_PPM_EC_Sayuran_Daun.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: '1.1 MB',
        fileType: 'pdf',
      },
    ],
    orderIndex: 1,
    status: 'published',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
  },
  {
    id: 'mat-media-tanam',
    title: 'Penyiapan Media Tanam: Fondasi Rumah Bagi Akar & Keberhasilan Budidaya',
    slug: 'penyiapan-media-tanam',
    description: 'Modul Pembelajaran Resmi & Dokumen PDF Lengkap Penyiapan Media Tanam (28 Slide): Konsep rumah bagi akar, 5 fungsi rizosfer, 6 bahan baku, formula 1:1:1, serta sistem Tanah, Hidroponik, Aeroponik, dan Akuaponik.',
    categoryId: 'cat-2',
    categoryName: 'Penyiapan Media Tanam',
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Fisika & Kimia Media Tanam, Formulasi Campuran, dan Sistem Media Modern',
    learningObjectives: [],
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    pdfUrl: '/materials/penyiapan-media-tanam.pdf',
    attachments: [
      {
        id: 'att-media-tanam-full',
        name: 'Penyiapan_media_tanam_full.pdf',
        fileUrl: '/materials/penyiapan-media-tanam.pdf',
        fileSize: '12.5 MB',
        fileType: 'pdf',
      },
    ],
    orderIndex: 2,
    status: 'published',
    createdAt: '2026-08-05T08:00:00Z',
    updatedAt: '2026-10-28T08:15:00Z',
  },

  {
    id: 'mat-pht-hortikultura',
    title: 'Pengendalian Hama Terpadu (PHT) Tanaman Cabai Merah',
    slug: 'pengendalian-hama-terpadu-cabai-merah',
    description: 'Strategi pencegahan dan pengendalian hama thrips, kutu kebul (Bemisia tabaci), serta antraknosa dengan pestisida nabati.',
    categoryId: 'cat-12',
    categoryName: 'Pengendalian Hama dan Penyakit Tanaman',
    targetClassId: 'cls-11-atph',
    targetClassName: 'XI ATPH',
    topic: 'Identifikasi Gejala Serangan & Ambang Ekonomi Hama',
    learningObjectives: [
      'Mengenali morfologi dan gejala serangan hama Thrips sp. dan Tungau',
      'Membuat formulasi pestisida nabati berbahan daun mimba dan ekstrak bawang putih',
      'Menetapkan keputusan penyemprotan berdasarkan nilai ambang kendali ekonomi',
    ],
    content: `
### Konsep Dasar PHT pada Agribisnis Cabai
PHT bukan berarti anti-pestisida, melainkan pendekatan ekologis untuk membatasi populasi organisme pengganggu tanaman (OPT) di bawah tingkat yang merugikan secara ekonomis dengan memanfaatkan musuh alami dan metode kultur teknis.

1. **Kultur Teknis:** Pemasangan mulsa plastik hitam perak (MPHP) untuk memantulkan sinar UV yang mengusir kutu kebul dan thrips.
2. **Pemasangan Perangkap:** Yellow sticky trap dengan kerapatan 40 buah per hektar.
3. **Penyemprotan Pestisida Nabati:** Rebusan ekstrak daun nimba konsentrasi 5% diaplikasikan di pagi atau sore hari.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80',
    attachments: [],
    orderIndex: 1,
    status: 'published',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-10T09:00:00Z',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-logbook-nft',
    title: 'Tugas Praktik 1: Logbook Kalibrasi pH & EC Nutrisi Hidroponik',
    description: 'Lakukan pengukuran harian larutan nutrisi tandon hidroponik NFT selama 3 hari berturut-turut. Dokumentasikan foto alat ukur dan tuliskan analisis perubahan nilai EC serta tindakan koreksi yang diambil.',
    instructions: `
1. Catat nilai pH dan EC larutan tandon setiap pukul 07.30 WIB dan 16.00 WIB.
2. Buat tabel perbandingan pada dokumen laporan (bisa diketik langsung atau upload PDF/Word).
3. Jika pH naik di atas 6.8, jelaskan takaran penambahan larutan pH Down (asam fosfat).
4. Lampirkan minimal 2 foto dokumentasi saat siswa melakukan kalibrasi dan pembacaan sensor.
5. Format pengumpulan: PDF atau Word (maksimal 10 MB).
    `,
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Sistem Hidroponik NFT',
    startDate: '2026-08-01T00:00:00Z',
    dueDate: '2026-11-15T23:59:00Z',
    submissionType: 'text_and_file',
    points: 100,
    rubricCriteria: [
      { criteria: 'Kelengkapan Data Logbook 3 Hari', weight: 40, description: 'Mencantumkan data pH & EC pagi dan sore secara lengkap.' },
      { criteria: 'Ketepatan Analisis Tindakan Koreksi', weight: 35, description: 'Menjelaskan formula pH Down / penambahan air baku dengan benar.' },
      { criteria: 'Dokumentasi Foto Praktik Mandiri', weight: 25, description: 'Foto orisinal siswa di greenhouse atau instalasi mini.' },
    ],
    status: 'published',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'asg-formula-media',
    title: 'Tugas 2: Rencana Anggaran Biaya & Formulasi Media Tanam Sayuran Organik',
    description: 'Hitung kebutuhan bahan dan estimasi biaya pembuatan media tanam untuk 100 polybag ukuran 35x35 cm.',
    instructions: `
1. Hitung volume kebutuhan topsoil, kompos matang, dan arang sekam dalam satuan karung/m3.
2. Buat tabel estimasi harga bahan baku di toko pertanian lokal terdekat.
3. Tuliskan langkah perlakuan agens hayati Trichoderma pada media.
    `,
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Penyiapan Media Tanam',
    startDate: '2026-08-10T00:00:00Z',
    dueDate: '2026-11-20T23:59:00Z',
    submissionType: 'text_and_file',
    points: 100,
    rubricCriteria: [
      { criteria: 'Ketepatan Perhitungan Volume Bahan', weight: 50, description: 'Kesesuaian rumus konversi polybag ke volume tanah.' },
      { criteria: 'Rasionalitas Rincian Anggaran', weight: 30, description: 'Kesesuaian harga pasar terkini.' },
      { criteria: 'Format dan Kerapian Laporan', weight: 20, description: 'Tata bahasa baku dan struktur rapi.' },
    ],
    status: 'published',
    createdAt: '2026-08-10T08:00:00Z',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-rizky-logbook',
    assignmentId: 'asg-logbook-nft',
    assignmentTitle: 'Tugas Praktik 1: Logbook Kalibrasi pH & EC Nutrisi Hidroponik',
    studentId: 'usr-student-rizky',
    studentName: 'Rizky Pratama',
    studentEmail: 'rizky.pratama@siswa.eduatph.sch.id',
    studentNisn: '0078129381',
    classId: 'cls-10-atph',
    className: 'X ATPH',
    textContent: 'Berikut laporan hasil pengukuran nutrisi hidroponik NFT selada di greenhouse sekolah. Hari 1 pH 6.2 EC 1240, Hari 2 pH 6.6 EC 1310, Hari 3 pH 6.9 EC 1190. Pada hari ketiga dilakukan koreksi pH Down sebanyak 15 ml sehingga pH kembali ke 6.1.',
    fileName: 'Laporan_Praktik_Rizky_Pratama_X_ATPH.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.4 MB',
    submittedAt: '2026-08-14T14:30:00Z',
    status: 'sudah_dinilai',
    grade: 92,
    feedback: 'Luar biasa Rizky! Analisis kenaikan pH akibat penyerapan ion nitrat dijelaskan dengan sangat tepat. Pertahankan kedisiplinan pencatatan logbook.',
    gradedAt: '2026-08-15T10:00:00Z',
    gradedBy: 'Okta Nofiyanto',
  },
  {
    id: 'sub-siti-logbook',
    assignmentId: 'asg-logbook-nft',
    assignmentTitle: 'Tugas Praktik 1: Logbook Kalibrasi pH & EC Nutrisi Hidroponik',
    studentId: 'usr-student-siti',
    studentName: 'Siti Rahmawati',
    studentEmail: 'siti.rahma@siswa.eduatph.sch.id',
    studentNisn: '0078129382',
    classId: 'cls-10-atph',
    className: 'X ATPH',
    textContent: 'Tugas logbook kalibrasi tandon nutrisi selada hijau. Sudah dilampirkan foto display TDS meter dan pH meter digital di tandon 150 liter.',
    fileName: 'Siti_Rahma_Logbook_Hidroponik.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.1 MB',
    submittedAt: '2026-08-15T09:12:00Z',
    status: 'sudah_dikumpulkan',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-manajemen-agribisnis-x',
    title: 'Evaluasi Bab 1: Manajemen Agribisnis Tanaman (Kelas X ATPH)',
    description: 'Kuis evaluasi komprehensif Bab I mencakup 4 subsistem agribisnis, 10 karakteristik agribisnis, fungsi manajemen (POACE & 6M), perencanaan produksi tanaman, serta penerapan SMK3LH di SMK Pertanian.',
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Manajemen Agribisnis Tanaman',
    durationMinutes: 30,
    maxAttempts: 2,
    passingScore: 75,
    isPublished: true,
    questionCount: 10,
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'quiz-dasar-hidroponik',
    title: 'Evaluasi Pembelajaran: Prinsip Hidroponik & Nutrisi Tanaman',
    description: 'Kuis interaktif untuk mengukur pemahaman konsep nutrisi tanaman, fungsi hara makro mikro, serta teknik NFT dan aeroponik.',
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Sistem Hidroponik',
    durationMinutes: 20,
    maxAttempts: 2,
    passingScore: 75,
    isPublished: true,
    questionCount: 5,
    createdAt: '2026-08-01T08:00:00Z',
  },
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-mgt-1',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Istilah "Agribisnis" pertama kali diperkenalkan secara ilmiah pada tahun 1957 oleh...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Malayu S.P. Hasibuan' },
      { id: 'B', text: 'Davis dan Golberg' },
      { id: 'C', text: 'Downey dan Erickson' },
      { id: 'D', text: 'George R. Terry dan Leslie Rue' },
    ],
    correctAnswer: 'B',
    explanation: 'Istilah agribisnis pertama kali diperkenalkan oleh Davis dan Golberg pada tahun 1957 yang mendefinisikan agribisnis sebagai penjumlahan keseluruhan dari semua kegiatan manufaktur, budidaya, hingga distribusi produk pertanian.',
    points: 10,
    orderIndex: 1,
  },
  {
    id: 'q-mgt-2',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Perusahaan atau industri yang memproduksi benih unggul, pupuk organik, pestisida nabati, dan traktor tangan termasuk ke dalam...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Subsistem Agribisnis Hulu (Up-stream Agribusiness)' },
      { id: 'B', text: 'Subsistem Budi Daya / Usaha Tani (On-farm Agribusiness)' },
      { id: 'C', text: 'Subsistem Agribisnis Hilir (Down-stream Agribusiness)' },
      { id: 'D', text: 'Subsistem Layanan Pendukung Agribisnis' },
    ],
    correctAnswer: 'A',
    explanation: 'Subsistem Agribisnis Hulu mencakup seluruh kegiatan penyediaan sarana produksi pertanian (saprotan) seperti benih, pupuk, pestisida, dan alat mesin pertanian (alsintan).',
    points: 10,
    orderIndex: 2,
  },
  {
    id: 'q-mgt-3',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Kegiatan penggilingan gabah menjadi beras, pengolahan cabai menjadi saus sambal, serta pengemasan dan distribusi ke pasar swalayan merupakan bagian dari...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Subsistem Agribisnis Hulu' },
      { id: 'B', text: 'Subsistem Pertanian Primer' },
      { id: 'C', text: 'Subsistem Agribisnis Hilir (Down-stream Agribusiness)' },
      { id: 'D', text: 'Subsistem Layanan Pendukung' },
    ],
    correctAnswer: 'C',
    explanation: 'Subsistem Agribisnis Hilir meliputi kegiatan pascapanen, pengolahan hasil pertanian (agroindustri), distribusi logistik, dan pemasaran hasil panen ke tangan konsumen.',
    points: 10,
    orderIndex: 3,
  },
  {
    id: 'q-mgt-4',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Manakah di bawah ini lembaga yang berperan dalam Subsistem Layanan Pendukung Agribisnis (Supporting Services)?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Pabrik pestisida kimia dan produsen traktor' },
      { id: 'B', text: 'Petani cabai dan buruh pemetik tomat' },
      { id: 'C', text: 'Bank, Koperasi Tani, Balai Penelitian Pertanian (R&D), dan Balai Penyuluhan' },
      { id: 'D', text: 'Pabrik saus sambal dan pedagang grosir pasar induk' },
    ],
    correctAnswer: 'C',
    explanation: 'Subsistem layanan pendukung menyediakan jasa vital penunjang sistem agribisnis, seperti pembiayaan modal (Bank/Koperasi), riset & inovasi (R&D), penyuluhan lapangan, dan lembaga diklat SMK Pertanian.',
    points: 10,
    orderIndex: 4,
  },
  {
    id: 'q-mgt-5',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Salah satu karakteristik agribisnis menurut Downey dan Erickson (1992) yang membedakannya secara tajam dari industri manufaktur lainnya adalah...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Produksi dapat diatur konstan setiap hari tanpa terpengaruh cuaca' },
      { id: 'B', text: 'Produksi agribisnis bersifat musiman dan sangat tergantung pada kondisi biologis serta alam' },
      { id: 'C', text: 'Jumlah pelakunya sangat sedikit dan hanya dikuasai satu perusahaan raksasa' },
      { id: 'D', text: 'Produk agribisnis bersifat tahan lama dan tidak pernah mengalami kebusukan' },
    ],
    correctAnswer: 'B',
    explanation: 'Produksi pertanian sangat unik karena bersifat musiman (seasonality), mudah rusak (perishable), dan sangat dipengaruhi oleh faktor eksternal lingkungan alam dan cuaca.',
    points: 10,
    orderIndex: 5,
  },
  {
    id: 'q-mgt-6',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Dalam unsur perencanaan agribisnis 6W/1H menurut Manullang (1996), unsur "Way" (cara) menjelaskan tentang...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Alasan mengapa target profit perusahaan harus dicapai' },
      { id: 'B', text: 'Penjabaran perincian langkah kegiatan yang dibutuhkan dalam penciptaan produk dengan memanfaatkan faktor produksi' },
      { id: 'C', text: 'Kualifikasi pengalaman dan sertifikasi keahlian pegawai kebun' },
      { id: 'D', text: 'Penetapan jadwal waktu kapan panen dimulai dan berakhir' },
    ],
    correctAnswer: 'B',
    explanation: 'Unsur "Way" (cara) merupakan penjabaran dari perincian kegiatan apa saja yang dibutuhkan dalam penciptaan suatu produk agribisnis dengan memanfaatkan faktor-faktor produksi.',
    points: 10,
    orderIndex: 6,
  },
  {
    id: 'q-mgt-7',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Petani cabai menargetkan panen raya pada bulan Desember–Januari karena harga cabai tinggi. Jika masa budidaya tanaman di lahan adalah 3 bulan dan masa pembibitan di tray adalah 1,5 bulan, maka kegiatan pembibitan sebaiknya dimulai pada...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Awal bulan November' },
      { id: 'B', text: 'Pertengahan bulan Juli' },
      { id: 'C', text: 'Awal bulan Oktober' },
      { id: 'D', text: 'Akhir bulan Desember' },
    ],
    correctAnswer: 'B',
    explanation: 'Melalui teknik perhitungan mundur (penjadwalan produksi): Target panen Desember -> tanam di lahan akhir Agustus/awal September (3 bulan mundur) -> pembibitan dimulai 1,5 bulan sebelumnya, yaitu pertengahan Juli.',
    points: 10,
    orderIndex: 7,
  },
  {
    id: 'q-mgt-8',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Menurut Hasibuan (2010), pemberian motivasi kepada bawahan berupa pujian, penghargaan, sertifikat, atau bonus atas kinerja yang berprestasi disebut...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Motivasi represif' },
      { id: 'B', text: 'Motivasi positif (insentif positif)' },
      { id: 'C', text: 'Motivasi preventif' },
      { id: 'D', text: 'Motivasi negatif (insentif negatif)' },
    ],
    correctAnswer: 'B',
    explanation: 'Motivasi positif (insentif positif) memotivasi bawahan dengan memberikan apresiasi sehingga kepuasan dan semangat kerja meningkat secara jangka panjang.',
    points: 10,
    orderIndex: 8,
  },
  {
    id: 'q-mgt-9',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Tindakan pengawasan yang dilakukan SEBELUM terjadinya kesalahan atau penyimpangan dalam proses produksi agribisnis (seperti kalibrasi alat sprayer sebelum menyemprot) dinamakan...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Pengawasan preventif' },
      { id: 'B', text: 'Pengawasan represif' },
      { id: 'C', text: 'Pengawasan komparatif' },
      { id: 'D', text: 'Pengawasan pascatindakan' },
    ],
    correctAnswer: 'A',
    explanation: 'Pengawasan preventif dilakukan sebelum terjadinya kesalahan/penyelewengan guna melakukan tindakan pencegahan dini.',
    points: 10,
    orderIndex: 9,
  },
  {
    id: 'q-mgt-10',
    quizId: 'quiz-manajemen-agribisnis-x',
    questionText: 'Berdasarkan Peraturan Pemerintah (PP) No. 50 Tahun 2012, penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3) diwajibkan bagi perusahaan yang...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Hanya memiliki kantor di gedung bertingkat tinggi' },
      { id: 'B', text: 'Mempekerjakan pekerja minimal 100 orang atau memiliki potensi bahaya tinggi' },
      { id: 'C', text: 'Memiliki modal usaha minimal 50 miliar rupiah' },
      { id: 'D', text: 'Hanya mengekspor komoditas buah ke luar negeri' },
    ],
    correctAnswer: 'B',
    explanation: 'PP No. 50 Tahun 2012 mewajibkan penerapan SMK3 bagi perusahaan yang mempekerjakan pekerja minimal 100 orang ATAU yang ruang lingkup pekerjaannya memiliki tingkat potensi bahaya tinggi (misalnya bahan kimia pestisida dan alsintan alat berat).',
    points: 10,
    orderIndex: 10,
  },
  {
    id: 'q-1',
    quizId: 'quiz-dasar-hidroponik',
    questionText: 'Berapakah rentang pH ideal larutan nutrisi untuk budidaya selada hidroponik agar penyerapan unsur hara optimal?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: '4.0 - 5.0' },
      { id: 'B', text: '5.5 - 6.5' },
      { id: 'C', text: '7.5 - 8.5' },
      { id: 'D', text: '8.5 - 9.5' },
    ],
    correctAnswer: 'B',
    explanation: 'Pada rentang pH 5.5 - 6.5, sebagian besar unsur hara makro (N, P, K, Ca, Mg, S) dan mikro (Fe, Mn, Zn, Cu, B, Mo) berada dalam bentuk terlarut yang mudah diserap akar tanaman.',
    points: 20,
    orderIndex: 1,
  },
  {
    id: 'q-2',
    quizId: 'quiz-dasar-hidroponik',
    questionText: 'Alat ukur yang digunakan untuk mendeteksi kepekatan garam mineral/larutan nutrisi dalam air hidroponik adalah...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Anemometer' },
      { id: 'B', text: 'TDS / EC Meter' },
      { id: 'C', text: 'Higrometer' },
      { id: 'D', text: 'Barometer' },
    ],
    correctAnswer: 'B',
    explanation: 'EC (Electrical Conductivity) meter mengukur daya hantar listrik larutan yang berbanding lurus dengan kepekatan total garam terlarut (TDS - Total Dissolved Solids) dalam satuan ppm atau mS/cm.',
    points: 20,
    orderIndex: 2,
  },
  {
    id: 'q-3',
    quizId: 'quiz-dasar-hidroponik',
    questionText: 'Pada sistem NFT (Nutrient Film Technique), ketebalan aliran nutrisi di dasar talang atau pipa sebaiknya diatur sangat tipis (1–3 mm). Pernyataan ini benar atau salah?',
    questionType: 'true_false',
    options: [
      { id: 'true', text: 'Benar' },
      { id: 'false', text: 'Salah' },
    ],
    correctAnswer: 'true',
    explanation: 'Benar, tujuan aliran tipis seperti film adalah agar bagian atas massa akar mendapatkan suplai oksigen langsung dari udara terbuka sementara bagian bawah menyerap larutan nutrisi.',
    points: 20,
    orderIndex: 3,
  },
  {
    id: 'q-4',
    quizId: 'quiz-dasar-hidroponik',
    questionText: 'Kekurangan unsur hara Nitrogen (N) pada tanaman sayuran daun ditandai dengan gejala utama yaitu...',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Daun muda mengkerut dan kerdil' },
      { id: 'B', text: 'Daun-daun tua menguning secara merata (klorosis)' },
      { id: 'C', text: 'Tepi daun terbakar warna ungu kebiruan' },
      { id: 'D', text: 'Batang tanaman menjadi berkayu keras dan tebal' },
    ],
    correctAnswer: 'B',
    explanation: 'Nitrogen bersifat mobile di dalam jaringan tanaman. Jika terjadi defisiensi, tanaman akan merelokasi cadangan N dari daun tua ke titik tumbuh baru, menyebabkan daun tua menguning terlebih dahulu.',
    points: 20,
    orderIndex: 4,
  },
  {
    id: 'q-5',
    quizId: 'quiz-dasar-hidroponik',
    questionText: 'Mengapa pupuk pekatan Stok A dan Stok B dalam formula AB Mix tidak boleh dicampur bersamaan dalam keadaan konsentrat pekat?',
    questionType: 'multiple_choice',
    options: [
      { id: 'A', text: 'Kalsium pada Stok A akan bereaksi dengan Sulfat/Fosfat pada Stok B membentuk endapan kalsium sulfat/gipsum yang tidak larut' },
      { id: 'B', text: 'Menimbulkan bau menyengat yang mengundang lalat buah' },
      { id: 'C', text: 'Menurunkan pH air secara drastis hingga mendekati asam murni' },
      { id: 'D', text: 'Menghilangkan warna merah dan hijau pada pupuk' },
    ],
    correctAnswer: 'A',
    explanation: 'Kation Ca2+ pekat pada Stok A bila bertemu dengan anion SO4 2- atau PO4 3- pada Stok B konsentrat akan membentuk endapan kalsium sulfat (gipsum) yang tidak larut dan tidak dapat diserap akar tanaman.',
    points: 20,
    orderIndex: 5,
  },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att-rizky-1',
    quizId: 'quiz-dasar-hidroponik',
    quizTitle: 'Evaluasi Pembelajaran: Prinsip Hidroponik & Nutrisi Tanaman',
    studentId: 'usr-student-rizky',
    studentName: 'Rizky Pratama',
    className: 'X ATPH',
    startedAt: '2026-08-04T13:00:00Z',
    completedAt: '2026-08-04T13:14:20Z',
    answers: [
      { questionId: 'q-1', userAnswer: 'B', isCorrect: true, pointsAwarded: 20 },
      { questionId: 'q-2', userAnswer: 'B', isCorrect: true, pointsAwarded: 20 },
      { questionId: 'q-3', userAnswer: 'true', isCorrect: true, pointsAwarded: 20 },
      { questionId: 'q-4', userAnswer: 'B', isCorrect: true, pointsAwarded: 20 },
      { questionId: 'q-5', userAnswer: 'A', isCorrect: true, pointsAwarded: 20 },
    ],
    score: 100,
    maxScore: 100,
    percentage: 100,
    passed: true,
    attemptNumber: 1,
  },
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-rizky',
    studentId: 'usr-student-rizky',
    studentName: 'Rizky Pratama',
    nisn: '0078129381',
    classId: 'cls-10-atph',
    className: 'X ATPH',
    assignmentAverage: 92,
    quizAverage: 100,
    finalScore: 96,
    status: 'Tuntas',
    notes: 'Sangat kompeten dalam penyiapan nutrisi dan pengoperasian hidroponik NFT.',
  },
  {
    id: 'grd-siti',
    studentId: 'usr-student-siti',
    studentName: 'Siti Rahmawati',
    nisn: '0078129382',
    classId: 'cls-10-atph',
    className: 'X ATPH',
    assignmentAverage: 88,
    quizAverage: 80,
    finalScore: 84,
    status: 'Tuntas',
    notes: 'Pemahaman konsep dasar baik, aktif dalam praktik lapangan.',
  },
  {
    id: 'grd-dimas',
    studentId: 'usr-student-dimas',
    studentName: 'Dimas Anggoro',
    nisn: '0068129401',
    classId: 'cls-11-atph',
    className: 'XI ATPH',
    assignmentAverage: 85,
    quizAverage: 82,
    finalScore: 83.5,
    status: 'Tuntas',
    notes: 'Keterampilan budidaya cabai sangat baik.',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-praktik-lapangan',
    title: 'Jadwal Praktik Persemaian Tanaman Sayuran di Greenhouse Utama',
    content: `
Diberitahukan kepada seluruh siswa kelas X ATPH:
Praktik persemaian benih cabai dan selada akan dilaksanakan pada hari Rabu pukul 08.00 WIB. 
Harap membawa kelengkapan:
1. Pakaian kerja lapangan (wearpack ATPH)
2. Sepatu boots & sarung tangan berkebun
3. Spidol permanen & buku catatan logbook
Keterlambatan lebih dari 15 menit tidak diperkenankan memasuki area greenhouse steril.
    `,
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    priority: 'important',
    isPublished: true,
    authorName: 'Okta Nofiyanto',
    createdAt: '2026-08-12T07:30:00Z',
  },
  {
    id: 'anc-evaluasi-tengah-semester',
    title: 'Pengumuman Pelaksanaan Evaluasi Teori ATPH Semester Ganjil',
    content: 'Evaluasi online akan dibuka serentak pada portal EduATPH mulai hari Senin pukul 09.00 WIB. Pastikan baterai laptop/ponsel terisi penuh dan koneksi internet stabil.',
    targetClassId: 'all',
    targetClassName: 'Semua Kelas',
    priority: 'normal',
    isPublished: true,
    authorName: 'Okta Nofiyanto',
    createdAt: '2026-08-10T11:00:00Z',
  },
];
