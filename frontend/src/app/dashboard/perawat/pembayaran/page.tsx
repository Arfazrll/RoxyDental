"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ReceiptText, CreditCard, Wallet, ArrowLeft, ArrowRight, Edit } from "lucide-react";
import InputPembayaran from "@/components/ui/addpembayaran";
import EditPembayaran from "@/components/ui/editpembayaran";
import DoctorNavbar from "@/components/ui/navbarpr";
import { useToast } from "@/hooks/use-toast";
import { 
  paymentService, 
  Payment, 
  CreatePaymentData,
  UpdatePaymentData,
  PaymentMethodType 
} from "@/services/payment.service";

const PAGE_SIZE = 10;

const formatCurrency = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

function methodLabel(m: string) {
  const x = (m || "").toLowerCase();
  if (x === "cash") return "Cash";
  if (x === "card") return "Debit/Credit";
  if (x === "qris") return "QRIS";
  if (x === "transfer") return "Transfer";
  return m || "-";
}

function MethodBadge({ method }: { method: string }) {
  const m = (method || "").toLowerCase();
  const base =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold";

  if (m === "cash") return <span className={`${base} bg-pink-50 text-pink-700 border-pink-200`}><Wallet className="w-3 h-3" />Cash</span>;
  if (m === "card") return <span className={`${base} bg-purple-50 text-purple-700 border-purple-200`}><CreditCard className="w-3 h-3" />Debit/Credit</span>;
  if (m === "qris") return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}><ReceiptText className="w-3 h-3" />QRIS</span>;
  if (m === "transfer") return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}><CreditCard className="w-3 h-3" />Transfer</span>;

  return <span className={`${base} bg-gray-50 text-gray-700 border-gray-200`}>{methodLabel(method)}</span>;
}

export default function PaymentPage() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAllPayments(search);
      setPayments(data);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal mengambil data pembayaran",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPayments();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const filteredPayments = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.visit.patient.fullName.toLowerCase().includes(q) ||
        p.visit.visitNumber.toLowerCase().includes(q) ||
        p.paymentNumber.toLowerCase().includes(q)
    );
  }, [search, payments]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));

  const displayedPayments = filteredPayments.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const total = useMemo(() => {
    return filteredPayments.reduce(
      (acc, p) => {
        acc.totalBill += p.amount;
        acc.amountPaid += p.paidAmount;
        acc.change += p.changeAmount;
        return acc;
      },
      { totalBill: 0, amountPaid: 0, change: 0 }
    );
  }, [filteredPayments]);

  const handleSavePayment = async (formData: any) => {
    try {
      const paymentData: CreatePaymentData = {
        visitId: formData.visitId,
        paymentMethod: formData.metode as PaymentMethodType,
        amount: formData.totalTagihan,
        paidAmount: formData.jumlahBayar,
        referenceNumber: formData.nomorReferensi || undefined,
        notes: formData.catatan || undefined
      };

      await paymentService.createPayment(paymentData);

      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil disimpan",
      });

      setShowModal(false);
      fetchPayments();
      setPage(1);
    } catch (error: any) {
      console.error("Error saving payment:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal menyimpan pembayaran",
        variant: "destructive",
      });
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowEditModal(true);
  };

  const handleUpdatePayment = async (formData: any) => {
    if (!selectedPayment) return;

    try {
      const updateData: UpdatePaymentData = {
        paymentMethod: formData.paymentMethod,
        amount: formData.amount,
        paidAmount: formData.paidAmount,
        referenceNumber: formData.referenceNumber || undefined,
        notes: formData.notes || undefined
      };

      await paymentService.updatePayment(selectedPayment.id, updateData);

      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil diupdate",
      });

      setShowEditModal(false);
      setSelectedPayment(null);
      fetchPayments();
    } catch (error: any) {
      console.error("Error updating payment:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal mengupdate pembayaran",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FFF5F7] via-white to-white">
      <DoctorNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-10 pt-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/70 px-3 py-1 text-xs font-semibold text-pink-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              Pembayaran Klinik
            </div>

            <h1 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
              Data Pembayaran
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Kelola transaksi pembayaran pasien dengan ringkas dan rapi.
            </p>
          </div>

          <Button
            className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold shadow-md rounded-xl"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pembayaran
          </Button>
        </div>

        <Card className="rounded-2xl border-pink-100 shadow-sm mb-5">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="relative w-full md:max-w-md mt-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <Input
                placeholder="Cari nama pasien / nomor kunjungan / nomor pembayaran"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 border-pink-200 focus-visible:ring-pink-200 rounded-xl bg-white"
              />
            </div>

            <div className="text-xs text-gray-500">
              Menampilkan <b className="text-gray-700">{filteredPayments.length}</b> transaksi
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-pink-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-linear-to-r from-pink-100 to-rose-50">
                <tr>
                  {[
                    "TANGGAL",
                    "NO. PEMBAYARAN",
                    "PASIEN",
                    "NO. KUNJUNGAN",
                    "TOTAL TAGIHAN",
                    "METODE",
                    "JUMLAH BAYAR",
                    "KEMBALIAN",
                    "STATUS",
                    "AKSI",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-pink-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                      </div>
                    </td>
                  </tr>
                ) : displayedPayments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-500">
                      Tidak ada data pembayaran untuk filter saat ini.
                    </td>
                  </tr>
                ) : (
                  displayedPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-pink-50/60 transition">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-pink-700">
                        {p.paymentNumber}
                      </td>

                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {p.visit.patient.fullName}
                      </td>

                      <td className="px-4 py-3 text-gray-700">{p.visit.visitNumber}</td>

                      <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.amount)}
                      </td>

                      <td className="px-4 py-3">
                        <MethodBadge method={p.paymentMethod} />
                      </td>

                      <td className="px-4 py-3 text-right text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.paidAmount)}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-900 whitespace-nowrap">
                        {formatCurrency(p.changeAmount)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.status === "PAID"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : p.status === "PARTIAL"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {p.status === "PAID"
                            ? "Lunas"
                            : p.status === "PARTIAL"
                            ? "Sebagian"
                            : p.status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditPayment(p)}
                          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-gray-800">
                    TOTAL
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(total.totalBill)}
                  </td>
                  <td />
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(total.amountPaid)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(total.change)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-t border-pink-100 bg-white">
            <div className="text-xs text-gray-500">
              Page <b className="text-gray-700">{page}</b> of{" "}
              <b className="text-gray-700">{totalPages}</b>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

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

      {showEditModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setShowEditModal(false);
              setSelectedPayment(null);
            }}
          />
          <div className="relative z-10 w-full max-w-3xl">
            <EditPembayaran
              payment={selectedPayment}
              onSave={handleUpdatePayment}
              onClose={() => {
                setShowEditModal(false);
                setSelectedPayment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}