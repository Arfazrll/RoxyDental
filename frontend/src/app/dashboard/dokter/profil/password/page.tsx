"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, Loader2, CheckCircle2, X, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DoctorNavbar from "@/components/ui/navbardr";
import SettingsSidebar from "@/components/ui/SettingsSidebar";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function SettingsChangePassword() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("ganti-password");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [toast, setToast] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: "" }), 3500);
  };

  const validateField = (type: string, value: string) => {
    if (type === "old") return value ? "" : "Password saat ini harus diisi";
    if (type === "new") {
      if (!value) return "Password baru harus diisi";
      if (value.length < 6) return "Minimal 6 karakter";
      if (!/(?=.*[a-z])/.test(value)) return "Harus ada huruf kecil";
      if (!/(?=.*[A-Z])/.test(value)) return "Harus ada huruf besar";
      if (!/(?=.*\d)/.test(value)) return "Harus ada angka";
      if (!/(?=.*[\W_])/.test(value)) return "Harus ada simbol";
      if (value === passwordData.oldPassword) return "Password baru tidak boleh sama dengan password lama";
      return "";
    }
    if (type === "confirm") {
      if (!value) return "Konfirmasi password harus diisi";
      if (value !== passwordData.newPassword) return "Password tidak cocok";
      return "";
    }
    return "";
  };

  const handleConfirmChange = async () => {
    const oldError = validateField("old", passwordData.oldPassword);
    const newError = validateField("new", passwordData.newPassword);
    const confirmError = validateField("confirm", passwordData.confirmPassword);

    setPasswordErrors({
      oldPassword: oldError,
      newPassword: newError,
      confirmPassword: confirmError,
    });

    if (oldError || newError || confirmError) {
      setTouched({
        oldPassword: true,
        newPassword: true,
        confirmPassword: true,
      });
      setConfirmDialogOpen(false);
      showToast("error", "Periksa kembali syarat password sebelum mengubah.");
      return;
    }

    setLoading(true);
    setConfirmDialogOpen(false);

    try {
      const response = await authService.changePassword({
        currentPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        showToast("success", "Password berhasil diperbarui.");
        setSuccessDialogOpen(true);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTouched({ oldPassword: false, newPassword: false, confirmPassword: false });
        setPasswordErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setErrorMessage(response.message || "Gagal mengganti password");
        setErrorDialogOpen(true);
        showToast("error", response.message || "Gagal mengganti password");
      }
    } catch (error: any) {
      let errObj: any = error;

      if (typeof error === 'string') {
        try {
          errObj = JSON.parse(error);
        } catch (e) {
          errObj = { message: error };
        }
      } else if (error?.response?.data) {
        errObj = error.response.data;
      } else if (error?.message) {
        if (typeof error.message === 'string') {
          try {
            errObj = JSON.parse(error.message);
          } catch (e) {
            errObj = { message: error.message };
          }
        }
      }

      if (errObj?.message === "Password saat ini salah") {
        setErrorMessage("Password saat ini yang Anda masukkan salah");
        setPasswordErrors({
          ...passwordErrors,
          oldPassword: "Password saat ini salah",
        });
        setTouched({ ...touched, oldPassword: true });
        showToast("error", "Password saat ini salah.");
      } else if (errObj?.errors && Array.isArray(errObj.errors)) {
        const firstError = errObj.errors[0];
        setErrorMessage(firstError.message || "Validasi gagal");
        showToast("error", firstError.message || "Validasi gagal");
      } else {
        const msg = errObj?.message || (typeof errObj === 'string' ? errObj : "Terjadi kesalahan saat mengganti password");
        setErrorMessage(msg);
        showToast("error", msg);
      }

      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    router.push("/dashboard/dokter/main");
  };

  const newPw = passwordData.newPassword || "";
  const criteria = {
    minLength: newPw.length >= 6,
    hasLower: /[a-z]/.test(newPw),
    hasUpper: /[A-Z]/.test(newPw),
    hasNumber: /\d/.test(newPw),
    hasSymbol: /[\W_]/.test(newPw),
    notSameAsOld: newPw !== "" && newPw !== passwordData.oldPassword,
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFF5F7] to-white">
      <DoctorNavbar />

      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <SettingsSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          <div className="lg:col-span-3">
            <Card className="shadow-2xl rounded-2xl border border-pink-100 bg-white overflow-hidden">
              <CardHeader className="px-8 py-6 border-b border-pink-100 bg-linear-to-r from-pink-50 via-white to-white">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center shadow-inner">
                      <Shield className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-pink-900 tracking-tight">Ganti Password</h2>
                      <p className="text-sm text-pink-600 mt-1">Demi keamanan akun, gunakan password yang kuat dan unik</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Terakhir diperbarui</p>
                    <p className="text-sm font-medium text-pink-700">{new Date().toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                <div className="space-y-5">
                  {(['old', 'new', 'confirm'] as const).map((type, idx) => {
                    const isOld = type === 'old';
                    const isNew = type === 'new';
                    const isConfirm = type === 'confirm';
                    const show = isOld ? showOldPassword : isNew ? showNewPassword : showConfirmPassword;
                    const setter = isOld ? setShowOldPassword : isNew ? setShowNewPassword : setShowConfirmPassword;
                    const value = isOld ? passwordData.oldPassword : isNew ? passwordData.newPassword : passwordData.confirmPassword;
                    const label = isOld ? 'Password Saat Ini' : isNew ? 'Password Baru' : 'Konfirmasi Password Baru';
                    const placeholder = isOld ? 'Masukkan password saat ini' : isNew ? 'Masukkan password baru' : 'Konfirmasi password baru';

                    const key = type === 'old' ? 'oldPassword' : type === 'new' ? 'newPassword' : 'confirmPassword';
                    const error = passwordErrors[key];
                    const showError = touched[key] && error;

                    return (
                      <div key={type} className={`${idx === 0 ? 'mt-4' : ''}`}>
                        <Label className="text-pink-900 font-semibold mb-1">{label}</Label>
                        <div className="relative">
                          <Input
                            aria-label={label}
                            type={show ? 'text' : 'password'}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                              const fieldKey = type + 'Password';
                              setPasswordData({ ...passwordData, [fieldKey]: e.target.value });
                              setTouched({ ...touched, [fieldKey]: true });
                              setPasswordErrors({
                                ...passwordErrors,
                                [fieldKey]: validateField(type, e.target.value),
                              });
                            }}
                            className={`border-pink-200 pr-12 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 rounded-lg transition-shadow duration-150 shadow-sm ${showError ? 'border-red-400 ring-red-50' : 'hover:shadow-md'
                              }`}
                            disabled={loading}
                          />

                          <button
                            type="button"
                            onClick={() => setter(!show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 focus:outline-none"
                            aria-label={`Toggle ${label}`}
                            disabled={loading}
                          >
                            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>

                        {showError && <p className="text-red-600 text-xs mt-1">{error}</p>}

                        {isNew && (
                          <div className="mt-3 bg-pink-50 border border-pink-100 rounded-md p-3 text-sm">
                            <div className="font-semibold text-pink-800 mb-2">Syarat Password</div>
                            <ul className="space-y-1">
                              <li className="flex items-center gap-2">
                                {criteria.minLength ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-400" />}
                                <span className="text-xs">Minimal 6 karakter</span>
                              </li>
                              <li className="flex items-center gap-2">
                                {criteria.hasUpper ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-400" />}
                                <span className="text-xs">Huruf besar (A-Z)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                {criteria.hasLower ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-400" />}
                                <span className="text-xs">Huruf kecil (a-z)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                {criteria.hasNumber ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-400" />}
                                <span className="text-xs">Angka (0-9)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                {criteria.hasSymbol ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-400" />}
                                <span className="text-xs">Simbol (mis. !@#)</span>
                              </li>
                              <li className="flex items-center gap-2">
                                {criteria.notSameAsOld ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-400" />}
                                <span className="text-xs">Tidak sama dengan password lama</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                <span className="text-xs">
                                  Jangan gunakan informasi pribadi yang mudah ditebak (nama, tanggal lahir, dsb.). <span className="italic">(Petunjuk)</span>
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">Tips Keamanan Password</h4>
                      <ul className="space-y-1">
                        {[
                          "Minimal 6 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol",
                          "Jangan gunakan informasi pribadi yang mudah ditebak",
                          "Ubah password secara berkala setiap 3-6 bulan",
                          "Jangan gunakan password yang sama untuk akun lain",
                        ].map((tip, idx) => (
                          <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform active:scale-95"
                    onClick={() => setConfirmDialogOpen(true)}
                    disabled={
                      loading ||
                      !passwordData.oldPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Ubah Password"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-sm text-pink-600 mt-8"> © 2025 POLABDC — All rights reserved</p>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">Yakin ingin mengganti password?</DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600 text-sm">Pastikan Anda mengingat password baru yang telah dibuat</p>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} className="px-8 border-pink-300 text-pink-700" disabled={loading}>
              Batal
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 disabled:opacity-50" onClick={handleConfirmChange} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Ya, Ganti"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md flex justify-center items-center p-6">
          <div className="text-center bg-pink-100 rounded-2xl shadow-lg p-6 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-16 h-16 text-pink-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold text-pink-700 mb-2">Password Berhasil Diganti!</h3>
            <p className="text-sm text-gray-600 mb-4">Password Anda telah berhasil diperbarui</p>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg mt-2" onClick={handleSuccessClose}>
              Kembali ke Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-900">Gagal Mengganti Password</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-16 h-16 text-red-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-gray-700">{errorMessage}</p>
          </div>
          <div className="flex justify-center pt-2">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8" onClick={() => setErrorDialogOpen(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {toast.type && (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`max-w-xs w-full rounded-lg shadow-lg p-3 flex items-start gap-3 transform transition-transform duration-200 ${toast.type === "success" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
              }`}
            role="status"
            aria-live="polite"
          >
            <div className="pt-1">
              {toast.type === "success" ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <X className="w-6 h-6 text-red-600" />}
            </div>
            <div className="text-sm">
              <div className={`${toast.type === "success" ? "text-emerald-800 font-medium" : "text-red-800 font-medium"}`}>
                {toast.type === "success" ? "Berhasil" : "Gagal"}
              </div>
              <div className="text-gray-700">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}