"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DoctorNavbar from "@/components/ui/navbarpr";
import AuthGuard from "@/components/AuthGuard";
import { 
  User, MapPin, Calendar, Users, Clock, FileText, GraduationCap, 
  Briefcase, Award, Loader2 
} from "lucide-react";
import { dashboardNurseService, NurseDashboardData } from '@/services/dashboard-nurse.service';
import { nurseProfileService, ProfileCompletion, ShiftStatus } from '@/services/nurse-profile.service';

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<NurseDashboardData | null>(null);
  const [completion, setCompletion] = useState<ProfileCompletion | null>(null);
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, completionRes, shiftRes] = await Promise.all([
        dashboardNurseService.getNurseSummary(),
        nurseProfileService.getProfileCompletion(),
        nurseProfileService.getCurrentShiftStatus()
      ]);
      
      setDashboardData(dashboardRes.data);
      setCompletion(completionRes.data);
      setShiftStatus(shiftRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data dashboard');
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { totalVisits, todayVisits, monthlyVisits, profile, schedules } = dashboardData;

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="p-6 space-y-6">
        <Card className="bg-linear-to-br from-pink-50 to-pink-25 border-none shadow-md">
          <CardContent className="p-6 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-yellow-400 overflow-hidden flex items-center justify-center shadow-sm">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Profile" className="w-32 h-32 object-cover rounded-2xl" />
                ) : (
                  <User className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                <p className="text-gray-600 mt-1 text-sm">Perawat</p>

                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>POLADC</span>
                </div>

                <Badge className="mt-2 bg-pink-100 text-pink-700 border-none w-fit">
                  {profile.specialization || 'Perawat Klinik'}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {completion && (
                <div className="flex items-center gap-2 mt-1"></div>
              )}

              {shiftStatus && shiftStatus.status === 'On Duty' && (
                <Badge className="bg-green-100 text-green-800 border-none">
                  <Clock className="w-3 h-3 mr-1" />
                  {shiftStatus.status}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Kunjungan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Card className="shadow-xl border-none bg-white hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-3 min-h-20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 mt-4">Total Kunjungan</p>
                    <p className="text-2xl font-bold text-gray-900">{totalVisits}</p>
                  </div>
                  <div className="w-10 h-10 bg-[#FFF0F5] rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-[#E91E63]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-none bg-white hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-3 min-h-20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 mt-4">Kunjungan Hari ini</p>
                    <p className="text-2xl font-bold text-gray-900">{todayVisits}</p>
                  </div>
                  <div className="w-10 h-10 bg-[#FFF0F5] rounded-lg flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5 text-[#E91E63]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-none bg-white hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-3 min-h-20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 mt-4">Kunjungan Bulan ini</p>
                    <p className="text-2xl font-bold text-gray-900">{monthlyVisits}</p>
                  </div>
                  <div className="w-10 h-10 bg-[#FFF0F5] rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-[#E91E63]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Jadwal Praktik</h3>
            </div>

            <Card className="shadow-md border-none bg-white h-full flex-1">
              <CardContent className="px-6 py-6 h-full flex flex-col">
                <div className="overflow-x-auto flex-1 mt-3">
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
                      {schedules.map((schedule, i) => (
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

          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Kualifikasi Tenaga Medis</h3>
            </div>

            <Card className="shadow-md border-none bg-white h-full flex-1">
              <CardContent className="px-6 py-6 h-full flex flex-col space-y-8">
                {/* Pendidikan - Data dari Database */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 mt-4">
                    <GraduationCap className="w-5 h-5 text-pink-600" />
                    Pendidikan
                  </h4>
                  <p className="text-sm text-gray-800">{profile.education || '-'}</p>
                </div>

                {/* Pengalaman - Data dari Database */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-pink-600" />
                    Pengalaman
                  </h4>
                  <p className="text-sm text-gray-800">{profile.experience || '-'}</p>
                </div>

                {/* Spesialisasi - Data dari Database (1 badge saja) */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-pink-600" />
                    Spesialisasi
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {profile.specialization ? (
                      <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-4 py-1 shadow-sm font-medium">
                        {profile.specialization}
                      </Badge>
                    ) : (
                      <p className="text-xs text-gray-500">Belum ada spesialisasi</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  return (
    <AuthGuard requiredRole="PERAWAT">
      <DashboardContent />
    </AuthGuard>
  );
}