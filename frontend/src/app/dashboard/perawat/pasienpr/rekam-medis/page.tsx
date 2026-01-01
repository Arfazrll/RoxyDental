"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import { patientService, PatientWithVisit } from "@/services/patient.service";
import { dashboardNurseService } from "@/services/dashboard-nurse.service";
import { useToast } from "@/hooks/use-toast";

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type PatientsApiWrapped = {
  success?: boolean;
  data?: {
    patients?: PatientWithVisit[];
    pagination?: Pagination;
  };
};

type PatientsApiDirect = {
  patients?: PatientWithVisit[];
  pagination?: Pagination;
};

/**
 * MedicalRecordsPage (Perawat)
 * - UI aligned with doctor's polished page (sticky header, card, skeleton, pagination UI)
 * - BE calls NOT changed: patientService.getPatients(currentPage, limit, searchQuery)
 * - Debounce search, rows-per-page select, accessible pagination
 */

export default function MedicalRecordsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // search + debounce
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  // data & pagination (server-driven)
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<PatientWithVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  const [currentUserName, setCurrentUserName] = useState<string>("-");

  const tabs = useMemo(
    () => [
      {
        label: "Daftar Pasien",
        value: "daftar-pasien",
        href: "/dashboard/perawat/pasienpr/daftar-pasien",
      },
      {
        label: "Daftar Antrian",
        value: "daftar-antrian",
        href: "/dashboard/perawat/pasienpr/antrian",
      },
      {
        label: "Rekam Medis",
        value: "rekam-medis",
        href: "/dashboard/perawat/pasienpr/rekam-medis",
      },
    ],
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardNurseService.getNurseSummary();
        const name = res?.data?.profile?.fullName;
        setCurrentUserName(name || "-");
      } catch {
        setCurrentUserName("-");
      }
    })();
  }, []);

  // Normalize various possible API shapes
  const normalizePatientsResponse = (raw: any): { list: PatientWithVisit[]; pg: Pagination } => {
    const defaultPg: Pagination = {
      total: 0,
      page: currentPage,
      limit: 20,
      totalPages: 0,
    };

    if (!raw) return { list: [], pg: defaultPg };

    // wrapped: { success, data: { patients, pagination } }
    if (typeof raw === "object" && "data" in raw && raw.data) {
      const list = Array.isArray(raw.data.patients) ? raw.data.patients : [];
      const pg = raw.data.pagination || defaultPg;
      return { list, pg };
    }

    // direct: { patients, pagination }
    if (typeof raw === "object" && ("patients" in raw || "pagination" in raw)) {
      const list = Array.isArray(raw.patients) ? raw.patients : [];
      const pg = raw.pagination || defaultPg;
      return { list, pg };
    }

    // array itself
    if (Array.isArray(raw)) {
      return {
        list: raw,
        pg: { total: raw.length, page: currentPage, limit: pagination.limit || 20, totalPages: Math.max(1, Math.ceil(raw.length / (pagination.limit || 20))) },
      };
    }

    // fallback if raw.data is array
    if (raw && raw.data && Array.isArray(raw.data)) {
      return {
        list: raw.data as PatientWithVisit[],
        pg: { total: raw.data.length, page: currentPage, limit: pagination.limit || 20, totalPages: Math.max(1, Math.ceil(raw.data.length / (pagination.limit || 20))) },
      };
    }

    return { list: [], pg: defaultPg };
  };

  // FETCH - BE signature preserved
  const fetchMedicalRecords = async (p = currentPage, lim = pagination.limit, q = searchQuery) => {
    setLoading(true);
    try {
      const response = await patientService.getPatients(p, lim, q);
      const { list, pg } = normalizePatientsResponse(response);

      setRows(Array.isArray(list) ? list : []);
      setPagination({
        total: pg.total || 0,
        page: pg.page || p,
        limit: pg.limit || lim,
        totalPages: pg.totalPages || (pg.total ? Math.max(1, Math.ceil(pg.total / (pg.limit || lim))) : 0),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal mengambil data rekam medis",
        variant: "destructive",
      });
      setRows([]);
      setPagination({
        total: 0,
        page: 1,
        limit: lim,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // debounce rawQuery -> searchQuery
  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearchQuery(rawQuery.trim());
      setCurrentPage(1);
    }, 300);

    return () => window.clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery]);

  // fetch whenever searchQuery or currentPage or pagination.limit changes
  useEffect(() => {
    fetchMedicalRecords(currentPage, pagination.limit, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage, pagination.limit]);

  // format helpers
  const formatDate = (date?: string) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const getNoRm = (row: PatientWithVisit) => row.medicalRecordNumber || "-";
  const getNoId = (row: PatientWithVisit) => row.patientNumber || "-";
  const getNama = (row: PatientWithVisit) => row.fullName || "-";
  const getTanggal = (row: PatientWithVisit) => {
    const raw = row.lastVisit;
    return raw ? formatDate(raw) : "-";
  };
  const getDiagnosis = (row: PatientWithVisit) => row.lastDiagnosis || "-";
  const getTindakan = (row: PatientWithVisit) =>
    row.chiefComplaint?.trim()
      ? row.chiefComplaint
      : row.lastServiceName?.trim()
      ? row.lastServiceName
      : "-";

  const openDetail = (row: PatientWithVisit) => {
    const medicalRecordNumber = row.medicalRecordNumber;
    if (medicalRecordNumber) {
      router.push(`/dashboard/perawat/pasienpr/rekam-medis/${encodeURIComponent(medicalRecordNumber)}`);
    } else {
      toast({
        title: "Error",
        description: "Nomor rekam medis tidak ditemukan",
        variant: "destructive",
      });
    }
  };

  // pagination helpers with ellipsis
  const totalPages = Math.max(1, pagination.totalPages || Math.ceil((pagination.total || rows.length) / (pagination.limit || 20)));
  const page = currentPage;

  const getPageNumbers = () => {
    const total = totalPages || 1;
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
    setCurrentPage(clamped);
    const el = document.getElementById("medrec-table-top");
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
                  isActive ? "bg-linear-to-r from-pink-600 to-pink-500 text-white shadow-md" : "bg-white text-pink-700 border border-pink-100 hover:bg-pink-50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mt-7">
          <h1 id="medrec-table-top" className="text-2xl font-bold text-pink-900">Rekam Medis</h1>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-pink-100 shadow-sm">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari No. RM / No. ID / Nama Pasien"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              className="border-none focus-visible:ring-0 placeholder:text-pink-300"
              aria-label="Cari rekam medis"
            />
          </div>
        </div>

        {/* Card / Table */}
        <section className="overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-pink-900" role="table" aria-label="Daftar rekam medis">
              <thead className="bg-pink-50/80 sticky top-0 z-10">
                <tr className="border-b border-pink-100">
                  {["NO. RM", "NO. ID", "NAMA PASIEN", "TANGGAL", "PERAWAT", "DIAGNOSIS", "TINDAKAN", "AKSI"].map((head) => (
                    <th key={head} scope="col" className="px-4 py-3 text-left font-semibold text-pink-800">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: Math.max(pagination.limit, 5) }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-b last:border-b-0">
                      {Array.from({ length: 8 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 max-w-40 rounded-md bg-pink-100 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-pink-600">Tidak ada data rekam medis</td>
                  </tr>
                ) : (
                  rows.map((row, idx) => (
                    <tr key={row.medicalRecordNumber || row.patientNumber || idx} className={`border-b last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-pink-50/40"} hover:bg-pink-100/60 transition-colors`}>
                      <td className="px-4 py-3 align-top">{getNoRm(row)}</td>
                      <td className="px-4 py-3 align-top">{getNoId(row)}</td>
                      <td className="px-4 py-3 font-medium align-top">{getNama(row)}</td>
                      <td className="px-4 py-3 align-top">{getTanggal(row)}</td>
                      <td className="px-4 py-3 align-top">{currentUserName}</td>
                      <td className="px-4 py-3 align-top"> <Badge variant="secondary" className="font-normal text-sm">{getDiagnosis(row)}</Badge></td>
                      <td className="px-4 py-3 align-top">{getTindakan(row)}</td>
                      <td className="px-4 py-3 align-top">
                        <Button
                            size="sm"
                            onClick={() => openDetail(row)}
                            className="flex items-center gap-1 bg-linear-to-r from-pink-400 to-pink-500 text-white hover:opacity-90 transition"
                          >
                            <Eye className="h-4 w-4" />
                               Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-pink-50/30">
            <div className="text-sm text-pink-700">
              <span className="font-medium">{pagination.total || rows.length || 0}</span> rekam medis — {pageLabel}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => gotoPage(1)} disabled={page <= 1} aria-label="Halaman pertama" className={`p-2 rounded-md border text-sm ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}>
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button onClick={() => gotoPage(page - 1)} disabled={page <= 1} aria-label="Sebelumnya" className={`p-2 rounded-md border text-sm ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <nav aria-label="Paginasi" className="flex items-center gap-1">
                {getPageNumbers().map((p, i) =>
                  p === "ellipsis" ? (
                    <span key={`ell-${i}`} className="px-2 text-pink-400">…</span>
                  ) : (
                    <button key={`pg-${p}`} onClick={() => gotoPage(p as number)} aria-current={page === p ? "true" : undefined} className={`w-9 h-9 rounded-md text-sm font-medium border flex items-center justify-center focus:outline-none ${page === p ? "bg-pink-600 text-white border-pink-600 shadow" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}>
                      {p}
                    </button>
                  )
                )}
              </nav>

              <button onClick={() => gotoPage(page + 1)} disabled={page >= totalPages} aria-label="Selanjutnya" className={`p-2 rounded-md border text-sm ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button onClick={() => gotoPage(totalPages)} disabled={page >= totalPages} aria-label="Halaman terakhir" className={`p-2 rounded-md border text-sm ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}>
                <ChevronsRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 ml-2">
                <label htmlFor="goto-medrec" className="sr-only">Lompat ke halaman</label>
                <input id="goto-medrec" type="number" min={1} max={totalPages || 1} placeholder="Go" onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = Number((e.target as HTMLInputElement).value);
                    if (!isNaN(v)) gotoPage(v);
                  }
                }} className="w-16 px-2 py-1 rounded-md border border-pink-100 bg-white text-sm text-pink-700 focus:outline-none" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="h-10" />
    </div>
  );
}
