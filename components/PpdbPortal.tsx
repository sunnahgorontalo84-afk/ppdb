import React, { useState, useEffect } from "react";
import { 
  ApplicationStatus, 
  AdmissionTrack, 
  Gender, 
  Registration 
} from "../types";
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  limit, 
  onSnapshot 
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  ClipboardList, 
  CheckCircle, 
  Search, 
  ChevronRight, 
  Upload, 
  Clock, 
  User, 
  MapPin, 
  Calendar, 
  Eye, 
  FileText, 
  X, 
  LayoutDashboard, 
  Check, 
  BookOpen, 
  Trash2, 
  ArrowLeft,
  ChevronLeft,
  Award,
  Lock,
  Download,
  AlertTriangle,
  LogOut,
  Sliders,
  Filter,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Mock seed data for instant demonstration out of the box
const DEFAULT_REGISTRATIONS: Registration[] = [
  {
    id: "ASSUNNAH-2026-00382",
    fullName: "Ahmad Mujahid Al-Fatih",
    nisn: "0098372645",
    birthPlace: "Gorontalo",
    birthDate: "2012-04-12",
    gender: Gender.IKHWAN,
    whatsapp: "081234567890",
    email: "mujahid.fatih@gmail.com",
    track: AdmissionTrack.TAHFIDZ,
    previousSchool: "SD IT Al-Farabi",
    reportAverage: 91,
    quranJuz: 6,
    quranLevel: "Lancar & Sesuai Tajwid",
    fatherName: "Abdullah Salam",
    fatherOccupation: "Wiraswasta",
    motherName: "Siti Rahmah",
    guardianPhone: "081234567890",
    status: ApplicationStatus.ACCEPTED,
    testDate: "2026-06-25",
    testTime: "08:00 - 11:30 WITA",
    testVenue: "Kantor Mudir (Gedung Utama)",
    notes: "Alhamdulillah halaqah Qur'an sangat baik dan bacaan tartil. Memiliki potensi tahfidz tinggi. Diterima dengan diskon SPP beasiswa Tahfidz.",
    submittedAt: "2026-06-10"
  },
  {
    id: "ASSUNNAH-2026-00491",
    fullName: "Kamila Azzahra",
    nisn: "0103728495",
    birthPlace: "Manado",
    birthDate: "2012-08-25",
    gender: Gender.AKHAWAT,
    whatsapp: "085293848123",
    email: "kamila.azzahra@yahoo.com",
    track: AdmissionTrack.PRESTASI,
    previousSchool: "MIN 1 Gorontalo",
    reportAverage: 94,
    quranJuz: 3,
    quranLevel: "Lancar, Perlu Perbaikan Tajwid",
    fatherName: "Hariyanto Gobel",
    fatherOccupation: "PNS",
    motherName: "Aisyah Yusuf",
    guardianPhone: "081344556677",
    status: ApplicationStatus.TEST_SCHEDULED,
    testDate: "2026-06-20",
    testTime: "09:00 - 11:00 WITA",
    testVenue: "Gedung Ruang Kelas Putri",
    notes: "Harap datang 15 menit sebelum tes baca Al-Qur'an dimulai dan wajib didampingi ibu.",
    submittedAt: "2026-06-12"
  },
  {
    id: "ASSUNNAH-2026-00508",
    fullName: "Yusuf Al-Amin",
    nisn: "0084372951",
    birthPlace: "Gorontalo",
    birthDate: "2013-01-05",
    gender: Gender.IKHWAN,
    whatsapp: "089871635241",
    email: "yusuf.alamin@gmail.com",
    track: AdmissionTrack.REGULER,
    previousSchool: "SDN 3 Kota Gorontalo",
    reportAverage: 82,
    quranJuz: 1,
    quranLevel: "Kurang Lancar",
    fatherName: "Luqman Hakim",
    fatherOccupation: "Guru",
    motherName: "Aminah",
    guardianPhone: "089871635241",
    status: ApplicationStatus.SUBMITTED,
    submittedAt: "2026-06-14"
  }
];

interface PpdbPortalProps {
  initialTab?: "dashboard" | "select-track" | "fill-form" | "check-status" | "admin-panel";
  hideNonAdminTabs?: boolean;
}

