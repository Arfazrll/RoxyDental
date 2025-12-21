"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";
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
        setSuccessDialogOpen(true);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTouched({ oldPassword: false, newPassword: false, confirmPassword: false });
        setPasswordErrors({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      
      if (error.message === "Password saat ini salah") {
        setErrorMessage("Password saat ini yang Anda masukkan salah");
        setPasswordErrors({
          ...passwordErrors,
          oldPassword: "Password saat ini salah"
        });
        setTouched({ ...touched, oldPassword: true });
      } else if (error.errors) {
        const firstError = error.errors[0];
        setErrorMessage(firstError.message || "Validasi gagal");
      } else {
        setErrorMessage(error.message || "Terjadi kesalahan saat mengganti password");
      }
      
      setErrorDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessDialogOpen(false);
    router.push("/dashboard/dokter/profil");
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SettingsSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          <div className="lg:col-span-3 mt-6">
            <Card className="shadow-xl rounded-2xl border border-pink-100">
              <CardHeader className="bg-linear-to-r from-pink-100 to-pink-50 rounded-t-2xl px-6 py-6">
                <h2 className="text-2xl font-bold text-pink-900">Ganti Password</h2>
                <p className="text-sm text-pink-600 mt-1">
                  Perbarui password untuk keamanan akun Anda
                </p>
              </CardHeader>

              <CardContent className="p-8 space-y-6">
                <div className="space-y-5">
                  {["old", "new", "confirm"].map((type, idx) => {
                    const isOld = type === "old";
                    const isNew = type === "new";
                    const isConfirm = type === "confirm";
                    const show = isOld ? showOldPassword : isNew ? showNewPassword : showConfirmPassword;
                    const setter = isOld
                      ? setShowOldPassword
                      : isNew
                      ? setShowNewPassword
                      : setShowConfirmPassword;
                    const value = isOld
                      ? passwordData.oldPassword
                      : isNew
                      ? passwordData.newPassword
                      : passwordData.confirmPassword;
                    const label = isOld
                      ? "Password Saat Ini"
                      : isNew
                      ? "Password Baru"
                      : "Konfirmasi Password Baru";
                    const placeholder = isOld
                      ? "Masukkan password saat ini"
                      : isNew
                      ? "Masukkan password baru"
                      : "Konfirmasi password baru";

                    const key = type === "old" ? "oldPassword" : type === "new" ? "newPassword" : "confirmPassword";
                    const error = passwordErrors[key];
                    const showError = touched[key] && error;

                    return (
                      <div key={type} className={idx === 0 ? "mt-4" : ""}>
                        <Label className="text-pink-900 font-semibold mb-1">{label}</Label>
                        <div className="relative">
                          <Input
                            type={show ? "text" : "password"}
                            placeholder={placeholder}
                            value={value}
                            onChange={(e) => {
                              const fieldKey = type + "Password";
                              setPasswordData({ ...passwordData, [fieldKey]: e.target.value });
                              setTouched({ ...touched, [fieldKey]: true });
                              setPasswordErrors({
                                ...passwordErrors,
                                [fieldKey]: validateField(type, e.target.value),
                              });
                            }}
                            className={`border-pink-300 pr-10 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 ${
                              showError ? "border-red-500" : ""
                            }`}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={() => setter(!show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600"
                            disabled={loading}
                          >
                            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {showError && <p className="text-red-600 text-xs mt-1">{error}</p>}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setConfirmDialogOpen(true)}
                    disabled={loading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword}
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

        <p className="text-center text-sm text-pink-600 mt-8">
          © 2025 RosyDental. Platform untuk klinik gigi modern
        </p>
      </div>

      {/* Konfirmasi Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Yakin ingin mengganti password?
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-600 text-sm">
            Pastikan Anda mengingat password baru yang telah dibuat
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="px-8 border-pink-300 text-pink-700"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 disabled:opacity-50"
              onClick={handleConfirmChange}
              disabled={loading}
            >
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

      {/* Dialog Sukses */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md flex justify-center items-center p-6">
          <div className="text-center bg-pink-100 rounded-2xl shadow-lg p-6 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto w-16 h-16 text-pink-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-xl font-bold text-pink-700 mb-2">Password Berhasil Diganti!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Password Anda telah berhasil diperbarui
            </p>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg mt-2"
              onClick={handleSuccessClose}
            >
              Kembali ke Profil
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Error */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-900">
              Gagal Mengganti Password
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto w-16 h-16 text-red-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-gray-700">{errorMessage}</p>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={() => setErrorDialogOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}