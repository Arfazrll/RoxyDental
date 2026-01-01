"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import api from "@/lib/api";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "sent">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Masukkan alamat email yang valid");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("sent");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setResendSuccess(false);

    try {
      await api.post("/auth/forgot-password", { email });
      setResendSuccess(true);

      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim ulang email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 px-4 font-poppins">
      <div className="relative w-full max-w-[420px]">
        {/* Background blur */}
        <div className="absolute -left-24 -top-20 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute -right-24 bottom-[-40px] w-72 h-72 bg-pink-300/30 rounded-full blur-3xl" />

        {/* ================= INPUT STEP ================= */}
        {step === "input" && (
          <div className="relative bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8 border border-white/30">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow">
                <Image
                  src="/images/putih.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  priority
                />
              </div>

              <h1 className="mt-4 text-[22px] font-semibold tracking-tight text-pink-700">
                Lupa Password
              </h1>
              <p className="mt-1 text-[13px] text-slate-600 text-center leading-relaxed">
                Masukkan email terdaftar untuk menerima tautan reset password
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-pink-200">
                  <FaEnvelope className="text-pink-400 text-sm" />
                  <input
                    type="email"
                    className="w-full bg-transparent outline-none text-[14px] text-slate-800 placeholder:text-slate-400"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-[14px] font-semibold text-white shadow hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                {loading ? "Mengirim..." : "Kirim Email Reset"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() => router.push("/login")}
                className="text-[13px] font-medium text-pink-600 hover:underline"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        )}

        {/* ================= SENT STEP ================= */}
        {step === "sent" && (
          <div className="relative bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8 border border-white/30 text-center">
            {/* Header minimal – TANPA ICON */}
            <div className="mb-6">
              <div className="h-[3px] w-16 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-pink-600 mb-4" />
              <h2 className="text-[22px] font-semibold text-pink-700 tracking-tight">
                Email Terkirim
              </h2>
              <p className="mt-1 text-[12.5px] text-slate-500">
                Silakan periksa email Anda
              </p>
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
              Kami telah mengirimkan tautan reset password ke alamat email:
              <span className="block mt-1 font-medium text-slate-800">
                {email}
              </span>
            </p>

            {resendSuccess && (
              <div className="mb-4 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-left">
                <p className="text-[13px] font-medium text-pink-700">
                  Email berhasil dikirim ulang
                </p>
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Silakan periksa inbox atau folder spam.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/login")}
                className="py-3 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-[14px] font-semibold text-white shadow hover:scale-[1.02] transition-transform"
              >
                Kembali ke Login
              </button>

              <button
                onClick={handleResend}
                disabled={loading}
                className="text-[13px] font-medium text-pink-600 hover:underline disabled:text-slate-400"
              >
                {loading ? "Mengirim ulang..." : "Kirim ulang email"}
              </button>
            </div>

            <p className="mt-6 text-[11px] text-slate-500">
             © 2025 POLABDC — All rights reserved
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
