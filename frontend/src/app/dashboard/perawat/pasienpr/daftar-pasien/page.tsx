"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import { usePathname, useRouter } from "next/navigation";

interface PatientType {
  rmNo: string;
  name: string;
  dob: string;
  gender: string;
  visitDate: string;
  tindakan: string;
}

interface TabType {
  label: string;
  value: string;
  href: string;
}

export default function PatientPage() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs: TabType[] = [
    { label: "Daftar Pasien", value: "daftar-pasien", href: "/dashboard/perawat/pasienpr/daftar-pasien" },
    { label: "Daftar Antrian", value: "daftar-antrian", href: "/dashboard/perawat/pasienpr/antrian" },
    { label: "Rekam Medis", value: "rekam-medis", href: "/dashboard/perawat/pasienpr/rekam-medis" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const patients: PatientType[] = Array.from({ length: 25 }).map((_, i) => ({
    rmNo: i % 3 === 0 ? "-" : `008-0097${70 + i}`,
    name: `Pasien ${i + 1}`,
    dob: `19/0${(i % 9) + 1}/200${i % 5}`,
    gender: i % 2 === 0 ? "Wanita" : "Pria",
    visitDate: "Senin, 07 Juli 2025",
    tindakan: i % 2 === 0 ? "T5003 - Scaling Class 1" : "T5002 - Scaling Class 2",
  }));

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rmNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const currentPatients = filtered.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="min-h-screen bg-[#FDDCE7]">
      <DoctorNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.value);
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`px-4 py-2 rounded-full font-medium transition shadow-sm ${
                  isActive
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-white border border-pink-300 text-pink-700 hover:bg-pink-50"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Search Sidebar */}
          <div className="md:col-span-3 w-full">
            <div className="bg-white rounded-xl p-4 border border-pink-200 shadow-sm">
              <h2 className="text-lg font-semibold text-pink-900 mb-3">Daftar Pasien</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-pink-400 h-5 w-5" />
                <Input
                  placeholder="No. ID"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-pink-300 rounded-lg"
                />
              </div>
              <Button className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg">Cari</Button>
            </div>
          </div>

          {/* Table */}
          <div className="md:col-span-9">
            <div className="bg-white rounded-xl shadow-md border border-pink-200 overflow-x-auto">
              <table className="w-full text-pink-900 min-w-[900px]">
                <thead className="bg-pink-100">
                  <tr>
                    {["NO. ID","NAMA","J/K","TGL. LAHIR (UMUR)","TGL. KUNJUNGAN","TINDAKAN"," "].map((h) => (
                      <th key={h} className="text-left px-3 py-3 text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((p, i) => (
                    <tr key={i} className="border-t border-pink-100 hover:bg-pink-50 transition">
                      <td className="px-3 py-3 whitespace-nowrap">{p.rmNo}</td>
                      <td className="px-3 py-3">{p.name}</td>
                      <td className="px-3 py-3">{p.gender}</td>
                      <td className="px-3 py-3">{p.dob}</td>
                      <td className="px-3 py-3">{p.visitDate}</td>
                      <td className="px-3 py-3">{p.tindakan}</td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => router.push(`/rekam-medis/tambah?rm=${p.rmNo === "-" ? "" : p.rmNo}`)}
                          className="p-2 rounded-full hover:bg-pink-200 transition"
                        >
                          <PlusCircle className="h-5 w-5 text-pink-700" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
           <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm rounded-md border font-medium ${
                    currentPage === i + 1
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-white border border-pink-300 text-pink-700 hover:bg-pink-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-4 py-2 bg-white border border-pink-300 rounded-md text-pink-700 hover:bg-pink-100 font-medium"
              >
                Akhir
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
