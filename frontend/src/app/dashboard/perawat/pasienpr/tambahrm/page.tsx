"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ClipboardList, User, Stethoscope, Activity, Trash } from "lucide-react";

/* ========================= MAIN FORM ========================= */

export default function AddMedicalRecordForm() {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    dateOfBirth: "",
    age: "",
    medicalRecordNo: "",
    gender: "Pria",
    bloodType: "",
    email: "",
    visitDate: "",
    doctor: "",
    complaints: "",
    bloodPressure: "",
    pulse: "",
    temperature: "",
    actions: [{ name: "", price: "" }],
    notes: "",
    diagnosis: "",
  });

  /* ====================== HANDLERS ======================= */

  const handleAddAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { name: "", price: "" }],
    });
  };

  const handleRemoveAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({ ...formData, actions: newActions });
  };

  const handleActionChange = (index: number, field: string, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setFormData({ ...formData, actions: newActions });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Rekam medis berhasil disimpan!");
  };

  /* =========================================================== */

  return (
    <div className="min-h-screen bg-pink-50 p-6 text-gray-900">
      {/* HEADER */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <ClipboardList className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-pink-900">Tambah Rekam Medis</h1>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* ===========================================================
          1. INFORMASI PASIEN
        =========================================================== */}
        <SectionHeader number={1} title="Informasi Pasien" icon={<User size={18} />} color="pink" />

        <Card className="shadow-md border border-gray-300 bg-white">
          <CardContent className="pt-6 space-y-4">

            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nama Pasien" required>
                <Input
                  placeholder="Masukkan nama pasien"
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                />
              </FormField>

              <FormField label="No. ID">
                <Input
                  placeholder="Auto-generate"
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  value={formData.patientId}
                  onChange={(e) =>
                    setFormData({ ...formData, patientId: e.target.value })
                  }
                />
              </FormField>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Tanggal Lahir">
                <Input
                  type="date"
                  className="border border-gray-300 text-gray-900"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Umur">
                <Input
                  placeholder="-"
                  readOnly
                  className="border border-gray-300 bg-gray-100 text-gray-900"
                  value={formData.age}
                />
              </FormField>

              <FormField label="No. Rekam Medis">
                <Input
                  placeholder="Auto-generate"
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  value={formData.medicalRecordNo}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalRecordNo: e.target.value })
                  }
                />
              </FormField>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Jenis Kelamin">
                <Select
                  value={formData.gender}
                  onValueChange={(v) =>
                    setFormData({ ...formData, gender: v })
                  }
                >
                  <SelectTrigger className="border border-gray-300 text-gray-900">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pria">Pria</SelectItem>
                    <SelectItem value="Wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Golongan Darah">
                <Select
                  value={formData.bloodType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, bloodType: v })
                  }
                >
                  <SelectTrigger className="border border-gray-300 text-gray-900">
                    <SelectValue placeholder="Pilih" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "AB", "O", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Email">
                <Input
                  type="email"
                  placeholder="nama@contoh.com"
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* ===========================================================
          2. INFORMASI REKAM MEDIS
        =========================================================== */}
        <SectionHeader number={2} title="Informasi Rekam Medis" icon={<Stethoscope size={18} />} color="yellow" />

        <Card className="shadow-md border border-gray-300 bg-white">
          <CardContent className="pt-6 space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tanggal Kunjungan" required>
                <Input
                  type="date"
                  className="border border-gray-300 text-gray-900"
                  value={formData.visitDate}
                  onChange={(e) =>
                    setFormData({ ...formData, visitDate: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Dokter Pemeriksa" required>
                <Select
                  value={formData.doctor}
                  onValueChange={(v) =>
                    setFormData({ ...formData, doctor: v })
                  }
                >
                  <SelectTrigger className="border border-gray-300 text-gray-900">
                    <SelectValue placeholder="Pilih dokter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-sarah">dr. Sarah Aminah</SelectItem>
                    <SelectItem value="dr-budi">dr. Budi Santoso</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Keluhan">
              <Textarea
                placeholder="Tuliskan keluhan pasien"
                className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                rows={3}
                value={formData.complaints}
                onChange={(e) =>
                  setFormData({ ...formData, complaints: e.target.value })
                }
              />
            </FormField>
          </CardContent>
        </Card>

        {/* ===========================================================
          3. HASIL PEMERIKSAAN
        =========================================================== */}
        <SectionHeader number={3} title="Hasil Pemeriksaan" icon={<Activity size={18} />} color="pink" />

        <Card className="shadow-md border border-gray-300 bg-white">
          <CardContent className="pt-6 space-y-4">

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Tekanan Darah">
                <Input
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  placeholder="120/80 mmHg"
                  value={formData.bloodPressure}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodPressure: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Nadi">
                <Input
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  placeholder="80 bpm"
                  value={formData.pulse}
                  onChange={(e) =>
                    setFormData({ ...formData, pulse: e.target.value })
                  }
                />
              </FormField>

              <FormField label="Suhu Tubuh">
                <Input
                  className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                  placeholder="36.5°C"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                />
              </FormField>
            </div>

          </CardContent>
        </Card>

        {/* ===========================================================
          4. RENCANA TINDAKAN
        =========================================================== */}
        <SectionHeader number={4} title="Rencana Tindakan / Obat" icon={<ClipboardList size={18} />} color="yellow" />

        <Card className="shadow-md border border-gray-300 bg-white">
          <CardContent className="pt-6 space-y-6">

            {formData.actions.map((action, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">

                <div className="col-span-1 font-medium text-sm text-gray-900">#{index + 1}</div>

                <div className="col-span-7">
                  <Label className="text-gray-900">Nama Tindakan / Obat</Label>
                  <Input
                    className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                    placeholder="Nama tindakan"
                    value={action.name}
                    onChange={(e) =>
                      handleActionChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-3">
                  <Label className="text-gray-900">Biaya</Label>
                  <Input
                    className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                    placeholder="Rp 0"
                    value={action.price}
                    onChange={(e) =>
                      handleActionChange(index, "price", e.target.value)
                    }
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAction(index)}
                      className="flex items-center gap-1"
                    >
                      <Trash size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={handleAddAction} className="w-full border-dashed">
              Tambah Obat
            </Button>
          </CardContent>
        </Card>

        {/* ===========================================================
          5. CATATAN
        =========================================================== */}
        <SectionHeader number={5} title="Catatan" icon={<ClipboardList size={18} />} color="pink" />

        <Card className="shadow-md border border-gray-300 bg-white">
          <CardContent className="pt-6 space-y-4">

            <FormField label="Catatan Tambahan">
              <Textarea
                placeholder="Catatan untuk pasien atau instruksi khusus"
                className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </FormField>

            <FormField label="Hasil Pemeriksaan Lain">
              <Textarea
                placeholder="Hasil lab, radiologi, dll"
                rows={3}
                className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
              />
            </FormField>

            <FormField label="Rencana Perawatan">
              <Textarea
                placeholder="Rencana perawatan selanjutnya"
                rows={3}
                className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
              />
            </FormField>

            <FormField label="Diagnosis">
              <Textarea
                placeholder="Diagnosis akhir"
                rows={2}
                className="border border-gray-300 text-gray-900 placeholder:text-gray-700"
                value={formData.diagnosis}
                onChange={(e) =>
                  setFormData({ ...formData, diagnosis: e.target.value })
                }
              />
            </FormField>

          </CardContent>
        </Card>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center gap-4 pb-10">
          <Button variant="outline" className="px-8">
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-8 bg-pink-600 hover:bg-pink-700 text-white shadow-md"
          >
            Selesai, Tambahkan
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ===================== COMPONENT PEMBANTU ===================== */

function SectionHeader({
  number,
  title,
  icon,
  color,
}: {
  number: number;
  title: string;
  icon: React.ReactNode;
  color: "pink" | "yellow";
}) {
  const bg = color === "pink" ? "bg-pink-600" : "bg-yellow-500";
  return (
    <Card className={`${bg} text-white border border-gray-300`}>
      <CardHeader>
        <h2 className="font-bold flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm text-gray-700 font-bold">
            {number}
          </div>
          {icon}
          <span>{title}</span>
        </h2>
      </CardHeader>
    </Card>
  );
}

function FormField({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
