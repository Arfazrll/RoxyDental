"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, User, Lock, Bell, CreditCard } from "lucide-react";

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
  onLogout?: () => void; // Opsional, panggil fungsi logout eksternal
}

export default function SettingsSidebar({ activeMenu, setActiveMenu, onLogout }: Props) {
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: "informasi-akun", label: "Informasi Akun", subtitle: "Data profil & akun", icon: User, path: "/dashboard/dokter/profil/akun" },
    { id: "ganti-password", label: "Ganti Password", subtitle: "Keamanan akun", icon: Lock, path: "/dashboard/dokter/profil/password" },
    { id: "notifikasi", label: "Notifikasi", subtitle: "Pengaturan pemberitahuan", icon: Bell, path: "/dashboard/dokter/profil/notifikasi" },
    { id: "tentang", label: "Tentang", subtitle: "Info aplikasi", icon: CreditCard, path: "/dashboard/dokter/profil/setting" },
  ];

  const handleMenuClick = (item: MenuItem) => {
    setActiveMenu(item.id); // highlight
    router.push(item.path);  // navigasi
  };

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    if (onLogout) {
      onLogout(); // panggil fungsi logout eksternal, misal clear token
    } else {
      // Default redirect ke login jika onLogout tidak diberikan
      router.push("/login");
    }
  };

  return (
    <>
      {/* Sidebar Card */}
      <Card className="shadow-md bg-pink-50 border border-pink-200">
        <CardContent className="p-5">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h2 className="font-bold text-pink-900 text-lg mb-2">Menu Pengaturan</h2>
            <p className="text-sm text-pink-600">Pilih kategori pengaturan</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                  activeMenu === item.id
                    ? "bg-pink-600 text-white shadow-md"
                    : "bg-white text-pink-900 hover:bg-pink-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div>
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className={`text-xs ${activeMenu === item.id ? "text-pink-100" : "text-pink-600"}`}>
                    {item.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Logout Section */}
          <div className="mt-8 pt-5 border-t border-pink-200">
            <button
              onClick={() => setLogoutDialogOpen(true)}
              className="flex items-center gap-2 text-pink-700 hover:text-pink-900 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Keluar</span>
            </button>
            <p className="text-xs text-pink-600 mt-2">
              Dapatkan informasi Anda secara lengkap untuk mengakses berbagai fitur
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Apakah Anda yakin ingin keluar?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(false)}
              className="px-8 border-pink-300 text-pink-700"
            >
              Batal
            </Button>
            <Button
              onClick={handleLogout}
              className="px-8 bg-pink-600 hover:bg-pink-700"
            >
              Ya, Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
