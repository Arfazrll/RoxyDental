"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import DoctorNavbar from "@/components/ui/navbarpr";
import {
  patientService,
  PatientWithVisit,
} from "@/services/patient.service";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const PAGE_SIZE = 20;

export default function PatientListPage() {
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientWithVisit[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientService.getPatients(
        page,
        PAGE_SIZE,
        searchQuery
      );

      if (response.success && response.data) {
        setPatients(response.data.patients || []);
        setTotalPages(response.data.totalPages || 1);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // reset ke halaman 1 saat search
    fetchPatients();
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={`
                  px-6 py-3 rounded-full
                  text-sm font-semibold
                  transition-all
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
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-sm"
        >
          <Search className="w-5 h-5 text-pink-400" />
          <Input
            placeholder="Cari pasien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-pink-200"
          />
          <Button className="bg-pink-600 text-white hover:bg-pink-700">
            Cari
          </Button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white border border-pink-100">
          <table className="min-w-full divide-y divide-pink-200 text-pink-900">
            <thead className="bg-pink-100">
              <tr>
                {[
                  "NO. PASIEN",
                  "NAMA PASIEN",
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
                    className="hover:bg-pink-50 transition-colors"
                  >
                    <td className="px-4 py-3">{p.patientNumber || "-"}</td>
                    <td className="px-4 py-3 font-medium">{p.fullName}</td>
                    <td className="px-4 py-3">
                      {p.gender === "L" ? "Pria" : "Wanita"}
                    </td>
                    <td className="px-4 py-3">
                      {p.dateOfBirth
                        ? `${formatDate(p.dateOfBirth)} (${calculateAge(
                            p.dateOfBirth
                          )} th)`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {p.lastVisit ? formatDate(p.lastVisit) : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {p.chiefComplaint?.trim() || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-pink-700">
            Halaman {page} dari {totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}