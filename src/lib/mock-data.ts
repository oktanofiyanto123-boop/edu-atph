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
    title: 'Standar Formulasi & Sterilisasi Media Tanam Organik Pembibitan',
    slug: 'standar-formulasi-sterilisasi-media-tanam',
    description: 'Teknik formulasi media persemaian hortikultura dengan perbandingan tanah subur, arang sekam bakar, dan pupuk kandang matang terfermentasi.',
    categoryId: 'cat-2',
    categoryName: 'Penyiapan Media Tanam',
    targetClassId: 'cls-10-atph',
    targetClassName: 'X ATPH',
    topic: 'Karakteristik Fisik dan Kimia Tanah Pertanian',
    learningObjectives: [
      'Mengetahui komposisi ideal media tanam bibit cabai dan tomat (2:1:1)',
      'Melakukan pengujian kematangan pupuk kompos (uji bau, warna, dan C/N ratio)',
      'Memahami proses sterilisasi media tanam menggunakan uap air panas dan solarisasi matahari',
    ],
    content: `
### Kriteria Fisik Media Tanam Unggul
Media tanam yang ideal untuk pembibitan tanaman hortikultura harus memenuhi syarat kegemburan (porositas), aerasi yang baik, dan kapasitas menahan air (*water holding capacity*) yang seimbang.

#### Formula Standar Persemaian:
- **2 Bagian Topsoil:** Lapisan tanah atas yang kaya akan bahan organik.
- **1 Bagian Arang Sekam:** Berfungsi menjaga porositas, memperbaiki aerasi, dan menstabilkan pH tanah.
- **1 Bagian Kompos Fermentasi:** Sumber hara makro (N, P, K) dan mikroorganisme tanah menguntungkan (*Trichoderma sp.*).
    `,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    attachments: [
      {
        id: 'att-3',
        name: 'Panduan_Sterilisasi_Tanah.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSize: '1.8 MB',
        fileType: 'pdf',
      },
    ],
    orderIndex: 2,
    status: 'published',
    createdAt: '2026-08-05T08:00:00Z',
    updatedAt: '2026-08-05T08:00:00Z',
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
