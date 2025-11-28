"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DoctorNavbar from "@/components/ui/navbardr";
import SettingsSidebar from "@/components/ui/SettingsSidebar";

export default function SettingsAccountInfo() {
  const [activeMenu, setActiveMenu] = useState("informasi-akun");
  const [profileData, setProfileData] = useState({
    name: "drg. Kartika Yunia Dewari",
    email: "kartika.yunia@example.com",
    phone: "+62 812-3456-7890",
    accountType: "Dokter", // readonly
    specialization: "Dokter Gigi",
    strNumber: "STR-123456789",
    status: "Aktif", // readonly
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Dialog states
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 2 * 1024 * 1024) { // Maksimal 2MB
      const reader = new FileReader();
      reader.onload = () => setPreviewPhoto(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert("File terlalu besar! Maksimal 2MB.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <SettingsSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-100">
                <h2 className="text-xl font-bold text-pink-900">Informasi Akun</h2>
                <p className="text-sm text-pink-600">Update data dan profil akun Anda</p>
              </CardHeader>

              <CardContent className="p-6">
                {/* Profile Photo Section */}
                <div className="flex items-start gap-6 mb-6 mt-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border border-pink-200">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-100">
                          <User className="w-16 h-16 text-pink-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-pink-900 mb-1">Foto Profil</h3>
                    <p className="text-sm text-pink-600 mb-2">Format: JPG, PNG. Maksimal 2MB</p>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-md cursor-pointer">
                        <Upload className="w-4 h-4" /> Ubah Foto
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                      </label>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-300 text-pink-700"
                        onClick={() => setPreviewPhoto(null)}
                      >
                        Hapus Foto
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nama Lengkap</Label>
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Email</Label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nomor Telepon</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Jenis Akun</Label>
                    <Input
                      value={profileData.accountType}
                      readOnly
                      className="border-pink-300 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Spesialisasi</Label>
                    <Input
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nomor STR</Label>
                    <Input
                      value={profileData.strNumber}
                      onChange={(e) => setProfileData({ ...profileData, strNumber: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-pink-900 font-semibold mb-1">Status Akun</Label>
                  <Input
                    value={profileData.status}
                    readOnly
                    className="border-pink-300 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-pink-200">
                  <Button
                    variant="outline"
                    className="border-pink-300 text-pink-700 hover:bg-pink-50 px-8"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    Hapus Akun
                  </Button>
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8"
                    onClick={() => setConfirmSaveOpen(true)}
                  >
                    Simpan Perubahan
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

      {/* Dialogs */}
      <Dialog open={confirmSaveOpen} onOpenChange={setConfirmSaveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Anda yakin ingin menyimpan perubahan?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => setConfirmSaveOpen(false)} className="px-8 border-pink-300 text-pink-700">
              Batal
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-8"
              onClick={() => {
                setConfirmSaveOpen(false);
                setSuccessSaveOpen(true);
              }}
            >
              Ya, Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successSaveOpen} onOpenChange={setSuccessSaveOpen}>
        <DialogContent className="max-w-md text-center p-6">
          <h3 className="text-xl font-bold text-pink-700 mb-4">Perubahan berhasil disimpan!</h3>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8" onClick={() => setSuccessSaveOpen(false)}>
            Tutup
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Anda yakin ingin menghapus akun?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)} className="px-8 border-pink-300 text-pink-700">
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={() => {
                setConfirmDeleteOpen(false);
                setSuccessDeleteOpen(true);
              }}
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDeleteOpen} onOpenChange={setSuccessDeleteOpen}>
        <DialogContent className="max-w-md text-center p-6">
          <h3 className="text-xl font-bold text-red-700 mb-4">Akun berhasil dihapus!</h3>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8" onClick={() => setSuccessDeleteOpen(false)}>
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
