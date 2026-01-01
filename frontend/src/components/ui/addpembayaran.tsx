"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentForm {
  visitId: string;
  totalTagihan: number;
  metode: string;
  jumlahBayar: number;
  catatan: string;
}

interface Props {
  onClose?: () => void;
  onSave: (data: PaymentForm) => void;
}

export default function InputPembayaran({ onSave, onClose }: Props) {
  const [form, setForm] = useState<PaymentForm>({
    visitId: "",
    totalTagihan: 0,
    metode: "",
    jumlahBayar: 0,
    catatan: "",
  });

  const update = (key: keyof PaymentForm, value: string | number) => {
    setForm({ ...form, [key]: value });
  };

  const kembalian = useMemo(() => {
    return Math.max(form.jumlahBayar - form.totalTagihan, 0);
  }, [form.jumlahBayar, form.totalTagihan]);

  const handleSubmit = () => {
    if (!form.visitId) {
      alert("Silakan pilih kunjungan pasien");
      return;
    }
    if (!form.metode) {
      alert("Silakan pilih metode pembayaran");
      return;
    }
    onSave(form);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-xl shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800">
          Input Pembayaran
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Catat pembayaran kunjungan pasien dengan mudah
        </p>

        {/* Pilih Kunjungan */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">
            Pilih Kunjungan Pasien
          </span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Cari nama pasien atau nomor kunjungan..."
            value={form.visitId}
            onChange={(e) => update("visitId", e.target.value)}
          />
        </label>

        {/* Total Tagihan */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">
            Total Tagihan (Rp)
          </span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
            value={form.totalTagihan.toLocaleString("id-ID")}
            disabled
          />
        </label>

        {/* Metode Pembayaran */}
        <label className="block mb-4 text-sm">
          <span className="font-medium text-gray-700">
            Metode Pembayaran
          </span>
          <select
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            value={form.metode}
            onChange={(e) => update("metode", e.target.value)}
          >
            <option value="">Pilih metode</option>
            <option value="cash">Cash</option>
            <option value="debit">Debit</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Transfer</option>
          </select>
        </label>

        {/* Jumlah Bayar & Kembalian */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <label>
            <span className="font-medium text-gray-700">
              Jumlah Bayar (Rp)
            </span>
            <input
              type="number"
              min={0}
              className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              value={form.jumlahBayar}
              onChange={(e) =>
                update("jumlahBayar", Number(e.target.value))
              }
            />
          </label>

          <label>
            <span className="font-medium text-gray-700">
              Kembalian (Rp)
            </span>
            <input
              className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-600"
              value={kembalian.toLocaleString("id-ID")}
              disabled
            />
          </label>
        </div>

        {/* Catatan */}
        <label className="block mb-5 text-sm">
          <span className="font-medium text-gray-700">
            Catatan (Opsional)
          </span>
          <input
            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
            placeholder="Contoh: Lunas, DP, dll"
            value={form.catatan}
            onChange={(e) => update("catatan", e.target.value)}
          />
        </label>

        {/* Info Box */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm mb-5 flex gap-2">
          <span className="text-blue-600 font-semibold">ℹ️</span>
          <p className="text-blue-700">
            Pastikan total tagihan sudah sesuai dengan tindakan yang
            dilakukan dokter. Status kunjungan harus{" "}
            <b>Selesai (COMPLETED)</b> agar dapat dilakukan pembayaran.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 text-sm"
            >
              Batal
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-sm font-medium"
          >
            SIMPAN PEMBAYARAN
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
