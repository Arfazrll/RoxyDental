"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, Award } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";
import {
  Bell,
  User,
  ChevronDown,
  Calendar,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  MapPin,
  Stethoscope,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function DoctorDashboard() {
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const scheduleData = [
    { day: "Minggu", start: "16:00", end: "21:00", location: "Soso Dental Kemang" },
    { day: "Senin", start: "16:00", end: "21:00", location: "Soso Dental Kemang" },
    { day: "Selasa", start: "-", end: "-", location: "-" },
    { day: "Rabu", start: "-", end: "-", location: "-" },
    { day: "Kamis", start: "15:00", end: "15:00", location: "Soso Dental Kemang" },
    { day: "Jumat", start: "-", end: "-", location: "-" },
    { day: "Sabtu", start: "-", end: "-", location: "-" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="p-6">
        {/* Profile Card */}
        <Card className="mb-6 bg-gradient-to-br from-pink-50 to-pink-25 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-yellow-400 overflow-hidden flex items-center justify-center shadow-sm">
                  <User className="w-20 h-20 text-gray-300" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    drg. Kartika Yusriya Dinanti
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <span className="text-sm">Dokter Gigi</span>
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>Tempat Praktik</span>
                  </div>

                  <Badge className="mt-2 bg-pink-100 text-pink-700 border-none hover:bg-pink-100 w-fit">
                    Soso Dental Kemang
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPredictionModal(true)}
                  className="bg-[#E91E63] hover:bg-[#C2185B] text-white shadow-md"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Prediksi
                </Button>
                <Button
                  onClick={() => setShowAnalysisModal(true)}
                  className="bg-[#E91E63] hover:bg-[#C2185B] text-white shadow-md"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analisis Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Kunjungan */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Kunjungan</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Kunjungan */}
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-5 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Kunjungan</p>
                    <p className="text-2xl font-bold text-gray-900">48</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#E91E63]" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">↑ 18% vs bulan lalu</p>
              </CardContent>
            </Card>

            {/* Pasien Baru */}
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-5 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pasien Baru</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#E91E63]" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">↑ 36% vs bulan lalu</p>
              </CardContent>
            </Card>

            {/* Rating Pasien */}
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-5 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating Pasien</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#E91E63]" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">↑ Sangat Baik</p>
              </CardContent>
            </Card>
          </div>
        </div>

{/* SECTION: Schedule + Qualifications */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Schedule */}
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <Clock className="w-5 h-5 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Jadwal Praktik</h3>
    </div>

    
    <Card className="shadow-md border-none bg-white h-full flex-1">
      <CardContent className="px-6 py-6 h-full flex flex-col">
          <div className="mt-5"></div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Hari</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Jam Awal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Jam Akhir</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tempat Praktik</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">{schedule.day}</td>
                  <td className="py-3 px-4 text-gray-700">{schedule.start}</td>
                  <td className="py-3 px-4 text-gray-700">{schedule.end}</td>
                  <td className="py-3 px-4 text-gray-700">{schedule.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Qualifications */}
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
        <FileText className="w-5 h-5 text-pink-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Kualifikasi Tenaga Medis</h3>
    </div>

    <Card className="shadow-md border-none bg-white h-full flex-1">
      <CardContent className="px-6 py-6 h-full flex flex-col">
        <div className="space-y-8 flex-1">

          {/* Pendidikan */}
        <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-pink-600" />
                Pendidikan
            </h4>
            <p className="text-sm text-gray-800">drg - Dokter Gigi</p>
            <p className="text-xs text-gray-500">Universitas Indonesia, 2018</p>
        </div>


          {/* Pengalaman */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-pink-600" />
              Pengalaman
            </h4>
            <p className="text-sm text-gray-800">5+ tahun praktik</p>
            <p className="text-xs text-gray-500">Spesialis Perawatan Gigi</p>
          </div>

          {/* Spesialisasi */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-600" />
              Spesialisasi
            </h4>

            <div className="flex flex-wrap gap-3">
              <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-4 py-1 shadow-sm font-medium">
                Kedokteran Gigi Umum
              </Badge>
              <Badge className="bg-green-50 text-green-700 border border-green-200 rounded-full px-4 py-1 shadow-sm font-medium">
                Bedah Gigi
              </Badge>
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-1 shadow-sm font-medium">
                Perawatan Saluran Akar
              </Badge>
              <Badge className="bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-4 py-1 shadow-sm font-medium">
                Ortodonti
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>


{/* Prediction Modal */}
{showPredictionModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <Card className="w-full max-w-2xl shadow-2xl border-none flex flex-col">

      <CardHeader className="bg-[#E91E63] text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Prediksi AI
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white flex-1 overflow-y-auto max-h-[80vh]">
        <div className="space-y-4 mt-4">

          {/* Prediksi Kunjungan */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">
                Prediksi Kunjungan Pasien
              </span>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-700 mb-2">Minggu Depan</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-green-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-green-700">+6 pasien</span>
              </div>
            </div>
          </div>

          {/* Dominan */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-3">
              Indikasi yang Paling Dominan
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Scaling</span>
                <span className="font-semibold text-pink-600">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tambal Gigi</span>
                <span className="font-semibold text-pink-600">32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cabut Gigi</span>
                <span className="font-semibold text-pink-600">18%</span>
              </div>
            </div>
          </div>

          {/* Rekomendasi */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Rekomendasi AI</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Pertimbangkan untuk menambah slot lebih minggu depan</li>
              <li>Siapkan alat scaling perlu ditambah minggu depan</li>
              <li>Promosi perawatan ortodonti bisa meningkatkan jumlah kunjungan</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={() => setShowPredictionModal(false)}
          className="w-full mt-4 bg-[#E91E63] hover:bg-[#C2185B] text-white"
        >
          Tutup
        </Button>
      </CardContent>
    </Card>
  </div>
)}


{/* Analysis Modal */}
{showAnalysisModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    {/* Card lebih lebar */}
    <Card className="w-full max-w-xl shadow-2xl border-none">

      <CardHeader className="bg-[#E91E63] text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analisis Data
        </CardTitle>
      </CardHeader>

      {/* CardContent scrollable */}
      <CardContent className="p-6 bg-white max-h-[75vh] overflow-y-auto">

        <div className="space-y-4 mt-4">

          {/* Card atas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
              <p className="text-sm text-gray-600">Total Kunjungan</p>
              <p className="text-3xl font-bold text-blue-600">48</p>
              <p className="text-xs text-gray-500 mt-1">↑ 18%</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <p className="text-sm text-gray-600">Pasien Baru</p>
              <p className="text-3xl font-bold text-green-600">12</p>
              <p className="text-xs text-gray-500 mt-1">↑ 36%</p>
            </div>
          </div>

          {/* Statistik Bulan */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="font-semibold text-gray-900 mb-3">Statistik Bulan Ini</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Rata-rata kunjungan per hari</span>
                <span className="font-semibold">4.2</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Rating kepuasan</span>
                <span className="font-semibold text-yellow-600">4.8 ★</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Total revenue</span>
                <span className="font-semibold text-green-600">Rp 48.000.000</span>
              </div>
            </div>
          </div>

          {/* Tren */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-gray-900 mb-3">Tren Kunjungan Per Hari</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Senin</span>
                  <span className="font-semibold text-purple-600">8 pasien</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Selasa</span>
                  <span className="font-semibold text-purple-600">5 pasien</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Jumat</span>
                  <span className="font-semibold text-purple-600">3 pasien</span>
                </div>
                <div className="w-full bg-purple-200 h-2 rounded-full">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        <Button
          onClick={() => setShowAnalysisModal(false)}
          className="w-full mt-4 bg-[#E91E63] hover:bg-[#C2185B] text-white"
        >
          Tutup
        </Button>

      </CardContent>
    </Card>
  </div>
)}
      </div>
    </div>
  );
}   