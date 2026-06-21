import React from "react";
import { VisiMisi, Achievements, FacilitiesData, BoardingSchoolProfile } from "../data";
import { Check, Award, Compass, Sparkles, BookOpen, Presentation, Home, Cpu, Activity, Landmark } from "lucide-react";
import { motion } from "motion/react";

// Robust Lucide Icon Picker mapping helper
const getFacilityIcon = (iconName: string) => {
  switch (iconName) {
    case "Church": return Compass;
    case "Presentation": return Presentation;
    case "Home": return Home;
    case "Cpu": return Cpu;
    case "BookOpen": return BookOpen;
    case "Activity": return Activity;
    default: return Landmark;
  }
};

export default function About() {
  return (
    <div className="bg-pbg text-txp py-16 transition-colors duration-200" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Visi Misi Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="visimisi-section">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Visi & Misi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-txp font-sans">
              Menempa Karakter <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Santri Bertauhid</span> Mulia
            </h2>
            <p className="text-txs leading-relaxed font-light text-sm">
              Didirikan sejak tahun {BoardingSchoolProfile.foundedYear}, {BoardingSchoolProfile.name} berkomitmen melahirkan generasi mandiri hafizhul Qur'an yang istiqomah belajar, membumikan sunnah, dan cakap teknologi.
            </p>
            
            {/* Visi Block */}
            <div className="relative p-6 rounded-2xl bg-sbg border border-bdgen shadow-premium overflow-hidden transition-all duration-200 hover:translate-y-[-2px]">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600 dark:bg-emerald-500" />
              <h4 className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Visi Pesantren
              </h4>
              <p className="text-txp text-sm mt-3 leading-relaxed font-light italic font-serif">
                "{VisiMisi.visi}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-sbg border border-bdgen rounded-2xl p-8 sm:p-10 space-y-6 transition-colors duration-200 shadow-premium">
            <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 border-b border-bdgen pb-4 flex items-center gap-2">
              <Compass className="h-5 w-5 text-emerald-605 dark:text-emerald-400" />
              Komitmen Misi Kami
            </h3>
            
            <ul className="grid grid-cols-1 gap-4">
              {VisiMisi.misi.map((misiStr, idx) => (
                <li key={idx} className="flex gap-4 items-start text-sm">
                  <div className="h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-755 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/10 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-txp/90 leading-relaxed font-light">{misiStr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prestasi Section */}
        <div className="border-t border-bdgen pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Catatan Prestasi</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-txp font-sans">
              Ikhtisar <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Capaian</span> Pesantren
            </h2>
            <p className="text-txs text-sm font-light mt-3">
              Alhamdulillah, atas taufiq dari Allah, para santri kami terus berupaya mengukir prestasi gemilang baik di ranah keagamaan, bahasa, maupun sains umum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Achievements.map((ach, idx) => (
              <div 
                key={idx} 
                className="group relative p-6 rounded-2xl bg-sbg border border-bdgen hover:border-emerald-500/20 shadow-premium hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-pbg border border-bdgen text-emerald-700 dark:text-emerald-400 font-mono transition-colors duration-205">
                    {ach.year}
                  </span>
                  <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-txp font-bold text-sm leading-snug mt-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-sans font-medium">
                  {ach.title}
                </h4>
                <p className="text-emerald-650 dark:text-emerald-500/60 text-[10px] uppercase font-bold mt-3 tracking-widest font-mono">
                  {ach.level}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fasilitas Section */}
        <div className="border-t border-bdgen pt-16" id="fasilitas-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Lingkungan Belajar</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-txp font-sans">
              Fasilitas Penunjang <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Pendidikan</span>
            </h2>
            <p className="text-txs text-sm font-light mt-3">
              Menciptakan ekosistem belajar mukim yang kondusif, bersih, rapi, dan representatif demi kenyamanan ibadah dan studi santri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FacilitiesData.map((fac, idx) => {
              const IconComponent = getFacilityIcon(fac.icon);
              return (
                <div 
                  key={idx} 
                  className="flex flex-col justify-between p-6 rounded-2xl bg-sbg border border-bdgen hover:border-emerald-500/20 shadow-premium hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
                >
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-pbg border border-bdgen text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors duration-200">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h4 className="text-txp font-bold text-base mt-4 font-sans font-medium">{fac.name}</h4>
                    <p className="text-txs text-xs mt-2 leading-relaxed font-light">{fac.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
