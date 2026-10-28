import fs from 'fs';
import path from 'path';

// Minimal pure Node.js standard PDF 1.4 generator
class PDFBuilder {
  constructor() {
    this.objects = [];
    this.pages = [];
  }

  addObject(content) {
    const id = this.objects.length + 1;
    this.objects.push({ id, content });
    return id;
  }

  escapeText(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  addPage(pageContentCommands) {
    const stream = pageContentCommands.join('\n');
    const streamLen = Buffer.byteLength(stream, 'utf-8');

    const contentObjId = this.addObject(
      `<< /Length ${streamLen} >>\nstream\n${stream}\nendstream`
    );

    const pageObjId = this.addObject(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >> >> >> /Contents ${contentObjId} 0 R >>`
    );

    this.pages.push(pageObjId);
  }

  build() {
    // 1: Catalog
    // 2: Pages
    const catalogId = 1;
    const pagesId = 2;

    const allObjects = [];
    allObjects.push({
      id: catalogId,
      content: `<< /Type /Catalog /Pages ${pagesId} 0 R >>`,
    });

    // We will place pages obj later
    allObjects.push({ id: pagesId, content: '' });

    // Add rest of objects
    this.objects.forEach((obj) => {
      allObjects.push({
        id: obj.id + 2,
        content: obj.content,
      });
    });

    const pageRefs = this.pages.map((p) => `${p + 2} 0 R`).join(' ');
    allObjects[1].content = `<< /Type /Pages /Kids [ ${pageRefs} ] /Count ${this.pages.length} >>`;

    // Serialize
    let output = '%PDF-1.4\n%âãÏÓ\n';
    const xrefOffsets = [];

    allObjects.forEach((obj) => {
      xrefOffsets[obj.id] = Buffer.byteLength(output, 'utf-8');
      output += `${obj.id} 0 obj\n${obj.content}\nendobj\n`;
    });

    const xrefStart = Buffer.byteLength(output, 'utf-8');
    output += `xref\n0 ${allObjects.length + 1}\n`;
    output += '0000000000 65535 f \n';

    for (let i = 1; i <= allObjects.length; i++) {
      const offset = xrefOffsets[i] || 0;
      output += String(offset).padStart(10, '0') + ' 00000 n \n';
    }

    output += `trailer\n<< /Size ${allObjects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    return Buffer.from(output, 'utf-8');
  }
}

// Generate the 24-page PDF for Bab IV
const pdf = new PDFBuilder();

const pagesData = [
  // Page 1
  {
    header: 'KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI REPUBLIK INDONESIA, 2023',
    bookTitle: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    authors: 'Penulis: Ani Susanti, Yustinanda Rahma Dewi',
    isbn: 'ISBN: 978-623-194-505-1 (no.jil.lengkap PDF) / 978-623-194-506-8 (jil.1 PDF)',
    chapterNum: 'BAB IV',
    chapterTitle: 'Pengelolaan Faktor Produksi',
    sections: [
      {
        title: 'Tujuan Pembelajaran',
        paragraphs: [
          'Setelah mempelajari materi ini melalui literasi, diskusi, observasi dan identifikasi, dan bermain peran, Kalian mampu memahami pengelolaan sumber daya pendukung (sumber daya alam, sumber daya manusia, sumber daya pendukung lainnya / faktor produksi lainnya).',
        ],
      },
      {
        title: 'Pertanyaan Pemantik',
        paragraphs: [
          '1. Apakah kalian tahu tentang sumber daya pendukung pada proses produksi tanaman?',
          '2. Apa saja sumber daya pendukung tersebut?',
          '3. Bagaimana mengelola sumber daya pendukung tersebut supaya produksi tanaman optimal?',
        ],
      },
    ],
    pageNum: '111',
  },
  // Page 2
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Peta Konsep & Pengantar Faktor Produksi',
    sections: [
      {
        title: 'Peta Konsep Faktor Produksi',
        paragraphs: [
          'Faktor Produksi terbagi menjadi 3 pilar utama:',
          '  1. Pengelolaan Sumber Daya Alam (Tanah, Air, Iklim, Pupuk Alami)',
          '  2. Pengelolaan Sumber Daya Manusia (Petani, Pengusaha, Aparat Kebijakan)',
          '  3. Pengelolaan Faktor Produksi Lainnya (Modal Tetap, Modal Bergerak, Keahlian)',
        ],
      },
      {
        title: 'Pengertian Faktor Produksi',
        paragraphs: [
          'Sebelum membahas tentang pengelolaan sumber daya pendukung proses produksi tanaman, alangkah baiknya kita memahami terlebih dahulu tentang faktor produksi.',
          'Faktor produksi merupakan benda-benda yang diciptakan oleh alam atau dibuat oleh manusia dan dapat dimanfaatkan untuk menghasilkan barang dan jasa. Demikian halnya dengan kegiatan produksi pertanian yang juga membutuhkan ketersediaan faktor produksi.',
          'Audio Visual Pembelajaran: Simak tayangan budi daya tanaman vanili melalui tautan https://www.youtube.com/watch?v=rSQ5PQGDzU0 (Sumber: Rekayasa Teknologi, 2022).',
        ],
      },
    ],
    pageNum: '112',
  },
  // Page 3
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Faktor Produksi: Tanah dan Mineral',
    sections: [
      {
        title: 'Klasifikasi Empat Faktor Produksi Utama',
        paragraphs: [
          'Berdasarkan proses agribisnis tanaman, faktor produksi diklasifikasikan menjadi 4 jenis utama: Tanah, Tenaga Kerja, Modal, dan Keahlian.',
        ],
      },
      {
        title: '1. Tanah Sebagai Faktor Produksi Alami',
        paragraphs: [
          'Tanah dan segala yang tumbuh di atasnya, serta yang terdapat di dalamnya (seperti benda-benda tambang). Sebagai tempat hidup beberapa makhluk hidup, tanah terdiri atas beberapa komponen, yaitu bahan padatan atau mineral, bahan organik, air, dan udara.',
          'Bahan padatan penyusun tanah berupa batuan alami yang mengalami pelapukan menjadi mineral berupa ion positif dan ion negatif:',
          '  - Ion Positif dalam tanah: Kalium (K+), Magnesium (Mg2+), dan Kalsium (Ca2+).',
          '  - Ion Negatif dalam tanah: Ion Nitrat (NO3-) dan Fosfat (PO4 2-).',
          'Ion yang terkandung dalam mineral merupakan nutrisi esensial bagi pertumbuhan tanaman.',
        ],
      },
      {
        title: 'Bahan Organik dan Humus',
        paragraphs: [
          'Bahan organik tanah terdiri atas sisa-sisa makhluk hidup yang mati, daun yang gugur, atau kotoran hewan (feses) yang telah diuraikan oleh mikroorganisme bakteri dan jamur tanah.',
          'Hasil penguraian ini disebut humus. Humus memiliki peran krusial bagi kegemburan, aerasi, kapasitas ikat air, dan kesuburan tanah pertanian.',
        ],
      },
    ],
    pageNum: '113',
  },
  // Page 4
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Perbedaan Tanah vs Lahan & Tenaga Kerja',
    sections: [
      {
        title: 'Perbedaan Konseptual: Tanah vs Lahan',
        paragraphs: [
          'Kondisi tanah, air, dan udara akan menempati pori-pori (rongga) di antara partikel tanah. Dalam perkembangan pertanian modern, istilah LAHAN lebih tepat digunakan karena cakupannya lebih luas dibanding tanah.',
          'Menurut KBBI: Lahan adalah tanah terbuka atau tanah garapan.',
          'Menurut Ngadisih (2020): Lahan adalah lingkungan fisik (abiotik) dan biotik berkaitan dengan daya dukung untuk kehidupan dan kesejahteraan manusia.',
          'Simak tayangan video pengertian tanah dan lahan: https://www.youtube.com/watch?v=1tut4wAt7GA (Kanal FTP UGM, 2021).',
        ],
      },
      {
        title: '2. Tenaga Kerja (Labor) dalam Usaha Tani',
        paragraphs: [
          'Tenaga kerja (labor) merupakan setiap usaha yang dihasilkan dari sebagian atau seluruh kemampuan jasmani dan rohani manusia, dan/atau kemampuan fisik ternak atau mesin untuk kegiatan produksi barang dan jasa pertanian.',
          'Diperlukan untuk: pengolahan lahan, pembibitan, penanaman, pemupukan, pemeliharaan, pengendalian OPT, pemanenan, dan pascapanen.',
          'Sumber tenaga kerja usaha tani:',
          '  a. Tenaga Kerja Dalam Keluarga (TKDK / family labour): Seluruh tenaga dalam keluarga petani.',
          '  b. Tenaga Kerja Luar Keluarga (TKLK / hired labour): Tenaga upahan dari luar keluarga.',
        ],
      },
    ],
    pageNum: '114',
  },
  // Page 5
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Satuan HOK, Modal, dan Keahlian Manajerial',
    sections: [
      {
        title: 'Satuan HOK (Hari Orang Kerja)',
        paragraphs: [
          'Satuan tenaga kerja yang digunakan dalam menghitung analisis usaha tani disebut Hari Orang Kerja (HOK).',
          'Ketentuan: 1 HOK usaha tani dihitung 8 jam kerja per hari (termasuk 1 jam istirahat).',
        ],
      },
      {
        title: '3. Modal (Capital)',
        paragraphs: [
          'Modal merupakan semua jenis barang dan/atau jasa yang jika diolah bersama faktor produksi lain akan menghasilkan barang baru atau menunjang proses produksi.',
          'Modal Tetap: Barang investasi yang dapat digunakan berulang kali (mesin traktor, sprayer, bangunan greenhouse, kendaraan farm). Nilainya dihitung berdasarkan penyusutan per masa produksi.',
          'Modal Bergerak / Operasional: Modal yang habis dalam satu kali siklus tanam (benih, pupuk, pestisida, bahan bakar solar).',
        ],
      },
      {
        title: '4. Keahlian (Skill / Entrepreneurship)',
        paragraphs: [
          'Keahlian manajerial atau kecakapan kewirausahaan yang berperan mengkoordinasikan dan mengoptimalkan ketiga faktor produksi lainnya (tanah, tenaga kerja, modal) agar berfungsi pada efisiensi puncak.',
        ],
      },
      {
        title: 'Subbab A: Pengelolaan Sumber Daya Alam',
        paragraphs: [
          'Apersepsi: Mengapa faktor sumber daya alam harus dikelola dengan prinsip pelestarian lingkungan? Mari kita pelajari konsep pertanian berkelanjutan.',
        ],
      },
    ],
    pageNum: '115',
  },
  // Page 6
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Pertanian Berkelanjutan & Metode SRI',
    sections: [
      {
        title: 'Empat Kriteria Pertanian Berkelanjutan (Sustainable Agriculture)',
        paragraphs: [
          'Pertanian berkelanjutan adalah sebuah sistem usaha tani menyeluruh (holistik) yang memenuhi 4 pilar kriteria:',
          '  1. Aspek Ekonomi: Menguntungkan secara finansial dan layak usaha.',
          '  2. Aspek Ekologi: Bersahabat, ramah lingkungan, dan tidak merusak ekosistem.',
          '  3. Aspek Sosial: Berkeadilan dan diterima oleh masyarakat luas (kesetaraan akses pasar bagi petani kecil).',
          '  4. Aspek Budaya: Sesuai dengan kearifan lokal serta mudah diterapkan secara teknis.',
        ],
      },
      {
        title: 'Metode SRI (System of Rice Intensification)',
        paragraphs: [
          'SRI adalah metode budi daya padi organik hemat air yang mengedepankan kearifan lokal. Manfaat nyata metode SRI:',
          '  - Menghemat pemakaian air irigasi hingga 50%.',
          '  - Memperbaiki sifat fisik, kimia, dan biologi tanah sawah.',
          '  - Memulihkan ekosistem mikroorganisme tanah.',
          '  - Menggantikan 100% pupuk anorganik sintetis dengan kompos pupuk kandang matang.',
          'Simak audio visual budi daya padi organik metode SRI: https://www.youtube.com/watch?v=lPRPued7hDk (TV Tani Indonesia, 2021).',
        ],
      },
    ],
    pageNum: '116',
  },
  // Page 7
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Bagan Konsep Holistik & Panduan Diskusi',
    sections: [
      {
        title: 'Bagan Konsep Holistik Pertanian Berkelanjutan',
        paragraphs: [
          'Keterkaitan sistemik:',
          '  - Sistem Sosial: Pengetahuan dan keyakinan petani -> Pengendalian hama dan penyakit.',
          '  - Faktor Produksi / Saprodi -> Tanaman / Ternak / Ikan -> Keberlanjutan Produksi.',
          '  - Tanah & Biota Tanah -> Kuantitas dan Kualitas Air -> Mencegah Degradasi Lahan.',
          '  - Sistem Ekonomi & Politik: Kebijakan pupuk, harga gabah, dan kelestarian hayati.',
        ],
      },
      {
        title: 'Petunjuk Aktivitas Diskusi Kelompok',
        paragraphs: [
          '1. Bentuk kelompok belajar yang terdiri dari 4-5 siswa.',
          '2. Tunjuk satu orang sebagai ketua kelompok dan satu orang sebagai notulis.',
          '3. Identifikasi sumber daya alam pertanian di lingkungan sekolah atau daerah kalian.',
          '4. Diskusikan dan rancang langkah-langkah pengelolaannya sesuai prinsip pertanian berkelanjutan.',
          '5. Tuliskan hasil diskusi pada Blangko Aktivitas Diskusi untuk dipresentasikan di depan kelas.',
        ],
      },
    ],
    pageNum: '117',
  },
  // Page 8
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Tabel 4.1 Blangko Aktivitas Diskusi Kelompok',
    sections: [
      {
        title: 'Blangko Aktivitas Diskusi Kelompok Siswa',
        paragraphs: [
          'Aktivitas Belajar : Pengelolaan Sumber Daya Alam Pertanian Berkelanjutan',
          'Hari / Tanggal    : ............................................................',
          'Kelompok / Kelas  : ............................................................',
          'Nama Anggota      : 1. ................................. 2. .................................',
          '                    3. ................................. 4. .................................',
        ],
      },
      {
        title: 'Format Tabel Kerja Analisis:',
        paragraphs: [
          '----------------------------------------------------------------------------------',
          '| No | Identifikasi Sumber Daya Alam | Cara Pengelolaan Berkelanjutan              |',
          '----------------------------------------------------------------------------------',
          '| 1. | Tanah / Lahan Pertanian      | Pemupukan organik, rotasi tanaman, biopori  |',
          '| 2. | Sumber Daya Air & Irigasi    | Pembuatan embung, irigasi tetes, rorak       |',
          '| 3. | Keanekaragaman Hayati / Biota| PHT, pemanfaatan musuh alami Trichogramma   |',
          '| 4. | Bahan Organik & Hara Tanah   | Kompos kascing, mulsa vertikal, leguminosae  |',
          '----------------------------------------------------------------------------------',
          'Kesimpulan Diskusi Kelompok:',
          'Pengelolaan SDA yang bijak menjaga produktivitas jangka panjang tanpa merusak ekosistem hayati.',
        ],
      },
    ],
    pageNum: '118',
  },
  // Page 9
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Pengendalian Hama Terpadu (PHT)',
    sections: [
      {
        title: 'Prinsip Dasar Pengendalian Hama Terpadu (PHT)',
        paragraphs: [
          'PHT adalah pendekatan pengelolaan organisme pengganggu tanaman yang memadukan metode biologi, fisik, mekanis, budidaya, dan kimiawi untuk meminimalkan biaya ekonomi serta resiko lingkungan.',
          'Prinsip Utama PHT:',
          '  1. Budidaya tanaman sehat dengan benih varietas tahan hama.',
          '  2. Melestarikan dan memanfaatkan agen pengendali hayati (musuh alami).',
          '  3. Pengamatan mingguan secara rutin di petak sawah/kebun.',
          '  4. Petani sebagai manajer dan pengambil keputusan di lahannya.',
        ],
      },
      {
        title: 'Agen Pengendali Hayati (Parasitoid & Predator)',
        paragraphs: [
          'Pemanfaatan Trichogramma sp. sebagai musuh alami parasit telur dan larva penggerek batang padi/tebu.',
          'Peran predator alami seperti laba-laba, kumbang koksinil, dan burung hantu (Tyto alba) pengendali hama tikus sawah.',
        ],
      },
    ],
    pageNum: '119',
  },
  // Page 10
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Ambang Ekonomi & Konservasi Lahan/Air',
    sections: [
      {
        title: 'Konsep Ambang Ekonomi (AE)',
        paragraphs: [
          'Ambang Ekonomi (AE) adalah batas kepadatan populasi hama yang memerlukan tindakan pengendalian aktif guna mencegah populasi mencapai Tingkat Kerusakan Ekonomi (TKE).',
          'Keputusan penyemprotan pestisida nabati/kimia hanya diambil apabila populasi hama telah melampaui Ambang Ekonomi.',
        ],
      },
      {
        title: 'Tanaman Perangkap & Konservasi Tanah dan Air',
        paragraphs: [
          'Penggunaan tanaman pemikat (atraktan) seperti bunga refugia (kenikir, bunga matahari) untuk mengalihkan hama dari tanaman pokok.',
          'Metode Mekanis Konservasi:',
          '  - Terasering / Pembuatan Teras: Memperpendek panjang lereng dan memperlambat laju limpasan air (run-off).',
          '  - Embung Pertanian: Kolam penampung air hujan untuk cadangan irigasi musim kemarau.',
          '  - Guludan dan pengolahan tanah memotong garis kontur lereng bukit.',
        ],
      },
    ],
    pageNum: '120',
  },
  // Page 11
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Teknik Rorak / Parit Buntu & Lubang Biopori',
    sections: [
      {
        title: 'Teknik Rorak (Parit Buntu / Teras Saluran)',
        paragraphs: [
          'Rorak adalah lubang-lubang buntu yang dibuat sejajar kontur lereng, umumnya berukuran panjang 100 cm, lebar 40 cm, dan kedalaman 40 cm.',
          'Fungsi Utama Rorak: Meresapkan air limpasan hujan ke dalam profil tanah dan menampung sedimen tanah yang tererosi.',
          'Data Penelitian (Monde 2010 dlm Sallata 2017):',
          '  - Rorak yang diberi mulsa vertikal menekan aliran permukaan hingga 73%.',
          '  - Rorak terbukti menekan tanah tererosi hingga 76%.',
          '  - Pemberian mulsa 6 ton/ha pada kebun kakao menurunkan aliran permukaan 71% dan erosi 87%.',
        ],
      },
      {
        title: 'Lubang Resapan Biopori (LRB)',
        paragraphs: [
          'Lubang silindris tegak sedalam 80-100 cm dengan diameter 10-30 cm yang diisi sampah organik dedaunan.',
          'Sampah organik mengundang cacing dan fauna tanah membentuk terowongan mikroskopis (biopori) yang mempercepat resapan air.',
        ],
      },
    ],
    pageNum: '121',
  },
  // Page 12
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Tipe Teras Lahan & Perlindungan Kualitas Air',
    sections: [
      {
        title: 'Ragam Tipe Teras Pertanian Lahan Miring',
        paragraphs: [
          'Macam-macam bentuk teras:',
          '  1. Teras Bangku (Bench Terrace): Bidang olah datar dengan tampingan rumput penguat.',
          '  2. Teras Guludan: Cocok untuk lereng 8-15% dengan tanaman semusim.',
          '  3. Teras Kebun & Teras Individu: Dibuat khusus melingkari pokok tanaman buah/perkebunan tahunan.',
          '  4. Teras Saluran & Teras Batu: Memanfaatkan tumpukan batu lereng.',
        ],
      },
      {
        title: 'Langkah Perlindungan Kualitas Sumber Daya Air Pertanian',
        paragraphs: [
          '1. Mengurangi aplikasi bahan kimia sintetis pada lapisan tanah atas (top soil) agar tidak mencemari air tanah dangkal (water table).',
          '2. Menggunakan sistem irigasi tetes (drip irrigation) hemat air langsung ke perakaran.',
          '3. Mempertahankan jalur hijau konservasi (riparian buffer) di sepanjang tepi saluran drainase dan sungai.',
        ],
      },
    ],
    pageNum: '122',
  },
  // Page 13
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Diversifikasi Tanaman & Biologi Tanah',
    sections: [
      {
        title: 'Strategi Diversifikasi Tanaman',
        paragraphs: [
          'Menanam ragam tanaman bernilai ekonomi tinggi dalam satu hamparan untuk meredam fluktuasi harga pasar dan resiko kegagalan panen.',
          'Langkah konkret: Penanaman tanaman penutup (cover crops) seperti legum dan semanggi untuk menekan gulma.',
        ],
      },
      {
        title: 'Pengelolaan Nutrisi & Simbiosis Mikroorganisme Tanah',
        paragraphs: [
          'Tanaman Leguminosae bersimbiosis dengan Rhizobium sp. untuk mengikat nitrogen bebas (N2) dari udara ke dalam tanah.',
          'Peran Fungi Mikoriza Arbuskular (FMA): Memperluas jangkauan serapan akar terhadap unsur fosfat (P) dan air pada kondisi cekaman kekeringan.',
          'Penggunaan pupuk organik: Kompos matang, kascing (bekas cacing), dan pupuk hijau dedaunan.',
          'Simak video simbiosis Rhizobakteri dan Mikoriza: https://www.youtube.com/watch?v=enLlU-7MFxs (Deki Kun Farm, 2022).',
        ],
      },
    ],
    pageNum: '123',
  },
  // Page 14
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Agroforestri & Prinsip Pertanian Organik',
    sections: [
      {
        title: 'Sistem Agroforestri (Wanatani)',
        paragraphs: [
          'Agroforestri adalah sistem tata guna lahan permanen yang memadukan tanaman tahunan berkayu (kehutanan) dengan tanaman semusim (pertanian) dan/atau ternak.',
          'Contoh praktis: Tumpangsari tanaman jagung atau kedelai di antara tegakan pohon jati muda.',
          'Manfaat Agroforestri:',
          '  1. Penghasilan petani berkesinambungan (harian/musiman dari jagung, jangka panjang dari kayu).',
          '  2. Menahan energi kinetik air hujan melalui stratifikasi tajuk pohon berlapis (Stratum A hingga E).',
        ],
      },
      {
        title: 'Prinsip Ekologi Pertanian Organik',
        paragraphs: [
          'Pertanian organik menolak benih rekayasa genetika (GMO), pupuk kimia sintetis, dan pestisida racun.',
          'Prinsip 1 menurut Sulaiman (2007): Prinsip Ekologi — Membangun sistem produksi yang harmonis dengan siklus dan daya dukung alamiah bumi.',
        ],
      },
    ],
    pageNum: '124',
  },
  // Page 15
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Pertanian Regeneratif (Regenerative Agriculture)',
    sections: [
      {
        title: 'Empat Prinsip Pertanian Organik (Sulaiman, 2007)',
        paragraphs: [
          '1. Prinsip Ekologi: Berbasis pada siklus hidup alami.',
          '2. Prinsip Kesehatan: Menjaga kesehatan tanah, tanaman, hewan, dan manusia sebagai satu kesatuan utuh.',
          '3. Prinsip Keadilan: Menjamin keadilan lingkungan dan kesempatan hidup bersama.',
          '4. Prinsip Perlindungan: Dikelola dengan kehati-hatian demi generasi sekarang dan masa depan.',
        ],
      },
      {
        title: 'Empat Teknik Kunci Pertanian Regeneratif',
        paragraphs: [
          'Pertanian regeneratif berfokus memulihkan kembali kadar karbon organik tanah (soil organic carbon):',
          '  1. Pengolahan tanah konservasi (No-till / Minimum tillage): Mencegah karbon teroksidasi ke atmosfer.',
          '  2. Keanekaragaman tanaman: Eksudat akar yang kaya gula memberi makan miliaran mikroba tanah.',
          '  3. Rotasi tanaman & Tanaman Penutup (Cover crops): Memperkaya bahan organik dan memutus siklus hama.',
          '  4. Menghindari kekacauan kimiawi: Menghindari herbisida keras yang merusak hifa jamur tanah.',
        ],
      },
    ],
    pageNum: '125',
  },
  // Page 16
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Subbab B: Pengelolaan Sumber Daya Manusia',
    sections: [
      {
        title: 'Apersepsi SDM Pertanian Indonesia',
        paragraphs: [
          'Tantangan ketahanan pangan masa depan: regenerasi petani muda di era pertanian modern 4.0 dan smart farming.',
          'Lulusan SMK Pertanian disiapkan menjadi mandor profesional, supervisor agribisnis, manajer kebun, hingga wirausahawan agribisnis (agripreneur).',
        ],
      },
      {
        title: 'Peran SDM dalam 4 Subsistem Agribisnis',
        paragraphs: [
          'SDM berperan di setiap lini bisnis:',
          '  - Subsistem Hulu: Formulator pupuk, pemulia benih, teknisi alsintan.',
          '  - Subsistem Budidaya: Petani terampil, mandor greenhouse, operator irigasi tetes.',
          '  - Subsistem Hilir: Petugas sortasi/grading, operator pengolahan pascapanen, tenaga pemasaran.',
          '  - Subsistem Penunjang: Penyuluh pertanian lapang (PPL), analis kredit perbankan, peneliti.',
        ],
      },
    ],
    pageNum: '126',
  },
  // Page 17
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Tiga Kategori SDM Pertanian & RDK/RDKK',
    sections: [
      {
        title: 'Tiga Pilar SDM Pertanian (Saragih, 2004)',
        paragraphs: [
          '1. Para Petani dan Pengusaha Tani: Pelaku utama yang menjalankan kegiatan budi daya tanaman di lahan.',
          '2. Pelaku Usaha Agribisnis: Pengelola bisnis penyedia saprodi, pergudangan, pengolahan, dan pemasaran produk.',
          '3. Aparat Pemerintah: Pembuat regulasi (Undang-Undang, Permentan), pengawas distribusi pupuk bersubsidi, dan penyuluh.',
        ],
      },
      {
        title: 'Aktivitas Bermain Peran: Penyusunan RDK & RDKK',
        paragraphs: [
          'Simulasi penyusunan dokumen perencanaan kelompok tani:',
          '  - RDK (Rencana Definitif Kelompok): Pola tanam, luas tanam komoditas, dan jadwal kegiatan usaha tani bersama.',
          '  - RDKK (Rencana Definitif Kebutuhan Kelompok): Rincian kebutuhan riil benih, pupuk bersubsidi, dan alsintan selama satu tahun.',
        ],
      },
    ],
    pageNum: '127',
  },
  // Page 18
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Tabel 4.2 Pembagian Peran & Subbab C: Modal Usaha',
    sections: [
      {
        title: 'Tabel 4.2 Contoh Pembagian Peran Simulasi Kelas',
        paragraphs: [
          'Peran yang dimainkan siswa:',
          '  - Kelompok Tani A & B: Ketua Poktan dan anggota petani mendiskusikan kebutuhan musim tanam.',
          '  - Penyuluh Pertanian Lapang (PPL): Membimbing perhitungan dosis pupuk dan verifikasi RDKK.',
          '  - Aparat Desa / Pemerintah (RT/Kadus): Mengesahkan dan memfasilitasi kebutuhan petani.',
        ],
      },
      {
        title: 'Subbab C: Pengelolaan Faktor Produksi Lainnya (Modal & Keahlian)',
        paragraphs: [
          'Definisi Modal menurut Hanafie (2010): Keseluruhan nilai sumber ekonomi non-manusia yang berupa harta benda yang dapat digunakan untuk menghasilkan nilai tambah dan kekayaan baru.',
        ],
      },
    ],
    pageNum: '128',
  },
  // Page 19
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Analisis Biaya Modal Usaha Tani Cabai',
    sections: [
      {
        title: 'Diferensiasi Modal Tetap vs Modal Bergerak',
        paragraphs: [
          '1. Modal Tetap: Barang modal yang bertahan lebih dari satu siklus produksi (traktor cultivator, instalasi green house, sprayer elektrik, cangkul, gudang benih). Biaya diperhitungkan melalui nilai penyusutan (depresiasi).',
          '2. Modal Bergerak (Modal Kerja): Habis dipakai dalam satu musim tanam (benih cabai hibrida, mulsa plastik perak hitam, pupuk NPK Mutiara, pestisida organik, upah harian tenaga kerja).',
          'Simak video perhitungan modal awal tanam cabai: https://www.youtube.com/watch?v=w3TTftfyvkI (Petani Polycultur, 2022).',
        ],
      },
      {
        title: 'Faktor Keahlian Manajerial (Management Skill)',
        paragraphs: [
          'Keahlian manajerial adalah seni mengkombinasikan tanah, tenaga kerja, dan modal secara tepat waktu dan tepat sasaran. Meliputi fungsi POAC: Perencanaan (Planning), Pengorganisasian (Organizing), Pelaksanaan (Actuating), dan Pengawasan (Controlling).',
        ],
      },
    ],
    pageNum: '129',
  },
  // Page 20
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Gambar 4.16 Infografis Tugas & Keahlian Manajerial',
    sections: [
      {
        title: 'Lima Tugas Utama Manajemen Produksi Tanaman',
        paragraphs: [
          '1. Memeriksa kebun/lahan untuk menentukan waktu tanam tepat dan mendeteksi gejala serangan OPT.',
          '2. Mengarahkan operasional penyiapan lahan, penanaman, fertilisasi presisi, dan jadwal pemanenan.',
          '3. Mengawasi kepatuhan SOP irigasi, pemupukan kimia/organik, dan standar keamanan pangan.',
          '4. Merencanakan kegiatan panen berdasarkan prakiraan cuaca dan kematangan optimal komoditas.',
          '5. Mencatat pembukuan keuangan, arus kas, arsip logistik operasional, dan hasil panen.',
        ],
      },
      {
        title: 'Lima Keahlian Kunci Manajer Agribisnis',
        paragraphs: [
          '1. Keterampilan Teknis (Technical Skill): Mengoperasikan alsintan, teknik okulasi/cangkok, aplikasi pestisida aman.',
          '2. Manajemen Waktu (Time Management): Ketepatan jadwal tanam mundur musim perayaan.',
          '3. Pengambilan Keputusan (Decision Making): Cepat dan tepat menangani anomali cuaca atau hama.',
          '4. Pemantauan & Evaluasi: Mengoreksi penyimpangan kerja operasional lapangan.',
          '5. Komunikasi Efektif (Communication): Membangun relasi harmonis dengan petani pekerja dan pembeli.',
        ],
      },
    ],
    pageNum: '130',
  },
  // Page 21
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Tabel 4.3 Blangko Aktivitas Simulasi Manajer Usaha Tani',
    sections: [
      {
        title: 'Simulasi Peran: Menjadi Manajer Agribisnis',
        paragraphs: [
          'Instruksi Siswa: Pilih satu komoditas sayuran/buah unggulan (misal: Tomat Beef Hidroponik, Cabai Merah Keriting, Melon Golden). Identifikasikan rincian input yang diperlukan:',
          '  - Tenaga kerja yang dibutuhkan dan syarat keahlian khusus.',
          '  - Daftar barang modal tetap yang harus disiapkan.',
          '  - Rincian kebutuhan modal bergerak selama satu musim tanam.',
          'Lakukan penilaian rekan sejawat (peer assessment) mengenai kecakapan komunikasi dan kepemimpinan manajer.',
        ],
      },
      {
        title: 'Format Tabel Kerja Mandiri Siswa:',
        paragraphs: [
          '| Kegiatan Produksi | Tenaga Kerja | Keterampilan Dibutuhkan | Modal Tetap | Modal Bergerak |',
          '| Olah Lahan & Bedeng | Operator Traktor | Mahir cultivator & kontur | Traktor Roda 2 | Solar, Mulsa PHP |',
          '| Penanaman & Semai   | Pekerja Kebun   | Teliti pasang ajir & bibit | Tray Semai, Esemper | Benih, Fungisida |',
          '| Nutrisi & Irigasi   | Teknisi Irigasi | Paham EC/pH meter larutan | Pompa & Selang Drip | Pupuk AB Mix / NPK|',
        ],
      },
    ],
    pageNum: '131',
  },
  // Page 22
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Rangkuman Komprehensif Bab IV',
    sections: [
      {
        title: 'Empat Pokok Rangkuman Bab IV',
        paragraphs: [
          '1. Faktor produksi adalah seluruh benda ciptaan alam maupun buatan manusia yang digunakan untuk menghasilkan barang dan jasa pertanian. Terdiri atas tanah/lahan, tenaga kerja, modal, dan keahlian manajerial.',
          '2. Pengelolaan sumber daya alam berlandaskan prinsip Pertanian Berkelanjutan (memenuhi aspek ekonomi, ekologi, sosial, dan budaya). Diwujudkan melalui metode Pengendalian Hama Terpadu (PHT) dengan ambang ekonomi serta konservasi lahan & air (terasering, rorak parit buntu, biopori, mulsa).',
          '3. Sumber daya manusia pertanian mencakup petani pengusaha, pelaku agribisnis penunjang, dan aparat regulator pemerintah yang harus bersinergi dalam perencanaan kelompok (RDK/RDKK).',
          '4. Pengelolaan modal memisahkan modal tetap (dihitung nilai penyusutan) dan modal bergerak (habis satu siklus tanam). Keahlian manajerial mengintegrasikan seluruh faktor input mencapai produktivitas optimal.',
        ],
      },
    ],
    pageNum: '132',
  },
  // Page 23
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Asesmen Pembelajaran & Pengayaan',
    sections: [
      {
        title: 'Asesmen Nontes (Portofolio)',
        paragraphs: [
          'Kumpulkan laporan hasil diskusi kelompok analisis konservasi SDA dan blangko pembagian peran manajer agribisnis.',
        ],
      },
      {
        title: 'Asesmen Tes Tertulis (Uji Pemahaman Siswa)',
        paragraphs: [
          'Jawablah pertanyaan-pertanyaan berikut dengan jelas dan sistematis:',
          '1. Menurutmu, bagaimana prinsip pengelolaan sumber daya alam pertanian yang berwawasan lingkungan?',
          '2. Jelaskan peranan tiga kategori sumber daya manusia dalam rantai agribisnis tanaman!',
          '3. Sebutkan dan jelaskan dua jenis modal usaha tani beserta masing-masing 3 contoh konkretnya!',
          '4. Keterampilan manajerial apa yang paling penting untuk mengatasi kendala operasional lapangan? Berikan alasannya!',
        ],
      },
      {
        title: 'Materi Pengayaan: Pertanian Zero Waste',
        paragraphs: [
          'Untuk memperluas cakrawala berpikir kalian tentang efisiensi faktor produksi, simak tayangan konsep Pertanian Zero Waste (Pertanian Bebas Limbah Terpadu): https://www.youtube.com/watch?v=HnC4C_zSVnI (AFH Channel, 2020).',
        ],
      },
    ],
    pageNum: '133',
  },
  // Page 24
  {
    header: 'Dasar-Dasar Agribisnis Tanaman untuk SMK/MAK Kelas X',
    chapterNum: 'Bab IV: Pengelolaan Faktor Produksi',
    chapterTitle: 'Refleksi Pembelajaran Bab IV',
    sections: [
      {
        title: 'Tabel 4.4 Refleksi Diri Pemahaman Siswa',
        paragraphs: [
          'Setelah menyelesaikan seluruh rangkaian materi Bab IV, refleksikan capaian kompetensimu:',
          '----------------------------------------------------------------------------------',
          '| No | Materi Kompetensi Pokok                   | Paham (Ya) | Perlu Ulang (Belum) |',
          '----------------------------------------------------------------------------------',
          '| 1. | Pengelolaan Sumber Daya Alam Berkelanjutan|    [  ]    |        [  ]         |',
          '| 2. | Pengelolaan Sumber Daya Manusia Agribisnis|    [  ]    |        [  ]         |',
          '| 3. | Pengelolaan Faktor Modal & Keahlian Usaha |    [  ]    |        [  ]         |',
          '----------------------------------------------------------------------------------',
          'Pesan Refleksi Guru (Bapak Okta Nofiyanto):',
          'Terus kembangkan kecakapan agribisnis dan jiwa kewirausahaan kalian untuk menyongsong pertanian Indonesia yang maju, mandiri, dan modern.',
        ],
      },
    ],
    pageNum: '134',
  },
];

