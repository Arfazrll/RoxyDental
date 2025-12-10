"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, User, Lock, Bell, FileText, Loader2, AlertCircle } from "lucide-react";
import { nurseProfileService, NurseProfile } from "@/services/nurse-profile.service";

interface MenuItem {
  id: string;
  label: string;
  subtitle: string;
  icon: any;
  path: string;
}

interface Props {
  activeMenu: string;
  setActiveMenu: (menuId: string) => void;
}

export default function SettingsSidebar({ activeMenu, setActiveMenu }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [profile, setProfile] = useState<NurseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { 
      id: "informasi-akun", 
      label: "Informasi Akun", 
      subtitle: "Data profil & akun", 
      icon: User, 
      path: "/dashboard/perawat/profilpr/akunpr" 
    },
    { 
      id: "ganti-password", 
      label: "Ganti Password", 
      subtitle: "Keamanan akun", 
      icon: Lock, 
      path: "/dashboard/perawat/profilpr/passwordpr" 
    },
    { 
      id: "notifikasi", 
      label: "Notifikasi", 
      subtitle: "Pengaturan pemberitahuan", 
      icon: Bell, 
      path: "/dashboard/perawat/profilpr/notifikasipr" 
    },
    { 
      id: "tentang", 
      label: "Tentang Aplikasi", 
      subtitle: "Info & versi aplikasi", 
      icon: FileText, 
      path: "/dashboard/perawat/profilpr/settingpr" 
    },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await nurseProfileService.getProfile();
      setProfile(response.data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    setActiveMenu(item.id);
    router.push(item.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setLogoutDialogOpen(false);
    router.push('/');
  };

  const isMenuActive = (item: MenuItem) => {
    return pathname === item.path || activeMenu === item.id;
  };

  return (
    <>
      <Card className="shadow-md bg-pink-50 border border-pink-200">
        <CardContent className="p-5">
          {/* Profile Summary */}
          <div className="mt-4 mb-6 pb-4 border-b border-pink-200">
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-pink-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-pink-200 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-pink-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Gagal memuat profil</span>
              </div>
            ) : profile ? (
              <div className="flex items-center gap-3">
                {profile.profilePhoto ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-300">
                    <img 
                      src={profile.profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-pink-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-pink-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-pink-900 text-sm">
                    {profile.fullName}
                  </h3>
                  <p className="text-xs text-pink-600">
                    {profile.role === 'PERAWAT' ? 'Perawat' : 'Tenaga Medis'}
                  </p>
                  {profile.specialization && (
                    <p className="text-xs text-pink-500 mt-0.5">
                      {profile.specialization}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="font-bold text-pink-900 text-lg mb-1">Pengaturan</h2>
            <p className="text-sm text-pink-600">Kelola akun dan preferensi</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isMenuActive(item);

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    active
                      ? "bg-pink-600 text-white shadow-md"
                      : "bg-white text-pink-900 hover:bg-pink-100"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className={`text-xs truncate ${
                      active ? "text-pink-100" : "text-pink-600"
                    }`}>
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Logout Section */}
          <div className="mt-8 pt-5 border-t border-pink-200">
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="flex items-center gap-2 text-pink-700 hover:text-pink-900 font-medium transition w-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Keluar dari Akun</span>
            </button>
            <p className="text-xs text-pink-600 mt-2">
              Anda akan dialihkan ke halaman login
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Konfirmasi Logout
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-pink-700 text-sm">
              Apakah Anda yakin ingin keluar dari akun ini?
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setLogoutDialogOpen(false)}
              variant="outline"
              className="px-8 border-pink-300 text-pink-700 hover:bg-pink-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleLogout}
              className="px-8 bg-pink-600 hover:bg-pink-700 text-white"
            >
              Ya, Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}