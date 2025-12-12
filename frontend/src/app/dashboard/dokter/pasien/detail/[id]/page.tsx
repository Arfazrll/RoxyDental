'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { visitService } from '@/services/visit.service';
import { treatmentService } from '@/services/treatment.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import DoctorNavbar from '@/components/ui/navbardr';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DetailProps {
  params: Promise<{ id: string }>;
}

export default function MedicalRecordDetailPage({ params }: DetailProps) {
  const resolvedParams = use(params);
  const visitId = resolvedParams.id;
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

  useEffect(() => {
    fetchVisitData();
  }, [visitId]);

  const fetchVisitData = async () => {
    try {
      setLoading(true);
      const response = await visitService.getVisitById(visitId);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        throw new Error('Data tidak ditemukan');
      }
    } catch (error: any) {
      console.error('Error fetching visit data:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal memuat data rekam medis',
        variant: 'destructive',
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTreatment = async () => {
    if (!selectedTreatmentId) return;

    try {
      await treatmentService.deleteTreatment(selectedTreatmentId);
      toast({
        title: 'Sukses',
        description: 'Treatment berhasil dihapus',
      });
      setDeleteDialogOpen(false);
      setSelectedTreatmentId(null);
      fetchVisitData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Gagal menghapus treatment',
        variant: 'destructive',
      });
    }
  };

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
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (!data || !data.patient) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-gray-500 mb-4">Data tidak ditemukan</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Detail Rekam Medis</h1>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <Card>
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-600">Informasi Pasien</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">No. Pasien</p>
              <p className="font-semibold">{data.patient?.patientNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-semibold">{data.patient?.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Umur</p>
              <p className="font-semibold">
                {data.patient?.dateOfBirth ? `${calculateAge(data.patient.dateOfBirth)} tahun` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jenis Kelamin</p>
              <p className="font-semibold">
                {data.patient?.gender === 'L' ? 'Laki-laki' : data.patient?.gender === 'P' ? 'Perempuan' : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">No. Telepon</p>
              <p className="font-semibold">{data.patient?.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{data.patient?.email || '-'}</p>
            </div>
            {data.patient?.bloodType && (
              <div>
                <p className="text-sm text-gray-500">Golongan Darah</p>
                <p className="font-semibold">{data.patient.bloodType}</p>
              </div>
            )}
            {data.patient?.allergies && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Alergi</p>
                <p className="font-semibold text-red-600">{data.patient.allergies}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-600">Informasi Kunjungan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">No. Antrian</p>
              <p className="font-semibold">{data.queueNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Perawat</p>
              <p className="font-semibold">{data.nurse?.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Kunjungan</p>
              <p className="font-semibold">{data.visitDate ? formatDate(data.visitDate) : '-'}</p>
            </div>
            {data.bloodPressure && (
              <div>
                <p className="text-sm text-gray-500">Tekanan Darah</p>
                <p className="font-semibold">{data.bloodPressure}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Keluhan Utama</p>
              <p className="font-semibold">{data.chiefComplaint || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-pink-50 flex flex-row items-center justify-between">
            <CardTitle className="text-pink-600">Riwayat Treatment</CardTitle>
            <Button
              onClick={() => router.push(`/dashboard/dokter/pasien/detail/${visitId}/tambah-treatment`)}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Treatment
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {!data.treatments || data.treatments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Belum ada treatment untuk kunjungan ini</p>
            ) : (
              <div className="space-y-4">
                {data.treatments.map((treatment: any) => (
                  <Card key={treatment.id} className="border-l-4 border-l-pink-600">
                    <CardContent className="pt-6">
                      <div className="flex justify-end mb-4 gap-2">
                        <Button
                          onClick={() =>
                            router.push(
                              `/dashboard/dokter/pasien/detail/${visitId}/${treatment.id}/edit-treatment/${treatment.id}`
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedTreatmentId(treatment.id);
                            setDeleteDialogOpen(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Tanggal Treatment</p>
                          <p className="font-semibold">
                            {treatment.createdAt ? formatDate(treatment.createdAt) : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dokter</p>
                          <p className="font-semibold">{treatment.performer?.fullName || '-'}</p>
                        </div>
                        {treatment.service && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Layanan</p>
                            <p className="font-semibold">{treatment.service.serviceName}</p>
                          </div>
                        )}
                        {treatment.toothNumber && (
                          <div>
                            <p className="text-sm text-gray-500">Nomor Gigi</p>
                            <p className="font-semibold">{treatment.toothNumber}</p>
                          </div>
                        )}
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Diagnosis</p>
                          <p className="font-semibold">{treatment.diagnosis || '-'}</p>
                        </div>
                        {treatment.treatmentNotes && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Catatan Treatment</p>
                            <p className="font-semibold">{treatment.treatmentNotes}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Jumlah</p>
                          <p className="font-semibold">{treatment.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="font-semibold">{formatCurrency(treatment.subtotal)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus treatment ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTreatment} className="bg-red-600 hover:bg-red-700">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}