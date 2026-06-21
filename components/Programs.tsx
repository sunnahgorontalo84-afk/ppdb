import React from "react";
import { ProgramsData } from "../data";
import { Check, Clock, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

interface ProgramsProps {
  onNavigate: (viewId: string) => void;
}

export default function Programs({ onNavigate }: ProgramsProps) {
  return (
    <section className="py-20 lg:py-28 bg-pbg relative" id="programs-section">
      <div className="absolute inset-0 bg-radial from-emerald-950/2 dark:from-emerald-950/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/5 dark:bg-emerald-950/50 px-3 py-1 rounded border border-emerald-500/20">Program Pendidikan</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-txp tracking-tight mt-3 font-sans">
            Tingkatan <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Sekolah Islam</span> Terpadu
          </h2>
          <p className="text-sm font-sans text-txs mt-4 leading-relaxed font-light">
            Menyelenggarakan sistem asrama (boarding school) 24 jam dengan integrasi total antara ilmu syari'at, sains, akhlak, kemandirian, dan bahasa asing.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {ProgramsData.map((program, index) => {
            const isSma = program.level === "SMA IT";
            return (
              <motion.div
                key={program.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 ${
                  isSma 
                    ? "border-emerald-500/30 bg-sbg shadow-premium" 
                    : "border-bdgen bg-sbg/55 dark:bg-sbg/40 shadow-premium"
                }`}
              >
                {/* Popularity Badge for SMA */}
                {isSma && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white font-bold text-[10px] py-1.5 px-4 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-md">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Madinah Prep Track</span>
                  </div>
                )}

                <div className="p-8">
                  {/* Badge & Level */}
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-3xl font-mono">{program.level}</span>
                    <div className="h-1 text-emerald-700/50 w-6" />
                    <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-500/60 uppercase tracking-widest font-mono">Boarding Program</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-txp mt-4 font-sans">{program.title}</h3>
                  <p className="text-txs text-sm font-light leading-relaxed mt-3">{program.description}</p>
                  
                  {/* Clock / Duration */}
                  <div className="flex items-center gap-2 mt-5 text-emerald-700 dark:text-emerald-300 bg-tbg/55 dark:bg-tbg/70 rounded-lg px-3 py-1.5 w-max border border-bdgen">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-mono font-medium">{program.duration}</span>
                  </div>

                  {/* Curriculum List */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Fokus Kurikulum Utama</span>
                    </div>
                    
                    <ul className="space-y-2.5">
                      {program.curriculum.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-txs text-sm">
                          <div className="mt-1 h-4 w-4 shrink-0 rounded bg-tbg border border-bdgen flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="font-light leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="p-8 bg-tbg/10 dark:bg-tbg/30 border-t border-bdgen flex justify-between items-center flex-wrap gap-4">
                  <div className="text-[10px] uppercase font-bold tracking-tight text-emerald-700 dark:text-emerald-500/80 font-mono">
                    Ikhwan (Putra) / Akhawat (Putri) Terpisah
                  </div>
                  <button
                    onClick={() => onNavigate("ppdb")}
                    className={`text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-all duration-200 cursor-pointer ${
                      isSma 
                        ? "bg-emerald-600 text-white border-transparent hover:bg-emerald-500 shadow-md hover:shadow-emerald-500/10" 
                        : "bg-transparent text-emerald-700 dark:text-emerald-350 border border-bdgen hover:border-emerald-500/30 hover:bg-tbg/55"
                    }`}
                  >
                    Daftar SPMB {program.level}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
