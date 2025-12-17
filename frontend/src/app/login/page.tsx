"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<"DOKTER" | "PERAWAT">();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slides = [
    "/images/logo1.jpg",
    "/images/logo2.jpg",
    "/images/logo3.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
    setError("Pilih role terlebih dahulu");
    return;
    }

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
     const response = await authService.login({ username, password, role });
      
      if (response.success) {
        if (role === 'DOKTER') {
          router.push('/dashboard/dokter/main');
        } else {
          router.push('/dashboard/perawat/mainpr');
        }
      }

    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 400) {
          setError("Username atau password salah");
        } else {
          setError(err.response.data?.message || "Terjadi kesalahan pada server");
        }
      } else {
        setError("Server tidak dapat dihubungi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="hidden lg:flex relative flex-col justify-center items-center lg:w-3/5 overflow-hidden"
           style={{ background: "linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 40%, #FFB4C8 100%)" }}>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-[85%] max-w-3xl">
          <div className="text-left w-full mb-8">
            <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-2">Selamat Datang</h1>
            <h2 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-2">
              di <span className="text-pink-600 drop-shadow-sm">POLADC</span>
            </h2>
          </div>

          <div className="relative rounded-3xl shadow-2xl bg-white/40 backdrop-blur-sm p-4">
            <div className="relative overflow-hidden w-full rounded-2xl bg-gray-100" style={{ paddingBottom: "56.25%" }}>
              {slides.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Clinic slide ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    currentSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                />
              ))}
              
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="flex justify-center mt-5 gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="transition-all duration-300 rounded-full hover:scale-110"
                  style={{
                    width: currentSlide === index ? "28px" : "10px",
                    height: "10px",
                    backgroundColor: currentSlide === index ? "#FF5E8A" : "#FFB4C8",
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full lg:w-2/5 bg-white min-h-screen">
        <div className="flex flex-col justify-center items-center flex-1 px-6 sm:px-8 md:px-12 py-8 sm:py-10">
          <div className="w-full max-w-md">
            
            <div className="flex flex-col items-center mb-8">
              <div className="rounded-full flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform"
                   style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)" }}>
                <Image src="/images/putih.png" alt="Logo POLADC" width={60} height={60} className="object-contain" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1 text-center">POLADC</h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base text-center">Login ke Akun Kamu</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Pilih Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "DOKTER", label: "Dokter" },
                    { value: "PERAWAT", label: "Perawat" }
                  ].map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 text-sm sm:text-base ${
                        role === r.value
                          ? "text-white bg-pink-500 border-pink-500 shadow-lg scale-105"
                          : "text-gray-700 bg-white border-gray-300 hover:border-pink-300 hover:bg-pink-50"
                      }`}
                      onClick={() => setRole(r.value as any)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border-2 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-pink-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-pink-500 to-pink-600 text-white py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <p
                className="text-pink-600 font-bold underline cursor-pointer text-sm sm:text-base hover:text-pink-700"
                onClick={() => router.push("/forgot-password")}
              >
                Lupa Password?
              </p>

              <div className="h-6">
                {role === "PERAWAT" && (
                  <p className="text-gray-600 text-sm sm:text-base">
                    Belum punya akun?{" "}
                    <span
                      className="text-pink-600 font-bold underline cursor-pointer hover:text-pink-700"
                      onClick={() => router.push("/register")}
                    >
                      Daftar Sekarang
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 text-gray-500 font-medium hover:text-pink-600 transition-colors text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm text-center mt-8">© 2025 POLADC — All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}