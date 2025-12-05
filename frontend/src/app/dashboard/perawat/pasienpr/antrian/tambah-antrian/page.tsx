"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Users, Clock, FileText } from "lucide-react";

export default function TambahAntrianPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // AUTO NUMBER
  const nextQueue = searchParams.get("next") || "1";
  const nextId = searchParams.get("nextId") || "ID001";

  const [queueNo] = useState(nextQueue);
  const [id, setId] = useState(nextId);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Menunggu");
  const [action, setAction] = useState("");

  // TOAST MANUAL
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Berhasil ditambahkan!");

    setTimeout(() => {
      router.push("/dashboard/perawat/pasienpr/antrian");
    }, 1500);
  };

  return (
    <>
      {/* TOAST ADA DI ATAS */}
      {toast && (
        <div
          className="
            fixed top-6 right-6 bg-pink-600 text-white px-5 py-3 
            rounded-lg shadow-lg animate-slide-down z-50
          "
        >
          {toast}
        </div>
      )}

      <div className="min-h-screen bg-[#FFE6EB] flex flex-col items-center py-10">
        {/* HEADER ICON */}
        <div className="w-24 h-24 rounded-full bg-linear-to-r from-pink-600 to-pink-400 shadow-lg flex items-center justify-center mb-6">
          <Users className="text-white" size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-bold text-pink-900 mb-6">
          Tambah Daftar Antrian
        </h1>

        {/* CARD */}
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-pink-600 to-pink-400 text-white px-6 py-4">
            <h2 className="font-semibold text-lg flex gap-2 items-center">
              <FileText size={20} /> Informasi Pasien
            </h2>
            <p className="text-sm opacity-80">
              Pastikan semua informasi yang dimasukkan sudah benar
            </p>
          </div>

          <form className="p-6 space-y-5" onSubmit={handleSubmit}>
            {/* No Antrian & ID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-pink-800 text-sm font-medium">
                  No. Antrian
                </label>
                <Input value={queueNo} readOnly className="mt-1 bg-gray-100" />
              </div>

              <div>
                <label className="text-pink-800 text-sm font-medium">
                  No. ID
                </label>
                <Input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Nama */}
            <div>
              <label className="text-pink-800 text-sm font-medium">
                Nama Pasien
              </label>
              <Input
                placeholder="Masukkan Nama Pasien"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Jam + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-pink-800 text-sm font-medium flex items-center gap-1">
                  <Clock size={16} /> Jam
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-700"
                  required
                />
              </div>

              <div>
                <label className="text-pink-800 text-sm font-medium">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Menunggu">Menunggu</SelectItem>
                    <SelectItem value="Sedang Dilayani">
                      Sedang Dilayani
                    </SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tindakan */}
            <div>
              <label className="text-pink-800 text-sm font-medium">
                Tindakan
              </label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih Tindakan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemeriksaan Umum">
                    Pemeriksaan Umum
                  </SelectItem>
                  <SelectItem value="Kontrol Rutin">Kontrol Rutin</SelectItem>
                  <SelectItem value="Tindakan Khusus">
                    Tindakan Khusus
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="px-8 border-pink-300 text-pink-700"
                onClick={() =>
                  router.push("/dashboard/perawat/pasien/antrian")
                }
              >
                Batal
              </Button>

              <Button className="px-8 bg-pink-600 hover:bg-pink-700 text-white">
                Daftar Sekarang
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
