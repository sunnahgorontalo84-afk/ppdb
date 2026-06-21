import { Teacher, Facility, Program, Faq } from "./types";

export const BoardingSchoolProfile = {
  name: "Pondok Pesantren As-Sunnah",
  tagline: "Membentuk Generasi Rabbani, Berakhlak Mulia, Unggul, dan Berpegang Teguh Pada Al-Qur'an dan As-Sunnah",
  foundedYear: 2012,
  address: "Jl. Al-Qodariah, Desa Padengo, Kecamatan Limboto Barat, Kab. Gorontalo, Provinsi Gorontalo",
  phone: "+62 811-4322-8484",
  email: "info@assunnahgorontalo.sch.id",
  mapUrl: "https://maps.app.goo.gl/fVcshfscmQrmyeDP9",
  socials: {
    instagram: "@assunnah_gorontalo",
    facebook: "Pondok Pesantren As-Sunnah Gorontalo",
    youtube: "As-Sunnah TV",
  }
};

export const VisiMisi = {
  visi: "Menjadi lembaga pendidikan Islam terkemuka di Indonesia dalam mencetak Hafizhul Qur'an yang beraqidah lurus, berakhlak mulia, berwawasan luas, serta mandiri berdasarkan Al-Qur'an dan As-Sunnah.",
  misi: [
    "Menyelenggarakan pendidikan tahfidz Al-Qur'an secara intensif dengan target minimal 15 Juz (SMP) dan 30 Juz (SMA).",
    "Menanamkan aqidah salafiyah yang bersih bagi santri serta akhlak mulia dalam kehidupan sehari-hari.",
    "Mengembangkan kemampuan bahasa Arab secara aktif (lisan & lisan) serta penguasaan literatur kitab suci.",
    "Menyelenggarakan kurikulum pendidikan nasional (SMP-SMA) berkualitas tinggi di bidang sains dan teknologi.",
    "Membiasakan amalan ibadah harian sesuai tuntunan Sunnah Rasulullah shallallahu 'alaihi wa sallam.",
    "Membekali santri dengan hardskill kewirausahaan dan kepemimpinan agar siap berkhidmat untuk umat."
  ]
};

export const Achievements = [
  {
    year: "2025",
    title: "Juara 1 Musabaqah Hifzhil Qur'an (MHQ) 10 Juz",
    level: "Tingkat Provinsi"
  },
  {
    year: "2025",
    title: "Juara Umum Olimpiade Bahasa Arab (OBA)",
    level: "Tingkat Nasional (Oleh MGMP Bahasa Arab)"
  },
  {
    year: "2024",
    title: "Juara 1 Lomba Hifzul Qur'an",
    level: "Tingkat Kabupaten & Provinsi"
  },
  {
   year: "2025",
    title: "Terakreditasi UIM (Universitas Islam Madinah)",
    level: "Arab Saudi"
  }
];

export const TeachersData: Teacher[] = [
  {
    name: "Ustadz H. Ahmad Ridwan, Lc., M.Ag.",
    role: "Mudir/Pimpinan Pondok Pesantren",
    education: "S1 Universitas Islam Madinah (KSA), S2 UIN Syarif Hidayatullah Jakarta",
    specialty: "Aqidah & Hadis",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    name: "Ustadz Dr. Muhammad Faisal, Lc., M.A.",
    role: "Kepala Madrasah Madrasah Tsanawiyah",
    education: "S1 Universitas Islam Negeri",
    specialty: "Pendidikan Islam",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    name: "Ustadz Dr. Muhammad Faisal, Lc., M.A.",
    role: "Kepala Madrasah Madrasah Aliyah",
    education: "S1 & S2 Universitas Al-Azhar Kairo (Mesir), S3 Universitas Islam Negeri",
    specialty: "Fiqih & Ushul Fiqih",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    name: "Ustadz Hamzah Abdul Latif, Lc.",
    role: "Kepala Bidang Tahfidz Al-Qur'an",
    education: "S1 Syariah Universitas Islam Madinah (KSA), Hafizh 30 Juz bersanad",
    specialty: "Tahfidz & Tajwid Makharijul Huruf",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    name: "Ustadz H. Fahri Al-Fatih, Lc.",
    role: "Kepala Sekolah SMA IT As-Sunnah",
    education: "S1 Bahasa Arab Universitas Islam Madinah (KSA)",
    specialty: "Bahasa Arab, Nahwu & Sharaf",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    name: "Ustadzah Fatimah Azzahra, S.Pd., Gr.",
    role: "Kepala Sekolah SMP IT As-Sunnah (Akhawat)",
    education: "S1 Pendidikan Matematika Universitas Negeri Gorontalo",
    specialty: "Matematika & Kepengasuhan Putri",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256"
  },
  {
    name: "Ustadzah Hafshah binti Adam, Lc.",
    role: "Pembimbing Tahfidz & Keputrian",
    education: "S1 Dirasat Islamiyah Universitas Al-Azhar Kairo, Hafizhah 30 Juz",
    specialty: "Tafsir Al-Qur'an & Akhlak",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256"
  }
];

