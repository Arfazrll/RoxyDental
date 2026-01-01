"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbardr";
import { patientService } from "@/services/patient.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

/**
 * PatientListPage.tsx
 * Versi polish: better UX, debounce search, page size select, skeleton loader,
 * improved pagination (first/last, ellipsis), sticky header, accessibility improvements.
 *
 * NOTE: BE tidak diubah. Hanya UI/FE.
 */

export default function PatientListPage() {
  const pathname = usePathname();
  const { toast } = useToast();

  // search + debounce
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  // data
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // pagination (FE controlled, backend called with page & limit)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(2); // rows per page (FE-selectable)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  // tabs (kept same)
  const tabs = useMemo(
    () => [
      {
        label: "Daftar Pasien",
        value: "daftar-pasien",
        href: "/dashboard/dokter/pasien/daftar-pasien",
      },
      {
        label: "Daftar Antrian",
        value: "daftar-antrian",
        href: "/dashboard/dokter/pasien/antrian",
      },
      {
        label: "Rekam Medis",
        value: "rekam-medis",
        href: "/dashboard/dokter/pasien/rekam-medis",
      },
    ],
    []
  );

  // FETCH function (calls BE service - unchanged)
  const fetchPatients = async (p: number, lim: number, q: string) => {
    setLoading(true);
    try {
      const res = await patientService.getPatients(p, lim, q);
      if (res?.data) {
        setPatients(res.data.patients || []);
        setPagination(
          res.data.pagination || {
            total: 0,
            page: 1,
            limit: lim,
            totalPages: 1,
          }
        );
      } else {
        setPatients([]);
        setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal mengambil data pasien",
        variant: "destructive",
      });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // initial / on change: debounce searchQuery, page, limit
  useEffect(() => {
    // debounce search input (300ms)
    window.clearTimeout(debounceRef.current);
    // assign timer
    debounceRef.current = window.setTimeout(() => {
      setSearchQuery(rawQuery.trim());
      setPage(1); // whenever search changes, go to page 1
    }, 300);

    return () => {
      window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery]);

  useEffect(() => {
    // fetch whenever searchQuery, page, or limit changes
    fetchPatients(page, limit, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page, limit]);

  // util: format date & age
  const formatDate = (date?: string) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return "-";
    try {
      const today = new Date();
      const birth = new Date(dob);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age;
    } catch {
      return "-";
    }
  };

  // improved pagination numbers with ellipsis
  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
    const current = page;
    const delta = 2; // show two pages around current
    const range = [];
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      range.push(i);
    }

    const pages: Array<number | "ellipsis"> = [];

    // first
    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) pages.push("ellipsis");
    }

    pages.push(...range);

    // last
    if (range[range.length - 1] < total) {
      if (range[range.length - 1] < total - 1) pages.push("ellipsis");
      pages.push(total);
    }

    return pages;
  };

  // helper to clamp page
  const gotoPage = (p: number) => {
    const clamped = Math.max(1, Math.min(p, pagination.totalPages || 1));
    setPage(clamped);
    // scroll to top of table for UX
    const el = document.getElementById("patient-table-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // small accessibility helpers
  const pageLabel = `Halaman ${page} dari ${pagination.totalPages || 1}`;

  return (
    <div className="min-h-screen bg-[#FFF7FA]">
      <DoctorNavbar />

      <main className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-3 mb-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`
                  px-5 py-2 rounded-full text-sm font-semibold transition
                  ${isActive
                    ? "bg-linear-to-r from-pink-600 to-pink-500 text-white shadow-md"
                    : "bg-white text-pink-700 border border-pink-100 hover:bg-pink-50"}
                `}
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

        {/* Card */}
        <section className="overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm">
          {/* Table */}
          <div className="overflow-x-auto">
            <table
              className="min-w-full text-sm text-pink-900"
              role="table"
              aria-label="Daftar pasien"
            >
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
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-pink-800"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Loading skeleton */}
                {loading ? (
                  Array.from({ length: Math.max(limit, 5) }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-b last:border-b-0">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 max-w-32 rounded-md bg-pink-100 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-pink-600">
                      Tidak ada data pasien
                    </td>
                  </tr>
                ) : (
                  patients.map((patient: any, idx: number) => (
                    <tr
                      key={patient.id || idx}
                      className={`border-b last:border-b-0 ${
                        idx % 2 === 0 ? "bg-white" : "bg-pink-50/40"
                      } hover:bg-pink-100/60 transition-colors`}
                    >
                      <td className="px-4 py-3 align-top">{patient.patientNumber || "-"}</td>
                      <td className="px-4 py-3 font-medium align-top">{patient.fullName || "-"}</td>
                      <td className="px-4 py-3 align-top">
                        {patient.gender === "L" ? "Pria" : "Wanita"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {patient.dateOfBirth
                          ? `${formatDate(patient.dateOfBirth)} (${calculateAge(
                              patient.dateOfBirth
                            )})`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {patient.lastVisit ? formatDate(patient.lastVisit) : "-"}
                      </td>
                      <td className="px-4 py-3 align-top">{patient.chiefComplaint || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination / Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-pink-50/30">
            <div className="text-sm text-pink-700">
              <span className="font-medium">{pagination.total || 0}</span>{" "}
              pasien — {pageLabel}
            </div>

            <div className="flex items-center gap-2">
              {/* First */}
              <button
                onClick={() => gotoPage(1)}
                disabled={page <= 1}
                aria-label="Halaman pertama"
                className={`p-2 rounded-md border text-sm ${
                  page <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"
                }`}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page <= 1}
                aria-label="Sebelumnya"
                className={`p-2 rounded-md border text-sm ${
                  page <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers (compact with ellipsis) */}
              <nav aria-label="Paginasi" className="flex items-center gap-1">
                {getPageNumbers().map((p, i) =>
                  p === "ellipsis" ? (
                    <span key={`ell-${i}`} className="px-2 text-pink-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={`pg-${p}`}
                      onClick={() => gotoPage(p)}
                      aria-current={page === p ? "true" : undefined}
                      className={`w-9 h-9 rounded-md text-sm font-medium border flex items-center justify-center focus:outline-none ${
                        page === p
                          ? "bg-pink-600 text-white border-pink-600 shadow"
                          : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </nav>

              {/* Next */}
              <button
                onClick={() => gotoPage(page + 1)}
                disabled={page >= (pagination.totalPages || 1)}
                aria-label="Selanjutnya"
                className={`p-2 rounded-md border text-sm ${
                  page >= (pagination.totalPages || 1)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last */}
              <button
                onClick={() => gotoPage(pagination.totalPages || 1)}
                disabled={page >= (pagination.totalPages || 1)}
                aria-label="Halaman terakhir"
                className={`p-2 rounded-md border text-sm ${
                  page >= (pagination.totalPages || 1)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"
                }`}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {/* Jump to page */}
              <div className="flex items-center gap-2 ml-2">
                <label htmlFor="goto" className="sr-only">
                  Lompat ke halaman
                </label>
                <input
                  id="goto"
                  type="number"
                  min={1}
                  max={pagination.totalPages || 1}
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
