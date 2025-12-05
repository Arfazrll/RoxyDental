"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Bell,
  User,
  ChevronDown,
  Calendar,
  FileText,
  Users,
  MapPin,
  Settings,
  LogOut,
  LayoutDashboard,
  Stethoscope,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ======================
  // **NOTIFIKASI PERAWAT**
  // ======================
  const notifications = [
    {
      title: "Pasien Masuk Antrian",
      desc: "Pasien Budi Santoso masuk antrian pemeriksaan",
      time: "2 menit lalu",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Butuh Tindakan",
      desc: "dr. Sinta meminta persiapan alat untuk pasien Lina",
      time: "15 menit lalu",
      icon: <Stethoscope className="w-5 h-5 text-pink-600" />,
      bg: "bg-pink-100",
    },
    {
      title: "Update Jadwal",
      desc: "Jadwal hari ini diperbarui oleh admin klinik",
      time: "1 jam lalu",
      icon: <Calendar className="w-5 h-5 text-green-600" />,
      bg: "bg-green-100",
    },
  ];

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <>
      <nav className="bg-[#E91E63] text-white px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <Image src="/images/pink.png" alt="Logo POLADC" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-bold text-xl tracking-wide">POLADC</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">
          {/* NOTIFICATION */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="p-2 rounded-lg hover:bg-white/10 relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold">Notifikasi</h3>
                  <Badge className="text-yellow-700">3 Baru</Badge>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.bg}`}>
                        {n.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{n.title}</h4>
                        <p className="text-xs mt-1">{n.desc}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg"
            >
              <span className="text-sm font-medium">Suster Nabila</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#E91E63]" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                {/* PROFILE HEADER */}
                <div className="p-4 border-b border-gray-200 flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Suster Nabila Putri</h4>
                    <p className="text-sm text-gray-500">Perawat</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>Klinik Soso Dental</span>
                    </div>
                  </div>
                </div>

                {/* MENU PERAWAT */}
                <div className="py-2">
                  <DropdownItem
                    href="/dashboard/perawat/mainpr"
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    text="Dashboard"
                    active={pathname === "/dashboard/perawat/mainpr"}
                  />
                  <DropdownItem
                    href="/dashboard/perawat/akunpr"
                    icon={<User className="w-5 h-5" />}
                    text="Profil"
                    active={pathname === "/dashboard/perawat/akunpr/profilpr"}
                  />
                  <DropdownItem
                    href="/dashboard/perawat/pasienpr/daftar-pasien"
                    icon={<Users className="w-5 h-5" />}
                    text="Daftar Pasien"
                    active={pathname === "/dashboard/perawat/pasienpr/daftar-pasien"}
                  />
                  <DropdownItem
                    href="/dashboard/perawat/kalenderpr"
                    icon={<Calendar className="w-5 h-5" />}
                    text="Kalender"
                    active={pathname === "/dashboard/perawat/kalenderpr"}
                  />
                  <DropdownItem
                    href="/dashboard/perawat/profilpr/akunpr"
                    icon={<Settings className="w-5 h-5" />}
                    text="Pengaturan"
                    active={pathname === "/dashboard/perawat/profilpr/akunpr"}
                  />
                </div>

                {/* LOGOUT */}
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-pink-600 hover:bg-pink-50 rounded-md mx-2 my-1"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl animate-scaleFade">
            <h3 className="text-lg font-bold text-pink-600">Konfirmasi Logout</h3>
            <p className="text-sm text-pink-700 mt-2">Yakin ingin keluar dari akun ini?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-pink-300 text-pink-600 hover:bg-pink-100"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-scaleFade {
          animation: scaleFade 0.25s ease-out forwards;
        }
        @keyframes scaleFade {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}

function DropdownItem({ href, icon, text, danger, active }: any) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-md mx-2 my-1 transition
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : active
            ? "bg-pink-100 text-pink-600 font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );
}
