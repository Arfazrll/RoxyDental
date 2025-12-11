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
import { useToast } from "@/hooks/use-toast";

interface EditTreatmentProps {
  params: { 
    visitId: string;
    treatmentId: string;
  };
}

export default function EditTreatmentPage({ params }: EditTreatmentProps) {
  const router = useRouter();
  const { visitId, treatmentId } = params;
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [treatment, setTreatment] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    toothNumber: "",
    diagnosis: "",
    treatmentNotes: "",
    quantity: 1,
    discount: 0
  });

  useEffect(() => {
    fetchTreatment();
  }, []);

  const fetchTreatment = async () => {
    try {
      const response = await treatmentService.getTreatmentById(treatmentId);
      const data = response.data;
      setTreatment(data);
      setFormData({
        toothNumber: data.toothNumber || "",
        diagnosis: data.diagnosis || "",
        treatmentNotes: data.treatmentNotes || "",
        quantity: data.quantity,
        discount: data.discount
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal mengambil data treatment",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await treatmentService.updateTreatment(treatmentId, {
        toothNumber: formData.toothNumber || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatmentNotes: formData.treatmentNotes || undefined,
        quantity: formData.quantity,
        discount: formData.discount
      });

      toast({
        title: "Sukses",
        description: "Treatment berhasil diupdate"
      });

      router.push(`/dashboard/dokter/pasien/detail/${visitId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Gagal mengupdate treatment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" || name === "discount" ? Number(value) : value
    }));
  };

  if (!treatment) {
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
            <h1 className="text-2xl font-bold text-pink-900">Edit Treatment</h1>
            <p className="text-sm text-pink-600">
              {treatment.service.serviceName} - {treatment.patient.fullName}
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-pink-600 text-white">
            <CardTitle>Form Edit Treatment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Layanan</Label>
                <Input
                  value={treatment.service.serviceName}
                  disabled
                  className="bg-gray-100"
                />
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
                      Simpan Perubahan
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