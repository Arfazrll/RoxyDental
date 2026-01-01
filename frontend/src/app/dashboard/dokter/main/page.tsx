'use client';

import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardData } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, Award, MapPin, FileText, BarChart3, TrendingUp } from 'lucide-react';
import DoctorNavbar from '@/components/ui/navbardr';
import PredictionModal from "@/components/ui/PredictionModal";
import TikaChatbot from '@/components/ui/TikaChatbot';
import {
  User,
  Calendar,
  Users,
  Activity,
  Clock,
} from 'lucide-react';

export default function DoctorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDoctorSummary();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  const { totalVisits, todayVisits, monthlyVisits, profile, schedules, practiceStatus } = dashboardData || {};

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="p-6">
     <Card className="mb-6 bg-linear-to-br from-pink-50 to-pink-25 border-none shadow-md rounded-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Foto Dokter */}
          <div className="w-40 h-40 md:w-44 md:h-44 bg-white rounded-2xl border-4 border-yellow-400 overflow-hidden flex items-center justify-center shadow-sm shrink-0 mt-6">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-24 h-24 text-gray-300" />
            )}
          </div>

          {/* Info Dokter */}
          <div className="flex flex-col justify-start flex-1 mt-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.fullName || 'drg. Nama Dokter'}
            </h2>

            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <span className="text-sm">{profile?.specialization || 'Dokter Gigi'}</span>
            </p>

            <div className="flex items-center gap-2 mt-3 text-pink-500">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">
            Tempat Praktek
          </span>
        </div>

    {/* Badge Lokasi */}
    <Badge
      className="
        mt-2
        inline-flex items-center
        max-w-fit
        px-3 py-1
        rounded-full
        text-xs font-medium
        bg-pink-100 text-pink-600
        whitespace-nowrap
      "
    >
      Rocydental
    </Badge>

    {/* Tombol Prediksi */}
    <div className="mt-3">
      <Button
        onClick={() => setShowPredictionModal(true)}
        className="
          inline-flex items-center
          h-8 px-4
          rounded-full
          bg-pink-600 hover:bg-pink-700
          text-sm font-semibold text-white
          shadow-md
          transition-colors
        "
      >
        <Activity className="w-4 h-4 mr-2" />
        Prediksi
      </Button>
    </div>
    </div>

        </div>
      </CardContent>
    </Card>


        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Kunjungan</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Kunjungan */}
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow rounded-lg">
              <CardContent className="p-5 min-h-[140px] flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Kunjungan</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVisits || 0}</p>
                </div>
                <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#E91E63]" />
                </div>
              </CardContent>
            </Card>

            {/* Kunjungan Hari Ini */}
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow rounded-lg">
              <CardContent className="p-5 min-h-[140px] flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kunjungan Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{todayVisits || 0}</p>
                </div>
                <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#E91E63]" />
                </div>
              </CardContent>
            </Card>

            {/* Kunjungan Bulan Ini */}
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow rounded-lg">
              <CardContent className="p-5 min-h-[140px] flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Kunjungan Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{monthlyVisits || 0}</p>
                </div>
                <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#E91E63]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      {schedules && schedules.length > 0 ? (
                        schedules.map((schedule, i) => (
                          <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-700">{schedule.day}</td>
                            <td className="py-3 px-4 text-gray-700">{schedule.start}</td>
                            <td className="py-3 px-4 text-gray-700">{schedule.end}</td>
                            <td className="py-3 px-4 text-gray-700">{schedule.location}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-gray-500">
                            Belum ada jadwal praktik minggu ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

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
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-pink-600" />
                      Pendidikan
                    </h4>
                    <p className="text-sm text-gray-800">{profile?.education || 'Belum diisi'}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-pink-600" />
                      Pengalaman
                    </h4>
                    <p className="text-sm text-gray-800">{profile?.experience || 'Belum diisi'}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-600" />
                      Spesialisasi
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {profile?.specialization ? (
                        <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-4 py-1 shadow-sm font-medium">
                          {profile.specialization}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">Belum diisi</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      {showPredictionModal && (
        <PredictionModal onClose={() => setShowPredictionModal(false)} />
      )}

      </div>

            <TikaChatbot />
    </div>
  );
}