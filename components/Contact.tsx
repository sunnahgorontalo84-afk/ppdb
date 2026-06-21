import React, { useState } from "react";
import { FaqsData, BoardingSchoolProfile } from "../data";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Youtube, 
  Instagram, 
  Facebook,
  Sparkles,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact() {
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState("Semua");
  const [faqSearch, setFaqSearch] = useState("");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Pertanyaan Umum",
    message: ""
  });
  const [isSent, setIsSent] = useState(false);

  const categories = ["Semua", "Pendaftaran", "Tahfidz", "Keuangan", "Fasilitas & Layanan"];

  // Filter FAQs
  const filteredFaqs = FaqsData.filter(faq => {
    const matchesCategory = faqCategory === "Semua" || faq.category === faqCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSent(true);
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "Pertanyaan Umum",
        message: ""
      });
    }, 400);
  };

  const toggleFaq = (idx: number) => {
    setActiveFaqIdx(activeFaqIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-pbg text-txp border-t border-bacc relative transition-colors duration-200" id="kontak-section">
      <div className="absolute inset-0 bg-radial from-emerald-950/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Contact and Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Informasi Kontak</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-txp font-sans">
                Hubungi <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Sekretariat</span> Pesantren
              </h2>
              <p className="text-txs text-sm font-light leading-relaxed">
                Ada pertanyaan mengenai rincian keuangan, kurikulum turots, atau tata tertib asrama? Panitia SPMB siap membantu mengklarifikasi keraguan Anda.
              </p>
            </div>

            {/* Info details array */}
            <div className="space-y-4">
              
              {/* Address */}
              <div className="flex gap-4 p-4 rounded-xl bg-sbg border border-bdgen hover:border-emerald-500/15 shadow-premium text-sm font-light transition-all duration-300 hover:translate-y-[-1px]">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-pbg text-emerald-600 dark:text-emerald-400 border border-bdgen flex items-center justify-center transition-colors duration-200">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-txp block font-sans">Lokasi & Alamat Utama</span>
                  <span className="text-txs text-xs mt-1 block leading-relaxed">{BoardingSchoolProfile.address}</span>
                  <a 
                    href={BoardingSchoolProfile.mapUrl}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold mt-2 inline-block font-sans transition-colors"
                  >
                    Buka Google Maps &rarr;
                  </a>
                </div>
              </div>

              {/* Telphone WhatsApp */}
              <div className="flex gap-4 p-4 rounded-xl bg-sbg border border-bdgen hover:border-emerald-500/15 shadow-premium text-sm font-light transition-all duration-300 hover:translate-y-[-1px]">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-pbg text-emerald-600 dark:text-emerald-400 border border-bdgen flex items-center justify-center transition-colors duration-200">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-txp block font-sans">Telepon / WhatsApp Resmi</span>
                  <span className="text-txs text-xs mt-1 block font-mono font-medium">{BoardingSchoolProfile.phone}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-500/60 block mt-0.5 uppercase tracking-wide font-mono font-bold font-medium">Pelayanan Senin - Sabtu (08:00 - 15:30 WITA)</span>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex gap-4 p-4 rounded-xl bg-sbg border border-bdgen hover:border-emerald-500/15 shadow-premium text-sm font-light transition-all duration-300 hover:translate-y-[-1px]">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-pbg text-emerald-600 dark:text-emerald-400 border border-bdgen flex items-center justify-center transition-colors duration-200">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-txp block font-sans">Surat Elektronik (Email)</span>
                  <span className="text-txs text-xs mt-1 block font-mono font-medium">{BoardingSchoolProfile.email}</span>
                </div>
              </div>

            </div>

            {/* Social Media Feeds Links */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500/60 uppercase tracking-widest block font-mono">Kanal Informasi Media Sosial</span>
              <div className="flex gap-3">
                <a href="#" className="h-10 w-10 rounded-xl bg-sbg border border-bdgen text-emerald-600 dark:text-emerald-400 hover:text-txp flex items-center justify-center transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-xl bg-sbg border border-bdgen text-emerald-600 dark:text-emerald-400 hover:text-txp flex items-center justify-center transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-xl bg-sbg border border-bdgen text-emerald-600 dark:text-emerald-400 hover:text-txp flex items-center justify-center transition-colors duration-200">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Contact Interactive Form */}
          <div className="lg:col-span-7 bg-sbg border border-bdgen rounded-2xl p-8 sm:p-10 shadow-sm transition-colors duration-200">
            {!isSent ? (
              <form onSubmit={handleSendMessage} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-txp font-sans">Kirim Pesan Sekretariat</h3>
                  <p className="text-emerald-600 dark:text-emerald-500/60 text-xs mt-1">Kami berupaya merespons pesan tertulis Anda maksimal dalam 24 jam.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 font-mono uppercase tracking-wide">Nama Lengkap Anda</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Yusuf"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-sm text-txp placeholder-txs focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 font-mono uppercase tracking-wide">Alamat Email Aktif</label>
                    <input
                      type="email"
                      required
                      placeholder="Contoh: yusuf@gmail.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-sm text-txp placeholder-txs focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 font-mono uppercase tracking-wide">No. Telepon / HP</label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 0812XXXXXXXX"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-sm text-txp placeholder-txs focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 font-mono uppercase tracking-wide">Subjek Keperluan Pertanyaan</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-sm text-txp focus:outline-none focus:border-emerald-500/40 transition-colors"
                  >
                    <option value="Pertanyaan Umum">Tanya Seputar Umum</option>
                    <option value="PPDB & Keuangan">PPDB Baru & Rincian SPP</option>
                    <option value="Kerjasama Pesantren">Kemitraan Or Wakaf Masjid</option>
                    <option value="Saran Pengaduan">Masukan / Saran Layanan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 font-mono uppercase tracking-wide">Isi Pesan Pertanyaan Anda</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan pertanyaan Anda sedetail mungkin di sini..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pbg border border-bdgen text-sm text-txp placeholder-txs focus:outline-none focus:border-emerald-500/40 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-pbg font-bold text-xs py-3.5 rounded-xl tracking-widest uppercase transition-all duration-200 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Kirim Pesan Tertulis
                </button>
              </form>
            ) : (
              <div className="text-center p-8 space-y-4 animate-fade-in">
                <div className="h-12 w-12 bg-emerald-950/20 dark:bg-emerald-950 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Send className="h-5 w-5" />
                </div>
                <h4 className="text-lg font-bold text-txp font-sans">Alhamdulillah, Pesan Terkirim!</h4>
                <p className="text-txs text-xs font-light max-w-sm mx-auto leading-relaxed">
                  Terima kasih, pesan Anda berhasil terkirim ke Sekretariat As-Sunnah. Panitia akan merespons melalui alamat email atau ponsel Anda secepatnya.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-5 py-2 hover:bg-tbg bg-pbg border border-bdgen rounded-xl text-emerald-600 dark:text-emerald-300 duration-200 text-xs cursor-pointer inline-block"
                >
                  Kirim pesan baru lainnya
                </button>
              </div>
            )}
          </div>

        </div>

        {/* FAQs Section */}
        <div className="border-t border-bacc pt-16" id="faqs-section">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="text-left max-w-lg">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase bg-emerald-950/10 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/10">Pertanyaan Lazim</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-txp font-sans">
                Tanya & <span className="font-serif italic font-light text-emerald-600 dark:text-emerald-400">Jawab</span> (FAQ)
              </h2>
              <p className="text-txs text-sm font-light mt-3">
                Kumpulan pertanyaan krusial yang paling sering diajukan wali santri mengenai dinamika tata pamong, disiplin asrama, dan registrasi PPDB.
              </p>
            </div>

            {/* FAQ Filters & Search */}
            <div className="relative w-full md:w-72 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Cari kata kunci tanya jawab..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-sbg border border-bdgen text-xs text-txp placeholder-txs/55 focus:outline-none focus:border-emerald-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border border-bdgen transition-all cursor-pointer whitespace-nowrap ${
                  faqCategory === cat
                    ? "bg-emerald-600 text-white border-transparent font-bold"
                    : "bg-sbg text-txs hover:text-emerald-600 dark:hover:text-emerald-400 shadow-premium"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Layout */}
          {filteredFaqs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = activeFaqIdx === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-bdgen hover:border-emerald-500/20 rounded-xl bg-sbg shadow-premium overflow-hidden transition-all duration-205"
                  >
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-5 flex justify-between items-center gap-4 cursor-pointer hover:bg-tbg/30 font-semibold text-sm text-txp"
                    >
                      <span className="leading-snug font-sans">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4.5 w-4.5 text-emerald-700 dark:text-emerald-500 shrink-0" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 border-t border-bdgen text-xs font-light text-txs leading-relaxed bg-pbg">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-emerald-600/40 text-xs font-sans font-light">
              Tidak ditemukan tanya jawab yang sesuai penelusuran.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
