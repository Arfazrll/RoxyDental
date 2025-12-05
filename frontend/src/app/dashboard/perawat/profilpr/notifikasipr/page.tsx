"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Lock, Bell, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DoctorNavbar from "@/components/ui/navbarpr";
import SettingsSidebar from "@/components/ui/SettingsSidebarpr";

export default function SettingsNotification() {
  const [activeMenu, setActiveMenu] = useState("notifikasi");
  const [notifications, setNotifications] = useState({
    browser: true,
    jadwalPasien: true,
    pesanBaru: false,
    updateSistem: true,
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSaveSettings = () => {
    setConfirmDialogOpen(false);
    setSuccessDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="pt-6 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <SettingsSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg rounded-2xl border border-pink-100">
              <CardHeader className="bg-pink-100 rounded-t-2xl px-6 py-6">
                <h2 className="text-2xl font-bold text-pink-900">Pengaturan Notifikasi</h2>
                <p className="text-sm text-pink-600 mt-1">Atur preferensi pemberitahuan sistem</p>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Notifikasi Push Section */}
                <div className="mt-4">
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-yellow-900 mb-2">Notifikasi Push</h3>
                    <p className="text-sm text-yellow-800">Terima notifikasi di browser</p>
                  </div>

                  {/* Toggle Items */}
                  <div className="space-y-4">
                    {[
                      { key: "jadwalPasien", title: "Jadwal Pasien", desc: "Notifikasi saat ada jadwal pasien" },
                      { key: "pesanBaru", title: "Pesan Baru", desc: "Notifikasi pesan dari pasien" },
                      { key: "updateSistem", title: "Update Sistem", desc: "Notifikasi tentang update sistem" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-pink-200">
                        <div>
                          <h4 className="font-semibold text-pink-900">{item.title}</h4>
                          <p className="text-sm text-pink-600">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => toggleNotification(item.key)}
                          className={`relative w-14 h-7 rounded-full transition-colors ${
                            notifications[item.key as keyof typeof notifications] ? "bg-pink-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                              notifications[item.key as keyof typeof notifications] ? "translate-x-7" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4 border-t border-pink-200">
                  <Button
                    className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 rounded-lg shadow-md"
                    onClick={() => setConfirmDialogOpen(true)}
                  >
                    Simpan Pengaturan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-center text-sm text-pink-600 mt-8">
          © 2025 RosyDental. Platform untuk klinik gigi modern
        </p>
      </div>

      {/* Dialog Konfirmasi */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-pink-900">
              Anda yakin ingin menyimpan pengaturan terbaru?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="px-8 border-pink-300 text-pink-700"
            >
              Batal
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-8"
              onClick={handleSaveSettings}
            >
              Ya, Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Sukses */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md flex justify-center items-center p-6">
          <div className="text-center bg-pink-100 rounded-2xl shadow-lg p-6 w-full">
            <h3 className="text-xl font-bold text-pink-700 mb-2">Pengaturan berhasil disimpan!</h3>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg mt-2"
              onClick={() => setSuccessDialogOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
