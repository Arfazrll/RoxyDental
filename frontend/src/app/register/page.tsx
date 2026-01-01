"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    specialization: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Toast untuk notifikasi kegagalan pendaftaran (UI kecil yang tidak "mengubah" layout utama)
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Khusus: deteksi bila email sudah terdaftar -> tampilkan banner non-blokir yang membantu
  const [emailExists, setEmailExists] = useState(false);
  const [emailExistsMessage, setEmailExistsMessage] = useState("");

  // ✅ Redirect hanya setelah sukses registrasi (bukan berdasarkan isAuthenticated)
  useEffect(() => {
    if (!showSuccessModal) return;
    const t = setTimeout(() => router.push("/login"), 2000);
    return () => clearTimeout(t);
  }, [showSuccessModal, router]);

  // auto-hide error toast setelah 4 detik
  useEffect(() => {
    if (!showErrorToast) return;
    const t = setTimeout(() => setShowErrorToast(false), 4000);
    return () => clearTimeout(t);
  }, [showErrorToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // jika user mengubah email, reset flag emailExists agar user bisa coba email lain
    if (name === "email") {
      setEmailExists(false);
      setEmailExistsMessage("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordContainsPersonal = (password: string) => {
    const lowered = password.toLowerCase();
    const checks: string[] = [];

    if (formData.username) checks.push(formData.username.toLowerCase());
    if (formData.fullName) {
      // cek tiap kata dari fullName
      formData.fullName.split(/\s+/).forEach((p) => p && checks.push(p.toLowerCase()));
    }
    if (formData.email) {
      const local = formData.email.split("@")[0];
      if (local) checks.push(local.toLowerCase());
    }
    if (formData.phone) {
      // beberapa digit telepon (compact) untuk dicek
      const digits = formData.phone.replace(/\D/g, "");
      if (digits.length >= 4) {
        // cek potongan 4-digit
        for (let i = 0; i <= digits.length - 4; i++) {
          checks.push(digits.slice(i, i + 4));
        }
      } else if (digits.length > 0) {
        checks.push(digits);
      }
    }

    return checks.some((part) => part && part.length >= 3 && lowered.includes(part));
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.fullName ||
      !formData.phone
    ) {
      setError("Harap lengkapi semua data yang wajib diisi");
      return false;
    }

    if (formData.username.length < 3) {
      setError("Username minimal 3 karakter");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }

    // Password rules:
    const pwd = formData.password;
    if (pwd.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      setError("Password harus mengandung minimal 1 huruf besar (A-Z)");
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      setError("Password harus mengandung minimal 1 huruf kecil (a-z)");
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      setError("Password harus mengandung minimal 1 angka (0-9)");
      return false;
    }

    // Cegah password yang mudah ditebak: mengandung bagian username/fullname/email/phone
    if (passwordContainsPersonal(pwd)) {
      setError("Password tidak boleh mengandung informasi pribadi (nama, username, email, atau nomor telepon).");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      return false;
    }

    if (formData.fullName.length < 3) {
      setError("Nama lengkap minimal 3 karakter");
      return false;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      setError("Nomor telepon minimal 10 digit");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowErrorToast(false);
    setEmailExists(false);
    setEmailExistsMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        specialization: formData.specialization || undefined,
      });

      setShowSuccessModal(true);
    } catch (err: any) {
      // tampilkan pesan error dari server bila ada; tampilkan juga toast notifikasi kecil
      const serverMessage =
        err?.response?.data?.message || err?.message || "Registrasi gagal. Silakan coba lagi.";

      // Deteksi kasus email sudah terdaftar
      const status = err?.response?.status;
      const emailExistsPatterns = [
        /email.*already/i,
        /email.*sudah/i,
        /already exists/i,
        /duplicate/i,
        /unique/i,
        /email.*exists/i,
      ];
      const isEmailExists = status === 409 || emailExistsPatterns.some((p) => p.test(serverMessage));

      if (isEmailExists) {
        // Tampilkan banner non-blokir dengan opsi masuk atau ganti email
        setEmailExists(true);
        setEmailExistsMessage("Email tersebut sudah terdaftar. Jika itu akun Anda, silakan masuk. Atau gunakan email lain untuk registrasi.");
        // jangan set error besar; tampilkan toast kecil juga supaya user melihat ada masalah
        setShowErrorToast(true);
        setError("");
      } else {
        setError(serverMessage);
        setShowErrorToast(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT / BACKGROUND */}
      <div className="hidden lg:flex relative flex-col justify-center items-center lg:w-2/5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/perawat.jpg"
            alt="POLABDC Background"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,221,230,0.85) 0%, rgba(255,202,212,0.85) 40%, rgba(255,180,200,0.85) 100%)",
          }}
        />

        <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bergabung dengan <span className="text-pink-600">POLABDC</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Daftar sebagai Perawat dan mulai kelola pasien dengan sistem yang efisien
          </p>
        </div>
      </div>

      {/* RIGHT / FORM */}
      <div className="flex flex-col w-full lg:w-3/5 bg-white min-h-screen overflow-y-auto">
        {/* Error toast (tidak mengubah layout form, muncul di atas kanan) */}
        {showErrorToast && (error || emailExistsMessage) && (
          <div className="fixed top-6 right-6 z-50">
            <div className="max-w-xs w-full bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 shadow-lg animate-in slide-in-from-right">
              <div className="text-sm font-semibold mb-1">Gagal Membuat Akun</div>
              <div className="text-xs leading-snug">{error || emailExistsMessage}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center items-center flex-1 px-6 sm:px-8 md:px-12 py-8 sm:py-10">
          <div className="w-full max-w-2xl">
            <div
              className="lg:hidden mb-8 -mx-6 sm:-mx-8 md:-mx-12 -mt-8 sm:-mt-10 px-6 sm:px-8 md:px-12 py-8 rounded-b-3xl"
              style={{ background: "linear-gradient(135deg, #FFDDE6 0%, #FFB4C8 100%)" }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
                Daftar Akun
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-600 text-center">Perawat POLABDC</h2>
            </div>

           <div className="flex flex-col items-center mb-8 animate-in fade-in zoom-in duration-300">

              {/* LOGO */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center
                          bg-linear-to-br from-pink-400 to-pink-600
                          shadow-[0_12px_30px_rgba(255,94,138,0.4)]
                          mb-4 transition-transform hover:scale-105 overflow-hidden"
              >
                <Image
                  src="/images/putih.png"
                  alt="Logo POLABDC"
                  width={56}
                  height={56}
                  className="object-contain"
                  priority
                />
              </div>

              {/* TITLE */}
              <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-1 text-center tracking-wide">
                Registrasi Perawat
              </h2>

              {/* SUBTITLE */}
              <p className="text-gray-500 font-medium text-sm sm:text-base text-center">
                Lengkapi data diri Anda
              </p>

            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* khusus: banner email sudah terdaftar (non-blokir) */}
            {emailExists && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-sm flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-semibold">Perhatian — Email sudah terdaftar</div>
                  <div className="text-xs mt-1">{emailExistsMessage}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-xs px-3 py-1 rounded-lg bg-yellow-100 hover:bg-yellow-200 font-semibold"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => setFormData((p) => ({ ...p, email: "" }))}
                    className="text-xs px-3 py-1 rounded-lg bg-white border border-yellow-200 hover:bg-yellow-50 font-medium"
                  >
                    Gunakan email lain
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
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
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* helper text (tidak mengubah struktur UI utama) */}
                  <p className="text-xs text-gray-400 mt-2">
                    Password minimal 6 karakter, mengandung huruf besar, huruf kecil, dan angka. Jangan gunakan informasi pribadi.
                  </p>
                </div>

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
                      onClick={() => setShowConfirmPassword((v) => !v)}
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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>

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

            <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
              <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl font-bold text-gray-900 text-center">
                    Registrasi Berhasil
                  </DialogTitle>
                </DialogHeader>

                <div className="text-center space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Akun Anda telah berhasil dibuat. Silakan masuk menggunakan email dan password yang telah didaftarkan.
                  </p>

                  <button
                    onClick={() => router.push("/login")}
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Ke Halaman Login
                  </button>

                  <p className="text-xs text-gray-400">Anda akan diarahkan otomatis dalam beberapa detik</p>
                </div>
              </DialogContent>
            </Dialog>

            <p className="text-gray-400 text-xs text-center mt-8">© 2025 POLABDC — All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
