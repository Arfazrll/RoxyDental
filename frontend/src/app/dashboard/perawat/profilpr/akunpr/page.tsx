"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DoctorNavbar from "@/components/ui/navbarpr";
import SettingsSidebar from "@/components/ui/SettingsSidebarpr";
import AuthGuard from "@/components/AuthGuard";
import { nurseProfileService, NurseProfile, UpdateProfileData } from "@/services/nurse-profile.service";

function SettingsAccountPageContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    education: '',
    experience: '',
    sipNumber: '',
    sipStartDate: '',
    sipEndDate: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await nurseProfileService.getProfile();
      setProfile(response.data);
      setPreviewPhoto(response.data.profilePhoto || null);
      
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        phone: response.data.phone,
        specialization: response.data.specialization || '',
        education: response.data.education || '',
        experience: response.data.experience || '',
        sipNumber: response.data.sipNumber || '',
        sipStartDate: response.data.sipStartDate ? new Date(response.data.sipStartDate).toISOString().split('T')[0] : '',
        sipEndDate: response.data.sipEndDate ? new Date(response.data.sipEndDate).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 2MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => setPreviewPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData: UpdateProfileData = {
        ...formData,
        profilePhoto: previewPhoto || undefined
      };

      await nurseProfileService.updateProfile(updateData);
      
      setConfirmSaveOpen(false);
      setSuccessSaveOpen(true);
      
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setConfirmDeleteOpen(false);
    setSuccessDeleteOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-pink-900">Data profil tidak dapat dimuat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SettingsSidebar activeMenu="informasi-akun" setActiveMenu={() => {}} />

          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-100 p-4">
                <h2 className="text-xl font-bold text-pink-900">Informasi Akun</h2>
                <p className="text-sm text-pink-600">Update data dan profil akun Anda</p>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-start gap-6 mb-6 mt-6">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border border-pink-200">
                      {previewPhoto ? (
                        <img
                          src={previewPhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-pink-100">
                          <User className="w-16 h-16 text-pink-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-pink-900 mb-1">Foto Profil</h3>
                    <p className="text-sm text-pink-600 mb-2">
                      Format: JPG, PNG. Maksimal 2MB
                    </p>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-md cursor-pointer">
                        <Upload className="w-4 h-4" /> Ubah Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoChange}
                        />
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

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nama Lengkap</Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nomor Telepon</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Jenis Akun</Label>
                    <Input
                      value={profile.role === 'PERAWAT' ? 'Perawat' : 'Tenaga Medis'}
                      readOnly
                      className="border-pink-300 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Spesialisasi</Label>
                    <Input
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Pendidikan</Label>
                    <Input
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-pink-900 font-semibold mb-1">Pengalaman</Label>
                  <Input
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="border-pink-300"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Nomor SIP</Label>
                    <Input
                      value={formData.sipNumber}
                      onChange={(e) => setFormData({ ...formData, sipNumber: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Tanggal Mulai SIP</Label>
                    <Input
                      type="date"
                      value={formData.sipStartDate}
                      onChange={(e) => setFormData({ ...formData, sipStartDate: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                  <div>
                    <Label className="text-pink-900 font-semibold mb-1">Tanggal Akhir SIP</Label>
                    <Input
                      type="date"
                      value={formData.sipEndDate}
                      onChange={(e) => setFormData({ ...formData, sipEndDate: e.target.value })}
                      className="border-pink-300"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-pink-900 font-semibold mb-1">Status Akun</Label>
                  <Input
                    value={profile.isActive ? 'Aktif' : 'Nonaktif'}
                    readOnly
                    className="border-pink-300 bg-gray-100 cursor-not-allowed"
                  />
                </div>

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
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Perubahan'
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

      <Dialog open={confirmSaveOpen} onOpenChange={setConfirmSaveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Anda yakin ingin menyimpan perubahan?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => setConfirmSaveOpen(false)} 
              className="px-8 border-pink-300 text-pink-700"
              disabled={saving}
            >
              Batal
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-8"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Ya, Simpan'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successSaveOpen} onOpenChange={setSuccessSaveOpen}>
        <DialogContent className="max-w-md text-center p-6">
          <h3 className="text-xl font-bold text-pink-700 mb-4">Perubahan berhasil disimpan</h3>
          <Button 
            className="bg-pink-600 hover:bg-pink-700 text-white px-8" 
            onClick={() => setSuccessSaveOpen(false)}
          >
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
            <Button 
              variant="outline" 
              onClick={() => setConfirmDeleteOpen(false)} 
              className="px-8 border-pink-300 text-pink-700"
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={handleDelete}
            >
              Ya, Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={successDeleteOpen} onOpenChange={setSuccessDeleteOpen}>
        <DialogContent className="max-w-md text-center p-6">
          <h3 className="text-xl font-bold text-red-700 mb-4">Akun berhasil dihapus</h3>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white px-8" 
            onClick={() => setSuccessDeleteOpen(false)}
          >
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SettingsAccountPage() {
  return (
    <AuthGuard requiredRole="PERAWAT">
      <SettingsAccountPageContent />
    </AuthGuard>
  );
}