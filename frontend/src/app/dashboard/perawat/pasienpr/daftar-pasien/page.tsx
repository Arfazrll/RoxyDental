"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import { patientService, PatientWithVisit } from "@/services/patient.service";
import { useToast } from "@/hooks/use-toast";

/**
 * PatientListPage (Perawat) - UI aligned with doctor's page
 * - BE call kept unchanged: patientService.getPatients(1, 100, searchQuery)
 * - Debounce search (FE)
 * - Client-side pagination (since BE signature unchanged)
 * - Skeleton loader, sticky header, accessible pagination
 */

export default function PatientListPage() {
  const pathname = usePathname();
  const { toast } = useToast();

  // search + debounce
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  // data from BE (full list)
  const [patientsFull, setPatientsFull] = useState<PatientWithVisit[]>([]);
  const [loading, setLoading] = useState(false);

  // client-side pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10); // rows per page
  const totalPages = Math.max(1, Math.ceil((patientsFull?.length || 0) / limit));

  const tabs = useMemo(
    () => [
      { label: "Daftar Pasien", value: "daftar-pasien", href: "/dashboard/perawat/pasienpr/daftar-pasien" },
      { label: "Daftar Antrian", value: "daftar-antrian", href: "/dashboard/perawat/pasienpr/antrian" },
      { label: "Rekam Medis", value: "rekam-medis", href: "/dashboard/perawat/pasienpr/rekam-medis" },
    ],
    []
  );

  // fetch from BE — KEEP signature unchanged
  const fetchPatientsFromBE = async (q: string) => {
    setLoading(true);
    try {
      // BE call unchanged (first arg page & limit are kept as original caller)
      const response = await patientService.getPatients(1, 100, q);
      if (response?.success && response?.data) {
        setPatientsFull(response.data.patients || []);
      } else if (Array.isArray(response)) {
        setPatientsFull(response);
      } else {
        setPatientsFull([]);
      }
    } catch (error: any) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal mengambil data pasien",
        variant: "destructive",
      });
      setPatientsFull([]);
    } finally {
      setLoading(false);
      setPage(1); // reset to first page after each fetch
    }
  };

  // debounce rawQuery -> searchQuery
  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearchQuery(rawQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(debounceRef.current);
    };
  }, [rawQuery]);

  // fetch when searchQuery changes
  useEffect(() => {
    fetchPatientsFromBE(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // visible slice for current page
  const visiblePatients = useMemo(() => {
    const start = (page - 1) * limit;
    return patientsFull.slice(start, start + limit);
  }, [patientsFull, page, limit]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "-";
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch {
      return "-";
    }
  };

  // pagination numbers with ellipsis
  const getPageNumbers = () => {
    const total = totalPages;
    const current = page;
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }

    const pages: Array<number | "ellipsis"> = [];
    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("ellipsis");
    }

    pages.push(...range);

    if (range[range.length - 1] < total) {
      if (range[range.length - 1] < total - 1) pages.push("ellipsis");
      pages.push(total);
    }

    return pages;
  };

  const gotoPage = (p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages || 1));
    setPage(clamped);
    const el = document.getElementById("patient-table-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const pageLabel = `Halaman ${page} dari ${totalPages || 1}`;

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <main className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-3 mb-2">
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.value);
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-linear-to-r from-pink-600 to-pink-500 text-white shadow-md"
                    : "bg-white text-pink-700 border border-pink-100 hover:bg-pink-50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mt-7">
          <h1 id="patient-table-top" className="text-2xl font-bold text-pink-900">
            Daftar Pasien
          </h1>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-pink-100 shadow-sm">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari pasien (nama / no. pasien)..."
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              className="border-none focus-visible:ring-0 placeholder:text-pink-300"
              aria-label="Cari pasien"
            />
          </div>
        </div>

        {/* Card / Table */}
        <section className="overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-pink-900" role="table" aria-label="Daftar pasien">
              <thead className="bg-pink-50/80 sticky top-0 z-10">
                <tr className="border-b border-pink-100">
                  {[
                    "NO. PASIEN",
                    "NAMA",
                    "J/K",
                    "TGL. LAHIR (UMUR)",
                    "TGL. KUNJUNGAN",
                    "TINDAKAN",
                  ].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 text-left font-semibold text-pink-800">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  // skeleton rows
                  Array.from({ length: Math.max(limit, 5) }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-b last:border-b-0">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 max-w-32 rounded-md bg-pink-100 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : visiblePatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-pink-600">
                      Tidak ada data pasien
                    </td>
                  </tr>
                ) : (
                  visiblePatients.map((patient: any, idx: number) => (
                    <tr
                      key={patient.id || idx}
                      className={`border-b last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-pink-50/40"} hover:bg-pink-100/60 transition-colors`}
                    >
                      <td className="px-4 py-3 align-top">{patient.patientNumber || "-"}</td>
                      <td className="px-4 py-3 font-medium align-top">{patient.fullName || "-"}</td>
                      <td className="px-4 py-3 align-top">{patient.gender === "L" ? "Pria" : "Wanita"}</td>
                      <td className="px-4 py-3 align-top">
                        {patient.dateOfBirth ? `${formatDate(patient.dateOfBirth)} (${calculateAge(patient.dateOfBirth)})` : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">{patient.lastVisit ? formatDate(patient.lastVisit) : "-"}</td>
                      <td className="px-4 py-3 align-top">{patient.chiefComplaint?.trim() || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination / Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-pink-50/30">
            <div className="text-sm text-pink-700">
              <span className="font-medium">{patientsFull.length || 0}</span> pasien — {pageLabel}
            </div>

            <div className="flex items-center gap-2">
              {/* First */}
              <button
                onClick={() => gotoPage(1)}
                disabled={page <= 1}
                aria-label="Halaman pertama"
                className={`p-2 rounded-md border text-sm ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page <= 1}
                aria-label="Sebelumnya"
                className={`p-2 rounded-md border text-sm ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              <nav aria-label="Paginasi" className="flex items-center gap-1">
                {getPageNumbers().map((p, i) =>
                  p === "ellipsis" ? (
                    <span key={`ell-${i}`} className="px-2 text-pink-400">…</span>
                  ) : (
                    <button
                      key={`pg-${p}`}
                      onClick={() => gotoPage(p as number)}
                      aria-current={page === p ? "true" : undefined}
                      className={`w-9 h-9 rounded-md text-sm font-medium border flex items-center justify-center focus:outline-none ${page === p ? "bg-pink-600 text-white border-pink-600 shadow" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
                    >
                      {p}
                    </button>
                  )
                )}
              </nav>

              {/* Next */}
              <button
                onClick={() => gotoPage(page + 1)}
                disabled={page >= totalPages}
                aria-label="Selanjutnya"
                className={`p-2 rounded-md border text-sm ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last */}
              <button
                onClick={() => gotoPage(totalPages)}
                disabled={page >= totalPages}
                aria-label="Halaman terakhir"
                className={`p-2 rounded-md border text-sm ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {/* Jump to page */}
              <div className="flex items-center gap-2 ml-2">
                <label htmlFor="goto-patient" className="sr-only">Lompat ke halaman</label>
                <input
                  id="goto-patient"
                  type="number"
                  min={1}
                  max={totalPages || 1}
                  placeholder="Go"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = Number((e.target as HTMLInputElement).value);
                      if (!isNaN(v)) gotoPage(v);
                    }
                  }}
                  className="w-16 px-2 py-1 rounded-md border border-pink-100 bg-white text-sm text-pink-700 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
     <div className="h-10" />
    </div>
  );
}
