"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbarpr";
import {
  visitService,
  Visit,
  VisitStatusType,
} from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

/**
 * QueuePage (Perawat) — UI aligned with doctor's polished page
 * - BE calls unchanged: visitService.getNurseQueue(searchQuery) & visitService.updateVisitStatus(...)
 * - Debounce search (FE)
 * - Client-side pagination (since BE signature is unchanged)
 * - Skeleton loader, sticky header, accessible pagination, rows-per-page select
 * - Polling preserved (10s) to refresh queue
 */

export default function QueuePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // search + debounce
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  // data from BE (full list)
  const [queuesFull, setQueuesFull] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);

  // client-side pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10); // rows per page
  const totalPages = Math.max(1, Math.ceil((queuesFull?.length || 0) / limit));

  const tabs = [
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
  ];

  // Fetch from BE — KEEP signature unchanged (only searchQuery passed)
  const fetchQueueFromBE = async (q: string) => {
    setLoading(true);
    try {
      const data = await visitService.getNurseQueue(q);
      setQueuesFull(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error fetching queue:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal mengambil data antrian",
        variant: "destructive",
      });
      setQueuesFull([]);
    } finally {
      setLoading(false);
      setPage(1); // reset page when new data fetched
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

  // initial fetch & whenever searchQuery changes
  useEffect(() => {
    fetchQueueFromBE(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // polling every 10s (preserve behavior), but still respect current searchQuery
  useEffect(() => {
    const interval = setInterval(() => fetchQueueFromBE(searchQuery), 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleStatusChange = async (
    visitId: string,
    newStatus: VisitStatusType
  ) => {
    try {
      await visitService.updateVisitStatus(visitId, newStatus);
      toast({
        title: "Berhasil",
        description: "Status berhasil diubah",
      });
      fetchQueueFromBE(searchQuery);
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal mengubah status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: VisitStatusType) => {
    switch (status) {
      case "WAITING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border border-green-300";
      case "CANCELLED":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date?: string) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  // visible slice for current page
  const visibleQueues = useMemo(() => {
    const start = (page - 1) * limit;
    return queuesFull.slice(start, start + limit);
  }, [queuesFull, page, limit]);

  // pagination helpers with ellipsis
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
    const el = document.getElementById("queue-table-top");
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
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition
                  ${isActive
                    ? "bg-linear-to-r from-pink-600 to-pink-500 text-white shadow-md"
                    : "bg-white text-pink-700 border border-pink-100 hover:bg-pink-50"}`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mt-7">
          <h1 id="queue-table-top" className="text-2xl font-bold text-pink-900">
            Daftar Antrian
          </h1>
        </div>

        {/* Search + Add */}
       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-md">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-pink-100 shadow-sm">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari antrian (nama / no. pasien / no. antrian)..."
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              className="border-none focus-visible:ring-0 placeholder:text-pink-300"
              aria-label="Cari antrian"
            />
          </div>
        </div>

        {/* Button */}
        <Button
          className="w-full sm:w-auto bg-pink-600 text-white hover:bg-pink-700"
          onClick={() =>
            router.push("/dashboard/perawat/pasienpr/antrian/tambah-antrian")
          }
        >
          + Tambah Antrian
        </Button>
      </div>


        {/* Table Card */}
        <section className="overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-pink-900" role="table" aria-label="Daftar antrian">
              <thead className="bg-pink-50/80 sticky top-0 z-10">
                <tr className="border-b border-pink-100">
                  {[
                    "NO. ANTRIAN",
                    "NO. PASIEN",
                    "NAMA PASIEN",
                    "JAM",
                    "TINDAKAN",
                    "STATUS",
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
                ) : visibleQueues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-pink-600">
                      Tidak ada antrian
                    </td>
                  </tr>
                ) : (
                  visibleQueues.map((q: Visit, idx: number) => (
                    <tr
                      key={q.id || idx}
                      className={`border-b last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-pink-50/40"} hover:bg-pink-100/60 transition-colors`}
                    >
                      <td className="px-4 py-3 align-top">{q.queueNumber || "-"}</td>
                      <td className="px-4 py-3 align-top">{q.patient?.patientNumber || "-"}</td>
                      <td className="px-4 py-3 font-medium align-top">{q.patient?.fullName || "-"}</td>
                      <td className="px-4 py-3 align-top">{formatTime(q.visitDate)}</td>
                      <td className="px-4 py-3 align-top">{q.chiefComplaint || "-"}</td>
                      <td className="px-4 py-3 align-top">
                        <select
                          value={q.status}
                          onChange={(e) => handleStatusChange(q.id, e.target.value as VisitStatusType)}
                          className={`px-3 py-1 rounded-lg text-sm ${getStatusColor(q.status as VisitStatusType)}`}
                        >
                          <option value="WAITING">Menunggu</option>
                          <option value="IN_PROGRESS">Sedang Dilayani</option>
                          <option value="COMPLETED">Selesai</option>
                          <option value="CANCELLED">Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination / Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-pink-50/30">
            <div className="text-sm text-pink-700">
              <span className="font-medium">{queuesFull.length || 0}</span> antrian — {pageLabel}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => gotoPage(1)}
                disabled={page <= 1}
                aria-label="Halaman pertama"
                className={`p-2 rounded-md border text-sm ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => gotoPage(page - 1)}
                disabled={page <= 1}
                aria-label="Sebelumnya"
                className={`p-2 rounded-md border text-sm ${page <= 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

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

              <button
                onClick={() => gotoPage(page + 1)}
                disabled={page >= totalPages}
                aria-label="Selanjutnya"
                className={`p-2 rounded-md border text-sm ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => gotoPage(totalPages)}
                disabled={page >= totalPages}
                aria-label="Halaman terakhir"
                className={`p-2 rounded-md border text-sm ${page >= totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 ml-2">
                <label htmlFor="goto-queue" className="sr-only">Lompat ke halaman</label>
                <input
                  id="goto-queue"
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
