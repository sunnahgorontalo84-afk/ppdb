import React, { useState, useEffect } from "react";
import { BoardingSchoolProfile } from "./data";
import { 
  Compass, 
  Menu, 
  X, 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  Search, 
  PhoneCall, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Heart,
  Globe,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import Hero from "./components/Hero";
import Programs from "./components/Programs";
import About from "./components/About";
import Teachers from "./components/Teachers";
import PpdbPortal from "./components/PpdbPortal";
import Contact from "./components/Contact";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Theme state: "light" | "dark" | "system"
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(() => {
    return (localStorage.getItem("theme-mode") as "light" | "dark" | "system") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      let activeTheme: "light" | "dark" = "dark";
      if (themeMode === "system") {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        activeTheme = isSystemDark ? "dark" : "light";
      } else {
        activeTheme = themeMode;
      }

      if (activeTheme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    };

    applyTheme();
    localStorage.setItem("theme-mode", themeMode);

    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme();
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [themeMode]);

  // Navigation active state: "home", "programs", "about", "teachers", "ppdb", "contact", "admin"
  const [activeView, setActiveView] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash === "#/admin" || hash === "#admin" || search.includes("admin")) {
        setActiveView("admin");
      } else if (hash === "#/ppdb" || hash === "#ppdb") {
        setActiveView("ppdb");
      } else if (hash === "#/home" || hash === "#home") {
        setActiveView("home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Scroll to widget helper if same view or change tab
  const handleNavigate = (viewId: string) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    
    // Clear hash if navigating back to public areas
    if (viewId !== "admin") {
      if (window.location.hash === "#/admin" || window.location.hash === "#admin") {
        window.location.hash = "";
      }
    }
    
    // Automatically smooth scroll to top of viewport
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-pbg text-txp flex flex-col font-sans selection:bg-emerald-600 selection:text-black transition-colors duration-200">
      
      {/* 1. TOP GLOBAL NAVIGATION HEADER */}
      <nav className="sticky top-0 z-40 bg-pbg/85 backdrop-blur-md border-b border-bacc navbar-section transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo Header */}
            <div 
              onClick={() => handleNavigate("home")} 
              className="flex items-center gap-3 cursor-pointer group"
              id="brand-logo-nav"
            >
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-650 flex items-center justify-center text-black font-extrabold text-lg shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-all duration-200">
                AS
              </div>
              <div className="text-left">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-txp block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  As-Sunnah
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold block uppercase tracking-wider">
                  Pesantren Rabbani
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Grid matching our views) */}
            <div className="hidden lg:flex items-center gap-7">
              <button 
                id="nav-link-home"
                onClick={() => handleNavigate("home")}
                className={`text-xs uppercase tracking-wider font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                  activeView === "home" ? "text-emerald-600 dark:text-emerald-400" : "text-txs/80"
                }`}
              >
                Beranda
              </button>

              {/* Programs */}
              <button 
                id="nav-link-programs"
                onClick={() => handleNavigate("programs")}
                className={`text-xs uppercase tracking-wider font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                  activeView === "programs" ? "text-emerald-600 dark:text-emerald-400" : "text-txs/80"
                }`}
              >
                Program
              </button>

              {/* About Profile */}
              <button 
                id="nav-link-about"
                onClick={() => handleNavigate("about")}
                className={`text-xs uppercase tracking-wider font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                  activeView === "about" ? "text-emerald-600 dark:text-emerald-400" : "text-txs/80"
                }`}
              >
                Profil Visi-Misi
              </button>

              {/* Teachers */}
              <button 
                id="nav-link-teachers"
                onClick={() => handleNavigate("teachers")}
                className={`text-xs uppercase tracking-wider font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                  activeView === "teachers" ? "text-emerald-600 dark:text-emerald-400" : "text-txs/80"
                }`}
              >
                Dewan Guru
              </button>

              {/* Contact */}
              <button 
                id="nav-link-contact"
                onClick={() => handleNavigate("contact")}
                className={`text-xs uppercase tracking-wider font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer ${
                  activeView === "contact" ? "text-emerald-600 dark:text-emerald-400" : "text-txs/80"
                }`}
              >
                Kontak & FAQ
              </button>
            </div>

            {/* CTA PPDB BUTTON & MOBILE TOGGLERS */}
            <div className="flex items-center gap-4">
              
              {/* Elegant Theme Selector Pill */}
              <div className="flex items-center bg-sbg border border-bacc rounded-xl p-0.5 shadow-sm" id="theme-selector-pill">
                <button
                  onClick={() => setThemeMode("light")}
                  className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    themeMode === "light"
                      ? "bg-emerald-600 text-[#050806]"
                      : "text-emerald-500/60 hover:text-emerald-400"
                  }`}
                  title="Mode Terang"
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setThemeMode("dark")}
                  className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    themeMode === "dark"
                      ? "bg-emerald-600 text-[#050806]"
                      : "text-emerald-500/60 hover:text-emerald-400"
                  }`}
                  title="Mode Gelap"
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setThemeMode("system")}
                  className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                    themeMode === "system"
                      ? "bg-emerald-600 text-[#050806]"
                      : "text-emerald-500/60 hover:text-emerald-400"
                  }`}
                  title="Default Sistem"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                id="nav-btn-ppdb"
                onClick={() => handleNavigate("ppdb")}
                className={`hidden md:block text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeView === "ppdb"
                    ? "bg-tbg text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/10 font-bold"
                }`}
              >
                PPDB Online 2026/2027
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg border border-emerald-900/20 hover:bg-sbg text-emerald-400 hover:text-white transition-colors cursor-pointer"
                id="mobile-nav-toggle"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-bacc bg-pbg overflow-hidden animate-fade-in"
              id="mobile-nav-panel"
            >
              <div className="px-4 pt-4 pb-6 space-y-3">
                <button
                  onClick={() => handleNavigate("home")}
                  className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-sbg hover:text-emerald-400 text-sm font-medium transition-colors cursor-pointer"
                >
                  Beranda
                </button>
                <button
                  onClick={() => handleNavigate("programs")}
                  className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-sbg hover:text-emerald-400 text-sm font-medium transition-colors cursor-pointer"
                >
                  Program Pendidikan
                </button>
                <button
                  onClick={() => handleNavigate("about")}
                  className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-sbg hover:text-emerald-400 text-sm font-medium transition-colors cursor-pointer"
                >
                  Profil Visi-Misi & Fasilitas
                </button>
                <button
                  onClick={() => handleNavigate("teachers")}
                  className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-sbg hover:text-emerald-400 text-sm font-medium transition-colors cursor-pointer"
                >
                  Dewan Guru / Pengajar
                </button>
                <button
                  onClick={() => handleNavigate("contact")}
                  className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-sbg hover:text-emerald-400 text-sm font-medium transition-colors cursor-pointer"
                >
                  Hubungi Kami & FAQ
                </button>
                
                {/* Mobile Theme Switcher */}
                <div className="pt-4 border-t border-bacc flex items-center justify-between text-xs text-txs">
                  <span>Tema Aplikasi</span>
                  <div className="flex items-center bg-sbg border border-bacc rounded-xl p-0.5 shadow-sm">
                    <button
                      onClick={() => setThemeMode("light")}
                      className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer text-[10px] uppercase font-bold ${
                        themeMode === "light" ? "bg-emerald-600 text-[#050806]" : "text-emerald-500/60 hover:text-emerald-400"
                      }`}
                    >
                      Terang
                    </button>
                    <button
                      onClick={() => setThemeMode("dark")}
                      className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer text-[10px] uppercase font-bold ${
                        themeMode === "dark" ? "bg-emerald-600 text-[#050806]" : "text-emerald-500/60 hover:text-emerald-400"
                      }`}
                    >
                      Gelap
                    </button>
                    <button
                      onClick={() => setThemeMode("system")}
                      className={`px-3 py-1 rounded-lg transition-all duration-150 cursor-pointer text-[10px] uppercase font-bold ${
                        themeMode === "system" ? "bg-emerald-600 text-[#050806]" : "text-emerald-500/60 hover:text-emerald-400"
                      }`}
                    >
                      Default
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-bacc">
                  <button
                    onClick={() => handleNavigate("ppdb")}
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-[#050806] py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                  >
                    Daftar PPDB Online 2026
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* 2. DYNAMIC CONTENT AREA WITH TRANSITIONS */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* VIEW A: HOME */}
            {activeView === "home" && (
              <div>
                {/* 1. Main visual banner */}
                <Hero onNavigate={handleNavigate} />
                
                {/* 2. Slogan & Highlight values */}
                <section className="py-20 bg-pbg border-t border-bdgen transition-colors duration-200">
                  <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/20 dark:border-emerald-500/10">Nilai-Nilai Luhur</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-txp tracking-tight font-sans">
                      Menjawab Kebutuhan <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Pendidikan Umat</span>
                    </h2>
                    <p className="text-sm text-txs leading-relaxed font-light font-sans max-w-3xl mx-auto">
                      Di era modernisasi global, {BoardingSchoolProfile.name} membekali santri beraqidah ahlussunnah wal jamaah yang murni, disiplin harian menggapai ketaatan ibadah, membiasakan adab sunnah mulia, serta membajai diri penguasaan kurikulum sains nasional SMP & SMA IT.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                      <div className="p-6 rounded-2xl bg-sbg border border-bdgen hover:border-emerald-500/10 transition-all duration-300 hover:translate-y-[-4px] shadow-premium">
                        <span className="text-3xl font-mono text-emerald-650 dark:text-emerald-550 font-extrabold block">01</span>
                        <h4 className="text-txp font-bold text-sm mt-3 font-sans">Aqidah & Manhaj Salaf</h4>
                        <p className="text-txs text-xs mt-2 leading-relaxed font-light">Pondasi pemahaman agama berdasarkan jalan mulia para sahabat salafush-shalih.</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-sbg border border-bdgen hover:border-emerald-500/10 transition-all duration-300 hover:translate-y-[-4px] shadow-premium">
                        <span className="text-3xl font-mono text-emerald-650 dark:text-emerald-550 font-extrabold block">02</span>
                        <h4 className="text-txp font-bold text-sm mt-3 font-sans">Mutqin Tahfidz Harian</h4>
                        <p className="text-txs text-xs mt-2 leading-relaxed font-light font-sans">Halaqah setoran pagi & sore intensif dengan asisten asatidz mudir bersertifikat sanad.</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-sbg border border-bdgen hover:border-emerald-500/10 transition-all duration-300 hover:translate-y-[-4px] shadow-premium">
                        <span className="text-3xl font-mono text-emerald-650 dark:text-emerald-550 font-extrabold block">03</span>
                        <h4 className="text-txp font-bold text-sm mt-3 font-sans">Teknologi & Matematika</h4>
                        <p className="text-txs text-xs mt-2 leading-relaxed font-light">Raihan kurikulum sains berkualitas menyiapkan lulusan kuliah di LIPPIA / Madinah or PTN Ternama.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Short Teasers */}
                <Programs onNavigate={handleNavigate} />
              </div>
            )}

            {/* VIEW B: PROGRAMS */}
            {activeView === "programs" && (
              <Programs onNavigate={handleNavigate} />
            )}

            {/* VIEW C: ABOUT PROFIL */}
            {activeView === "about" && (
              <About />
            )}

            {/* VIEW D: TEACHERS */}
            {activeView === "teachers" && (
              <Teachers />
            )}

            {/* VIEW E: PPDB PORTAL */}
            {activeView === "ppdb" && (
              <PpdbPortal />
            )}

            {/* VIEW E.1: PPDB PORTAL FOR ADMINS (STANDALONE) */}
            {activeView === "admin" && (
              <PpdbPortal initialTab="admin-panel" hideNonAdminTabs={true} />
            )}

            {/* VIEW F: CONTACT & FAQ */}
            {activeView === "contact" && (
              <Contact />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. GLOBAL FOOTER DESIGN */}
      <footer className="bg-pbg text-txs text-xs border-t border-bdgen pt-16 pb-8 animate-fade-in transition-colors duration-200" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* School Brief col */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-600/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
                  AS
                </div>
                <span className="font-bold text-txp text-base tracking-tight font-sans">{BoardingSchoolProfile.name}</span>
              </div>
              <p className="text-txs text-[11px] font-sans font-light leading-relaxed">
                Pondok Pesantren khusus asrama yang melatih generasi santri penghafal Al-Qur'an terakreditasi nasional, berintegritas sains tinggi, mandiri, dan berkarakter akhlak salafi.
              </p>
            </div>

            {/* Quick Links col */}
            <div className="space-y-4">
              <h4 className="text-txp font-bold font-mono text-xs uppercase tracking-wider">Navigasi Link</h4>
              <ul className="space-y-2 font-light text-txs">
                <li>
                  <button onClick={() => handleNavigate("home")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Selamat Datang</button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("programs")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Program MTS / MA</button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("about")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Visi Misi & Fasilitas</button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("teachers")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Mudir & Asasidzah</button>
                </li>
              </ul>
            </div>

            {/* PPDB Portal Links col */}
            <div className="space-y-4">
              <h4 className="text-txp font-bold font-mono text-xs uppercase tracking-wider">Portal SPMB PPDB</h4>
              <ul className="space-y-2 font-light text-txs">
                <li>
                  <button onClick={() => handleNavigate("ppdb")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer text-emerald-650 dark:text-emerald-500 font-semibold font-mono transition-colors">Daftar Santri Baru &rarr;</button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("ppdb")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Jalur Prestasi</button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("ppdb")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Beasiswa Tahfidz</button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("ppdb")} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Lacak Status Kelulusan</button>
                </li>
              </ul>
            </div>

            {/* Newsletter col */}
            <div className="space-y-4">
              <h4 className="text-txp font-bold font-mono text-xs uppercase tracking-wider">Kabar Sepekan Pesantren</h4>
              <p className="text-txs text-[11px] font-light leading-relaxed">
                Masukkan email Anda untuk informasi tausyiah ringkas asatidz, info jadwal pengajian bulanan pesantren, or agenda SPMB.
              </p>
              
              {!newsletterSubscribed ? (
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Ketik email Anda..."
                    className="px-3 py-2 bg-sbg border border-bdgen text-txp placeholder-txs/50 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-500/30 transition-colors"
                  />
                  <button 
                    onClick={() => setNewsletterSubscribed(true)}
                    className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] uppercase font-mono cursor-pointer transition-colors"
                  >
                    Ikut
                  </button>
                </div>
              ) : (
                <p className="text-emerald-650 dark:text-emerald-500 text-xs font-semibold font-sans flex items-center gap-1.5 py-1">
                  ✓ Alamat email terdaftar untuk Buletin!
                </p>
              )}
            </div>

          </div>

          {/* Trademarks */}
          <div className="border-t border-bdgen pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-emerald-700/70 font-medium">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-500 animate-pulse" />
              <span>&copy; {new Date().getFullYear()} Pondok Pesantren As-Sunnah Gorontalo. Hak Cipta Dilindungi Undang-Undang.</span>
            </div>

            <div className="flex gap-4 font-light text-txs">
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kebijakan Privasi</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Aturan Asrama</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Syarat Pendaftaran</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
