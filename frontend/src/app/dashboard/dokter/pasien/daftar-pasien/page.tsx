"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbardr";
import { patientService } from "@/services/patient.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const LIMIT = 20;

export default function PatientListPage() {
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });

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

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.getPatients(
        page,
        LIMIT,
        searchQuery
      );

      if (res?.data) {
        setPatients(res.data.patients || []);
        setPagination(
          res.data.pagination || {
            total: 0,
            page: 1,
            limit: LIMIT,
            totalPages: 1,
          }
        );
      } else {
        setPatients([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Gagal mengambil data pasien",
        variant: "destructive",
      });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const formatDate = (date: string) => {
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

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`
                  px-6 py-3 rounded-full text-sm font-semibold transition
                  ${
                    isActive
                      ? "bg-pink-600 text-white shadow-lg"
                      : "bg-white text-pink-600 border border-pink-300 hover:bg-pink-50"
                  }
                `}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <h1 className="text-2xl font-bold text-pink-900">
          Daftar Pasien
        </h1>

        {/* Search */}
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-pink-400" />
            <Input
              placeholder="Cari pasien..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="border border-pink-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
          <table className="min-w-full divide-y divide-pink-200 text-pink-900">
            <thead className="bg-pink-100">
              <tr>
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
                    className="px-4 py-3 text-left text-sm font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-pink-600" />
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-pink-600"
                  >
                    Tidak ada data pasien
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-pink-50 transition"
                  >
                    <td className="px-4 py-2">
                      {p.patientNumber || "-"}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {p.fullName || "-"}
                    </td>
                    <td className="px-4 py-2">
                      {p.gender === "L" ? "Pria" : "Wanita"}
                    </td>
                    <td className="px-4 py-2">
                      {p.dateOfBirth
                        ? `${formatDate(p.dateOfBirth)} (${calculateAge(
                            p.dateOfBirth
                          )})`
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {p.lastVisit ? formatDate(p.lastVisit) : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {p.chiefComplaint || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-pink-100">
              <span className="text-sm text-pink-700">
                Halaman {pagination.page} dari{" "}
                {pagination.totalPages}
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-md border border-pink-300 text-pink-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                )
                  .slice(
                    Math.max(0, page - 3),
                    Math.min(pagination.totalPages, page + 2)
                  )
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-md text-sm border
                        ${
                          page === p
                            ? "bg-pink-600 text-white border-pink-600"
                            : "bg-white border-pink-300 text-pink-600 hover:bg-pink-50"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-md border border-pink-300 text-pink-600 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}