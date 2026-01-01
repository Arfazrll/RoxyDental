"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "@/lib/api";

type NoticeType = "error" | "warning" | "info";

function Notice({ type, message }: { type: NoticeType; message: string }) {
  const base = "mb-4 p-4 rounded-lg text-sm leading-relaxed flex items-start gap-3 border";
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  }[type];

  const Icon =
    type === "error" ? FaLock : type === "warning" ? FaLock : FaCheckCircle;

  return (
    <div role={type === "error" ? "alert" : "status"} aria-live="polite" className={`${base} ${styles}`}>
      <div className="mt-0.5 text-lg" aria-hidden>
        <Icon />
      </div>
      <p className="text-sm font-normal tracking-normal">{message}</p>
    </div>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // legacy error message (kept for compatibility)
  const [success, setSuccess] = useState(false);

  const [notice, setNotice] = useState<{ type: NoticeType; message: string } | null>(null);

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      setError("Link reset password tidak valid");
    }
  }, [email, token]);

  // auto-dismiss notice after 5s
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  // realtime validation: show info if password & confirm mismatch as user types
  useEffect(() => {
    if (!confirmPassword && !password) {
      setNotice(null);
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setNotice({ type: "info", message: "Password dan konfirmasi belum sama." });
    } else {
      // do not remove an error/warning explicitly set by submit flow; only clear info
      if (notice?.type === "info") setNotice(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice(null);

    // basic client-side checks
    if (!password || !confirmPassword) {
      setNotice({ type: "warning", message: "Semua field wajib diisi." });
      return;
    }

    if (password.length < 6) {
      setNotice({ type: "warning", message: "Password minimal terdiri dari 6 karakter." });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({ type: "error", message: "Password baru dan konfirmasi password tidak sama." });
      return;
    }

    setLoading(true);

    try {
      // call existing backend endpoint (no BE changes)
      await api.post("/auth/reset-password", {
        email,
        token,
        newPassword: password,
      });

      // success UI
      setSuccess(true);
      setNotice({ type: "info", message: "Password berhasil direset — mengalihkan ke halaman login..." });

      // Redirect after short delay
      setTimeout(() => {
        router.push("/login");
      }, 2800);
    } catch (err: any) {
      // prefer BE message, fallback generic
      const msg = err?.response?.data?.message || "Gagal reset password";
      // if backend specifically rejects because "new password must be different" or similar,
      // that message will be shown here without changing BE.
      setNotice({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 px-4">
        <div className="bg-white/60 border border-red-200 text-red-700 p-6 rounded-2xl max-w-md w-full backdrop-blur-sm">
          <h3 className="font-semibold text-lg mb-2">Link Tidak Valid</h3>
          <p className="text-sm mb-4 text-slate-700">Link reset password tidak valid atau sudah kadaluarsa.</p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Kirim Ulang Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 px-4">
        <div className="text-center max-w-md w-full bg-white/60 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
          <div className="mx-auto mb-6 w-[108px] h-[108px] flex items-center justify-center rounded-full text-white text-4xl shadow-xl bg-gradient-to-br from-green-400 via-green-500 to-green-600">
            <FaCheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Password Berhasil Direset</h2>
          <p className="text-sm text-slate-700 mb-4">Anda akan diarahkan ke halaman login...</p>
          <button
            onClick={() => router.push("/login")}
            className="py-3 px-6 text-white font-semibold rounded-lg shadow bg-gradient-to-br from-green-400 to-green-600 hover:scale-105 transition-transform"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 px-4 font-poppins">
      <div className="relative max-w-[440px] w-full">
        <div className="absolute -left-24 -top-16 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-fade-in-slow" />
        <div className="absolute -right-16 bottom-[-40px] w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-fade-in-slow" />

        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-6 md:p-8 border border-white/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow">
              <FaLock className="text-xl" />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight text-pink-700">Reset Password</h1>
              <p className="text-[13px] leading-relaxed text-slate-600">Masukkan password baru untuk akun <span className="font-medium text-slate-800">{email}</span></p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
          )}

          {notice && <Notice type={notice.type} message={notice.message} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-[13px] font-medium text-slate-700 mb-2">
                Password Baru
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  className="w-full py-3 px-4 pr-12 rounded-lg outline-none bg-white border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
                  placeholder="Min. 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-label="Password baru"
                  aria-required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-700"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
              </div>

              <div className="mt-2 text-[12px] leading-relaxed text-slate-600">
                {password.length > 0 ? (
                  password.length >= 6 ? (
                    <span className="inline-flex items-center gap-2 text-green-600">
                      <FaCheckCircle /> <span>Kekuatan: cukup</span>
                    </span>
                  ) : (
                    <span className="text-yellow-700">Password kurang dari 6 karakter</span>
                  )
                ) : (
                  <span>Gunakan kombinasi huruf dan angka untuk keamanan lebih baik.</span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-[13px] font-medium text-slate-700 mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full py-3 px-4 pr-12 rounded-lg outline-none bg-white border border-slate-200 text-[14px] text-slate-800 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  aria-label="Konfirmasi password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-700"
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
                >
                  {showConfirmPassword ? <HiEyeOff size={22} /> : <HiEye size={22} />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-[14px] font-semibold text-white rounded-lg shadow bg-gradient-to-br from-pink-500 to-pink-600 hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.3" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                ) : null}
                <span>{loading ? "Memproses..." : "Reset Password"}</span>
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => router.push("/login")} className="text-pink-600 text-sm font-medium hover:underline">
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
