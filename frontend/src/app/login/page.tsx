"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<"dokter" | "perawat">();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [errors, setErrors] = useState({
    role: "",
    username: "",
    password: "",
  });

  const [showErrorNotif, setShowErrorNotif] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const slides = ["/images/logo1.jpg", "/images/logo2.jpg", "/images/logo3.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Validasi realtime username
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      username: username && username.length < 3 ? "Username minimal 3 karakter" : "",
    }));
  }, [username]);

  // Validasi realtime password
  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      password: password && password.length < 8 ? "Password minimal 8 karakter" : "",
    }));
  }, [password]);

  // Notifikasi error merah
  const showNotification = (message: string) => {
    setErrorMessage(message);
    setShowErrorNotif(true);
    setTimeout(() => setShowErrorNotif(false), 3500);
  };


  //  HANDLE LOGIN DENGAN API
  const handleLogin = async () => {
    let newErrors = {
      role: "",
      username: "",
      password: "",
    };

    if (!role) newErrors.role = "Pilih role terlebih dahulu";
    if (!username) newErrors.username = "Username wajib diisi";
    else if (username.length < 3) newErrors.username = "Username minimal 3 karakter";

    if (!password) newErrors.password = "Password wajib diisi";
    else if (password.length < 8) newErrors.password = "Password minimal 8 karakter";

    setErrors(newErrors);

    if (newErrors.role || newErrors.username || newErrors.password) {
      const firstError = newErrors.role || newErrors.username || newErrors.password;
      showNotification(firstError);
      return;
    }

    try {
      // CALL API LOGIN
      const response = await api.post("/login", {
        username,
        password,
        role,
      });

      const { token, user } = response.data;

      // SIMPAN TOKEN & USER
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect berdasarkan role
      router.push(
        user.role === "dokter"
          ? "/dashboard/dokter/main"
          : "/dashboard/perawat/main"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Login gagal! Periksa kembali username atau password.";

      showNotification(message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* NOTIFIKASI ERROR */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${
          showErrorNotif
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-[120%] opacity-0 scale-95"
        }`}
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-start gap-4 min-w-[320px] max-w-md border-2 border-red-400">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
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

      {/* BAGIAN KIRI GAMBAR */}
      <div
        className="hidden lg:flex relative flex-col justify-center items-center lg:w-3/5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 40%, #FFB4C8 100%)",
        }}
      >
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-[85%] max-w-3xl">
          <div className="text-left w-full mb-8">
            <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-2">
              Selamat Datang
            </h1>
            <h2 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-2">
              di <span className="text-pink-600 drop-shadow-sm">POLADC</span>
            </h2>
          </div>

          <div className="relative rounded-3xl shadow-2xl bg-white/40 backdrop-blur-sm p-4">
            <div
              className="relative overflow-hidden w-full rounded-2xl bg-gray-100"
              style={{ paddingBottom: "56.25%" }}
            >
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FORM LOGIN */}
      <div className="flex flex-col w-full lg:w-2/5 bg-white min-h-screen">
        <div className="flex flex-col justify-center items-center flex-1 px-6 sm:px-8 md:px-12 py-8 sm:py-10">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="rounded-full flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)",
                }}
              >
                <Image
                  src="/images/putih.png"
                  alt="Logo POLADC"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1">POLADC</h2>
              <p className="text-gray-500 font-medium text-sm sm:text-base text-center">
                Login ke Akun Kamu
              </p>
            </div>

            {/* Role */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pilih Role
              </label>

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
                      setErrors((prev) => ({ ...prev, role: "" }));
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

            {/* Username */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-sm text-gray-900 mb-2">
                  Username
                </label>
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
                  <p className="text-red-500 text-xs mt-2 font-medium">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-sm text-gray-900 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  className={`w-full border-2 rounded-xl px-4 py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:ring-4 outline-none transition-all ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-300 focus:border-pink-500 focus:ring-pink-100"
                  }`}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-2 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Tombol LOGIN */}
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3.5 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all active:scale-[0.98] mt-2"
              >
                Sign In
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 space-y-3 text-center">
              <p
                className="text-pink-600 font-bold underline cursor-pointer text-sm sm:text-base hover:text-pink-700"
                onClick={() => router.push("/forgot-password")}
              >
                Lupa Password?
              </p>

              {role === "perawat" && (
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

              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 text-gray-500 font-medium hover:text-pink-600 transition-colors text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali ke Beranda
              </button>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm text-center mt-8">
              © 2025 POLADC — All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
