"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    specialization: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard/perawat/main');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      setError("Username minimal 3 karakter");
      return false;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }
    if (!formData.fullName || formData.fullName.length < 3) {
      setError("Nama lengkap minimal 3 karakter");
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError("Nomor telepon minimal 10 digit");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        specialization: formData.specialization || undefined
      });
    } catch (err: any) {
      setError(err.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
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
      {/* LEFT SIDE - Hero Section */}
      <div
        className="hidden lg:flex relative flex-col justify-center items-center lg:w-2/5 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 40%, #FFB4C8 100%)",
        }}
      >
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bergabung dengan <span className="text-pink-600">POLADC</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Daftar sebagai Perawat dan mulai kelola pasien dengan sistem yang efisien
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl">
              <p className="text-3xl font-bold text-pink-600">100+</p>
              <p className="text-sm text-gray-700">Pasien Terdaftar</p>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl">
              <p className="text-3xl font-bold text-pink-600">24/7</p>
              <p className="text-sm text-gray-700">Akses Sistem</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Register Form */}
      <div className="flex flex-col w-full lg:w-3/5 bg-white min-h-screen overflow-y-auto">
        <div className="flex flex-col justify-center items-center flex-1 px-6 sm:px-8 md:px-12 py-8 sm:py-10">
          <div className="w-full max-w-2xl">
            {/* Mobile Header */}
            <div className="lg:hidden mb-8 -mx-6 sm:-mx-8 md:-mx-12 -mt-8 sm:-mt-10 px-6 sm:px-8 md:px-12 py-8 rounded-b-3xl"
              style={{
                background: "linear-gradient(135deg, #FFDDE6 0%, #FFB4C8 100%)",
              }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
                Daftar Akun
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 text-center">
                Perawat POLADC
              </h2>
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="rounded-full flex items-center justify-center shadow-lg mb-4"
                style={{
                  width: '80px',
                  height: '80px',
                  background: "linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)",
                  color: "white",
                  fontSize: '36px',
                  fontWeight: "bold",
                }}
              >
                P
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1">
                Registrasi Perawat
              </h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base">
                Lengkapi data diri Anda
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Username */}
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Username unik"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Nama lengkap sesuai KTP"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    No. Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Specialization (Optional) */}
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Spesialisasi (Opsional)
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                    placeholder="Contoh: Perawat Gigi"
                    value={formData.specialization}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full border-2 rounded-xl px-4 py-3 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="Min. 6 karakter"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 font-semibold text-xs hover:bg-pink-100 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-semibold text-sm text-gray-900 mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className="w-full border-2 rounded-xl px-4 py-3 pr-20 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      placeholder="Ulangi password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-600 font-semibold text-xs hover:bg-pink-100 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-linear-to-r from-pink-500 to-pink-600 text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  "Daftar Sekarang"
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 space-y-3 text-center">
              <p className="text-gray-600 text-sm">
                Sudah punya akun?{" "}
                <span
                  className="text-pink-600 font-bold underline cursor-pointer hover:text-pink-700"
                  onClick={() => router.push("/login")}
                >
                  Login Sekarang
                </span>
              </p>

              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 text-gray-500 font-medium hover:text-pink-600 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>

            {/* Footer */}
            <p className="text-gray-400 text-xs text-center mt-8">
              © 2025 POLADC — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}