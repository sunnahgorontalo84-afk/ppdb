export enum ApplicationStatus {
  SUBMITTED = "Pendaftaran Terkirim",
  VERIFIED = "Berkas Terverifikasi",
  TEST_SCHEDULED = "Jadwal Seleksi Diatur",
  ACCEPTED = "Diterima (Lulus)",
  RESERVE = "Cadangan",
  REJECTED = "Tidak Lulus"
}

export enum AdmissionTrack {
  REGULER = "Jalur Reguler",
  PRESTASI = "Jalur Prestasi",
  TAHFIDZ = "Jalur Khusus Tahfidz"
}

export enum Gender {
  IKHWAN = "Ikhwan (Laki-laki)",
  AKHAWAT = "Akhawat (Perempuan)"
}

export interface Registration {
  id: string; // Unique, e.g. ASSUNNAH-2026-001
  fullName: string;
  nisn: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender;
  whatsapp: string;
  email: string;
  track: AdmissionTrack;
  
  // Academic
  previousSchool: string;
  reportAverage: number; // 0-100
  
  // Qur'an
  quranJuz: number; // Memorization count
  quranLevel: string; // "Lancar & Sesuai Tajwid", "Lancar, Perlu Perbaikan Tajwid", "Kurang Lancar"
  
  // Parent details
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  guardianPhone: string;
  
  // Certificates / achievements
  achievements?: string;
  certificateUrl?: string; // Simulated uploaded file name
  
  // Status and Admin decisions
  status: ApplicationStatus;
  notes?: string;
  testDate?: string; // Date of test
  testTime?: string; // Time of test
  testVenue?: string; // Online or Physical building name
  submittedAt: string; // Date string
}

export interface Teacher {
  name: string;
  role: string;
  education: string;
  avatar: string;
  specialty: string;
}

export interface Facility {
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
}

export interface Program {
  level: string; // "MTS" or "MA"
  title: string;
  description: string;
  curriculum: string[];
  duration: string;
}

export interface Faq {
  question: string;
  answer: string;
  category: string;
}
