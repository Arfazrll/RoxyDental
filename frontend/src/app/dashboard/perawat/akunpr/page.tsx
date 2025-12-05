"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorNavbar from "@/components/ui/navbarpr";
import {
  User, CreditCard, Phone, Mail, MapPin, Calendar, FileText, ArrowRight, BadgeCheck,
} from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import Link from "next/link";

// 🟣 Component Info Item
function InfoItem({ label, value, icon }: { label: string; value: string; icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    id: <CreditCard className="w-5 h-5 text-pink-600" />,
    badge: <BadgeCheck className="w-5 h-5 text-pink-600" />,
    file: <FileText className="w-5 h-5 text-pink-600" />,
    phone: <Phone className="w-5 h-5 text-pink-600" />,
    mail: <Mail className="w-5 h-5 text-pink-600" />,
    map: <MapPin className="w-5 h-5 text-pink-600" />,
    calendar: <Calendar className="w-5 h-5 text-pink-600" />,
  };

  return (
    <div className="flex items-center justify-between bg-pink-50 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div className="min-w-0">
        <p className="text-pink-400 text-xs font-semibold truncate">{label}</p>
        <p className="text-[#C2185B] font-bold text-base mt-1 truncate">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center shadow-md">
        {iconMap[icon]}
      </div>
    </div>
  );
}

// 🟡 Jadwal item
function ScheduleItem({ day, time }: { day: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-yellow-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-yellow-900 font-medium">{day}: {time}</span>
      </div>
    </div>
  );
}

// MAIN PAGE
export default function MedicalStaffDashboard() {
  const { profileData } = useProfile();

  const scheduleData = [
    { day: "Senin - Rabu", time: "08:00 - 16:00" },
    { day: "Kamis", time: "13:00 - 21:00" },
    { day: "Jumat", time: "08:00 - 12:00" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FFF6F8] flex flex-col">
      <DoctorNavbar />

      {/* MAIN */}
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 w-full">

        {/* STATUS AKUN */}
        <section className="mb-8">
<Card className="rounded-xl bg-white shadow-md w-full">
  <CardContent className="p-6">

    {/* GRID: Tengah lebih besar, tapi tidak terlalu mepet kanan */}
    <div className="grid grid-cols-[1fr_4.5fr_1.5fr] gap-6 items-start w-full">

      {/* STATUS AKUN */}
      <div className="flex flex-col w-full">
        <p className="text-sm text-gray-500 mt-6">Status Akun</p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-semibold text-green-700">Aktif</span>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md">
            Terverifikasi
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-1">
          Akun dan lisensi telah terverifikasi
        </p>
      </div>

      {/* KELENGKAPAN PROFIL – dibuat lebih panjang & tidak terlalu mepet kanan */}
      <div className="flex flex-col w-full pr-4">
        <p className="text-sm text-gray-500 mt-6">Kelengkapan Profil</p>

        <div className="w-full mt-2">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 rounded-full"
              style={{ width: "95%" }}
            ></div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          95% — Hampir Sempurna
        </p>
      </div>

      {/* STATUS SHIFT */}
      <div className="flex flex-col w-full">
        <p className="text-sm text-gray-500 mt-4">Status Shift</p>

        <div className="bg-pink-50 p-4 rounded-lg mt-2 w-full">
          <p className="text-sm font-semibold text-pink-700">On Duty</p>
          <p className="text-xs text-gray-500">
            08:00 - 16:00 · 3 jam 20 menit tersisa
          </p>
        </div>
      </div>

    </div>
  </CardContent>
</Card>

        </section>

        {/* GRID 2 KOLOM */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* PROFIL */}
          <Card className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col">
            <div className="bg-pink-600 px-6 py-4">
              <h3 className="text-white font-semibold tracking-wide">INFORMASI PROFIL</h3>
            </div>

            <CardContent className="p-6">

              {/* FOTO + NAMA — FOTO KIRI, TEKS KANAN */}
            <div className="flex items-center gap-6 mb-8 mt-4">

              {/* FOTO */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                {profileData?.photoUrl ? (
                  <img src={profileData.photoUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pink-100">
                    <User className="w-12 h-12 text-pink-400" />
                  </div>
                )}
              </div>

              {/* TEXT */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData?.name || "—"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {profileData?.accountType || "Tenaga Medis"}
                </p>
              </div>

            </div>


              {/* GRID INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InfoItem label="ID Karyawan" value={profileData?.strNumber || "-"} icon="id" />
                <InfoItem label="No. SIP" value="505/SIP/EXAMPLE/2024" icon="file" />
                <InfoItem label="No. STR" value={profileData?.strNumber || "-"} icon="badge" />
                <InfoItem label="Email" value={profileData?.email || "-"} icon="mail" />
                <InfoItem label="Nomor Telepon" value={profileData?.phone || "-"} icon="phone" />
                <InfoItem label="Lokasi Praktik" value={profileData?.workplace || "-"} icon="map" />
                <InfoItem label="Bergabung Sejak" value={profileData?.joinDate || "-"} icon="calendar" />

              </div>
            </CardContent>
          </Card>

          {/* JADWAL */}
          <Card className="rounded-2xl overflow-hidden shadow-lg bg-white flex flex-col">
            <div className="bg-yellow-400 px-6 py-4">
              <h3 className="text-yellow-900 font-semibold tracking-wide">JADWAL & LISENSI</h3>
            </div>

            <CardContent className="p-6 flex flex-col justify-between">

              <div className="space-y-6 mt-5">
                <div>
                  <p className="text-sm text-yellow-900 font-semibold">Status Praktik</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">AKTIF</span>
                    <span className="text-sm text-gray-500">Sedang Bertugas</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-yellow-900 font-semibold">Masa Berlaku SIP</p>
                  <p className="text-yellow-700 font-bold mt-1">15 Jan 2024 - 15 Jan 2027</p>
                </div>

                <div>
                  <p className="text-sm text-yellow-900 font-semibold">Sisa Masa Berlaku</p>
                  <div className="w-full bg-yellow-50 h-3 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-yellow-500" style={{ width: "75%" }} />
                  </div>
                  <p className="text-xs text-right text-yellow-800 mt-1">2.5 tahun</p>
                </div>

                <div>
                  <p className="text-sm text-yellow-900 font-semibold">Jadwal Praktik Minggu Ini</p>
                  <div className="mt-3 space-y-2">
                    {scheduleData.map((s) => (
                      <ScheduleItem key={s.day} day={s.day} time={s.time} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/dashboard/perawat/kalenderpr">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                    Lihat Jadwal Lengkap
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

            </CardContent>
          </Card>
        </section>

        <footer className="mt-10">
          <p className="text-center text-sm text-gray-400">
            © 2025 RoxyDental — Platform Klinik Gigi Modern
          </p>
        </footer>

      </main>
    </div>
  );
}
