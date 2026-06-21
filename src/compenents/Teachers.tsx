import React, { useState } from "react";
import { TeachersData } from "../data";
import { Search, GraduationCap } from "lucide-react";

export default function Teachers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");

  // Get unique list of specialties for filter
  const specialites = ["Semua", ...Array.from(new Set(TeachersData.map(t => t.specialty)))];

  // Filtering logic
  const filteredTeachers = TeachersData.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.education.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "Semua" || teacher.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <section className="py-20 bg-pbg text-txp transition-colors duration-200" id="pengajar-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left max-w-xl">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/5 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Dewan Asatidzah</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-txp font-sans">
              Mudir & <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Asatidzah</span> Pengajar
            </h2>
            <p className="text-txs text-sm font-light mt-3 leading-relaxed">
              Dididik langsung oleh para alumni Universitas Islam Madinah Arab Saudi, Al-Azhar Kairo, serta perguruan tinggi rujukan keagamaan & umum nasional.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Cari asatidz atau spesialisasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-sbg border border-bdgen text-sm text-txp placeholder-txs focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {specialites.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                selectedSpecialty === spec
                  ? "bg-emerald-600 text-white border-transparent font-bold shadow-md shadow-emerald-550/5"
                  : "bg-sbg text-txs border-bdgen hover:text-emerald-650 dark:hover:text-emerald-400 shadow-premium"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Teachers Grid */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl bg-sbg border border-bdgen hover:border-emerald-500/20 shadow-premium hover:shadow-lg p-6 flex gap-5 items-start transition-all duration-300"
              >
                {/* Avatar with subtle glow */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 opacity-0 group-hover:opacity-45 blur transition-opacity" />
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="relative h-16 w-16 rounded-full object-cover border border-bdgen bg-pbg"
                  />
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1">
                  <h4 className="text-txp font-bold text-sm leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-sans">
                    {teacher.name}
                  </h4>
                  <div className="text-xs text-amber-600 dark:text-amber-500 font-semibold font-mono tracking-wide">
                    {teacher.role}
                  </div>
                  
                  <div className="flex gap-2 items-start text-xs text-txs border-t border-bdgen pt-2.5">
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-light leading-normal line-clamp-2">{teacher.education}</span>
                  </div>

                  <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-705 dark:text-emerald-300 bg-pbg border border-bdgen rounded font-mono">
                    Spesialisasi: {teacher.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0a0f0c] rounded-2xl border border-emerald-900/15">
            <span className="text-emerald-500/60 text-sm font-sans font-light">Tidak menemukan asatidz yang sesuai pencarian.</span>
          </div>
        )}

      </div>
    </section>
  );
}
