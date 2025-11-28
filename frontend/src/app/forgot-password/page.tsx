"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "sent">("input");
  const [loading, setLoading] = useState(false);
  const [showResent, setShowResent] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      alert("Masukkan email yang valid!");
      return;
    }
    setStep("sent");
  };

  const handleResend = () => {
    setLoading(true);
    setShowResent(false);
    setTimeout(() => {
      setLoading(false);
      setShowResent(true);
    }, 1500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden font-poppins
      bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300">

      {/* Floating Blur Orbs */}
      <div className="absolute top-[-80px] left-[-100px] w-[260px] h-[260px] bg-pink-200/30 rounded-full blur-[60px] animate-float-slow"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-[60px] animate-float-slow delay-2000"></div>

      {/* STEP 1 – INPUT EMAIL */}
      {step === "input" && (
        <div className={`w-full max-w-[400px] transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* Logo */}
          <div className="mx-auto mb-6 w-[90px] h-[90px] flex items-center justify-center rounded-full shadow-lg
            animate-pulse drop-shadow-sm overflow-hidden">
            <Image
              src="/images/pink.png" // path ke folder public/images
              alt="RoxyDental Logo"
              width={90}
              height={90}
              className="object-cover rounded-full"
            />
          </div>

          <h2 className="text-2xl font-bold text-pink-600 drop-shadow-sm mb-2">Lupa Password?</h2>
          <p className="text-pink-500 text-sm opacity-80 mb-6">
            Masukkan email kamu untuk menerima tautan reset password
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-left bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <label className="text-pink-500 text-sm font-medium">Email</label>
            <div className="flex items-center bg-white/70 rounded-xl mt-1 mb-5 px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-pink-400 transition-all">
              <FaEnvelope className="text-pink-400 mr-2" />
              <input
                type="email"
                className="w-full py-2 px-1 outline-none bg-transparent placeholder-pink-300"
                placeholder="Masukkan email kamu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 text-white font-bold rounded-xl shadow-lg
                bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600
                hover:from-pink-500 hover:to-pink-400 hover:scale-105 transition-all duration-300 drop-shadow-sm"
            >
              Kirim Email
            </button>
          </form>

          <button
            onClick={() => router.push("/login")}
            className="mt-5 text-pink-600 font-semibold text-sm hover:underline drop-shadow-sm"
          >
            ← Kembali ke Login
          </button>
        </div>
      )}

      {/* STEP 2 – EMAIL SENT */}
      {step === "sent" && (
        <div className={`w-full max-w-[440px] transition-all duration-700 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="mx-auto mb-6 w-[110px] h-[110px] flex items-center justify-center rounded-full text-white text-4xl shadow-xl
            bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 animate-pulse drop-shadow-sm">
            <FaCheckCircle />
          </div>

          <h2 className="text-2xl font-bold text-pink-600 drop-shadow-sm">Email Terkirim!</h2>
          <p className="text-pink-500 opacity-80 text-sm mb-4">
            Kami telah mengirimkan tautan reset password ke <strong>{email}</strong>. Silakan cek inbox atau folder spam kamu.
          </p>

          {/* Resent Notification */}
          {showResent && (
            <div className="bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-medium inline-block mb-3 animate-fadeIn drop-shadow-sm">
              ✨ Email verifikasi telah dikirim ulang!
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full max-w-[300px] mx-auto mt-4">
            <button
              onClick={() => router.push("/login")}
              className="py-3 text-white font-bold rounded-xl shadow-lg
                bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600
                hover:from-pink-500 hover:to-pink-400 hover:scale-105 transition-all duration-300 drop-shadow-sm"
            >
              Kembali ke Login
            </button>

            <button
              onClick={handleResend}
              disabled={loading}
              className={`text-sm font-semibold ${loading ? "text-gray-400" : "text-pink-600 hover:underline"} drop-shadow-sm`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                  Mengirim ulang...
                </span>
              ) : (
                "Kirim Ulang Email"
              )}
            </button>
          </div>

          <p className="mt-5 text-pink-500 text-xs opacity-70 drop-shadow-sm">
            © 2025 RoxyDental • All rights reserved
          </p>
        </div>
      )}
    </div>
  );
}
