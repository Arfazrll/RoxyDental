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
import { visitService, Visit } from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { authService } from "@/services/auth.service";

/**
 * QueuePage.tsx
 * FE-upgrade: pagination (FE controlled), debounce search, skeletons, improved pagination UI
 * NOTE: BE tidak diubah. fetchQueue mencoba beberapa bentuk response agar kompatibel.
 */

export default function QueuePage() {
  const pathname = usePathname();
  const { toast } = useToast();

  // search + debounce
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<number | undefined>(undefined);

  // data
  const [queues, setQueues] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);

  // pagination (FE-controlled)
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  const [doctor, setDoctor] = useState<any | null>(null); // dokter yang login

  const tabs = useMemo(
    () => [
      { label: "Daftar Pasien", value: "daftar-pasien", href: "/dashboard/dokter/pasien/daftar-pasien" },
      { label: "Daftar Antrian", value: "daftar-antrian", href: "/dashboard/dokter/pasien/antrian" },
      { label: "Rekam Medis", value: "rekam-medis", href: "/dashboard/dokter/pasien/rekam-medis" }
    ],
    []
  );

  // Ambil user yang sedang login (role: DOKTER)
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.role === "DOKTER") {
      setDoctor(currentUser);
    }
  }, []);

  // FETCH function (compatible dengan beberapa bentuk response)
  const fetchQueue = async (p = page, lim = limit, q = searchQuery) => {
    setLoading(true);
    try {
      // asumsi BE menerima page, limit, query; jika tidak, visitService harus menangani sendiri.
      const res = await (visitService as any).getDoctorQueue(p, lim, q);
      // fleksibel: cek beberapa struktur response
      if (res?.data) {
        // bentuk { data: { visits: [...], pagination: { ... } } }
        const maybeVisits = res.data.visits || res.data.items || res.data.queue || res.data;
        const maybePagination = res.data.pagination || res.data.meta || res.data.paging;
        if (Array.isArray(maybeVisits)) {
          setQueues(maybeVisits);
        } else if (Array.isArray(res.data)) {
          setQueues(res.data);
        } else {
          // fallback: jika res itself is array
          setQueues(Array.isArray(res) ? res : []);
        }

        if (maybePagination) {
          setPagination({
            total: maybePagination.total || maybePagination.count || maybePagination.totalItems || 0,
            page: maybePagination.page || p,
            limit: maybePagination.limit || lim,
            totalPages: maybePagination.totalPages || maybePagination.pages || Math.max(1, Math.ceil((maybePagination.total || 0) / lim)),
          });
        } else {
          // jika BE tidak mengembalikan pagination, coba infer dari response
          setPagination((prev) => ({
            ...prev,
            page: p,
            limit: lim,
            total: Array.isArray(maybeVisits) ? maybeVisits.length : prev.total,
            totalPages: 1,
          }));
        }
      } else if (Array.isArray(res)) {
        setQueues(res);
        setPagination({ total: res.length, page: p, limit: lim, totalPages: 1 });
      } else {
        setQueues([]);
        setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
      }
    } catch (error: any) {
      console.error("Error fetching queue:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal mengambil data antrian",
        variant: "destructive",
      });
      setQueues([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  // debounce rawQuery -> searchQuery
  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setSearchQuery(rawQuery.trim());
      setPage(1); // reset ke halaman 1 saat search berubah
    }, 300);

    return () => {
      window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawQuery]);

  // fetch when searchQuery / page / limit changes
  useEffect(() => {
    fetchQueue(page, limit, searchQuery);
    // polling setiap 10 detik untuk update antrian
    const interval = setInterval(() => fetchQueue(page, limit, searchQuery), 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page, limit]);

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      WAITING: { label: "Menunggu", class: "bg-yellow-100 text-yellow-800" },
      IN_PROGRESS: {
        label: "Sedang Dilayani",
        class: "bg-blue-100 text-blue-800",
      },
      COMPLETED: { label: "Selesai", class: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Dibatalkan", class: "bg-red-100 text-red-800" },
    };
    return statusMap[status] || {
      label: status,
      class: "bg-gray-100 text-gray-800",
    };
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

  // pagination helpers (mirip PatientListPage)
  const getPageNumbers = () => {
    const total = pagination.totalPages || 1;
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
    const clamped = Math.max(1, Math.min(p, pagination.totalPages || 1));
    setPage(clamped);
    const el = document.getElementById("queue-table-top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const pageLabel = `Halaman ${page} dari ${pagination.totalPages || 1}`;

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

        {/* Search */}
        <div className="max-w-md">
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

        {/* Card / Table */}
        <section className="overflow-hidden rounded-2xl bg-white border border-pink-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-pink-900" role="table" aria-label="Daftar antrian">
              <thead className="bg-pink-50/80 sticky top-0 z-10">
                <tr className="border-b border-pink-100">
                  {[
                    "NO. ANTRIAN",
                    "NO. PASIEN",
                    "NAMA PASIEN",
                    "JAM KUNJUNGAN",
                    "DOKTER",
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
                  // Loading skeleton rows
                  Array.from({ length: Math.max(limit, 5) }).map((_, i) => (
                    <tr key={`sk-${i}`} className="border-b last:border-b-0">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 max-w-32 rounded-md bg-pink-100 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : queues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-pink-600">
                      Tidak ada antrian
                    </td>
                  </tr>
                ) : (
                  queues.map((queue: any, idx: number) => {
                    const statusInfo = getStatusBadge(queue.status);
                    return (
                      <tr
                        key={queue.id || queue.queueNumber || idx}
                        className={`border-b last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-pink-50/40"} hover:bg-pink-100/60 transition-colors`}
                      >
                        <td className="px-4 py-3 align-top">{queue.queueNumber || "-"}</td>
                        <td className="px-4 py-3 align-top">{queue.patient?.patientNumber || "-"}</td>
                        <td className="px-4 py-3 font-medium align-top">{queue.patient?.fullName || "-"}</td>
                        <td className="px-4 py-3 align-top">{formatTime(queue.visitDate)}</td>
                        <td className="px-4 py-3 align-top">{queue.doctor?.fullName || doctor?.fullName || "-"}</td>
                        <td className="px-4 py-3 align-top">{queue.chiefComplaint || "-"}</td>
                        <td className="px-4 py-3 align-top">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-pink-50/30">
            <div className="text-sm text-pink-700">
              <span className="font-medium">{pagination.total || 0}</span> antrian — {pageLabel}
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
                disabled={page >= (pagination.totalPages || 1)}
                aria-label="Selanjutnya"
                className={`p-2 rounded-md border text-sm ${page >= (pagination.totalPages || 1) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last */}
              <button
                onClick={() => gotoPage(pagination.totalPages || 1)}
                disabled={page >= (pagination.totalPages || 1)}
                aria-label="Halaman terakhir"
                className={`p-2 rounded-md border text-sm ${page >= (pagination.totalPages || 1) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border-pink-200 text-pink-600 hover:bg-pink-100"}`}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>

              {/* Jump to page */}
              <div className="flex items-center gap-2 ml-2">
                <label htmlFor="goto-queue" className="sr-only">Lompat ke halaman</label>
                <input
                  id="goto-queue"
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
