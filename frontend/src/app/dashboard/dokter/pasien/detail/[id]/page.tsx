"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, FileText, Pill, Download } from "lucide-react";
import { format, parse } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface RecordType {
  rmNo: string;
  noId: string;
  name: string;
  date: string;
  doctor: string;
  diagnosis: string;
  action: string;
  treatmentType: string;
  chiefComplaint: string;
  examinationResults: string;
  treatmentPlan: string;
  notes?: string;
  medications?: { id: string; name: string; dosage: string; duration: string; instructions?: string }[];
  procedures?: { id: string; procedureName: string; quantity: number; price: number; totalPrice: number; commission: number }[];
  packages?: { id: string; packageName: string; quantity: number; price: number; totalPrice: number; commission: number }[];
}

// Dummy Data
const dummyRecords: RecordType[] = Array.from({ length: 30 }).map((_, i) => ({
  rmNo: `RM-${(i + 1).toString().padStart(3, "0")}`,
  noId: `008-00${900 + i}`,
  name: `Pasien Dummy ${i + 1}`,
  date: `0${(i % 12) + 1} Juli 2025`,
  doctor: i % 2 === 0 ? "dr. Sarah Aminah" : "dr. Budi Santoso",
  diagnosis: i % 3 === 0 ? "Kalkulus supragingiva" : "Karies dentini",
  action: i % 2 === 0 ? "Scaling Class 1" : "Tambal Gigi Anterior",
  treatmentType: i % 2 === 0 ? "Scaling" : "Tambal",
  chiefComplaint: "Gigi sensitif dan berlubang",
  examinationResults: "Gigi atas sensitif, karies dentini pada gigi seri",
  treatmentPlan: "Tambal gigi dan scaling",
  notes: i % 2 === 0 ? "Pasien perlu kontrol 1 minggu lagi" : undefined,
  medications: [
    { id: "1", name: "Obat A", dosage: "1x sehari", duration: "5 hari", instructions: "Setelah makan" },
  ],
  procedures: [
    { id: "1", procedureName: "Scaling", quantity: 1, price: 50000, totalPrice: 50000, commission: 10000 },
  ],
  packages: [
    { id: "1", packageName: "Paket Gigi Sehat", quantity: 1, price: 100000, totalPrice: 100000, commission: 20000 },
  ],
}));

// ===================== Daftar Pasien =====================
export function MedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredRecords = dummyRecords.filter(
    r =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.noId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rmNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredRecords.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Pasien</h1>

      {/* Search */}
      <div className="mb-4 max-w-md relative">
        <Input
          placeholder="Cari No. RM / No. ID / Nama Pasien"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="min-w-full divide-y divide-pink-200">
          <thead className="bg-pink-100 text-pink-900">
            <tr>
              {["NO. RM", "NO. ID", "NAMA PASIEN", "TANGGAL", "DOKTER", "DIAGNOSIS", "TINDAKAN", "DETAIL"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-sm">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-pink-100 text-pink-900">
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-pink-600">Data tidak ditemukan</td>
              </tr>
            ) : (
              currentRecords.map((record, idx) => (
                <tr key={idx} className="hover:bg-pink-50">
                  <td className="px-4 py-2">{record.rmNo}</td>
                  <td className="px-4 py-2">{record.noId}</td>
                  <td className="px-4 py-2 font-medium">{record.name}</td>
                  <td className="px-4 py-2">{record.date}</td>
                  <td className="px-4 py-2">{record.doctor}</td>
                  <td className="px-4 py-2"><Badge variant="secondary">{record.diagnosis}</Badge></td>
                  <td className="px-4 py-2">{record.action}</td>
                  <td className="px-4 py-2">
                    <Link href={`/dashboard/dokter/pasien/detail/${record.rmNo}`}>
                      <Button size="sm" variant="outline">Detail</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              className={`${currentPage === i + 1 ? "bg-pink-600 text-white" : "border border-pink-200 hover:bg-pink-50"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===================== Detail Pasien =====================
interface DetailProps {
  params: { id: string };
}

export default function MedicalRecordDetailPage({ params }: DetailProps) {
  const recordId = params.id;
  const record = dummyRecords.find(r => r.rmNo === recordId); // pakai rmNo supaya konsisten

  if (!record) return <p className="text-center mt-10 text-red-600">ID tidak ditemukan</p>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/dokter/pasien">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{record.rmNo}</h1>
              <Badge variant="secondary">Final</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{record.date}</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Unduh PDF
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card className="lg:col-span-1">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Pasien
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">NO. RM</p>
              <p className="font-semibold">{record.rmNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">NO. ID</p>
              <p className="font-medium">{record.noId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">NAMA LENGKAP</p>
              <p className="font-medium">{record.name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Visit Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-accent/20 border-accent-foreground/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Informasi Kunjungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">TINDAKAN</p>
                <Badge>{record.treatmentType}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DIAGNOSIS</p>
                <p className="font-semibold">{record.diagnosis}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pemeriksaan */}
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle>Detail Pemeriksaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <p className="text-sm font-semibold mb-1">KELUHAN UTAMA</p>
                <p>{record.chiefComplaint}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">HASIL PEMERIKSAAN FISIK</p>
                <p>{record.examinationResults}</p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">RENCANA PERAWATAN</p>
                <p>{record.treatmentPlan}</p>
              </div>
              {record.notes && (
                <div>
                  <p className="text-sm font-semibold mb-1">CATATAN TAMBAHAN</p>
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent-foreground/20 italic">{record.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medications */}
        {(record.medications?.length ?? 0) > 0 && (
  <Card>
    <CardHeader className="bg-accent/10">
      <CardTitle className="flex items-center gap-2">
        <Pill className="w-5 h-5" /> Obat
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3 pt-6">
      {(record.medications ?? []).map(med => (
        <div key={med.id} className="p-4 bg-muted rounded-lg">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{med.name}</p>
              <p className="text-sm">Dosis: {med.dosage}</p>
            </div>
            <Badge variant="secondary">Durasi: {med.duration}</Badge>
          </div>
          {med.instructions && <p className="text-xs mt-2">Instruksi: {med.instructions}</p>}
        </div>
      ))}
    </CardContent>
  </Card>
)}

        </div>
      </div>
    </div>
  );
}
