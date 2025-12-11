"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import DoctorNavbar from "@/components/ui/navbardr";
import { treatmentService } from "@/services/treatment.service";
import { serviceService } from "@/services/service.service";
import { useToast } from "@/hooks/use-toast";

interface TambahTreatmentProps {
  params: { id: string };
}

export default function TambahTreatmentPage({ params }: TambahTreatmentProps) {
  const router = useRouter();
  const visitId = params.id;
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [visitData, setVisitData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    serviceId: "",
    toothNumber: "",
    diagnosis: "",
    treatmentNotes: "",
    quantity: 1,
    discount: 0
  });

  useEffect(() => {
    fetchVisitData();
    fetchServices();
  }, []);

  const fetchVisitData = async () => {
    try {
      const response = await treatmentService.getVisitWithTreatments(visitId);
      setVisitData(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengambil data kunjungan",
        variant: "destructive"
      });
    }
  };

  const fetchServices = async () => {
    try {
      const response = await serviceService.getServices();
      setServices(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengambil data layanan",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serviceId) {
      toast({
        title: "Error",
        description: "Pilih layanan terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await treatmentService.createTreatment({
        visitId,
        patientId: visitData.patient.id,
        serviceId: formData.serviceId,
        toothNumber: formData.toothNumber || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatmentNotes: formData.treatmentNotes || undefined,
        quantity: formData.quantity,
        discount: formData.discount
      });

      toast({
        title: "Sukses",
        description: "Treatment berhasil ditambahkan"
      });

      router.push(`/dashboard/dokter/pasien/detail/${visitId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal menambahkan treatment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" || name === "discount" ? Number(value) : value
    }));
  };

  if (!visitData) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/dokter/pasien/detail/${visitId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-pink-900">Tambah Treatment</h1>
            <p className="text-sm text-pink-600">
              Pasien: {visitData.patient.fullName} ({visitData.patient.patientNumber})
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-pink-600 text-white">
            <CardTitle>Form Treatment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceId">Layanan *</Label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                >
                  <option value="">Pilih Layanan</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName} - Rp {service.basePrice.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toothNumber">Nomor Gigi</Label>
                <Input
                  id="toothNumber"
                  name="toothNumber"
                  value={formData.toothNumber}
                  onChange={handleChange}
                  placeholder="Contoh: 11, 21, 31"
                  className="border-pink-200 focus:ring-pink-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Masukkan diagnosis"
                  className="border-pink-200 focus:ring-pink-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentNotes">Catatan Treatment</Label>
                <Textarea
                  id="treatmentNotes"
                  name="treatmentNotes"
                  value={formData.treatmentNotes}
                  onChange={handleChange}
                  placeholder="Masukkan catatan treatment"
                  rows={4}
                  className="border-pink-200 focus:ring-pink-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="border-pink-200 focus:ring-pink-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Diskon (Rp)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={handleChange}
                    className="border-pink-200 focus:ring-pink-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan Treatment
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}