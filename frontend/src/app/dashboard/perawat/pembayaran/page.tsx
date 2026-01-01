"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import InputPembayaran from "@/components/ui/addpembayaran";

/* =======================
   TYPE DATA
======================= */
interface Payment {
  id: string;
  patientName: string;
  visitNumber: string;
  totalBill: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  note?: string;
  createdAt: string;
}

interface PaymentForm {
  visitId: string;
  totalTagihan: number;
  metode: string;
  jumlahBayar: number;
  catatan: string;
}

/* =======================
   CONSTANT
======================= */
const PAGE_SIZE = 10;

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      patientName: "Intan Nuraeini",
      visitNumber: "KJ-2025-001",
      totalBill: 250000,
      paymentMethod: "Cash",
      amountPaid: 300000,
      change: 50000,
      note: "Lunas",
      createdAt: "2025-12-01T10:20:00",
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  /* =======================
     FILTER
  ======================= */
  const filteredPayments = useMemo(() => {
    return payments.filter(
      (p) =>
        p.patientName.toLowerCase().includes(search.toLowerCase()) ||
        p.visitNumber.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, payments]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));

  const displayedPayments = filteredPayments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =======================
     TOTAL
  ======================= */
  const total = filteredPayments.reduce(
    (acc, p) => {
      acc.totalBill += p.totalBill;
      acc.amountPaid += p.amountPaid;
      acc.change += p.change;
      return acc;
    },
    { totalBill: 0, amountPaid: 0, change: 0 }
  );

  const formatCurrency = (v: number) =>
    `Rp ${v.toLocaleString("id-ID")}`;

  /* =======================
     SAVE PEMBAYARAN
  ======================= */
  const handleSavePayment = (data: PaymentForm) => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      patientName: data.visitId, // sementara dari input
      visitNumber: data.visitId,
      totalBill: data.totalTagihan,
      paymentMethod: data.metode,
      amountPaid: data.jumlahBayar,
      change: Math.max(data.jumlahBayar - data.totalTagihan, 0),
      note: data.catatan,
      createdAt: new Date().toISOString(),
    };

    setPayments((prev) => [newPayment, ...prev]);
    setShowModal(false);
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen bg-[#FFF5F7] p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-pink-600">
            Data Pembayaran
          </h1>

          <Button
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm"
            onClick={() => setShowModal(true)}
          >
            + Tambah Pembayaran
          </Button>
        </div>

        {/* SEARCH */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <Input
                placeholder="Cari nama pasien / nomor kunjungan"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 border-pink-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {[
                    "TANGGAL",
                    "PASIEN",
                    "NO KUNJUNGAN",
                    "TOTAL TAGIHAN",
                    "METODE",
                    "JUMLAH BAYAR",
                    "KEMBALIAN",
                    "CATATAN",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left font-semibold text-pink-900"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-pink-100">
                {displayedPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-pink-50">
                    <td className="px-3 py-2">
                      {new Date(p.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-3 py-2 font-medium">
                      {p.patientName}
                    </td>
                    <td className="px-3 py-2">{p.visitNumber}</td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(p.totalBill)}
                    </td>
                    <td className="px-3 py-2">{p.paymentMethod}</td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(p.amountPaid)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatCurrency(p.change)}
                    </td>
                    <td className="px-3 py-2">
                      {p.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td colSpan={3} className="px-3 py-2">
                    TOTAL
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(total.totalBill)}
                  </td>
                  <td />
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(total.amountPaid)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(total.change)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end items-center gap-3 px-4 py-3">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <span className="text-xs text-pink-600">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>

      {/* =======================
          MODAL INPUT PEMBAYARAN
      ======================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative z-10 w-full max-w-3xl">
            <InputPembayaran
              onSave={handleSavePayment}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
