import React from "react";
import { BoardingSchoolProfile } from "../data";
import { Users, Award, BookOpen, ChevronRight, Sparkles, Building } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onNavigate: (viewId: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const stats = [
    { id: "stat-1", icon: Users, value: "480+", label: "Santri Mukim", color: "text-emerald-400" },
    { id: "stat-2", icon: Award, value: "32", label: "Asatidzah Berlisensi", color: "text-yellow-400" },
    { id: "stat-3", icon: BookOpen, value: "100%", label: "Kurikulum Terpadu", color: "text-sky-400" },
    { id: "stat-4", icon: Building, value: "12+", label: "Fasilitas Modern", color: "text-emerald-400" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/45 via-pbg to-pbg dark:from-emerald-950/10 dark:via-pbg dark:to-pbg py-20 lg:py-32 transition-colors duration-200" id="hero-section">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 dark:opacity-100 pointer-events-none" />
      
      {/* Ambient Glows */}
      <div className="absolute top-20 left-1/4 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-96 h-96 bg-emerald-600/3 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-500/20 px-4 py-2 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-medium tracking-wide shadow-premium"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Penerimaan Santri Baru (PPDB) 2026/2027 Dibuka!</span>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="text-4xl sm:text-5xl lg:text-6xl tracking-tight text-txp leading-tight"
            >
              <span className="font-light italic font-serif block text-emerald-700 dark:text-emerald-100">Selamat Datang di</span>
              <span className="font-extrabold font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-800 to-emerald-700 dark:from-emerald-400 dark:via-emerald-100 dark:to-emerald-300">
                {BoardingSchoolProfile.name}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-txs max-w-2xl leading-relaxed font-light font-sans"
            >
              {BoardingSchoolProfile.tagline}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                id="btn-ppdb-cta"
                onClick={() => onNavigate("ppdb")}
                className="group flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
              >
                Daftar PPDB Online
                <ChevronRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="btn-visimisi-cta"
                onClick={() => onNavigate("about")}
                className="flex items-center justify-center gap-2 bg-sbg hover:bg-tbg text-txp font-semibold px-8 py-4 rounded-xl border border-bdgen hover:border-emerald-500/20 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-premium"
              >
                Jelajahi Profil Pondok
              </button>
            </motion.div>
          </div>

          {/* Hero visual representation */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 blur-xl opacity-60 animate-pulse pointer-events-none" />
              <div className="relative rounded-2xl border border-bdgen bg-sbg/95 p-4 backdrop-blur-md overflow-hidden aspect-video sm:aspect-square flex items-center justify-center transition-colors duration-200 shadow-premium">
                
                <div className="absolute inset-0 bg-radial from-emerald-950/2 dark:from-emerald-950/10 via-transparent to-transparent pointer-events-none" />
                <div className="w-full h-full flex flex-col justify-between p-6 rounded-xl bg-tbg/20 dark:bg-tbg/40 border border-bdgen relative overflow-hidden">
                  
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-950/5 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-550/10 font-bold">TAHFIDZ & SAINS</span>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-500 tracking-wider uppercase font-mono font-bold">Gorontalo, ID</span>
                  </div>

                  <div className="my-auto space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-txp tracking-tight">Terakreditasi UIM (Universitas Islam Madinah)</h3>
                    <p className="text-xs sm:text-sm text-txs leading-relaxed font-light">
                      Kami memadukan ilmu syar'i murni dengan kurikulum akademik nasional untuk melahirkan cendekiawan muslim yang beraqidah lurus dan tangguh di era digital.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider font-bold rounded bg-sbg text-emerald-700 dark:text-emerald-400 border border-bdgen">30 Juz Bersanad</span>
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider font-bold rounded bg-sbg text-amber-700 dark:text-yellow-500 border border-bdgen">Kitab Turots</span>
                      <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider font-bold rounded bg-sbg text-sky-750 dark:text-sky-450 border border-bdgen">LIPPIA/UIM</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-bdgen pt-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs text-emerald-750 dark:text-emerald-400/80 font-semibold font-sans">Gelombang I Terbuka Hingga Desember 2026</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 block border-t border-bdgen pt-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center">
            {stats.map((stat) => {
              const IconComp = stat.icon;
              return (
                <div key={stat.id} className="text-center group p-4 rounded-xl hover:bg-sbg/80 hover:translate-y-[-2px] hover:shadow-premium transition-all duration-300 w-full cursor-default">
                  <div className="inline-flex items-center justify-center p-3 rounded-xl bg-sbg border border-bdgen text-emerald-600 dark:text-emerald-450 mb-3 group-hover:border-emerald-500/20 group-hover:bg-emerald-950/5 dark:group-hover:bg-emerald-950/10 transition-all shadow-premium">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-txp tracking-tight font-sans">{stat.value}</div>
                  <div className="text-[10px] uppercase text-emerald-700 dark:text-emerald-500/60 tracking-wider font-bold mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
