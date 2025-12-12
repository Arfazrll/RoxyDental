"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { visitService } from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import DoctorNavbar from "@/components/ui/navbarpr";

export default function TambahAntrianPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "L" as "L" | "P",
    phone: "",
    email: "",
    address: "",
    bloodType: "",
    allergies: "",
    visitDate: new Date().toISOString().split('T')[0],
    chiefComplaint: "",
    bloodPressure: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.dateOfBirth || !formData.phone) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang wajib (Nama, Tanggal Lahir, No. Telepon)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await visitService.createVisit({
        patient: {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email || undefined,
          address: formData.address || undefined,
          bloodType: formData.bloodType || undefined,
          allergies: formData.allergies || undefined
        },
        visit: {
          visitDate: formData.visitDate,
          chiefComplaint: formData.chiefComplaint || undefined,
          bloodPressure: formData.bloodPressure || undefined
        }
      });

      toast({
        title: "Berhasil",
        description: "Antrian berhasil ditambahkan"
      });

      router.push("/dashboard/perawat/pasienpr/antrian");
    } catch (error: any) {
      console.error('Error creating visit:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal menambahkan antrian",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE6EB]">
      <DoctorNavbar />
      <div className="flex flex-col items-center py-10 px-4">
        <div className="w-24 h-24 rounded-full bg-linear-to-r from-pink-600 to-pink-400 shadow-lg flex items-center justify-center mb-6">
          <Users className="text-white" size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold text-pink-900 mb-6">Tambah Daftar Antrian</h1>

        <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-pink-600 to-pink-400 text-white px-6 py-4">
            <h2 className="font-semibold text-lg">Informasi Pasien</h2>
            <p className="text-sm opacity-80">Pastikan semua informasi yang dimasukkan sudah benar</p>
          </div>

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-pink-800 text-sm font-medium">Nama Pasien *</label>
              <Input
                placeholder="Masukkan Nama Pasien"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-pink-800 text-sm font-medium">Tanggal Lahir *</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-pink-800 text-sm font-medium">Jenis Kelamin *</label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v as "L" | "P" })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Pria</SelectItem>
                    <SelectItem value="P">Wanita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-pink-800 text-sm font-medium">No. Telepon *</label>
                <Input
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-pink-800 text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-pink-800 text-sm font-medium">Alamat</label>
              <Textarea
                placeholder="Alamat lengkap"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-pink-800 text-sm font-medium">Golongan Darah</label>
                <Select value={formData.bloodType} onValueChange={(v) => setFormData({ ...formData, bloodType: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-pink-800 text-sm font-medium">Tanggal Kunjungan *</label>
                <Input
                  type="date"
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-pink-800 text-sm font-medium">Alergi</label>
              <Textarea
                placeholder="Alergi yang dimiliki pasien"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-pink-800 text-sm font-medium">Keluhan Utama</label>
              <Textarea
                placeholder="Keluhan pasien"
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-pink-800 text-sm font-medium">Tekanan Darah</label>
              <Input
                placeholder="120/80 mmHg"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="px-8 border-pink-300 text-pink-700"
                onClick={() => router.push("/dashboard/perawat/pasienpr/antrian")}
                disabled={loading}
              >
                Kembali
              </Button>

              <Button 
                type="submit" 
                className="px-8 bg-pink-600 hover:bg-pink-700 text-white"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Daftar Sekarang"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}