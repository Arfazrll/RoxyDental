'use client';

import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { DashboardData } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Briefcase, Award, MapPin, FileText, BarChart3, TrendingUp } from 'lucide-react';
import DoctorNavbar from '@/components/ui/navbardr';
import PredictionChart from '@/components/PredictionChart';
import TikaChatbot from '@/components/TikaChatbot';
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
        <Card className="mb-6 bg-linear-to-br from-pink-50 to-pink-25 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-yellow-400 overflow-hidden flex items-center justify-center shadow-sm">
                  {profile?.profilePhoto ? (
                    <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-20 h-20 text-gray-300" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.fullName || 'drg. Nama Dokter'}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <span className="text-sm">{profile?.specialization || 'Dokter Gigi'}</span>
                  </p>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>Tempat Praktik</span>
                  </div>

                  <Badge className="mt-2 bg-pink-100 text-pink-700 border-none hover:bg-pink-100 w-fit">
                    {practiceStatus === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
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

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Kunjungan</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-5 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Kunjungan</p>
                    <p className="text-2xl font-bold text-gray-900">{totalVisits || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#E91E63]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-5 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Kunjungan Hari Ini</p>
                    <p className="text-2xl font-bold text-gray-900">{todayVisits || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#E91E63]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-5 min-h-[140px] flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Kunjungan Bulan Ini</p>
                    <p className="text-2xl font-bold text-gray-900">{monthlyVisits || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFF0F5] rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-[#E91E63]" />
                  </div>
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl shadow-2xl border-none flex flex-col">
              <CardHeader className="bg-[#E91E63] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Prediksi AI
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-white hover:bg-white/20"
                    onClick={() => setShowPredictionModal(false)}
                  >
                    X
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white flex-1 overflow-y-auto max-h-[80vh]">
                <PredictionChart />
              </CardContent>
            </Card>
          </div>
        )}

        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-xl shadow-2xl border-none">
              <CardHeader className="bg-[#E91E63] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analisis Data
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 bg-white max-h-[75vh] overflow-y-auto">
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                      <p className="text-sm text-gray-600">Total Kunjungan</p>
                      <p className="text-3xl font-bold text-blue-600">{totalVisits || 0}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                      <p className="text-sm text-gray-600">Pasien Baru</p>
                      <p className="text-3xl font-bold text-green-600">{todayVisits || 0}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">Statistik Bulan Ini</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Kunjungan bulan ini</span>
                        <span className="font-semibold">{monthlyVisits || 0}</span>
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
      <TikaChatbot />
    </div>
  );
}