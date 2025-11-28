"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";

interface RecordType {
  rmNo: string;
  noId: string;
  name: string;
  date: string;
  doctor: string;
  diagnosis: string;
  action: string;
}

export default function MedicalRecordsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil page dari URL, default 1
  const currentPageFromUrl = Number(searchParams.get("page")) || 1;

  const [searchQuery, setSearchQuery] = useState("");

  const rowsPerPage = 20;

  const tabs = [
    {
      label: "Daftar Pasien",
      value: "daftar-pasien",
      href: "/dashboard/dokter/pasien/daftar-pasien?page=1",
    },
    {
      label: "Daftar Antrian",
      value: "daftar-antrian",
      href: "/dashboard/dokter/pasien/antrian?page=1",
    },
    {
      label: "Rekam Medis",
      value: "rekam-medis",
      href: "/dashboard/dokter/pasien/rekam-medis?page=1",
    },
  ];

  // Dummy records
  const records: RecordType[] = Array.from({ length: 30 }).map((_, i) => ({
    rmNo: `RM-${(i + 1).toString().padStart(3, "0")}`,
    noId: `008-00${900 + i}`,
    name: `Pasien Dummy ${i + 1}`,
    date: `0${(i % 12) + 1} Juli 2025`,
    doctor: i % 2 === 0 ? "dr. Sarah Aminah" : "dr. Budi Santoso",
    diagnosis: i % 3 === 0 ? "Kalkulus supragingiva" : "Karies dentini",
    action: i % 2 === 0 ? "Scaling Class 1" : "Tambal Gigi Anterior",
  }));

  const filteredRecords = records.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.noId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rmNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const startIdx = (currentPageFromUrl - 1) * rowsPerPage;
  const currentRecords = filteredRecords.slice(
    startIdx,
    startIdx + rowsPerPage
  );

  // Update pagination ke URL
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.value);

            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  isActive
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-pink-900">Rekam Medis</h1>

        {/* Search */}
        <div className="relative mb-4 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
          <Input
            placeholder="Cari No. RM / No. ID / Nama Pasien"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              goToPage(1); // reset pagination via URL
            }}
            className="pl-12 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-pink-600 text-pink-900"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="min-w-full divide-y divide-pink-200">
            <thead className="bg-pink-100 text-pink-900">
              <tr>
                {[
                  "NO. RM",
                  "NO. ID",
                  "NAMA PASIEN",
                  "TANGGAL",
                  "DOKTER",
                  "DIAGNOSIS",
                  "TINDAKAN",
                  "ACTION",
                ].map((head) => (
                  <th key={head} className="px-4 py-3 text-left font-semibold text-sm">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-pink-100 text-pink-900">
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-pink-600">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                currentRecords.map((record, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-4 py-2">{record.rmNo}</td>
                    <td className="px-4 py-2">{record.noId}</td>
                    <td className="px-4 py-2 font-medium">{record.name}</td>
                    <td className="px-4 py-2">{record.date}</td>
                    <td className="px-4 py-2">{record.doctor}</td>
                    <td className="px-4 py-2">
                      <Badge variant="secondary">{record.diagnosis}</Badge>
                    </td>
                    <td className="px-4 py-2">{record.action}</td>
                    <td className="px-4 py-2">
                      <Link href={`/dashboard/dokter/pasien/detail/${record.rmNo}`}>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
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
                className={`px-3 py-1 rounded-full ${
                  currentPageFromUrl === i + 1
                    ? "bg-pink-600 text-white"
                    : "border border-pink-200 hover:bg-pink-50"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
