"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [role, setRole] = useState<"DOKTER" | "PERAWAT">();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
<<<<<<< HEAD
  const [errors, setErrors] = useState({
    role: "",
    username: "",
    password: ""
  });
  const [showErrorNotif, setShowErrorNotif] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const slides = ["/images/logo1.jpg", "/images/logo2.jpg", "/images/logo3.jpg"];
=======
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const slides = [
    "/images/logo1.jpg",
    "/images/logo2.jpg",
    "/images/logo3.jpg",
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard/dokter/utama');
    }
  }, [isAuthenticated, authLoading, router]);
>>>>>>> d62cde122874babc89d9f76e3c686a9cb702af4a

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

<<<<<<< HEAD
  const dummyUser = {
    role: "dokter",
    username: "yusria",
    password: "12345678",
  };

  // Validasi real-time
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      username: username && username.length < 3 ? "Username minimal 3 karakter" : ""
    }));
  }, [username]);

  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      password: password && password.length < 8 ? "Password minimal 8 karakter" : ""
    }));
  }, [password]);

  const showNotification = (message: string) => {
    setErrorMessage(message);
    setShowErrorNotif(true);
    setTimeout(() => {
      setShowErrorNotif(false);
    }, 3500);
  };

  const handleLogin = () => {
    let newErrors = {
      role: "",
      username: "",
      password: ""
    };

    if (!role) {
      newErrors.role = "Pilih role terlebih dahulu";
    }
    if (!username) {
      newErrors.username = "Username wajib diisi";
    } else if (username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }
    if (!password) {
      newErrors.password = "Password wajib diisi";
    } else if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    setErrors(newErrors);

    // Jika ada error validasi, tampilkan notifikasi
    if (newErrors.role || newErrors.username || newErrors.password) {
      const firstError = newErrors.role || newErrors.username || newErrors.password;
      showNotification(firstError);
      return;
    }

    // Cek kredensial login
    if (role === dummyUser.role && username === dummyUser.username && password === dummyUser.password) {
      router.push(role === "dokter" ? "/dashboard/dokter/main" : "/dashboard/perawat/main");
    } else {
      showNotification("Username atau password salah! Silakan coba lagi.");
=======
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!role) {
      setError("Pilih role terlebih dahulu");
      return;
    }
    if (!username || !password) {
      setError("Username & password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      await login(username, password, role);
    } catch (err: any) {
      setError(err.message || "Login gagal. Periksa kredensial Anda.");
    } finally {
      setLoading(false);
>>>>>>> d62cde122874babc89d9f76e3c686a9cb702af4a
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Notifikasi Error */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${
        showErrorNotif ? "translate-x-0 opacity-100 scale-100" : "translate-x-[120%] opacity-0 scale-95"
      }`}>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-start gap-4 min-w-[320px] max-w-md border-2 border-red-400">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1 pt-1">
            <p className="font-bold text-sm mb-1">Oops! Ada Kesalahan</p>
            <p className="font-medium text-sm opacity-95">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setShowErrorNotif(false)}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* LEFT SIDE - Hero Section */}
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
<<<<<<< HEAD
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
=======
              
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
>>>>>>> d62cde122874babc89d9f76e3c686a9cb702af4a
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

      {/* RIGHT SIDE - Login Form */}
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

<<<<<<< HEAD
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "dokter", label: "Dokter" },
                  { value: "perawat", label: "Perawat" },
                ].map((r) => (
                  <button
                    key={r.value}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all border-2 text-sm sm:text-base ${
                      role === r.value
                        ? "text-white bg-pink-500 border-pink-500 shadow-lg scale-105"
                        : "text-gray-700 bg-white border-gray-300 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                    onClick={() => {
                      setRole(r.value as any);
                      setErrors(prev => ({ ...prev, role: "" }));
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-2 font-medium">{errors.role}</p>
              )}
            </div>

            {/* Username & Password */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-sm text-gray-900 mb-2">Username</label>
                <input
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:ring-4 outline-none transition-all ${
                    errors.username 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                      : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                  }`}
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-sm text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full border-2 rounded-xl px-4 py-3 pr-12 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:ring-4 outline-none transition-all ${
                      errors.password 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                        : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                    }`}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                      password ? "text-pink-600 hover:text-pink-700" : "text-gray-900 hover:text-gray-700"
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                  </button>
=======
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Role Selection */}
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
>>>>>>> d62cde122874babc89d9f76e3c686a9cb702af4a
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Form Inputs */}
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
                      className="w-full border-2 rounded-xl px-4 py-3 pr-20 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 font-semibold text-xs sm:text-sm hover:bg-pink-100 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
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

            {/* Footer */}
            <div className="mt-6 space-y-3 text-center">
              <p
                className="text-pink-600 font-bold underline cursor-pointer text-sm sm:text-base hover:text-pink-700"
                onClick={() => router.push("/forgot-password")}
              >
                Lupa Password?
              </p>

<<<<<<< HEAD
              {role === "perawat" && (
                <p className="text-gray-600 text-sm sm:text-base">
                  Belum punya akun?{" "}
                  <span
                    className="text-pink-600 font-bold underline cursor-pointer hover:text-pink-700"
                    onClick={() => router.push("/register/role")}
                  >
                    Daftar Sekarang
                  </span>
                </p>
              )}
=======
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
>>>>>>> d62cde122874babc89d9f76e3c686a9cb702af4a

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