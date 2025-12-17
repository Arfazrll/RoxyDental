"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "sent">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Masukkan email yang valid");
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
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

    try {
      await api.post('/auth/forgot-password', { email });
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden font-poppins bg-linear-to-br from-pink-100 via-pink-200 to-pink-300">

      <div className="absolute -top-20 left-[-100px] w-[260px] h-[260px] bg-pink-200/30 rounded-full blur-[60px] animate-float-slow"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-[60px] animate-float-slow delay-2000"></div>

      {step === "input" && (
        <div className="w-full max-w-[400px] transition-all duration-700 opacity-100 translate-y-0">
          <div className="mx-auto mb-6 w-[90px] h-[90px] flex items-center justify-center rounded-full shadow-lg animate-pulse drop-shadow-sm overflow-hidden bg-linear-to-br from-pink-400 via-pink-500 to-pink-600">
            <span className="text-white text-4xl">🦷</span>
          </div>

          <h2 className="text-2xl font-bold text-pink-600 drop-shadow-sm mb-2">Lupa Password?</h2>
          <p className="text-pink-500 text-sm opacity-80 mb-6">
            Masukkan email kamu untuk menerima tautan reset password
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-left bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <label className="text-pink-500 text-sm font-medium">Email</label>
            <div className="flex items-center bg-white/70 rounded-xl mt-1 mb-5 px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400 transition-all">
              <FaEnvelope className="text-pink-400 mr-2" />
             <input
              type="email"
              className="
                w-full py-2 px-1
                outline-none bg-transparent
                text-gray-800
                placeholder-pink-300
              "
              placeholder="Masukkan email kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold rounded-xl shadow-lg bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:to-pink-400 hover:scale-105 transition-all duration-300 drop-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mengirim..." : "Kirim Email"}
            </button>
          </form>

          <button
            onClick={() => router.push("/login")}
            className="mt-5 text-pink-600 font-semibold text-sm hover:underline drop-shadow-sm"
          >
            Kembali ke Login
          </button>
        </div>
      )}

      {step === "sent" && (
        <div className="w-full max-w-[440px] transition-all duration-700 opacity-100 translate-y-0">
          <div className="mx-auto mb-6 w-[110px] h-[110px] flex items-center justify-center rounded-full text-white text-4xl shadow-xl bg-linear-to-br from-pink-400 via-pink-500 to-pink-600 animate-pulse drop-shadow-sm">
            <FaCheckCircle />
          </div>

          <h2 className="text-2xl font-bold text-pink-600 drop-shadow-sm">Email Terkirim</h2>
          <p className="text-pink-500 opacity-80 text-sm mb-4">
            Kami telah mengirimkan tautan reset password ke <strong>{email}</strong>. 
            Silakan cek inbox atau folder spam kamu.
          </p>

          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded-lg text-xs mb-4">
            Development Mode: Cek console terminal backend untuk link reset password
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto mt-4">
            <button
              onClick={() => router.push("/login")}
              className="py-3 text-white font-bold rounded-xl shadow-lg bg-linear-to-r from-pink-400 via-pink-500 to-pink-600 hover:from-pink-500 hover:to-pink-400 hover:scale-105 transition-all duration-300 drop-shadow-sm"
            >
              Kembali ke Login
            </button>

            <button
              onClick={handleResend}
              disabled={loading}
              className={`text-sm font-semibold ${loading ? "text-gray-400" : "text-pink-600 hover:underline"} drop-shadow-sm`}
            >
              {loading ? "Mengirim ulang..." : "Kirim Ulang Email"}
            </button>
          </div>

          <p className="mt-5 text-pink-500 text-xs opacity-70 drop-shadow-sm">
            2025 RoxyDental - All rights reserved
          </p>
        </div>
      )}
    </div>
  );
}