export default function PpdbPortal({ initialTab = "dashboard", hideNonAdminTabs = false }: PpdbPortalProps) {
  // Portal State: "dashboard", "select-track", "fill-form", "check-status", "admin-panel", "letter-view"
  const [activeTab, setActiveTab] = useState<"dashboard" | "select-track" | "fill-form" | "check-status" | "admin-panel">(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  
  // Track selection
  const [selectedTrack, setSelectedTrack] = useState<AdmissionTrack>(AdmissionTrack.REGULER);
  
  // Form Wizard values
  const [formStep, setFormStep] = useState(1);
  const [formFiles, setFormFiles] = useState<{name: string}[]>([]);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Status check Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedRecord, setSearchedRecord] = useState<Registration | null>(null);
  const [searchError, setSearchError] = useState("");

  // Admin section
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("Semua");
  const [adminTrackFilter, setAdminTrackFilter] = useState("Semua");
  const [selectedRegForEdit, setSelectedRegForEdit] = useState<Registration | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Specialized Admin edit state
  const [editStatus, setEditStatus] = useState<ApplicationStatus>(ApplicationStatus.SUBMITTED);
  const [editNotes, setEditNotes] = useState("");
  const [editTestDate, setEditTestDate] = useState("");
  const [editTestTime, setEditTestTime] = useState("");
  const [editTestVenue, setEditTestVenue] = useState("");

  // Formal letter view modal state
  const [viewingLetterRecord, setViewingLetterRecord] = useState<Registration | null>(null);

  // Form Data inputs
  const [formData, setFormData] = useState({
    fullName: "",
    nisn: "",
    birthPlace: "",
    birthDate: "",
    gender: Gender.IKHWAN,
    whatsapp: "",
    email: "",
    previousSchool: "",
    reportAverage: 85,
    quranJuz: 0,
    quranLevel: "Lancar & Sesuai Tajwid",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    guardianPhone: "",
    achievements: ""
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  // Monitor Google Authentication status
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === "sunnahgorontalo84@gmail.com") {
        setAdminLoggedIn(true);
      }
    });
    return () => unsub();
  }, []);

  // Monitor and synchronize cloud registrations
  useEffect(() => {
    if (adminLoggedIn && currentUser && currentUser.email === "sunnahgorontalo84@gmail.com") {
      // Admin: realtime listener dari Firestore
      const unsub = onSnapshot(
        collection(db, "registrations"),
        (snapshot) => {
          const list: Registration[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Registration);
          });
          list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          setRegistrations(list);
          // Update cache lokal setiap kali data cloud berubah
          localStorage.setItem("assunnah_registrations", JSON.stringify(list));
        },
        (error) => {
          console.warn("Firestore listener error:", error.message);
          // Fallback ke cache lokal jika listener gagal
          const saved = localStorage.getItem("assunnah_registrations");
          if (saved) setRegistrations(JSON.parse(saved));
        }
      );
      return () => unsub();
    } else {
      // Non-admin: gunakan cache lokal (untuk state UI).
      // Pencarian status dan submit pendaftaran tetap langsung ke Firestore.
      // CATATAN: Tidak ada auto-seeding data demo di production.
      // Data lokal hanya berisi cache dari sesi terakhir (jika ada).
      const saved = localStorage.getItem("assunnah_registrations");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Filter: jangan tampilkan data demo hardcoded ke user publik
          const realData = parsed.filter((r: Registration) => !DEFAULT_REGISTRATIONS.some(d => d.id === r.id));
          setRegistrations(realData.length > 0 ? realData : []);
        } catch {
          setRegistrations([]);
        }
      } else {
        setRegistrations([]);
      }
    }
  }, [adminLoggedIn, currentUser]);

  // Cache helper: update state UI dan localStorage sebagai cache lokal.
  // Operasi tulis/hapus ke Firestore dilakukan secara eksplisit di masing-masing fungsi.
  const saveRegistrations = (newList: Registration[]) => {
    setRegistrations(newList);
    localStorage.setItem("assunnah_registrations", JSON.stringify(newList));
  };

  const handleTrackSelect = (track: AdmissionTrack) => {
    setSelectedTrack(track);
    // Reset specific states
    setFormStep(1);
    setIsSubmitSuccess(false);
    setFormFiles([]);
    setActiveTab("fill-form");
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      nisn: "",
      birthPlace: "",
      birthDate: "",
      gender: Gender.IKHWAN,
      whatsapp: "",
      email: "",
      previousSchool: "",
      reportAverage: 85,
      quranJuz: 0,
      quranLevel: "Lancar & Sesuai Tajwid",
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      guardianPhone: "",
      achievements: ""
    });
    setFormStep(1);
    setIsSubmitSuccess(false);
    setFormFiles([]);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStep(step => step + 1);
  };

  const handlePrevStep = () => {
    setFormStep(step => Math.max(1, step - 1));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Cek duplikat NISN langsung dari Firestore (bukan cache lokal)
      // agar akurat meskipun dibuka dari browser berbeda
      const nisnQuery = query(
        collection(db, "registrations"),
        where("nisn", "==", formData.nisn),
        limit(1)
      );
      const nisnSnap = await getDocs(nisnQuery);
      if (!nisnSnap.empty) {
        alert(`⚠️ NISN ${formData.nisn} sudah terdaftar di sistem kami. Silakan cek status pendaftaran Anda di menu "Cek Status Pendaftaran".`);
        setIsSubmitting(false);
        return;
      }

      // Generate ID unik: kombinasi tahun + random untuk menghindari tabrakan
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const id = `ASSUNNAH-2026-${randomNum}`;

      const newReg: Registration = {
        id,
        track: selectedTrack,
        fullName: formData.fullName,
        nisn: formData.nisn,
        birthPlace: formData.birthPlace,
        birthDate: formData.birthDate,
        gender: formData.gender,
        whatsapp: formData.whatsapp,
        email: formData.email,
        previousSchool: formData.previousSchool,
        reportAverage: Number(formData.reportAverage),
        quranJuz: Number(formData.quranJuz),
        quranLevel: formData.quranLevel,
        fatherName: formData.fatherName,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        guardianPhone: formData.guardianPhone,
        achievements: formData.achievements || undefined,
        certificateUrl: formFiles.length > 0 ? formFiles[0].name : undefined,
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date().toISOString().split("T")[0]
      };

      // Simpan ke Firestore cloud — data langsung tersedia untuk semua perangkat
      await setDoc(doc(db, "registrations", id), newReg);

      // Update cache lokal dan state UI
      saveRegistrations([newReg, ...registrations]);
      setNewlyCreatedId(id);
      setIsSubmitSuccess(true);
    } catch (err: any) {
      console.error("Submit error:", err);
      if (err?.message?.includes("offline") || err?.code === "unavailable") {
        alert("❌ Gagal mendaftar: Koneksi internet tidak tersedia. Pastikan Anda terhubung ke internet dan coba kembali.");
      } else if (err?.code === "permission-denied") {
        alert("❌ Pendaftaran ditolak oleh sistem keamanan. Pastikan semua data diisi dengan benar dan lengkap.");
      } else {
        alert("❌ Terjadi kesalahan saat menyimpan pendaftaran. Silakan coba lagi atau hubungi panitia.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setSearchedRecord(null);
    setIsSearching(true);

    const queryStr = searchQuery.trim();
    if (!queryStr) {
      setSearchError("Silakan masukkan Nomor Registrasi atau NISN.");
      setIsSearching(false);
      return;
    }

    try {
      // 1. Cari berdasarkan ID dokumen (Nomor Registrasi) — exact match
      const docRef = doc(db, "registrations", queryStr.toUpperCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSearchedRecord(docSnap.data() as Registration);
        setIsSearching(false);
        return;
      }

      // 2. Cari berdasarkan NISN
      const q = query(
        collection(db, "registrations"),
        where("nisn", "==", queryStr),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        setSearchedRecord(querySnap.docs[0].data() as Registration);
      } else {
        setSearchError("Data pendaftaran tidak ditemukan. Pastikan Nomor Registrasi (contoh: ASSUNNAH-2026-XXXXX) atau NISN yang dimasukkan sudah benar.");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      if (err?.code === "unavailable" || err?.message?.includes("offline")) {
        setSearchError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.");
      } else if (err?.code === "permission-denied") {
        setSearchError("Akses pencarian ditolak. Silakan coba lagi atau hubungi panitia.");
      } else {
        setSearchError("Terjadi kesalahan saat mencari data. Silakan coba lagi.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Admin login trigger — password dibaca dari environment variable
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!adminPass) {
      setAdminError("Konfigurasi admin belum disetel. Hubungi pengelola sistem.");
      return;
    }
    if (adminPassword === adminPass) {
      setAdminLoggedIn(true);
    } else {
      setAdminError("Sandi admin tidak valid. Silakan coba kembali atau gunakan Google Login.");
    }
  };

  // Google Authentication trigger for genuine cloud admin access
  const handleGoogleLogin = async () => {
    setAdminError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email === "sunnahgorontalo84@gmail.com") {
        setAdminLoggedIn(true);
        alert("Alhamdulillah, Otentikasi Berhasil! Selamat datang Panitia.");
      } else {
        setAdminError(`Akses ditolak: Gmail Anda (${result.user.email}) bukan admin terdaftar "sunnahgorontalo84@gmail.com".`);
        await signOut(auth);
      }
    } catch (err: any) {
      setAdminError(`Gagal masuk dengan Google: ${err.message}`);
    }
  };

  // Admin update submission status
  const submitAdminStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRegForEdit) return;

    const updatedReg = {
      ...selectedRegForEdit,
      status: editStatus,
      notes: editNotes || "",
      testDate: editTestDate || "",
      testTime: editTestTime || "",
      testVenue: editTestVenue || ""
    };

    try {
      await setDoc(doc(db, "registrations", selectedRegForEdit.id), updatedReg);
      
      const newList = registrations.map(r => {
        if (r.id === selectedRegForEdit.id) {
          return updatedReg;
        }
        return r;
      });

      await saveRegistrations(newList);
      setShowStatusModal(false);
      setSelectedRegForEdit(null);
      alert("Status pendaftaran berhasil diperbarui di Cloud Firestore!");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `registrations/${selectedRegForEdit.id}`);
    }
  };

  // Delete registration in admin list
  const deleteRegistration = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data registrasi ini permanen dari Cloud Firestore? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await deleteDoc(doc(db, "registrations", id));
        const newList = registrations.filter(r => r.id !== id);
        await saveRegistrations(newList);
        alert("Data registrasi berhasil dihapus secara permanen!");
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `registrations/${id}`);
      }
    }
  };

  // Open Edit Dialog inside Admins Panel
  const openEditDialog = (reg: Registration) => {
    setSelectedRegForEdit(reg);
    setEditStatus(reg.status);
    setEditNotes(reg.notes || "");
    setEditTestDate(reg.testDate || "");
    setEditTestTime(reg.testTime || "");
    setEditTestVenue(reg.testVenue || "");
    setShowStatusModal(true);
  };

  // Seed with random students for demonstration (hanya untuk testing)
  const handleReSeed = async () => {
    if (confirm("Reset ulang database PPDB ke setelan pabrik dan buat data contoh baru di Cloud Firestore?")) {
      try {
        for (const reg of DEFAULT_REGISTRATIONS) {
          await setDoc(doc(db, "registrations", reg.id), reg);
        }
        localStorage.setItem("assunnah_registrations", JSON.stringify(DEFAULT_REGISTRATIONS));
        setRegistrations(DEFAULT_REGISTRATIONS);
        alert("Database contoh berhasil dibuat ulang di Cloud Firestore!");
      } catch (err) {
        alert("Seeding gagal. Pastikan Anda masuk sebagai Admin dengan Google Login untuk hak akses menulis.");
        console.error("Seed error:", err);
      }
    }
  };

  // Hapus semua data demo dari Firestore dan localStorage
  const handleClearDemoData = async () => {
    if (!confirm("Hapus semua data DEMO (contoh) dari Firestore? Data pendaftaran nyata tidak akan terpengaruh.")) return;
    try {
      for (const reg of DEFAULT_REGISTRATIONS) {
        await deleteDoc(doc(db, "registrations", reg.id));
      }
      // Hapus juga dari cache lokal
      const saved = localStorage.getItem("assunnah_registrations");
      if (saved) {
        const parsed: Registration[] = JSON.parse(saved);
        const cleaned = parsed.filter(r => !DEFAULT_REGISTRATIONS.some(d => d.id === r.id));
        localStorage.setItem("assunnah_registrations", JSON.stringify(cleaned));
        setRegistrations(cleaned);
      }
      alert("✅ Data demo berhasil dihapus. Database sekarang hanya berisi data pendaftar asli.");
    } catch (err: any) {
      if (err?.code === "permission-denied") {
        alert("❌ Akses ditolak. Pastikan Anda login dengan Google Admin untuk dapat menghapus data.");
      } else {
        alert("❌ Gagal menghapus data demo: " + err?.message);
      }
    }
  };

  return (
    <div className="bg-pbg text-txp min-h-screen relative py-12 transition-colors duration-200" id="ppdb-main-container">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(7,10,8),rgba(14,20,17,0.3))] pointer-events-none opacity-40 dark:opacity-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 font-sans">
        
        {/* Banner Title */}
        <div className="text-center mb-12">
          {hideNonAdminTabs ? (
            <>
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Portal Khusus Kepanitiaan</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-txp mt-3 select-none font-sans">
                Admisi <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Staf & Panitia</span>
              </h1>
              <p className="text-txs text-sm font-light mt-2 max-w-xl mx-auto leading-relaxed">
                Halaman internal untuk mengelola berkas pendaftaran, verifikasi persyaratan, menentukan jadwal ujian seleksi santri baru.
              </p>
            </>
          ) : (
            <>
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Sistem Penerimaan Santri Baru (SPMB)</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-txp mt-3 select-none font-sans">
                Pintu Utama <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">PPDB Online</span>
              </h1>
              <p className="text-txs text-sm font-light mt-2 max-w-xl mx-auto leading-relaxed">
                Selamat datang di Portal SPMB Pesantren As-Sunnah. Kelola pendaftaran, kumpulkan berkas seleksi, dan lacak status kelulusan di sini.
              </p>
            </>
          )}
        </div>

        {/* TOP LEVEL NAVIGATION CHIPS */}
        {!hideNonAdminTabs && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 bg-sbg p-1.5 rounded-2xl border border-bdgen max-w-2xl mx-auto transition-colors duration-200 shadow-sm">
            <button
              onClick={() => { setActiveTab("dashboard"); resetForm(); }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "bg-emerald-600 text-pbg shadow"
                  : "text-emerald-750 dark:text-emerald-300 hover:text-txp"
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              Portal Utama
            </button>
            
            <button
              onClick={() => { setActiveTab("check-status"); setSearchError(""); setSearchedRecord(null); }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "check-status"
                  ? "bg-emerald-600 text-pbg shadow"
                  : "text-emerald-750 dark:text-emerald-300 hover:text-txp"
              }`}
            >
              <Search className="h-4 w-4" />
              Lacak Status
            </button>
          </div>
        )}

        {/* TAB CONTROLLERS */}
        <AnimatePresence mode="wait">

          {/* TAB 1: PORTAL DASHBOARD (Main Options) */}
          {activeTab === "dashboard" && (
            <motion.div
              layoutId="ppdb-views"
              key="view-dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {/* Option A: Register */}
              <div 
                onClick={() => setActiveTab("select-track")}
                className="group p-8 rounded-2xl bg-gradient-to-br from-sbg/60 to-pbg border border-bdgen hover:border-emerald-500/20 shadow-xl cursor-pointer hover:scale-[1.01] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-64"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-400 group-hover:scale-110 transition-transform">
                   <Plus className="h-24 w-24" />
                </div>
                <div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-950/20 dark:bg-emerald-950/40 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-txp group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Pendaftaran Santri Baru</h3>
                  <p className="text-txs text-xs mt-3 leading-relaxed font-light">
                    Mulai proses pendaftaran baru untuk jenjang SMP IT atau SMA IT. Tersedia pilihan jalur Reguler, Prestasi, dan program khusus Tahfidz.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-6 animate-pulse">
                  <span>Mulai Mengisi Formulir</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Option B: Check Status (Tracker) */}
              <div 
                onClick={() => setActiveTab("check-status")}
                className="group p-8 rounded-2xl bg-gradient-to-br from-sbg/60 to-pbg border border-bdgen hover:border-emerald-500/20 shadow-xl cursor-pointer hover:scale-[1.01] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-64"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Search className="h-24 w-24" />
                </div>
                <div>
                  <div className="h-12 w-12 rounded-xl bg-amber-950/20 dark:bg-amber-950/40 border border-amber-500/10 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-6">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-txp group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Lacak Status Kelulusan</h3>
                  <p className="text-txs text-xs mt-3 leading-relaxed font-light">
                    Cek status verifikasi berkas, dapatkan rincian jadwal seleksi tes, hubungi panitia wawancara, serta unduh SK kelulusan pendaftaran Anda.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-550 mt-6">
                  <span>Cari Nomor Registrasi / NISN</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* General terms / notice box */}
              <div className="md:col-span-2 p-5 rounded-xl border border-bdgen bg-tbg/30 text-txs text-xs flex gap-4 items-start leading-relaxed font-light mt-4">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-txp block mb-1">Informasi Seleksi PPDB Terpadu:</span>
                  1. Proses pendaftaran hanya dapat divalidasi apabila seluruh dokumen identitas, NISN aktif, dan biodata orang tua lengkap.<br />
                  2. Tes luring/luring (offline) bertempat di Kompleks Pesantren As-Sunnah meliputi: Baca-Tulis Qur'an, hafalan, wawancara, & tes dasar matematika.
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SELECT TRACK */}
          {activeTab === "select-track" && (
            <motion.div
              key="view-select-track"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-8"
              layoutId="ppdb-views"
            >
              <button 
                onClick={() => setActiveTab("dashboard")} 
                className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 hover:text-txp transition-colors cursor-pointer mb-2 font-mono uppercase tracking-wide"
              >
                <ChevronLeft className="h-4 w-4" /> Kembali ke dabor utama
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-txp font-sans">
                  Langkah 1: Pilih <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Jalur Pendaftaran</span>
                </h3>
                <p className="text-txs text-xs mt-1">Sesuaikan minat, raihan prestasi, dan jumlah kelompok juz hafalan Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. REGULER */}
                <div 
                  onClick={() => handleTrackSelect(AdmissionTrack.REGULER)}
                  className="group p-6 rounded-2xl bg-tbg/40 border border-bdgen hover:border-emerald-500/20 hover:bg-tbg/75 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-500/60 uppercase tracking-widest block mb-4">Jalur Utama</span>
                    <h4 className="text-lg font-bold text-txp group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-sans">
                      {AdmissionTrack.REGULER}
                    </h4>
                    <p className="text-xs text-txs leading-relaxed font-light mt-3">
                      Mengikuti rangkaian tes standar meliputi: ujian akademik (matematika & IPS-IPA dasar), kelancaran tes baca Al-Qur'an, dan materi keislaman dasar.
                    </p>
                  </div>
                  <button className="w-full mt-6 py-2.5 rounded-xl border border-bdgen text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-pbg group-hover:border-transparent transition-all cursor-pointer text-emerald-600 dark:text-emerald-300">
                    Pilih Reguler
                  </button>
                </div>

                {/* 2. PRESTASI */}
                <div 
                  onClick={() => handleTrackSelect(AdmissionTrack.PRESTASI)}
                  className="group p-6 rounded-2xl bg-tbg/40 border-2 border-bdgen hover:border-emerald-500/20 hover:bg-tbg/75 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block mb-4">Jalur Piagam</span>
                    <h4 className="text-lg font-bold text-txp group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-sans">
                      {AdmissionTrack.PRESTASI}
                    </h4>
                    <p className="text-xs text-txs leading-relaxed font-light mt-3">
                      Khusus calon santri pemegang sertifikat kejuaraan minimal tingkat kabupaten (Juara 1-3) akademik (sains/matematika) or non-akademik (olahraga/bela diri).
                    </p>
                  </div>
                  <button className="w-full mt-6 py-2.5 rounded-xl border border-bdgen text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-pbg group-hover:border-transparent transition-all cursor-pointer text-emerald-600 dark:text-emerald-300">
                    Pilih Prestasi
                  </button>
                </div>

                {/* 3. TAHFIDZ */}
                <div 
                  onClick={() => handleTrackSelect(AdmissionTrack.TAHFIDZ)}
                  className="group p-6 rounded-2xl bg-tbg/40 border border-bdgen hover:border-emerald-500/20 hover:bg-tbg/75 hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest block mb-4">Bebas SPP Track</span>
                    <h4 className="text-lg font-bold text-txp group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-sans">
                      {AdmissionTrack.TAHFIDZ}
                    </h4>
                    <p className="text-xs text-txs leading-relaxed font-light mt-3">
                      Bagi calon santri pengampu hafalan minimal 4 Juz (lulusan SD) atau 8 Juz (lulusan SMP). Mendapatkan prioritas kelulusan bebas SPP & asrama.
                    </p>
                  </div>
                  <button className="w-full mt-6 py-2.5 rounded-xl border border-bdgen text-xs font-semibold group-hover:bg-emerald-600 group-hover:text-pbg group-hover:border-transparent transition-all cursor-pointer text-emerald-600 dark:text-emerald-300">
                    Pilih Tahfidz
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: FILL FORM (Wizard-style Form) */}
          {activeTab === "fill-form" && (
            <motion.div
              key="view-fill-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto"
              layoutId="ppdb-views"
            >
              
              {!isSubmitSuccess ? (
                <div className="bg-sbg/40 p-6 sm:p-10 rounded-2xl border border-bdgen space-y-8">
                  
                  {/* Form Breadcrumb & steps logic */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-txp flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        Formulir PPDB Online ({selectedTrack})
                      </h3>
                      <p className="text-txs/70 text-xs mt-0.5">Silakan selesaikan formulir pendaftaran 3 langkah berikut.</p>
                    </div>
                    
                    {/* Step indicator */}
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-pbg border border-bdgen text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Langkah {formStep} dari 3
                    </span>
                  </div>

                  {/* Form Step Status Indicators (Visual Timeline) */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`h-1.5 rounded-full ${formStep >= 1 ? "bg-emerald-500" : "bg-neutral-800"}`} />
                    <div className={`h-1.5 rounded-full ${formStep >= 2 ? "bg-emerald-500" : "bg-neutral-800"}`} />
                    <div className={`h-1.5 rounded-full ${formStep >= 3 ? "bg-emerald-500" : "bg-neutral-800"}`} />
                  </div>

                  {/* FORM BODY */}
                  <form onSubmit={formStep === 3 ? handleFormSubmit : handleNextStep} className="space-y-6">
                    
                    {/* STEP 1: Personal Profile */}
                    {formStep === 1 && (
                      <div className="space-y-4">
                        <div className="border-b border-neutral-800 pb-3">
                          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                            <span className="text-xs bg-emerald-950 h-5 w-5 rounded-full inline-flex items-center justify-center font-bold text-emerald-400">1</span>
                            Profil Calon Santri Baru
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nama Lengkap Santri</label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Ahmad Abdullah Al-Mubarak"
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nomor Induk Siswa Nasional (NISN)</label>
                            <input
                              type="text"
                              required
                              maxLength={10}
                              placeholder="NISN Aktif (10 digit)"
                              value={formData.nisn}
                              onChange={(e) => setFormData({...formData, nisn: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Jenis Kelamin</label>
                            <select
                              value={formData.gender}
                              onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-300 focus:outline-none focus:border-emerald-500/40"
                            >
                              <option value={Gender.IKHWAN}>Ikhwan / Laki-laki (Dorm Putra)</option>
                              <option value={Gender.AKHAWAT}>Akhawat / Perempuan (Dorm Putri)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tempat Lahir</label>
                            <input
                              type="text"
                              required
                              placeholder="Kota tempat lahir"
                              value={formData.birthPlace}
                              onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tanggal Lahir</label>
                            <input
                              type="date"
                              required
                              value={formData.birthDate}
                              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Email Aktif Orang Tua</label>
                            <input
                              type="email"
                              required
                              placeholder="Contoh: ibnu.muhammad@gmail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">No. WhatsApp Orang Tua</label>
                            <input
                              type="tel"
                              required
                              placeholder="Contoh: 0812XXXXXXXX"
                              value={formData.whatsapp}
                              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Academic & Qur'an */}
                    {formStep === 2 && (
                      <div className="space-y-4">
                        <div className="border-b border-neutral-800 pb-3">
                          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                            <span className="text-xs bg-emerald-950 h-5 w-5 rounded-full inline-flex items-center justify-center font-bold text-emerald-400">2</span>
                            Akademik & Kemampuan Al-Qur'an
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Asal Sekolah Sebelumnya</label>
                            <input
                              type="text"
                              required
                              placeholder="Contoh: SDN 1 Gorontalo / MIN Gorontalo"
                              value={formData.previousSchool}
                              onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Rata-rata Nilai Rapor Terakhir (70-100)</label>
                            <input
                              type="number"
                              required
                              min={70}
                              max={100}
                              placeholder="Sesuai Rapor Terakhir"
                              value={formData.reportAverage}
                              onChange={(e) => setFormData({...formData, reportAverage: Number(e.target.value)})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Jumlah Hafalan Sekarang (Berapa Juz?)</label>
                            <input
                              type="number"
                              required
                              min={0}
                              max={30}
                              placeholder="0 jika belum menghafal"
                              value={formData.quranJuz}
                              onChange={(e) => setFormData({...formData, quranJuz: Number(e.target.value)})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tingkat Kelancaran Bacaan</label>
                            <select
                              value={formData.quranLevel}
                              onChange={(e) => setFormData({...formData, quranLevel: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm focus:outline-none focus:border-emerald-500/40"
                            >
                              <option value="Lancar & Sesuai Tajwid">Sangat Lancar & Sudah Sesuai Tajwid</option>
                              <option value="Lancar, Perlu Perbaikan Tajwid">Cukup Lancar, Mutu Tajwid Perlu Bimbingan</option>
                              <option value="Kurang Lancar">Kurang Lancar, Perlu Matrikulasi Dasar/IQRA</option>
                            </select>
                          </div>
                        </div>

                        {/* Extra Achievements field if Prestasi Track */}
                        {selectedTrack === AdmissionTrack.PRESTASI && (
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Deskripsi Singkat Kejuaraan/Prestasi</label>
                            <textarea
                              required
                              rows={3}
                              placeholder="Tuliskan nama kejuaraan, juara nomor berapa, tingkat apa (Kabupaten/Provinsi/Nasional). Contoh: Juara 1 OSN Matematika Tingkat Provinsi Gorontalo 2025"
                              value={formData.achievements}
                              onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 3: Parents & Supporting Document Upload Simulation */}
                    {formStep === 3 && (
                      <div className="space-y-4">
                        <div className="border-b border-neutral-800 pb-3">
                          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                            <span className="text-xs bg-emerald-950 h-5 w-5 rounded-full inline-flex items-center justify-center font-bold text-emerald-400">3</span>
                            Keluarga, Wali & Unggah Berkas
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nama Lengkap Ayah</label>
                            <input
                              type="text"
                              required
                              placeholder="Nama lengkap ayah"
                              value={formData.fatherName}
                              onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Pekerjaan Utama Ayah</label>
                            <input
                              type="text"
                              required
                              placeholder="PNS / Swasta / Petani / Pedagang"
                              value={formData.fatherOccupation}
                              onChange={(e) => setFormData({...formData, fatherOccupation: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nama Lengkap Ibu</label>
                            <input
                              type="text"
                              required
                              placeholder="Nama lengkap ibu kandung"
                              value={formData.motherName}
                              onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nomor Telepon Darurat (Wali)</label>
                            <input
                              type="tel"
                              required
                              placeholder="Biasanya sama dengan WhatsApp"
                              value={formData.guardianPhone}
                              onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500/40"
                            />
                          </div>
                        </div>

                        {/* File upload simulations specifically for Prestasi / Tahfidz or optional files */}
                        <div className="pt-2">
                          <label className="block text-xs font-medium text-neutral-400 mb-2">
                            Unggah Dokumen Pendukung (Kartu Keluarga / Piagam Prestasi)
                          </label>
                          
                          <div 
                            onClick={() => setFormFiles([{ name: "DOK_PERSYARATAN_PPDB.pdf" }])}
                            className="bg-neutral-950 border-2 border-dashed border-neutral-800 hover:border-emerald-500/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-neutral-900/10 transition-all flex flex-col items-center justify-center space-y-2"
                          >
                            <Upload className="h-8 w-8 text-neutral-500 animate-pulse" />
                            <span className="text-neutral-400 font-medium text-xs">Klik di sini untuk mengunggah dokumen</span>
                            <span className="text-[10px] text-neutral-600">Mendukung format PDF, JPG, PNG (Maks 5MB)</span>
                          </div>

                          {/* Render Uploaded items */}
                          {formFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-emerald-400 mt-3 font-mono">
                              <span className="truncate">{file.name}</span>
                              <button type="button" onClick={() => setFormFiles([])} className="text-emerald-400 hover:text-white">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl text-neutral-300 text-xs font-light leading-snug flex gap-3 items-start">
                          <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                          <span>
                            <strong>Pernyataan Kebenaran Data:</strong> Dengan menekan tombol kirim di bawah, saya selaku orang tua/wali calon santri menyatakan seluruh data yang diinput ke portal PPDB As-Sunnah ini adalah benar, sah, dan dapat dipertanggungjawabkan.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* FORM CONTROLS */}
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
                      {formStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors py-2.5 px-4 rounded-xl cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" /> Kembali
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-xs py-3 px-6 rounded-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            {formStep === 3 ? "Menyimpan..." : "Memproses..."}
                          </>
                        ) : (
                          <>
                            {formStep === 3 ? "Kirim Formulir Sekarang" : "Simpan & Lanjutkan"}
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                /* SUCCESS SUBMISSION SCREEN */
                <div className="bg-sbg border border-bdgen p-8 sm:p-12 text-center rounded-2xl relative overflow-hidden space-y-6 transition-colors duration-200">
                  
                  {/* Confetti effect inside simulation */}
                  <div className="h-16 w-16 bg-emerald-950/10 dark:bg-emerald-950 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mt-2">
                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-txp">Alhamdulillah, Pendaftaran Berhasil!</h3>
                    <p className="text-txs text-xs font-light leading-relaxed max-w-md mx-auto">
                      Formulir pendaftaran calon santri atas nama <strong>{formData.fullName}</strong> telah sukses tersimpan di database PPDB Pesantren As-Sunnah.
                    </p>
                  </div>

                  {/* ID Container */}
                  <div className="bg-pbg border border-bdgen rounded-2xl p-5 max-w-md mx-auto transition-colors duration-200">
                    <span className="text-[10px] text-txs/70 font-mono block uppercase tracking-widest">Nomor Registrasi Seleksi</span>
                    <span className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider select-all">
                      {newlyCreatedId}
                    </span>
                    <span className="text-[10px] text-txs mt-2 block font-mono">Simpan baik-baik nomor ini untuk mengecek status pendaftaran.</span>
                  </div>

                  {/* Next Step Instructions */}
                  <div className="text-left bg-pbg/50 border border-bdgen rounded-xl p-5 max-w-lg mx-auto text-xs space-y-2 text-txs font-light leading-relaxed transition-colors duration-200">
                    <span className="font-semibold text-txp block mb-1">Tahapan Langkah Setelah Mendaftar:</span>
                    1. <strong>Lacak Status:</strong> Masukkan nomor registrasi di atas ke menu "Lacak Status" untuk melihat hasil kelayakan berkas.<br />
                    2. <strong>Jadwal Seleksi:</strong> Staf admisi ustadz akan memeriksa biodata & menerbitkan jadwal seleksi ujian (baca Quran & akademik) dalam 2x24 jam.<br />
                    3. <strong>Gabung WA Grup:</strong> Anda juga akan dihubungi panitia sekretaris via WhatsApp ({formData.whatsapp}) untuk panduan ujian seleksi.
                  </div>

                  {/* Exit CTA */}
                  <div className="pt-6 border-t border-bdgen flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        resetForm();
                        setActiveTab("dashboard");
                      }}
                      className="text-xs bg-pbg hover:bg-sbg text-txp font-medium py-3 px-6 rounded-xl border border-bdgen cursor-pointer transition-colors duration-200"
                    >
                      Kembali ke Dabor Utama
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery(newlyCreatedId);
                        setActiveTab("check-status");
                        setSearchedRecord(registrations.find(r => r.id === newlyCreatedId) || null);
                      }}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-pbg font-semibold py-3 px-6 rounded-xl cursor-pointer transition-colors duration-200"
                    >
                      Lacak Pendaftaran Saya
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* TAB 4: TRACK STATUS / SEARCH */}
          {activeTab === "check-status" && (
            <motion.div
              layoutId="ppdb-views"
              key="view-check-status"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-8 animate-fade-in"
            >
              
              {/* Search Widget */}
              <div className="bg-sbg/40 p-6 sm:p-8 rounded-2xl border border-bdgen space-y-4 transition-colors duration-200">
                <h3 className="text-lg font-bold text-txp flex items-center gap-2">
                  <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Cek Status Kelulusan Calon Santri
                </h3>
                <p className="text-txs text-xs leading-relaxed font-light">
                  Silakan masukkan Nomor Registrasi Seleksi (e.g., ASSUNNAH-2026-00382) atau NISN 10-digit pendaftar untuk mengecek status seleksi.
                </p>

                <form onSubmit={handleSearchCheck} className="flex flex-col sm:flex-row gap-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Masukkan Nomor Registrasi / NISN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-pbg border border-bdgen text-sm text-txp placeholder-txs/55 focus:outline-none focus:border-emerald-500/45 transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-pbg font-semibold text-xs py-3 px-8 rounded-xl cursor-pointer transition-colors uppercase tracking-wider"
                  >
                    {isSearching ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Mencari...
                      </>
                    ) : "Cari Data"}
                  </button>
                </form>

                {searchError && (
                  <div className="p-3 bg-red-950/10 dark:bg-red-950/30 border border-red-500/20 text-red-650 dark:text-red-400 text-xs rounded-xl flex gap-2 items-center">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}
              </div>

              {/* SEARCH RESULT DISCOVERY CARD */}
              {searchedRecord && (
                <div className="bg-sbg/40 border border-bdgen rounded-2xl p-6 sm:p-8 space-y-8 transition-colors duration-200">
                  
                  {/* Top Stats of student */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-bdgen pb-5">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-950/10 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/10 font-bold">
                        {searchedRecord.track}
                      </span>
                      <h4 className="text-xl font-bold text-txp mt-2">{searchedRecord.fullName}</h4>
                      <p className="text-xs text-txs font-mono mt-0.5">NISN: {searchedRecord.nisn} | Asal: {searchedRecord.previousSchool}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-txs/75 font-mono block">Kode Registrasi</span>
                      <span className="text-base font-mono font-bold text-txp">{searchedRecord.id}</span>
                      <span className="text-[10px] text-txs/70 font-mono block mt-0.5">Dikirim: {searchedRecord.submittedAt}</span>
                    </div>
                  </div>

                  {/* VISUAL STEP PIPELINE */}
                  <div className="space-y-6">
                    <h5 className="text-xs font-semibold text-txp uppercase tracking-widest">Alur Pendaftaran & Status Terkini</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                      
                      {/* Step 1: Bio Submitted */}
                      <div className="p-4 rounded-xl relative overflow-hidden bg-pbg border border-bdgen transition-colors duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-txp">1. Terkirim</span>
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-[10px] text-txs block mt-1">Biodata calon santri tersimpan di database.</span>
                      </div>

                      {/* Step 2: Documents Verified */}
                      {(() => {
                        const isOk = searchedRecord.status !== ApplicationStatus.SUBMITTED;
                        return (
                          <div className={`p-4 rounded-xl border relative overflow-hidden transition-colors duration-200 ${
                            isOk ? "bg-pbg border-bdgen text-txp" : "bg-sbg/10 border-bdgen text-txs/50"
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold">2. Berkas</span>
                              {isOk ? <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Clock className="h-4 w-4 text-txs/40 animate-pulse" />}
                            </div>
                            <span className="text-[10px] text-txs block mt-1">
                              {isOk ? "Berkas verifikasi terbukti absah." : "Menunggu verifikasi staf berkas pendaftar."}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Step 3: Test Scheduled */}
                      {(() => {
                        const statuses = [ApplicationStatus.ACCEPTED, ApplicationStatus.RESERVE, ApplicationStatus.REJECTED, ApplicationStatus.TEST_SCHEDULED];
                        const isOk = statuses.includes(searchedRecord.status);
                        return (
                          <div className={`p-4 rounded-xl border relative overflow-hidden transition-colors duration-200 ${
                            isOk ? "bg-pbg border-bdgen text-txp" : "bg-sbg/10 border-bdgen text-txs/50"
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold">3. Seleksi Ujian</span>
                              {searchedRecord.status === ApplicationStatus.TEST_SCHEDULED ? (
                                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                              ) : isOk ? (
                                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-txs/45" />
                              )}
                            </div>
                            <span className="text-[10px] text-txs block mt-1">
                              {searchedRecord.testDate ? "Mendapat jadwal ujian seleksi luring." : "Ujian diselenggarakan setelah lolos berkas."}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Step 4: Final Admission Decision */}
                      {(() => {
                        const isFinal = [ApplicationStatus.ACCEPTED, ApplicationStatus.RESERVE, ApplicationStatus.REJECTED].includes(searchedRecord.status);
                        return (
                          <div className={`p-4 rounded-xl border-2 relative overflow-hidden transition-colors duration-200 ${
                            isFinal 
                              ? searchedRecord.status === ApplicationStatus.ACCEPTED 
                                ? "bg-emerald-950/10 dark:bg-emerald-950/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                : searchedRecord.status === ApplicationStatus.RESERVE
                                  ? "bg-yellow-950/10 dark:bg-yellow-950/20 border-yellow-500/30 text-yellow-600 dark:text-yellow-450"
                                  : "bg-red-950/10 dark:bg-red-950/20 border-red-500/30 text-red-600 dark:text-red-400"
                              : "bg-sbg/10 border-bdgen text-txs/50"
                          }`}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold">{isFinal ? "4. Keputusan" : "4. Kelulusan"}</span>
                              {searchedRecord.status === ApplicationStatus.ACCEPTED && <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                            </div>
                            <span className="text-[10px] text-txs block mt-1">
                              {isFinal ? `Selesai: ${searchedRecord.status}` : "Diumumkan setelah ujian diselesaikan."}
                            </span>
                          </div>
                        );
                      })()}

                    </div>
                  </div>

                  {/* ACTIVE STATE ACTIONS & ANNOUNCEMENT DETAILS FROM MUDIR */}
                  <div className="bg-pbg border border-bdgen rounded-xl p-6 space-y-4 transition-colors duration-200">
                    <h5 className="text-xs font-semibold text-txp uppercase tracking-wider">Rincian Informasi Resmi dari Panitia</h5>
                    
                    <div className="space-y-3 font-light text-txs text-sm">
                      <div className="flex gap-2 items-start">
                        <span className="font-semibold text-txp">Status Kelulusan:</span>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          searchedRecord.status === ApplicationStatus.ACCEPTED
                            ? "bg-emerald-950/25 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : searchedRecord.status === ApplicationStatus.TEST_SCHEDULED
                              ? "bg-blue-950/25 dark:bg-blue-950 text-sky-600 dark:text-sky-400 border border-blue-500/10"
                              : searchedRecord.status === ApplicationStatus.SUBMITTED
                                ? "bg-sbg text-txs border border-bdgen"
                                : searchedRecord.status === ApplicationStatus.RESERVE
                                  ? "bg-yellow-950/25 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20"
                                  : "bg-red-950/25 dark:bg-red-950 text-red-650 dark:text-red-400 border border-red-500/20"
                        }`}>
                          {searchedRecord.status}
                        </span>
                      </div>

                      {/* Display test schedule if exists */}
                      {searchedRecord.testDate && (
                        <div className="p-4 bg-sbg/60 rounded-xl border border-bdgen space-y-2 mt-2 transition-colors duration-200">
                          <h6 className="text-xs font-bold text-txp flex items-center gap-2">
                             <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            Kartu Panduan Jadwal Seleksi
                          </h6>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                            <div>
                              <span className="text-[10px] text-txs/70 block uppercase">Tanggal</span>
                              <span className="font-semibold text-txp">{searchedRecord.testDate}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-txs/70 block uppercase">Waktu</span>
                              <span className="font-semibold text-txp">{searchedRecord.testTime || "08:30 WITA"}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-txs/70 block uppercase">Lokasi/Gedung</span>
                              <span className="font-semibold text-emerald-650 dark:text-emerald-450">{searchedRecord.testVenue || "Gedung Pesantren"}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-txs block pt-1.5 border-t border-bdgen">
                            * Wajib membawa fotokopi akta kelahiran, pasfoto 3x4, dan didampingi orang tua wali berkemeja muslim rapi.
                          </span>
                        </div>
                      )}

                      {/* Mudir Notes of decision */}
                      {searchedRecord.notes && (
                        <div className="pt-2 border-t border-bdgen">
                          <span className="text-xs text-txs/65 block uppercase font-medium">Catatan Direktur Mudir:</span>
                          <p className="text-xs text-txs italic mt-1 font-light bg-sbg/20 p-2.5 rounded border border-bdgen">
                            "{searchedRecord.notes}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* PRINT FORMAL LETTER OR CONTRACT IF ACCEPTED / LULUS */}
                    {searchedRecord.status === ApplicationStatus.ACCEPTED && (
                      <div className="pt-4 border-t border-bdgen flex justify-end">
                        <button
                          onClick={() => setViewingLetterRecord(searchedRecord)}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer"
                        >
                          <FileText className="h-4.5 w-4.5" />
                          Unduh Surat Keputusan Kelulusan
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </motion.div>
          )}

          {/* TAB 5: STAFF/ADMIN PORTAL */}
          {activeTab === "admin-panel" && (
            <motion.div
              layoutId="ppdb-views"
              key="view-admin-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              
              {!adminLoggedIn ? (
                /* Admin Login Widget */
                <div className="space-y-6">
                  {hideNonAdminTabs && (
                    <div className="max-w-md mx-auto flex justify-start">
                      <button
                        onClick={() => window.location.hash = ""}
                        className="flex items-center gap-2 text-xs text-emerald-650 dark:text-emerald-450 hover:underline cursor-pointer font-semibold"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                      </button>
                    </div>
                  )}
                  <div className="bg-sbg p-8 rounded-2xl border border-bdgen max-w-md mx-auto text-center space-y-6 transition-colors duration-200">
                  <div className="h-12 w-12 rounded-full bg-emerald-950/10 dark:bg-emerald-950 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto transition-colors duration-200">
                    <Lock className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-txp font-sans">Otentikasi Staf Admisi</h3>
                    <p className="text-txs text-xs">Untuk mengelola berkas & status santri baru secara real-time di Cloud Firestore.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Primary Google Auth */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-750 hover:opacity-90 text-pbg font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md tracking-wider uppercase font-sans"
                    >
                      <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      Masuk dengan Google (Panitia)
                    </button>

                    <div className="flex items-center gap-2 text-txs/40 text-[9px] font-bold tracking-widest font-mono">
                      <div className="h-px bg-bdgen flex-1" />
                      <span>ATAU MASUK DENGAN SANDI</span>
                      <div className="h-px bg-bdgen flex-1" />
                    </div>

                    <form onSubmit={handleAdminAuth} className="space-y-4">
                      <div>
                        <input
                          type="password"
                          required
                          placeholder="Masukkan sandi kunci (Demo: assunnah84)"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-sm text-center text-txp focus:outline-none focus:border-emerald-500/40 placeholder-txs/50 font-mono transition-colors duration-200"
                        />
                      </div>

                      {adminError && <span className="text-rose-500 text-xs block font-bold">{adminError}</span>}

                      <button type="submit" className="w-full bg-tbg hover:bg-sbg/60 border border-bdgen text-emerald-600 dark:text-emerald-450 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer tracking-wider uppercase">
                        Masuk Menggunakan Sandi Demo
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              ) : (
                /* ADMIN REAL DATABASE CONTROLLER PANEL */
                <div className="bg-sbg border border-bdgen rounded-2xl p-6 sm:p-8 space-y-6 transition-colors duration-200">
                  
                  {/* Admin Header controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-bdgen pb-5">
                    <div>
                      <h4 className="text-lg font-bold text-txp">Dabor Kontrol Panitia PPDB</h4>
                      <p className="text-txs text-xs">Mengatur status, jadwal ujian, catatan kelulusan pendaftar.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      {hideNonAdminTabs && (
                        <button
                          onClick={() => window.location.hash = ""}
                          className="px-3.5 py-1.5 rounded-lg bg-sbg hover:bg-pbg text-txp border border-bdgen text-xs cursor-pointer flex items-center gap-1.5 transition-colors duration-200 font-semibold"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Halaman Utama
                        </button>
                      )}
                      <button 
                        onClick={handleReSeed}
                        className="px-3.5 py-1.5 rounded-lg border border-bdgen hover:border-emerald-500/50 text-txs hover:text-txp text-xs cursor-pointer transition-colors duration-200"
                      >
                        Reset & Contoh Data
                      </button>
                      <button 
                        onClick={handleClearDemoData}
                        className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-950/10 hover:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs cursor-pointer flex items-center gap-1.5 transition-colors duration-200 font-semibold"
                      >
                        🗑️ Hapus Data Demo
                      </button>
                      <button 
                        onClick={() => { setAdminLoggedIn(false); setAdminPassword(""); }}
                        className="px-3.5 py-1.5 rounded-lg bg-red-950/10 dark:bg-red-950/20 hover:bg-red-900/40 text-red-650 dark:text-red-450 border border-red-500/10 text-xs cursor-pointer flex items-center gap-1.5 transition-colors duration-200 font-semibold"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Keluar
                      </button>
                    </div>
                  </div>

                  {/* SEARCH & FILTER CONTROLLER FOR BOARD */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-txs/50">
                        <Search className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari berdasarkan nama, NISN, asal sekolah..."
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-sbg border border-bdgen text-xs text-txp placeholder:text-txs/60 focus:outline-none focus:border-emerald-500/40 transition-colors duration-200"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 bg-pbg border border-bdgen px-3 py-1.5 rounded-xl text-xs transition-colors duration-200">
                        <Filter className="h-3.5 w-3.5 text-txs" />
                        <span className="text-txs">Jalur:</span>
                        <select
                          value={adminTrackFilter}
                          onChange={(e) => setAdminTrackFilter(e.target.value)}
                          className="bg-pbg text-txp focus:outline-none cursor-pointer border-none p-0 text-xs font-semibold"
                        >
                          <option className="bg-pbg text-txp" value="Semua">Semua</option>
                          <option className="bg-pbg text-txp" value={AdmissionTrack.REGULER}>Reguler</option>
                          <option className="bg-pbg text-txp" value={AdmissionTrack.PRESTASI}>Prestasi</option>
                          <option className="bg-pbg text-txp" value={AdmissionTrack.TAHFIDZ}>Tahfidz</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 bg-pbg border border-bdgen px-3 py-1.5 rounded-xl text-xs transition-colors duration-200">
                        <Sliders className="h-3.5 w-3.5 text-txs" />
                        <span className="text-txs font-medium">Status:</span>
                        <select
                          value={adminStatusFilter}
                          onChange={(e) => setAdminStatusFilter(e.target.value)}
                          className="bg-pbg text-txp focus:outline-none cursor-pointer border-none p-0 text-xs font-semibold"
                        >
                          <option className="bg-pbg text-txp" value="Semua">Semua</option>
                          <option className="bg-pbg text-txp" value={ApplicationStatus.SUBMITTED}>Terkirim</option>
                          <option className="bg-pbg text-txp" value={ApplicationStatus.VERIFIED}>Terverifikasi</option>
                          <option className="bg-pbg text-txp" value={ApplicationStatus.TEST_SCHEDULED}>Ujian Dijadwalkan</option>
                          <option className="bg-pbg text-txp" value={ApplicationStatus.ACCEPTED}>Diterima/Lulus</option>
                          <option className="bg-pbg text-txp" value={ApplicationStatus.RESERVE}>Cadangan</option>
                          <option className="bg-pbg text-txp" value={ApplicationStatus.REJECTED}>Tidak Lulus</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DATA LIST TABLE */}
                  {(() => {
                    const filtered = registrations.filter(r => {
                      const matchSearch = r.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
                        r.nisn.includes(adminSearch) || r.previousSchool.toLowerCase().includes(adminSearch.toLowerCase());
                      const matchTrack = adminTrackFilter === "Semua" || r.track === adminTrackFilter;
                      const matchStatus = adminStatusFilter === "Semua" || r.status === adminStatusFilter;
                      return matchSearch && matchTrack && matchStatus;
                    });

                    return (
                      <div className="overflow-x-auto border border-bdgen rounded-xl bg-sbg/20 transition-colors duration-200">
                        {filtered.length > 0 ? (
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-pbg text-txp/80 border-b border-bdgen font-medium transition-colors duration-200">
                                <th className="p-4">Reg ID & Nama</th>
                                <th className="p-4">Jalur & NISN</th>
                                <th className="p-4">Akademik/Hafalan</th>
                                <th className="p-4">Status & Jadwal</th>
                                <th className="p-4 text-right">Tindakan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-bdgen">
                              {filtered.map(reg => (
                                <tr key={reg.id} className="hover:bg-sbg/40 transition-colors duration-150">
                                  
                                  {/* ID and Name */}
                                  <td className="p-4">
                                    <span className="font-mono text-[10px] text-txs/70 block">{reg.id}</span>
                                    <span className="font-bold text-txp text-sm block mt-0.5">{reg.fullName}</span>
                                    <span className="text-[10px] text-txs block font-light mt-0.5">Asal: {reg.previousSchool}</span>
                                  </td>

                                  {/* Track and NISN */}
                                  <td className="p-4">
                                    <span className="font-semibold block">{reg.track}</span>
                                    <span className="font-mono text-txs text-[10px] block mt-1">NISN: {reg.nisn}</span>
                                    <span className="text-[10px] block mt-0.5 text-txs/70">{reg.gender}</span>
                                  </td>

                                  {/* Academic & Qur'an */}
                                  <td className="p-4">
                                    <span className="block font-medium">Rapor: <strong className="text-txp font-bold">{reg.reportAverage}</strong></span>
                                    <span className="block text-[10px] text-txs mt-1 font-mono">Hafalan: {reg.quranJuz} Juz</span>
                                    <span className="block text-[10px] text-txs truncate max-w-40">{reg.quranLevel}</span>
                                  </td>

                                  {/* Status Decision & Exam Date */}
                                  <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${
                                      reg.status === ApplicationStatus.ACCEPTED
                                        ? "bg-emerald-950/25 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                        : reg.status === ApplicationStatus.TEST_SCHEDULED
                                          ? "bg-blue-950/25 dark:bg-blue-950 text-sky-600 dark:text-sky-450 border-blue-500/10"
                                          : reg.status === ApplicationStatus.SUBMITTED
                                            ? "bg-pbg text-txs border border-bdgen"
                                            : "bg-red-950/20 text-rose-500 border-red-500/10"
                                    }`}>
                                      {reg.status}
                                    </span>
                                    {reg.testDate && (
                                      <span className="block text-[10px] text-txs mt-1.5 font-mono">
                                        📅 Tes: {reg.testDate}
                                      </span>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td className="p-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => openEditDialog(reg)}
                                        className="p-2 rounded bg-pbg hover:bg-sbg border border-bdgen text-emerald-600 dark:text-emerald-450 hover:text-txp transition-all cursor-pointer"
                                        title="Ubah Status / Keputusan"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                      </button>
                                      
                                      <button
                                        onClick={() => deleteRegistration(reg.id)}
                                        className="p-2 rounded bg-red-950/10 dark:bg-red-950/20 hover:bg-red-900/40 border border-red-500/10 text-rose-650 dark:text-rose-400 hover:text-white transition-all cursor-pointer"
                                        title="Hapus Registrasi"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>

                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-12 text-zinc-500 text-xs">
                            Tidak ditemukan pendaftaran yang cocok dengan filter pencarian.
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* MODAL WINDOW 1: UPDATE STATUS & EXAM DIALOG (For Admins) */}
      {showStatusModal && selectedRegForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="status-edit-modal">
          <div className="relative w-full max-w-lg bg-sbg border border-bdgen rounded-2xl p-6 sm:p-8 space-y-6 text-left transition-colors duration-200">
            
            <button 
              onClick={() => { setShowStatusModal(false); setSelectedRegForEdit(null); }} 
              className="absolute top-4 right-4 text-txs hover:text-txp cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[10px] text-txs/70 font-mono block">Administrasi Pendaftaran</span>
              <h3 className="text-lg font-bold text-txp mt-1">Status: {selectedRegForEdit.fullName}</h3>
              <p className="text-xs text-txs mt-1">Edit status kelayakan, jadwal seleksi ujian atau hasil kelulusan santri.</p>
            </div>

            <form onSubmit={submitAdminStatusChange} className="space-y-4">
              {/* Status selectors */}
              <div>
                <label className="block text-xs text-txs mb-1.5 font-medium">Ubah Status Penerimaan</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-sbg border border-bdgen text-xs text-txp focus:outline-none focus:border-emerald-500/40"
                >
                  <option className="bg-sbg text-txp" value={ApplicationStatus.SUBMITTED}>Pendaftaran Terkirim (Tahap Awal)</option>
                  <option className="bg-sbg text-txp" value={ApplicationStatus.VERIFIED}>Berkas Terverifikasi (Lolos Dokumen)</option>
                  <option className="bg-sbg text-txp" value={ApplicationStatus.TEST_SCHEDULED}>Seleksi Ujian Luring Dijadwalkan</option>
                  <option className="bg-sbg text-txp" value={ApplicationStatus.ACCEPTED}>Diterima / Lulus Seleksi</option>
                  <option className="bg-sbg text-txp" value={ApplicationStatus.RESERVE}>Status Cadangan</option>
                  <option className="bg-sbg text-txp" value={ApplicationStatus.REJECTED}>Ujian Tidak Lulus / Ditolak</option>
                </select>
              </div>

              {/* Conditional Test scheduling fields */}
              {editStatus === ApplicationStatus.TEST_SCHEDULED && (
                <div className="p-4 bg-pbg rounded-xl border border-bdgen space-y-3 transition-colors duration-200">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Setel Kartu Seleksi Ujian:</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-txs mb-1 font-medium">Hari / Tanggal Tes</label>
                      <input 
                        type="date"
                        required
                        value={editTestDate}
                        onChange={(e) => setEditTestDate(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-sbg border border-bdgen text-xs text-txp [color-scheme:dark_light]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-txs mb-1 font-medium">Jam Pelaksanaan</label>
                      <input 
                        type="text"
                        required
                        placeholder="Contoh: 08:00 - 11:30"
                        value={editTestTime}
                        onChange={(e) => setEditTestTime(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-sbg border border-bdgen text-xs text-txp placeholder-txs/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-txs mb-1 font-medium">Tempat / Ruang Ujian</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Gedung SMPIT As-Sunnah (Putra)"
                      value={editTestVenue}
                      onChange={(e) => setEditTestVenue(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-sbg border border-bdgen text-xs text-txp placeholder-txs/50"
                    />
                  </div>
                </div>
              )}

              {/* Notes from mudir / admin */}
              <div>
                <label className="block text-xs text-txs mb-1.5 font-medium">Catatan / Ulasan Panitia Terkini</label>
                <textarea
                  rows={3}
                  placeholder="Isi ulasan pendukung. Contoh: Surat SK dan berkas pendaftaran dinyatakan lolos. Or Berkas KK kurang fotokopi, mohon disusulkan..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-xs text-txp placeholder-txs/45 focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-bdgen">
                <button
                  type="button"
                  onClick={() => { setShowStatusModal(false); setSelectedRegForEdit(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-pbg border border-bdgen cursor-pointer text-txp transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 hover:bg-emerald-500 bg-emerald-600 text-pbg font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL WINDOW 2: FORMAL ADMISSION SK LETTER (Authentic High-Fidelity Representation) */}
      {viewingLetterRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fade-in" id="letter-modal">
          <div className="relative w-full max-w-3xl bg-sbg border border-bdgen rounded-2xl p-6 sm:p-10 my-8 space-y-6 text-left shadow-2xl relative overflow-hidden transition-colors duration-200">
            
            {/* Close */}
            <button 
              onClick={() => setViewingLetterRecord(null)}
              className="absolute top-4 right-4 text-txs hover:text-txp cursor-pointer select-none border border-bdgen p-1 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Letter Frame Print Wrapper */}
            <div className="p-6 sm:p-10 bg-white text-zinc-900 rounded-xl space-y-8 select-text shadow-inner border-2 border-emerald-500 relative" id="print-letter-area">
              
              {/* Islamic geometric watermarks inside simulation letter */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_20%_20%_at_50%_50%,rgba(0,201,123,0.03),transparent)] pointer-events-none" />

              {/* School Letterhead */}
              <div className="flex items-center gap-4 border-b-4 border-emerald-500 pb-5">
                <div className="h-14 w-14 rounded-full bg-emerald-600 flex items-center justify-center text-white font-serif font-extrabold text-2xl shadow">
                  AS
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-serif uppercase tracking-normal">YAYASAN AS-SUNNAH GORONTALO</h2>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-emerald-700 uppercase tracking-wide leading-tight">PONDOK PESANTREN AS-SUNNAH GORONTALO</h3>
                  <span className="text-[10px] text-zinc-500 block font-light leading-normal">
                    Terakreditasi "A" BAN-S/M | NPSN: 60983726 | Alamat: Jl. Ki Hajar Dewantara, Gorontalo
                  </span>
                </div>
              </div>

              {/* Letter Header */}
              <div className="text-center space-y-1">
                <span className="text-sm font-bold block border-b border-zinc-900 w-max mx-auto px-4">
                  SURAT KEPUTUSAN KELULUSAN SELEKSI SPMB
                </span>
                <span className="text-[10px] text-zinc-600 block">
                  Nomor: 142/PP-AS/SK-PPDB/VI/2026
                </span>
              </div>

              {/* Salutations */}
              <div className="text-xs space-y-3 leading-relaxed">
                <span className="font-semibold block">Bismillahir-rahmanir-rahim,</span>
                <p>
                  Mudir (Pimpinan) Pondok Pesantren As-Sunnah Kota Gorontalo, dengan bertawakkal kepada Allah Subhanahu wa Ta'ala, setelah dilaksanakannya rapat pleno panitia pelaksana SPMB Gelombang I tahun akademik 2026/2027 atas verifikasi berkas, tes tertulis akademik dwi-bahasa, serta kelancaran setoran ujian tahfidzul Qur'an, dengan ini menetapkan bahwa:
                </p>
              </div>

              {/* Student Metadata Table */}
              <table className="w-full text-xs border border-zinc-350 bg-zinc-50 rounded select-text">
                <tbody>
                  <tr className="border-b border-zinc-200">
                    <td className="p-3 font-semibold text-zinc-500 w-1/3">No. Registrasi</td>
                    <td className="p-3 font-mono font-bold text-zinc-900">{viewingLetterRecord.id}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-3 font-semibold text-zinc-500">Nama Calon Santri</td>
                    <td className="p-3 font-bold text-zinc-900 uppercase">{viewingLetterRecord.fullName}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-3 font-semibold text-zinc-500">NISN Asal</td>
                    <td className="p-3 font-mono text-zinc-900">{viewingLetterRecord.nisn}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="p-3 font-semibold text-zinc-500">Program Jenjang</td>
                    <td className="p-3 font-semibold text-zinc-900">{viewingLetterRecord.track}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-500">Keputusan Akhir</td>
                    <td className="p-3 font-extrabold text-emerald-600 uppercase tracking-wider">
                      DITERIMA / LOLOS SELEKSI UTAMA
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Letter Footer terms */}
              <div className="text-xs text-zinc-700 leading-relaxed space-y-2">
                <span className="font-bold text-zinc-900 block uppercase">CONSTITUTIONAL TERMS / KETENTUAN DAFTAR ULANG:</span>
                <p>
                  1. Calon santri terpilih diwajibkan melakukan daftar ulang lunas/cicilan DP pertama paling lambat 10 hari sejak SK ini ditandatangani.<br />
                  2. Membawa fotokopi Surat Kelakuan Baik yang sah dari sekolah asal, surat keterangan sehat bebas penyakit menular dari puskesmas terpercaya.<br />
                  3. Mengisi pakta integritas mukim asrama 3 tahun penuh di bawah sanksi administratif jika melakukan pembatalan sepihak.
                </p>
              </div>

              {/* Signatures */}
              <div className="flex justify-between items-end pt-6 text-xs">
                <div className="text-zinc-500 font-mono text-[9px]">
                  Generated securely by As-Sunnah IT Portal<br />
                  Hash: 84ASG-72FF-938AB
                </div>
                
                <div className="text-right space-y-12">
                  <div>
                    <span className="block">Gorontalo, 15 Juni 2026</span>
                    <span className="font-semibold block">Mudir Pondok Pesantren As-Sunnah,</span>
                  </div>
                  
                  <div>
                    <span className="font-bold block uppercase border-b border-zinc-900">Ustadz H. Ahmad Ridwan, Lc., M.Ag.</span>
                    <span className="text-[10px] text-zinc-500 block">NIP. 19840412 201211 1 001</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Print trigger button */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-neutral-400">Tekan tombol di kanan untuk mencetak SK ini.</span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
              >
                <Download className="h-4 w-4" /> Cetak Surat (PDF)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