export const FacilitiesData: Facility[] = [
  {
    name: "Masjid Imam Syafi'i",
    description: "Masjid utama berlantai dua sebagai pusat ibadah wajib berjamaah, halaqah tahfidz, kajian kitab, serta pembinaan akhlak santri.",
    icon: "Church", // Using modern replacement
  },
  {
    name: "Gedung Kelas Ber-AC",
    description: "Ruang kelas representatif yang dilengkapi dengan AC, smart TV proyektor, serta fasilitas belajar mengajar multimedia terpadu.",
    icon: "Presentation",
  },
  {
    name: "Asrama Representatif (Boarding)",
    description: "Kamar tidur nyaman dengan kasur berkelas, lemari pribadi, sirkulasi udara optimal, serta dibimbing langsung ustadz kepengasuhan.",
    icon: "Home",
  },
  {
    name: "Laboratorium Sains & Komputer",
    description: "Dilengkapi komputer modern berkecepatan tinggi untuk praktik informatika koding serta alat praktikum fisika, kimia, biologi lengkap.",
    icon: "Cpu",
  },
  {
    name: "Perpustakaan Syamil",
    description: "Koleksi ribuan kitab rujukan turots Islam dari berbagai madzhab serta ratusan koleksi buku sains, ensiklopedia nasional & internasional.",
    icon: "BookOpen",
  },
  {
    name: "Sarana Olahraga Multi-Fungsi",
    description: "Lapangan futsal rumput sintetis, lapangan basket, bulu tangkis, panahan, serta sarana bela diri pencak silat / bela diri Islam.",
    icon: "Activity",
  },
];

export const ProgramsData: Program[] = [
  {
    level: "MTS",
    title: "Madrasah Tsanawiyah As-Sunnah Gorontalo",
    description: "Jenjang pendidikan 3 tahun bagi lulusan SD/MI. Kombinasi kurikulum kementerian pendidikan nasional dengan kurikulum pesantren.",
    curriculum: [
      "Hafalan Al-Qur'an (Target Minimal: 15 Juz)",
      "Bahasa Arab (Dasar: Durusul Lughah & Al-Arabiya Baina Yadaik)",
      "Kajian Kitab Aqidah, Hadis Arbain, dan Hadis Akhlak",
      "Kurikulum Nasional: Matematika, IPA Terpadu, Bahasa Inggris"
    ],
    duration: "3 Tahun (Boarding / Wajib Tinggal)"
  },
  {
    level: "MA",
    title: "Madrasah Aliyah As-Sunnah Limboto Barat",
    description: "Jenjang pendidikan 3 tahun (lulusan SMP/MTs) dengan orientasi persiapan kuliah di Jazirah Arab (LIPPIA/Universitas Islam Madinah) atau PTN Ternama.",
    curriculum: [
      "Tahfidzul Qur'an Intensif (Khatam Mutqin 30 Juz)",
      "Bahasa Arab Tingkat Lanjut (Nahwu Sharaf, Balaghah, Adab)",
      "Kajian Ushul (Ushul Fiqih, Musthalah Hadits, Ushul Tafsir)",
      "Kurikulum Nasional: Fisika/Kimia/Biologi (Sains) & Matematika Analitis",
      "Persiapan Da'at & TOEFL / IELTS / Bahasa Arab Al-Kafaah"
    ],
    duration: "3 Tahun (Boarding) + Pengabdian 1 Tahun"
  }
];

export const FaqsData: Faq[] = [
  {
    category: "Pendaftaran",
    question: "Kapan pendaftaran santri baru (PPDB / SPMB) gelombang 1 dibuka?",
    answer: "Pendaftaran Gelombang 1 dibuka mulai 1 Oktober 2026 hingga 15 Desember 2026. Apabila kuota telah terpenuhi, Gelombang 2 tidak akan dibuka. Kami sangat merekomendasikan untuk mendaftar lebih awal."
  },
  {
    category: "Pendaftaran",
    question: "Apa saja persyaratan utama mendaftar di As-Sunnah?",
    answer: "Persyaratan berkas meliputi: Fotokopi Ijazah/Rapor kelas terakhir, NISN (Nomor Induk Siswa Nasional), Pasfoto terbaru, Surat Pernyataan Bersedia Mukim di Asrama, dan mengikuti ujian seleksi luring (baca Al-Qur'an, tajwid, matematika dasar, wawancara santri & orang tua)."
  },
  {
    category: "Tahfidz",
    question: "Bagaimana jika calon santri belum lancar membaca Al-Qur'an?",
    answer: "Untuk jalur Reguler, kami menerima santri dengan bacaan Al-Qur'an dasar, asalkan memiliki komitmen tinggi untuk belajar membaca. Kami menyediakan program 'I'dad Qur'any' (matrikulasi khusus membaca) selama 3 bulan pertama menjelang kelas reguler dimulai."
  },
  {
    category: "Fasilitas & Layanan",
    question: "Apakah santri diperbolehkan membawa gadget/HP ke pesantren?",
    answer: "Demi kekhusyukan menghafal Al-Qur'an dan kelancaran proses KBM, santri dilarang keras membawa gadget pribadi (HP/smartphone/tablet). Komunikasi santri dengan orang tua dilakukan teratur melalui telepon resmi pondok setiap 2 pekan sekali."
  },
  {
    category: "Keuangan",
    question: "Berapa biaya pendidikan (SPP bulanan) dan apakah ada beasiswa?",
    answer: "SPP bulanan meliputi akomodasi kamar asrama, makan 3 kali sehari yang bergizi seimbang, layanan cuci (laundry), serta biaya operasional sekolah. Kami menyediakan Beasiswa Kategori Khusus bagi Penghafal Al-Qur'an (minimal 5 Juz berprestasi) berupa potongan SPP hingga 100% setelah lolos verifikasi berkas dan tes wawancara beasiswa."
  }
];
