"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import Image from "next/image";
import { 
  FaUser, 
  FaClipboardList, 
  FaCalendarAlt, 
  FaChartLine, 
  FaLock, 
  FaClock 
} from "react-icons/fa";

export default function LandingPagePro() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

  const goToLogin = () => router.push("/login");

  useEffect(() => {
    setAnimate(true);
  }, []);

  // ✅ Deklarasi menu items agar tidak error
  const menuItems = ["Beranda", "Fitur", "Kontak"];

  const features = [
    { icon: <FaUser className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500 animate-bounce-slow" />, title: "Manajemen Pasien", desc: "Kelola data pasien dan riwayat kunjungan dengan mudah." },
    { icon: <FaClipboardList className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500 animate-bounce-slow delay-100" />, title: "Rekam Medis Elektronik", desc: "Catat dan akses rekam medis secara aman." },
    { icon: <FaCalendarAlt className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500 animate-bounce-slow delay-200" />, title: "Jadwal Tenaga Medis", desc: "Atur jadwal dokter dan perawat secara terintegrasi." },
    { icon: <FaChartLine className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500 animate-bounce-slow delay-300" />, title: "Laporan Keuangan", desc: "Pantau transaksi, komisi, dan laporan otomatis." },
    { icon: <FaLock className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500 animate-bounce-slow delay-400" />, title: "Keamanan Terjamin", desc: "Akses hanya untuk pegawai dengan hak aman." },
    { icon: <FaClock className="w-12 h-12 sm:w-14 sm:h-14 text-pink-500 animate-bounce-slow delay-500" />, title: "Monitoring Real-time", desc: "Pantau aktivitas klinik & antrian pasien live." },
  ];

  return (
    <div className="relative flex flex-col min-h-screen font-sans bg-linear-to-b from-pink-50 to-white overflow-x-hidden">

      {/* Floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full filter blur-2xl animate-float-slow delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-md z-50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* LOGO */}
            <div className="space-y-4">
      <Logo />
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex space-x-10 font-medium text-gray-700">
              {menuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-pink-600 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-pink-100">
              <div className="flex flex-col space-y-3">
                {menuItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-pink-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-pink-50"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="grow relative">
        <section id="home" className="pt-24 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

            {/* Left */}
            <div className={`w-full space-y-6 text-center md:text-left transition-all duration-1000 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-xs sm:text-sm font-semibold animate-pulse">
                Dental Clinic
              </div>
              <h1 className="font-bold text-gray-900 leading-tight text-[clamp(1.6rem,4vw,4.5rem)]">
                Aplikasi Klinik{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-pink-600 to-pink-500 animate-gradient-x">
                  POLABDC
                </span>{" "}
                Efisien & Profesional
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-full md:max-w-md mx-auto md:mx-0">
                Digitalisasi penuh untuk semua pegawai Klinik POLABDC. Mudah, aman dan terorganisir.
              </p>
            </div>

            {/* Right */}
            <div className={`relative w-full flex justify-center transition-all duration-1000 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative w-full max-w-[450px]">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 opacity-50 animate-gradient-bg blur-3xl"></div>
                <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-10 shadow-2xl flex flex-col items-center text-center border border-white/20 hover:shadow-3xl transition-shadow duration-500">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Selamat Datang</h2>
                  <p className="text-gray-700 text-base sm:text-lg mb-6">
                    Digitalisasi penuh untuk pegawai klinik POLABDC
                  </p>
                  <button 
                    onClick={goToLogin}
                    className="bg-linear-to-r from-pink-500 via-pink-600 to-pink-500 text-white px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg animate-pulse"
                  >
                    Masuk Sekarang
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500 mt-3">
                    Hanya untuk pegawai Klinik POLABDC
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24 px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Solusi digital untuk kelola klinik lebih efisien dan profesional.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="relative p-8 rounded-3xl shadow-lg backdrop-blur-xl bg-white/30 border border-white/20 hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center animate-fade-in"
              >
                <div className="mb-4 p-6 bg-pink-100/50 rounded-full shadow-inner flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm sm:text-base text-gray-700">{f.desc}</p>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-pink-400/70 blur-sm"></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
     <footer className="relative z-10 bg-white/30 backdrop-blur-xl border-t border-white/20 py-16 px-6 lg:px-8 mt-12">
  <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-gray-800">
    
    {/* Logo & Deskripsi */}
    <div className="space-y-4">
      <Logo />
      <p className="text-sm sm:text-base text-gray-600">
        POLABDC Clinic Hub, aplikasi manajemen klinik untuk pegawai. Modern, aman, dan efisien.
      </p>
    </div>

    {/* Fitur Cepat */}
    <div className="space-y-4">
      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Fitur Cepat</h4>
      <ul className="space-y-2 text-sm sm:text-base">
        {["Manajemen Pasien", "Rekam Medis", "Jadwal Tenaga Medis", "Laporan Keuangan", "Monitoring Real-time"].map((item, i) => (
          <li key={i} className="hover:text-pink-500 transition-colors cursor-pointer">{item}</li>
        ))}
      </ul>
    </div>

    {/* Kontak */}
    <div className="space-y-4">
      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Kontak</h4>
      <ul className="space-y-2 text-sm sm:text-base text-gray-600">
        <li>📍 Jl. Klinik No.12, Jakarta</li>
        <li>📞 (021) 1234-5678</li>
        <li>✉️ info@polabdclinic.com</li>
      </ul>
    </div>

    {/* Newsletter */}
    <div className="space-y-4">
      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Newsletter</h4>
      <p className="text-sm sm:text-base text-gray-600">Dapatkan info terbaru POLABDC Clinic Hub.</p>
      <div className="flex flex-col sm:flex-row gap-2">
      </div>
    </div>

  </div>

  {/* Copyright */}
  <div className="border-t border-white/20 mt-12 pt-6 text-center text-gray-600 text-sm sm:text-base">
    &copy; 2025 POLABDC Clinic Hub. All rights reserved.
  </div>
</footer>
 </div>
  );
}
