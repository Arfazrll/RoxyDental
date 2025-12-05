"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DoctorNavbar from "@/components/ui/navbarpr";
import { 
  User, MapPin, Calendar, Users, Clock, FileText, GraduationCap, 
  Briefcase, Award 
} from "lucide-react";

// ======== Tipe Data ========
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  accountType: string;
  specialization: string;
  strNumber?: string;
  status?: string;
  photoUrl: string;
}

// ======== Hook Dummy useProfile ========
export function useProfile(): { profileData: ProfileData } {
  const profileData: ProfileData = {
    name: "Nabila",
    email: "nabila@example.com",
    phone: "+62 812-9876-5432",
    accountType: "Perawat",
    specialization: "Perawat Klinik",
    photoUrl: "", // kosong kalau belum ada foto
  };

  return { profileData };
}

// ======== Component Dashboard ========
export default function DoctorDashboard() {
  const { profileData } = useProfile(); // ambil data dokter

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

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <Card className="bg-linear-to-br from-pink-50 to-pink-25 border-none shadow-md">
          <CardContent className="p-6 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-white rounded-2xl border-4 border-yellow-400 overflow-hidden flex items-center justify-center shadow-sm">
                {profileData.photoUrl ? (
                  <img src={profileData.photoUrl} alt="Profile" className="w-32 h-32 object-cover rounded-2xl" />
                ) : (
                  <User className="w-20 h-20 text-gray-300" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600 mt-1 text-sm">{profileData.accountType}</p>

                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>Tempat Praktik</span>
                </div>

                <Badge className="mt-2 bg-pink-100 text-pink-700 border-none w-fit">
                  {profileData.specialization}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Kunjungan */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Kunjungan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Card className="shadow-xl border-none bg-white hover:shadow-2xl hover:scale-105 transition-transform duration-300">
              <CardContent className="p-3 min-h-20 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1 mt-4">Total Kunjungan</p>
                    <p className="text-2xl font-bold text-gray-900">48</p>
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
                    <p className="text-2xl font-bold text-gray-900">12</p>
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
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                  <div className="w-10 h-10 bg-[#FFF0F5] rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-5 h-5 text-[#E91E63]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Schedule + Qualifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule */}
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
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Kualifikasi Tenaga Medis</h3>
            </div>

            <Card className="shadow-md border-none bg-white h-full flex-1">
              <CardContent className="px-6 py-6 h-full flex flex-col space-y-8">
                {/* Pendidikan */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 mt-4">
                    <GraduationCap className="w-5 h-5 text-pink-600" />
                    Pendidikan
                  </h4>
                  <p className="text-sm text-gray-800">{profileData.accountType}</p>
                  <p className="text-xs text-gray-500">{profileData.specialization}</p>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
