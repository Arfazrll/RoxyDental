"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";
import { patientService, PatientWithVisit } from "@/services/patient.service";
import { dashboardService } from "@/services/dashboard.service";
import { useToast } from "@/hooks/use-toast";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<PatientWithVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [currentDoctorName, setCurrentDoctorName] = useState<string>("-");

  const tabs = useMemo(
    () => [
      { label: "Daftar Pasien", value: "daftar-pasien", href: "/dashboard/dokter/pasien/daftar-pasien" },
      { label: "Daftar Antrian", value: "daftar-antrian", href: "/dashboard/dokter/pasien/antrian" },
      { label: "Rekam Medis", value: "rekam-medis", href: "/dashboard/dokter/pasien/rekam-medis" }
    ],
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboardService.getDoctorSummary();
        const name = res?.data?.profile?.fullName;
        if (name) setCurrentDoctorName(name);
      } catch {
        setCurrentDoctorName("-");
      }
    })();
  }, []);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      const response = await patientService.getPatients(currentPage, 20, searchQuery);

      if (response?.success && response?.data) {
        const list = response.data.patients || [];
        const pg = response.data.pagination || {
          total: 0,
          page: currentPage,
          limit: 20,
          totalPages: 0
        };

        setRows(list);
        setPagination(pg);
      } else {
        setRows([]);
        setPagination({ total: 0, page: 1, limit: 20, totalPages: 0 });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengambil data rekam medis",
        variant: "destructive"
      });
      setRows([]);
      setPagination({ total: 0, page: 1, limit: 20, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, [currentPage, searchQuery]);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
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
  const getDiagnosis = (row: PatientWithVisit) => row.medicalHistory || "-";
  const getTindakan = (row: PatientWithVisit) => row.chiefComplaint || row.lastServiceName || "-";

  const openDetail = (row: PatientWithVisit) => {
    const medicalRecordNumber = row.medicalRecordNumber;
    if (medicalRecordNumber) {
      router.push(`/dashboard/dokter/pasien/rekam-medis/${medicalRecordNumber}`);
    } else {
      toast({
        title: "Error",
        description: "Nomor rekam medis tidak ditemukan",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-6 max-w-7xl mx-auto space-y-6">
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

        <h1 className="text-2xl font-bold text-pink-900">Rekam Medis</h1>

        <div className="relative mb-4 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
          <Input
            placeholder="Cari No. RM / No. ID / Nama Pasien"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-12 py-2 rounded-lg border border-pink-200"
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="min-w-full divide-y divide-pink-200">
            <thead className="bg-pink-100 text-pink-900">
              <tr>
                {["NO. RM", "NO. ID", "NAMA PASIEN", "TANGGAL", "DOKTER", "DIAGNOSIS", "TINDAKAN", "AKSI"].map(
                  (head) => (
                    <th key={head} className="px-4 py-3 text-left font-semibold text-sm">
                      {head}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-pink-100 text-pink-900">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-4 text-center text-pink-600">
                    Tidak ada data rekam medis
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-4 py-2">{getNoRm(row)}</td>
                    <td className="px-4 py-2">{getNoId(row)}</td>
                    <td className="px-4 py-2 font-medium">{getNama(row)}</td>
                    <td className="px-4 py-2">{getTanggal(row)}</td>
                    <td className="px-4 py-2">{currentDoctorName}</td>
                    <td className="px-4 py-2">
                      <Badge variant="secondary">{getDiagnosis(row)}</Badge>
                    </td>
                    <td className="px-4 py-2">{getTindakan(row)}</td>
                    <td className="px-4 py-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDetail(row)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <Button
                key={i}
                size="sm"
                className={`px-3 py-1 rounded-full ${
                  currentPage === i + 1 ? "bg-pink-600 text-white" : "border border-pink-200 hover:bg-pink-50"
                }`}
                onClick={() => setCurrentPage(i + 1)}
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