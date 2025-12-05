"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Lock, Bell, CreditCard, ExternalLink, FileText, Scale, Mail } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import SettingsSidebar from "@/components/ui/SettingsSidebarpr";

export default function SettingsAbout() {
  const [activeMenu, setActiveMenu] = useState("tentang");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const aboutInfo = {
    appName: "Sistem Manajemen Rumah Sakit",
    version: "Gold",
    build: "3876-SK-25",
    releaseDate: "29 Oktober 2025",
    edition: "Enterprise",
  };

  const documents = [
    { name: "Pusat Bantuan", icon: FileText },
    { name: "Diskomentar API", icon: FileText },
    { name: "Laporkan Bug", icon: FileText },
    { name: "Hubungi Support", icon: Mail },
  ];

  const legal = [
    { name: "Syarat & Ketentuan", icon: Scale },
    { name: "Kebijakan Privasi", icon: Scale },
    { name: "Lisensi Open Source", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div className="pt-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SettingsSidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            onLogout={() => setLogoutDialogOpen(true)}
          />

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Info Aplikasi */}
            <Card className="shadow-md rounded-lg">
              <CardHeader className="bg-white px-6 py-4 rounded-t-lg">
                <h2 className="text-xl font-bold text-pink-900">Informasi Aplikasi</h2>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {Object.entries(aboutInfo).map(([key, value], idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-pink-700 font-medium">
                      {key === "appName" ? "Nama Aplikasi:" : key.charAt(0).toUpperCase() + key.slice(1) + ":"}
                    </span>
                    <span className="text-pink-900 font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Dokumen & Bantuan */}
            <Card className="shadow-md rounded-lg">
              <CardHeader className="bg-white px-6 py-4 rounded-t-lg">
                <h2 className="text-lg font-bold text-pink-900">Dokumen & Bantuan</h2>
                <p className="text-sm text-pink-600 mt-1">Dapatkan bantuan dan dokumentasi</p>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {documents.map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-pink-50 rounded-lg border border-gray-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-pink-600" />
                        <span className="text-pink-900 font-medium">{doc.name}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-pink-400" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Legal */}
            <Card className="shadow-md rounded-lg">
              <CardHeader className="bg-white px-6 py-4 rounded-t-lg">
                <h2 className="text-lg font-bold text-pink-900">Legal</h2>
                <p className="text-sm text-pink-600 mt-1">Informasi hukum dan kebijakan</p>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {legal.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-pink-50 rounded-lg border border-gray-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-pink-600" />
                        <span className="text-pink-900 font-medium">{item.name}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-pink-400" />
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Pernyataan */}
            <Card className="shadow-md rounded-lg bg-pink-600 text-white">
              <CardContent className="p-6 text-center space-y-2">
                <CardTitle className="text-lg font-bold">Pernyataan</CardTitle>
                <CardDescription className="font-bold text-xl leading-relaxed">
                  Terima kasih telah menggunakan aplikasi kami!
                </CardDescription>
                <CardDescription className="text-sm leading-relaxed">
                  Sistem Manajemen Rumah Sakit dirancang untuk membantu tenaga medis memberikan pelayanan terbaik kepada pasien.
                </CardDescription>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
