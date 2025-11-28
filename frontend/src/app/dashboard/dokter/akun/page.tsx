"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorNavbar from "@/components/ui/navbardr";

import {
  CreditCard,
  Briefcase,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  ArrowRight,
  BadgeCheck
} from "lucide-react";

export default function MedicalStaffProfile() {
  return (
    <div className="min-h-screen w-full bg-[#FFE6EE]">
      <DoctorNavbar />

      <div className="px-10 py-10 w-full">
        <h1 className="text-3xl font-bold text-[#D6336C] mb-1">Profil Tenaga Medis</h1>
        <p className="text-[#E85A88] mb-6">
          Informasi Akun & Status Praktik Anda di Klinik Sehat
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ======================= */}
          {/* INFORMASI PROFIL */}
          {/* ======================= */}
          <Card className="rounded-2xl overflow-hidden shadow-lg border-0 bg-white">
            <div className="bg-[#FF8FB3] px-6 py-5">
              <h2 className="text-white text-xl font-bold">INFORMASI PROFIL</h2>
            </div>

            <CardContent className="p-6">
              {/* FOTO + IDENTITAS */}
              <div className="flex items-start gap-6 mb-8 mt-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src="/avatar-placeholder.jpg"
                      alt="avatar"
                      width={140}
                      height={140}
                      className="object-cover"
                    />
                  </div>

                  {/* STATUS AKTIF */}
                  <span className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>

                {/* NAMA + ROLE */}
                <div className="flex-1 mt-2">
                  <h3 className="text-2xl font-bold text-[#C2185B] mb-1">
                    drg. Kartika Yusriya Dinanti
                  </h3>
                  <p className="text-[#EB5A88] mb-4">Dokter Gigi</p>
                </div>
              </div>

              {/* DATA PROFIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="ID Karyawan" value="DKT-2024-001234" icon="id" />
                <InfoItem label="No. STR" value="1234567890123456567" icon="badge" />
                <InfoItem label="No. SIP" value="503/SIP/DPMSPT/2024" icon="file" />
                <InfoItem label="Nomor Telepon" value="+62 812-3456-7890" icon="phone" />
                <InfoItem label="Email" value="kartika.yusriya@roxydental.com" icon="mail" />
                <InfoItem label="Lokasi Praktik" value="RoxyDental - Jakarta Pusat" icon="map" />
                <InfoItem label="Bergabung Sejak" value="15 Januari 2024" icon="calendar" />
              </div>
            </CardContent>
          </Card>

          {/* ======================= */}
          {/* JADWAL & LISENSI */}
          {/* ======================= */}
          <Card className="rounded-2xl overflow-hidden shadow-lg border-0 bg-white">
            <div className="bg-[#F2C94C] px-6 py-5">
              <h2 className="text-yellow-900 text-xl font-bold">JADWAL & LISENSI</h2>
            </div>

            <CardContent className="p-6">
              {/* STATUS PRAKTIK */}
             <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-t-0 border-yellow-100 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-yellow-900 font-semibold">Status Praktik</span>
                  <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    AKTIF
                  </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">Sedang Bertugas</p>
                </div>
              </div>

              {/* MASA BERLAKU SIP */}
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-yellow-100">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-yellow-900 font-semibold mb-1">Masa Berlaku SIP</p>
                    <p className="text-lg font-bold text-yellow-600">
                      15 Jan 2024 - 15 Jan 2027
                    </p>
                  </div>
                </div>
              </div>

              {/* SISA MASA BERLAKU */}
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-yellow-100">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-yellow-900 font-semibold mb-2">Sisa Masa Berlaku</p>

                    <div className="bg-yellow-100 rounded-full h-3 overflow-hidden mb-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full"
                        style={{ width: "75%" }}
                      />
                    </div>

                    <p className="text-right text-yellow-900 font-bold">2.5 tahun</p>
                  </div>
                </div>
              </div>

              {/* JADWAL */}
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-yellow-100">
                <p className="text-yellow-900 font-semibold mb-3">Jadwal Praktik Minggu Ini:</p>

                <ScheduleItem day="Senin - Rabu" time="08:00 - 16:00" />
                <ScheduleItem day="Kamis" time="13:00 - 21:00" />
                <ScheduleItem day="Jumat" time="08:00 - 12:00" />
              </div>

              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                Lihat Jadwal Lengkap
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-[#EB5A88] mt-8">
          © 2025 RoxyDental. Platform untuk klinik gigi modern
        </p>
      </div>
    </div>
  );
}

/* ============================
   COMPONENT KECIL
=============================== */

function InfoItem({ label, value, icon }) {
  const iconMap = {
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
      <div>
        <p className="text-pink-400 text-xs font-semibold tracking-wide">{label}</p>
        <p className="text-[#C2185B] font-bold text-base mt-1">{value}</p>
      </div>

      <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center shadow-lg">
        {iconMap[icon]}
      </div>
    </div>
  );
}


function ScheduleItem({ day, time }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-yellow-100 last:border-0">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="text-yellow-900 font-medium">
          {day}: {time}
        </span>
      </div>
    </div>
  );
}
