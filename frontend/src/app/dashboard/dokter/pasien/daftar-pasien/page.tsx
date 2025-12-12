"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";
import { usePathname, useRouter } from "next/navigation";
import { visitService } from "@/services/visit.service";
import { useToast } from "@/hooks/use-toast";

export default function PatientPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const tabs = [
    { label: "Daftar Pasien", value: "daftar-pasien", href: "/dashboard/dokter/pasien/daftar-pasien" },
    { label: "Daftar Antrian", value: "daftar-antrian", href: "/dashboard/dokter/pasien/antrian" },
    { label: "Rekam Medis", value: "rekam-medis", href: "/dashboard/dokter/pasien/rekam-medis" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchCompletedVisits = async () => {
    setLoading(true);
    try {
      const response = await visitService.getCompletedVisits(currentPage, 10, searchQuery);
      
      if (response.success && response.data) {
        setVisits(response.data.visits || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      } else {
        setVisits([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching completed visits:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengambil data pasien",
        variant: "destructive"
      });
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedVisits();
  }, [currentPage, searchQuery]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#FDDCE7]">
      <DoctorNavbar />
      <div className="p-6 max-w-7xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 w-full">
            <div className="bg-white rounded-xl p-4 border border-pink-200 shadow-sm">
              <h2 className="text-lg font-semibold text-pink-900 mb-3">Daftar Pasien</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-pink-400 h-5 w-5" />
                <Input
                  placeholder="Cari pasien..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 border-pink-300 rounded-lg"
                />
              </div>
              <Button 
                onClick={() => fetchCompletedVisits()}
                className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg"
              >
                Cari
              </Button>
            </div>
          </div>

          <div className="md:col-span-9">
            <div className="bg-white rounded-xl shadow-md border border-pink-200 overflow-x-auto">
              <table className="w-full text-pink-900 min-w-[900px]">
                <thead className="bg-pink-100">
                  <tr>
                    {["NO. PASIEN", "NAMA", "J/K", "TGL. LAHIR (UMUR)", "TGL. KUNJUNGAN", "DIAGNOSIS", "AKSI"].map((h) => (
                      <th key={h} className="text-left px-3 py-3 text-sm font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : visits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-pink-600">
                        Tidak ada data pasien
                      </td>
                    </tr>
                  ) : (
                    visits.map((visit, i) => (
                      <tr key={i} className="border-t border-pink-100 hover:bg-pink-50 transition">
                        <td className="px-3 py-3 whitespace-nowrap">{visit.patient?.patientNumber || '-'}</td>
                        <td className="px-3 py-3">{visit.patient?.fullName || '-'}</td>
                        <td className="px-3 py-3">{visit.patient?.gender === 'L' ? 'Pria' : 'Wanita'}</td>
                        <td className="px-3 py-3">
                          {visit.patient?.dateOfBirth ? 
                            `${new Date(visit.patient.dateOfBirth).toLocaleDateString('id-ID')} (${calculateAge(visit.patient.dateOfBirth)} thn)` 
                            : '-'
                          }
                        </td>
                        <td className="px-3 py-3">{formatDate(visit.visitDate)}</td>
                        <td className="px-3 py-3">
                          {visit.treatments && visit.treatments.length > 0 
                            ? visit.treatments[0].diagnosis || '-'
                            : '-'
                          }
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => router.push(`/dashboard/dokter/pasien/detail/${visit.id}`)}
                            className="p-2 rounded-full hover:bg-pink-200 transition"
                          >
                            <Eye className="h-5 w-5 text-pink-700" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}