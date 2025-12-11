"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, FileText, Activity } from "lucide-react";
import Link from "next/link";
import NurseNavbar from "@/components/ui/navbarpr";
import { treatmentService } from "@/services/treatment.service";
import { useToast } from "@/hooks/use-toast";

interface DetailProps {
  params: { id: string };
}

export default function MedicalRecordDetailPage({ params }: DetailProps) {
  const visitId = params.id;
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [visitId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await treatmentService.getVisitWithTreatments(visitId);
      setData(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengambil data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <NurseNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <NurseNavbar />
        <div className="p-6 text-center">
          <p className="text-pink-700 font-semibold text-lg">Data tidak ditemukan</p>
          <Link href="/dashboard/perawat/pasienpr/rekam-medis">
            <Button className="mt-4">Kembali</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <NurseNavbar />
      
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/perawat/pasienpr/rekam-medis">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-pink-900">{data.visitNumber}</h1>
              <p className="text-sm text-pink-600">
                {new Date(data.visitDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="bg-pink-600 text-white rounded-t-md">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Pasien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white text-sm pt-4">
              <div>
                <p className="text-xs text-gray-400">NO. PASIEN</p>
                <p className="font-semibold text-pink-700 mt-1">{data.patient.patientNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">NAMA LENGKAP</p>
                <p className="font-medium mt-1">{data.patient.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">UMUR</p>
                  <p className="font-medium mt-1">{calculateAge(data.patient.dateOfBirth)} tahun</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">JENIS KELAMIN</p>
                  <p className="font-medium mt-1">{data.patient.gender === 'L' ? 'Pria' : 'Wanita'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">NO. TELEPON</p>
                <p className="font-medium mt-1">{data.patient.phone}</p>
              </div>
              {data.patient.email && (
                <div>
                  <p className="text-xs text-gray-400">EMAIL</p>
                  <p className="truncate font-medium mt-1">{data.patient.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-yellow-400/40 rounded-t-md">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informasi Kunjungan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white text-sm pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">NO. ANTRIAN</p>
                    <p className="font-medium mt-1">{data.queueNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">PERAWAT</p>
                    <p className="font-medium mt-1">{data.nurse.fullName}</p>
                  </div>
                </div>
                {data.chiefComplaint && (
                  <div>
                    <p className="text-xs text-gray-400">KELUHAN UTAMA</p>
                    <p className="font-medium mt-1">{data.chiefComplaint}</p>
                  </div>
                )}
                {data.bloodPressure && (
                  <div>
                    <p className="text-xs text-gray-400">TEKANAN DARAH</p>
                    <p className="font-medium mt-1">{data.bloodPressure}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-pink-600 text-white rounded-t-md">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Riwayat Treatment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white text-sm pt-4">
                {data.treatments && data.treatments.length > 0 ? (
                  data.treatments.map((treatment: any, idx: number) => (
                    <div key={idx} className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-pink-700">{treatment.service.serviceName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Oleh: {treatment.performer.fullName}
                          </p>
                        </div>
                        <Badge variant="secondary">{treatment.service.category}</Badge>
                      </div>
                      {treatment.diagnosis && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">DIAGNOSIS</p>
                          <p className="font-medium mt-1">{treatment.diagnosis}</p>
                        </div>
                      )}
                      {treatment.treatmentNotes && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">CATATAN</p>
                          <p className="mt-1">{treatment.treatmentNotes}</p>
                        </div>
                      )}
                      {treatment.toothNumber && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400">NO. GIGI</p>
                          <p className="font-medium mt-1">{treatment.toothNumber}</p>
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-pink-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold text-pink-700">
                            Rp {treatment.subtotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">Belum ada treatment</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}