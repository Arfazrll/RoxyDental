"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Payment, PaymentMethodType } from "@/services/payment.service";

interface PaymentForm {
  paymentMethod: PaymentMethodType;
  amount: number;
  paidAmount: number;
  referenceNumber: string;
  notes: string;
}

interface Props {
  payment: Payment;
  onSave: (data: PaymentForm) => void;
  onClose: () => void;
}

function formatRupiah(n: number) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("id-ID");
}

function sanitizeNumericInput(value: string) {
  let raw = value.replace(/\D/g, "");
  raw = raw.replace(/^0+/, "");
  return raw;
}

export default function EditPembayaran({ payment, onSave, onClose }: Props) {
  const [form, setForm] = useState<PaymentForm>({
    paymentMethod: payment.paymentMethod,
    amount: payment.amount,
    paidAmount: payment.paidAmount,
    referenceNumber: payment.referenceNumber || "",
    notes: payment.notes || "",
  });

  const [amountInput, setAmountInput] = useState<string>(payment.amount.toString());
  const [paidInput, setPaidInput] = useState<string>(payment.paidAmount.toString());

  const update = (key: keyof PaymentForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const kembalian = Math.max((form.paidAmount || 0) - (form.amount || 0), 0);
  const sisaBayar = Math.max((form.amount || 0) - (form.paidAmount || 0), 0);

  const statusBayar = (() => {
    if (!form.amount) return "Belum diisi";
    if ((form.paidAmount || 0) === 0) return "Belum bayar";
    if (form.paidAmount >= form.amount) return "Lunas";
    if (form.paidAmount > 0 && form.paidAmount < form.amount) return "DP/Cicilan";
    return "Belum bayar";
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const canSave = Boolean(form.paymentMethod && form.amount > 0);

  return (
    <Card className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl border border-pink-100 overflow-hidden bg-white">
      <div className="h-2 w-full bg-linear-to-r from-pink-500 via-pink-600 to-rose-500" />

      <CardContent className="p-0">
        <div className="max-h-[78vh] overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                Edit Pembayaran
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                No. Pembayaran: {payment.paymentNumber}
              </p>
            </div>

            <div
              className={[
                "px-3 py-1 rounded-full text-xs font-semibold border shadow-sm whitespace-nowrap",
                statusBayar === "Lunas"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : statusBayar === "DP/Cicilan"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : statusBayar === "Belum bayar"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-gray-50 text-gray-700 border-gray-200",
              ].join(" ")}
            >
              {statusBayar}
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-xl border border-pink-200 mb-6">
            <h3 className="font-semibold text-pink-900 mb-2 text-sm">
              Informasi Pasien & Kunjungan
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-600">Nama:</span>
                <p className="font-semibold text-gray-900">
                  {payment.visit.patient.fullName}
                </p>
              </div>
              <div>
                <span className="text-gray-600">No. Pasien:</span>
                <p className="font-semibold text-gray-900">
                  {payment.visit.patient.patientNumber}
                </p>
              </div>
              <div>
                <span className="text-gray-600">No. RM:</span>
                <p className="font-semibold text-gray-900">
                  {payment.visit.patient.medicalRecordNumber || "-"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">No. Kunjungan:</span>
                <p className="font-semibold text-gray-900">
                  {payment.visit.visitNumber}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Tagihan
            </div>

            <div className="mb-6">
              <div className="relative rounded-2xl border border-pink-200 bg-linear-to-br from-pink-50 via-white to-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-sm font-bold text-sm">
                    Rp
                  </div>

                  <div className="flex-1">
                    <Label className="text-xs text-gray-600 mb-1">Total Tagihan</Label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Masukkan total tagihan"
                      className="w-full bg-transparent text-2xl font-bold text-gray-900 focus:outline-none placeholder:text-gray-400"
                      value={amountInput}
                      onChange={(e) => {
                        const raw = sanitizeNumericInput(e.target.value);
                        setAmountInput(raw);
                        update("amount", raw ? Number(raw) : 0);
                      }}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Ditampilkan: <b>Rp {formatRupiah(form.amount)}</b>
                    </div>
                  </div>

                  <div className="hidden md:block text-right text-xs">
                    <div className="text-gray-500">Sisa</div>
                    <div className="font-semibold text-gray-800">
                      Rp {formatRupiah(sisaBayar)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Pembayaran
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-800 mb-2">
                Metode Pembayaran
              </Label>
              <select
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value as PaymentMethodType)}
              >
                <option value="">Pilih metode</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Debit/Credit Card</option>
                <option value="QRIS">QRIS</option>
                <option value="TRANSFER">Transfer Bank</option>
              </select>
            </div>

            {form.paymentMethod && form.paymentMethod !== "CASH" && (
              <div className="mb-4">
                <Label className="text-sm font-medium text-gray-800 mb-2">
                  Nomor Referensi / ID Transaksi
                </Label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  placeholder="Contoh: TRX123456789"
                  value={form.referenceNumber}
                  onChange={(e) => update("referenceNumber", e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <Label className="text-sm font-medium text-gray-800">Jumlah Bayar (Rp)</Label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  value={paidInput}
                  onChange={(e) => {
                    const raw = sanitizeNumericInput(e.target.value);
                    setPaidInput(raw);
                    update("paidAmount", raw ? Number(raw) : 0);
                  }}
                  placeholder="Masukkan jumlah bayar"
                />
                <div className="mt-1 text-[11px] text-gray-500">
                  {form.paidAmount > 0 && form.paidAmount < form.amount ? (
                    <>
                      Sisa bayar: <b className="text-amber-600">Rp {formatRupiah(sisaBayar)}</b>
                    </>
                  ) : form.paidAmount >= form.amount ? (
                    <span className="text-green-600 font-semibold">✓ Lunas</span>
                  ) : (
                    <>Sisa bayar: <b>Rp {formatRupiah(sisaBayar)}</b></>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-800">Kembalian (Rp)</Label>
                <input
                  className="w-full mt-2 p-3 border rounded-xl bg-green-50 text-green-700 font-semibold border-green-200"
                  value={formatRupiah(kembalian)}
                  disabled
                />
                <div className="mt-1 text-[11px] text-gray-500">
                  Otomatis jika bayar &gt; total tagihan
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-800">Catatan (Opsional)</Label>
              <input
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="Contoh: Lunas, DP, Cicilan ke-1, dll"
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs flex gap-2">
              <span className="text-blue-600 font-semibold">ℹ️</span>
              <div className="text-blue-800">
                <p className="mb-1">
                  <b>Catatan Update:</b>
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>Tanggal pembayaran akan diperbarui ke tanggal hari ini</li>
                  <li>Status akan otomatis disesuaikan dengan jumlah bayar</li>
                  <li>Anda dapat mengubah cicilan menjadi lunas dengan menambah jumlah bayar</li>
                </ul>
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-pink-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-gray-600">
              <span className="font-semibold text-gray-800">Ringkasan:</span> Total{" "}
              <b className="text-pink-600">Rp {formatRupiah(form.amount)}</b> • Bayar{" "}
              <b className={form.paidAmount >= form.amount ? "text-green-600" : "text-blue-600"}>
                Rp {formatRupiah(form.paidAmount)}
              </b>
              {sisaBayar > 0 && form.paidAmount > 0 && (
                <span className="text-amber-600"> • Sisa: <b>Rp {formatRupiah(sisaBayar)}</b></span>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                className="rounded-xl bg-linear-to-r from-pink-600 to-rose-500 text-white hover:opacity-95 font-semibold shadow-md disabled:opacity-60"
                disabled={!canSave}
              >
                UPDATE PEMBAYARAN
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}