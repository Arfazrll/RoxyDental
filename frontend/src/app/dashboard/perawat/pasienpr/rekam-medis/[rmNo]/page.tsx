"use client";

import React, { use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Navbarpr from "@/components/ui/navbarpr";

interface Medication {
  id?: string;
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

interface Visit {
  date: string;
  doctor: string;
  action: string;
  diagnosis: string;
}

interface Examination {
  chiefComplaint: string;
  physical: string;
  treatmentPlan: string;
}

interface RecordType {
  rmNo: string;
  noId: string;
  name: string;
  age?: number;
  gender?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  email?: string;
  bloodType?: string;
  allergy?: string;
  visit: Visit;
  examination: Examination;
  medications?: Medication[];
  notes?: string;
}

/* Dummy dataset */
const dummyRecords: RecordType[] = Array.from({ length: 30 }).map((_, i) => ({
  rmNo: `RM-${(i + 1).toString().padStart(3, "0")}`,
  noId: `008-00${900 + i}`,
  name: `Adil Kasun Sweger`,
  age: 35,
  gender: "Laki-laki",
  birthDate: "15 Mei 1990",
  address: "Jl. Merdeka No. 123, Jakarta Selatan",
  phone: "+62 812-3456-7890",
  email: "adilkasun@email.com",
  bloodType: "A+",
  allergy: "Penisilin, Kacang",
  visit: {
    date: "17 Juli 2025",
    doctor: "dr. Sarah Aminah",
    action: "Scaling Class 1",
    diagnosis: i % 3 === 0 ? "Kalkulus supragingiva" : "Karies dentini",
  },
  examination: {
    chiefComplaint:
      "Pasien mengeluhkan adanya karang gigi dan gusi berdarah saat menyikat gigi",
    physical:
      "Terlihat kalkulus supragingiva pada regio anterior rahang bawah dan atas. Gingiva terlihat meradang dengan warna kemerahan.",
    treatmentPlan: "Scaling dan pembersihan menyeluruh, edukasi kebersihan mulut",
  },
  medications:
    i % 2 === 0
      ? [
          {
            id: "m1",
            name: "Chlorhexidine Mouthwash 0.2%",
            dosage: "2x sehari",
            duration: "7 hari",
            instructions: "Berkumur 15 ml selama 30 detik",
          },
          {
            id: "m2",
            name: "Asam Mefenamat 500mg",
            dosage: "3x1 tablet",
            duration: "3 hari jika nyeri",
            instructions: "Diminum setelah makan",
          },
        ]
      : [],
  notes:
    i % 2 === 0
      ? "Pasien dianjurkan untuk kontrol kembali dalam 6 bulan untuk pemeriksaan rutin"
      : undefined,
}));

export default function RekamMedisDetailPage() {
  const params = useParams();
  const rm = String(params.rmNo ?? "").trim();

  const record = dummyRecords.find(
    (r) => r.rmNo.toLowerCase() === rm.toLowerCase()
  );

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    try {
      const element = document.getElementById("rekam-medis-root");
      if (!element) return alert("Konten tidak ditemukan untuk diunduh.");

      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = (html2pdfModule as any).default ?? html2pdfModule;

      await html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `${record?.rmNo ?? "rekam_medis"}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
        })
        .save();
    } catch (err) {
      console.error("Gagal membuat PDF:", err);
      alert("Gagal mengunduh PDF. Cek console untuk detail.");
    }
  };

  if (!record) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-pink-700 font-semibold text-lg">No RM tidak ditemukan</p>
          <Link href="/dashboard/perawat/pasienpr/rekam-medis" passHref>
            <Button className="mt-4">Kembali ke daftar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const meds = record.medications ?? [];

  return (
      <div className="min-h-screen bg-background">
    <Navbarpr />
    <div id="rekam-medis-root" className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/perawat/pasienpr/rekam-medis"
          className="inline-flex items-center gap-2 bg-white/60 border border-pink-200 text-pink-700 px-3 py-2 rounded shadow-sm text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border  text-pink-400 text-sm"
          >
            <Printer className="w-4 h-4" /> Cetak
          </Button>

          <Button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 bg-pink-600 text-white hover:bg-pink-700 text-sm"
          >
            <Download className="w-4 h-4" /> Unduh PDF
          </Button>
        </div>
      </div>


<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans"> {/* bisa ganti font-sans ke font-poppins jika diimport */}
  {/* Left column */}
  <div>
    <Card className="shadow-lg">
      <CardHeader className="bg-pink-600 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Informasi Pasien</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-white text-sm pt-4">
        <div>
          <p className="text-xs text-gray-400">NO. REKAM MEDIS</p>
          <p className="font-semibold text-pink-700 mt-1">{record.rmNo}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">NO. ID</p>
          <p className="font-medium mt-1">{record.noId}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">NAMA LENGKAP</p>
          <p className="font-medium mt-1">{record.name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">UMUR</p>
            <p className="font-medium mt-1">{record.age ?? "-"} tahun</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">JENIS KELAMIN</p>
            <p className="font-medium mt-1">{record.gender ?? "-"}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400">TANGGAL LAHIR</p>
          <p className="font-medium mt-1">{record.birthDate ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">ALAMAT</p>
          <p className="font-medium mt-1">{record.address ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">NO. TELEPON</p>
          <p className="font-medium mt-1">{record.phone ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">EMAIL</p>
          <p className="truncate font-medium mt-1">{record.email ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">GOLONGAN DARAH</p>
          <p className="font-semibold mt-1">{record.bloodType ?? "-"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-400">ALERGI</p>
          <p className="text-pink-700 font-medium mt-1">{record.allergy ?? "-"}</p>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Right column */}
  <div className="lg:col-span-2 space-y-6 font-sans">
    {/* Kunjungan */}
    <Card className="shadow-lg">
      <CardHeader className="bg-yellow-400/40 rounded-t-md">
        <CardTitle className="text-lg font-semibold">Informasi Kunjungan Terkini</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start bg-white text-sm pt-4">
        <div>
          <p className="text-xs text-gray-400">TANGGAL KUNJUNGAN</p>
          <p className="font-medium mt-1">{record.visit.date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">DOKTER PEMERIKSA</p>
          <p className="font-medium mt-1">{record.visit.doctor}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">TINDAKAN</p>
          <p className="font-medium mt-1">{record.visit.action}</p>
        </div>

        <div className="md:col-span-3 mt-2">
          <p className="text-xs text-gray-400">DIAGNOSIS</p>
          <div className="mt-2 rounded-md bg-pink-50 p-3">
            <p className="text-pink-700 font-semibold">{record.visit.diagnosis}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Pemeriksaan */}
    <Card className="shadow-lg">
      <CardHeader className="bg-pink-600 text-white rounded-t-md">
        <CardTitle className="text-lg font-semibold">Detail Pemeriksaan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-white text-sm pt-4">
        <div>
          <p className="text-xs text-gray-400">KELUHAN UTAMA</p>
          <p className="font-medium mt-1">{record.examination.chiefComplaint}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">HASIL PEMERIKSAAN FISIK</p>
          <p className="font-medium mt-1">{record.examination.physical}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">RENCANA PERAWATAN</p>
          <p className="font-medium mt-1">{record.examination.treatmentPlan}</p>
        </div>

        {record.notes && (
          <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded mt-2">
            <p className="text-sm font-medium">Catatan:</p>
            <p className="text-sm mt-1">{record.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Obat */}
    <Card className="shadow-lg">
      <CardHeader className="bg-yellow-400/40 rounded-t-md">
        <CardTitle className="text-lg font-semibold">Obat yang Diberikan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 bg-white text-sm pt-4">
        {meds.length === 0 ? (
          <p className="text-gray-600">Tidak ada obat yang diresepkan pada kunjungan ini.</p>
        ) : (
          meds.map((m, idx) => (
            <div key={m.id ?? idx} className="rounded-md bg-pink-50 p-4 border border-pink-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-pink-700 mt-1">{m.name}</p>
                  {m.instructions && <p className="text-gray-700 text-sm mt-1">{m.instructions}</p>}
                </div>
                <Badge variant="secondary" className="ml-4">
                  Dosis: {m.dosage}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-2">Durasi: {m.duration}</p>
            </div>
          ))
        )}

        {record.notes && meds.length > 0 && (
          <div className="mt-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-300">
            <p className="text-sm text-gray-600">{record.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</div>


        <div className="mt-8 text-center text-xs text-gray-400">© 2025 RoxyDental.</div>
      </div>
    </div>
  );
}
