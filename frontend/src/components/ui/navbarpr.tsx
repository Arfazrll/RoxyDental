"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  ChevronDown,
  Calendar,
  Users,
  MapPin,
  FileText,
  Settings,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { nurseProfileService, NurseProfile } from "@/services/nurse-profile.service";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await nurseProfileService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  const getDisplayName = () => {
    if (!profile) return 'Loading...';
    const words = profile.fullName.split(' ');
    return words.length > 2 ? `${words[0]} ${words[1]}` : profile.fullName;
  };

  return (
    <>
      <nav className="bg-[#E91E63] text-white px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <Image src="/images/pink.png" alt="Logo POLADC" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-bold text-xl tracking-wide">POLADC</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  {profile?.profilePhoto ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                      <img 
                        src={profile.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#E91E63]" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>

            {showProfile && profile && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex gap-3">
                  {profile.profilePhoto ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-200">
                      <img 
                        src={profile.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-pink-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">{profile.fullName}</h4>
                    <p className="text-xs text-gray-500">
                      {profile.role === 'PERAWAT' ? 'Perawat' : 'Tenaga Medis'}
                    </p>
                    {profile.specialization && (
                      <p className="text-xs text-pink-600 mt-0.5">{profile.specialization}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>POLADC</span>
                    </div>
                  </div>
                </div>

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
                    active={pathname === "/dashboard/perawat/akunpr"}
                  />
                  <DropdownItem
                    href="/dashboard/perawat/pasienpr/daftar-pasien"
                    icon={<Users className="w-5 h-5" />}
                    text="Daftar Pasien"
                    active={pathname.includes("/dashboard/perawat/pasienpr")}
                  />
                  <DropdownItem
                    href="/dashboard/perawat/kalenderpr"
                    icon={<Calendar className="w-5 h-5" />}
                    text="Kalender"
                    active={pathname === "/dashboard/perawat/kalenderpr"}
                  />

                   <DropdownItem
                    href="/dashboard/perawat/pembayaran"
                    icon={<FileText className="w-5 h-5" />}
                    text="Pembayaran"
                    active={pathname.startsWith("/dashboard/perawat/pembayaran")}
                  />

                  <DropdownItem
                    href="/dashboard/perawat/profilpr/akunpr"
                    icon={<Settings className="w-5 h-5" />}
                    text="Pengaturan"
                    active={pathname.includes("/dashboard/perawat/profilpr")}
                  />
                </div>

                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-pink-600 hover:bg-pink-50 rounded-md mx-2 my-1 transition"
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

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-80 shadow-2xl animate-scaleFade">
            <h3 className="text-lg font-bold text-pink-600">Konfirmasi Logout</h3>
            <p className="text-sm text-pink-700 mt-2">Yakin ingin keluar dari akun ini?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-pink-300 text-pink-600 hover:bg-pink-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
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

function DropdownItem({ href, icon, text, active }: {
  href: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-md mx-2 my-1 transition ${
        active
          ? "bg-pink-100 text-pink-600 font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );
}