pagesData.forEach((pData, index) => {
  const commands = [];
  const pHeight = 841.89;
  const pWidth = 595.28;

  // Background tint / margins
  commands.push('q');
  // Decorative top green banner
  commands.push('0.02 0.588 0.412 rg'); // emerald primary
  commands.push(`0 ${pHeight - 8} ${pWidth} 8 re f`);

  // Decorative header
  commands.push('BT');
  commands.push('/F1 8 Tf');
  commands.push('0.4 0.45 0.5 rg');
  commands.push(`50 ${pHeight - 32} Td`);
  commands.push(`(${pdf.escapeText(pData.header)}) Tj`);
  commands.push('ET');

  // Decorative divider line under header
  commands.push('0.85 0.88 0.92 RG');
  commands.push('0.75 w');
  commands.push(`50 ${pHeight - 38} m ${pWidth - 50} ${pHeight - 38} l S`);

  // Chapter badge & Title
  let curY = pHeight - 65;

  if (pData.isbn) {
    commands.push('BT');
    commands.push('/F1 8 Tf');
    commands.push('0.3 0.35 0.4 rg');
    commands.push(`50 ${curY} Td`);
    commands.push(`(${pdf.escapeText(pData.bookTitle)}) Tj`);
    curY -= 12;
    commands.push(`0 -12 Td`);
    commands.push(`(${pdf.escapeText(pData.authors)}) Tj`);
    curY -= 12;
    commands.push(`0 -12 Td`);
    commands.push(`(${pdf.escapeText(pData.isbn)}) Tj`);
    commands.push('ET');
    curY -= 20;
  }

  // Chapter Num Box
  commands.push('0.05 0.25 0.2 rg');
  commands.push(`50 ${curY - 6} 90 26 re f`);
  commands.push('BT');
  commands.push('/F2 13 Tf');
  commands.push('1 1 1 rg');
  commands.push(`58 ${curY} Td`);
  commands.push(`(${pdf.escapeText(pData.chapterNum)}) Tj`);
  commands.push('ET');

  curY -= 26;

  // Chapter Title Headline
  commands.push('BT');
  commands.push('/F2 18 Tf');
  commands.push('0.05 0.15 0.1 rg');
  commands.push(`50 ${curY} Td`);
  commands.push(`(${pdf.escapeText(pData.chapterTitle)}) Tj`);
  commands.push('ET');

  curY -= 30;

  // Render Sections
  pData.sections.forEach((sec) => {
    // Section Title Box
    commands.push('0.93 0.97 0.94 rg');
    commands.push(`50 ${curY - 4} ${pWidth - 100} 20 re f`);
    commands.push('0.02 0.588 0.412 RG');
    commands.push('1.5 w');
    commands.push(`50 ${curY - 4} m 50 ${curY + 16} l S`);

    commands.push('BT');
    commands.push('/F2 11 Tf');
    commands.push('0.04 0.4 0.25 rg');
    commands.push(`60 ${curY} Td`);
    commands.push(`(${pdf.escapeText(sec.title)}) Tj`);
    commands.push('ET');

    curY -= 24;

    // Paragraphs
    sec.paragraphs.forEach((para) => {
      commands.push('BT');
      commands.push('/F1 9.5 Tf');
      commands.push('0.15 0.2 0.25 rg');

      // Word wrapping logic simple (split into lines approx 80 chars)
      const words = para.split(' ');
      let line = '';
      words.forEach((w) => {
        if ((line + ' ' + w).length > 82) {
          commands.push(`50 ${curY} Td`);
          commands.push(`(${pdf.escapeText(line.trim())}) Tj`);
          curY -= 14;
          line = w + ' ';
        } else {
          line += w + ' ';
        }
      });
      if (line.trim().length > 0) {
        commands.push(`50 ${curY} Td`);
        commands.push(`(${pdf.escapeText(line.trim())}) Tj`);
        curY -= 14;
      }
      commands.push('ET');
      curY -= 4; // gap between paragraphs
    });

    curY -= 10;
  });

  // Footer bar & page number
  commands.push('0.85 0.88 0.92 RG');
  commands.push('0.75 w');
  commands.push(`50 45 m ${pWidth - 50} 45 l S`);

  commands.push('BT');
  commands.push('/F1 8 Tf');
  commands.push('0.4 0.45 0.5 rg');
  commands.push(`50 32 Td`);
  commands.push(`(EduATPH - Buku Kurikulum Merdeka SMK Pertanian | Halaman ${pData.pageNum}) Tj`);

  commands.push('/F2 9 Tf');
  commands.push('0.02 0.588 0.412 rg');
  commands.push(`${pWidth - 140} 32 Td`);
  commands.push(`(Hal. ${index + 1} dari 24) Tj`);
  commands.push('ET');

  commands.push('Q');
  pdf.addPage(commands);
});

const pdfBuffer = pdf.build();
const outDir = path.join(process.cwd(), 'public', 'materials');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, 'bab-4-pengelolaan-faktor-produksi-kelas-x.pdf');
fs.writeFileSync(outFile, pdfBuffer);
console.log(`Successfully generated 24-page PDF: ${outFile} (${pdfBuffer.length} bytes)`);
