"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

import DoctorNavbar from "@/components/ui/navbardr";
import AddFinance from "@/components/ui/addfinance";
import AddProcedure from "@/components/ui/addprocedure";
import AddPacket from "@/components/ui/addpacket";

import {
  financeService,
  FinanceReport,
  Procedure,
  Package,
} from "@/services/finance.service";

import { 
  paymentService, 
  Payment
} from "@/services/payment.service";

const PAGE_SIZE = 20;

const tableClass =
  "min-w-full text-xs border border-pink-200 border-separate border-spacing-0";
const thClass =
  "px-3 py-2 text-left font-semibold text-pink-900 whitespace-nowrap border-b border-pink-200 border-r border-pink-100 last:border-r-0";
const tdBase =
  "px-3 py-2 whitespace-nowrap border-r border-pink-100 last:border-r-0";
const tfootClass = "bg-pink-50 font-semibold border-t border-pink-200";

type PdfScope = "all" | "medical" | "procedure" | "packet" | "payment";

export default function CommissionReportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [pageMedical, setPageMedical] = useState(1);
  const [pageProcedure, setPageProcedure] = useState(1);
  const [pagePacket, setPagePacket] = useState(1);
  const [pagePayment, setPagePayment] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"medical" | "procedure" | "packet">("medical");

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfScope, setPdfScope] = useState<PdfScope>("all");

  const [medicalStaff, setMedicalStaff] = useState<FinanceReport[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    show: boolean;
    msg: string;
    type?: "success" | "error";
  }>({ show: false, msg: "" });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadFinanceReports(), 
        loadProcedures(), 
        loadPackages(), 
        loadPayments()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadFinanceReports = async () => {
    try {
      const res = await financeService.getFinanceReports();
      if (res.success) setMedicalStaff(res.data.reports);
    } catch (e) {
      console.error(e);
      showToast("Gagal memuat data laporan keuangan", "error");
    }
  };

  const loadProcedures = async () => {
    try {
      const res = await financeService.getProcedures();
      if (res.success) setProcedures(res.data.procedures);
    } catch (e) {
      console.error(e);
      showToast("Gagal memuat data prosedur", "error");
    }
  };

  const loadPackages = async () => {
    try {
      const res = await financeService.getPackages();
      if (res.success) setPackages(res.data.packages);
    } catch (e) {
      console.error(e);
      showToast("Gagal memuat data paket", "error");
    }
  };

  const loadPayments = async () => {
    try {
      const data = await paymentService.getAllPayments("");
      setPayments(data);
    } catch (e) {
      console.error(e);
      showToast("Gagal memuat data pembayaran", "error");
    }
  };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "" }), 3000);
  };

  const toNumber = (v: any) => Number(v) || 0;
  const formatCurrency = (v: number) => `Rp. ${v.toLocaleString("id-ID")}`;
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

  const filteredMedical = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return medicalStaff.filter((s) => s.nama.toLowerCase().includes(q));
  }, [searchQuery, medicalStaff]);

  const filteredProcedure = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return procedures.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery, procedures]);

  const filteredPacket = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return packages.filter((p) => p.name.toLowerCase().includes(q));
  }, [searchQuery, packages]);

  const filteredPayment = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.visit.patient.fullName.toLowerCase().includes(q) ||
        p.visit.visitNumber.toLowerCase().includes(q) ||
        p.paymentNumber.toLowerCase().includes(q)
    );
  }, [searchQuery, payments]);

  const totalPagesMedical = Math.max(1, Math.ceil(filteredMedical.length / PAGE_SIZE));
  const totalPagesProcedure = Math.max(1, Math.ceil(filteredProcedure.length / PAGE_SIZE));
  const totalPagesPacket = Math.max(1, Math.ceil(filteredPacket.length / PAGE_SIZE));
  const totalPagesPayment = Math.max(1, Math.ceil(filteredPayment.length / PAGE_SIZE));

  const displayedMedical = filteredMedical.slice((pageMedical - 1) * PAGE_SIZE, pageMedical * PAGE_SIZE);
  const displayedProcedure = filteredProcedure.slice((pageProcedure - 1) * PAGE_SIZE, pageProcedure * PAGE_SIZE);
  const displayedPacket = filteredPacket.slice((pagePacket - 1) * PAGE_SIZE, pagePacket * PAGE_SIZE);
  const displayedPayment = filteredPayment.slice((pagePayment - 1) * PAGE_SIZE, pagePayment * PAGE_SIZE);

  const renderPagination = (
    page: number,
    setPage: (val: number) => void,
    totalPages: number
  ) => (
    <div className="flex justify-end gap-3 items-center py-2">
      <button
        className={`cursor-pointer text-pink-600 text-base font-bold px-2 ${
          page === 1 ? "opacity-40 pointer-events-none" : ""
        }`}
        onClick={() => setPage(Math.max(1, page - 1))}
        aria-label="previous page"
      >
        ←
      </button>
      <span className="text-xs text-pink-600">
        Page {page} of {totalPages}
      </span>
      <button
        className={`cursor-pointer text-pink-600 text-base font-bold px-2 ${
          page === totalPages ? "opacity-40 pointer-events-none" : ""
        }`}
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        aria-label="next page"
      >
        →
      </button>
    </div>
  );

  const totalMedical = filteredMedical.reduce(
    (acc, s) => {
      acc.potongan += toNumber(s.potongan);
      acc.bhpHarga += toNumber(s.bhpHarga);
      acc.farmasiHarga += toNumber(s.farmasiHarga);
      acc.paketHarga += toNumber(s.paketHarga);
      acc.labHarga += toNumber(s.labHarga);
      return acc;
    },
    { potongan: 0, bhpHarga: 0, farmasiHarga: 0, paketHarga: 0, labHarga: 0 }
  );

  const totalProcedure = filteredProcedure.reduce(
    (acc, p) => {
      acc.totalSale += toNumber(p.totalSale);
      acc.totalComm += toNumber(p.totalComm);
      return acc;
    },
    { totalSale: 0, totalComm: 0 }
  );

  const totalPacket = filteredPacket.reduce(
    (acc, p) => {
      acc.totalSale += toNumber(p.totalSale);
      acc.totalComm += toNumber(p.totalComm);
      return acc;
    },
    { totalSale: 0, totalComm: 0 }
  );

  const totalPayment = filteredPayment.reduce(
    (acc, p) => {
      acc.totalBill += toNumber(p.amount);
      acc.amountPaid += toNumber(p.paidAmount);
      acc.change += toNumber(p.changeAmount);
      return acc;
    },
    { totalBill: 0, amountPaid: 0, change: 0 }
  );

  const handleSaveFinance = async (data: any) => {
    try {
      const res = await financeService.createFinanceReport(data);
      if (res.success) {
        await loadFinanceReports();
        setShowModal(false);
        showToast("Data keuangan berhasil ditambahkan!", "success");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal menambahkan data", "error");
    }
  };

  const handleSaveProcedure = async (data: any) => {
    try {
      const res = await financeService.createProcedure(data);
      if (res.success) {
        await loadProcedures();
        setShowModal(false);
        showToast("Data prosedur berhasil ditambahkan!", "success");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal menambahkan prosedur", "error");
    }
  };

  const handleSavePacket = async (data: any) => {
    try {
      const res = await financeService.createPackage(data);
      if (res.success) {
        await loadPackages();
        setShowModal(false);
        showToast("Data paket berhasil ditambahkan!", "success");
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Gagal menambahkan paket", "error");
    }
  };

  const exportPDF = async (scope: PdfScope) => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF("landscape");
      const pageW = doc.internal.pageSize.getWidth();

      const addTitle = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(title, pageW / 2, 14, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, pageW / 2, 22, { align: "center" });
      };

      const addMedical = () => {
        addTitle("LAPORAN KOMISI - TENAGA MEDIS");
        autoTable(doc, {
          startY: 28,
          head: [[
            "TENAGA MEDIS",
            "POTONGAN AWAL",
            "HARGA MODAL (BHP)",
            "KOMISI (AVG)",
            "FARMASI",
            "HARGA MODAL",
            "KOMISI (AVG)",
            "PAKET",
            "KOMISI (AVG)",
            "LAB",
          ]],
          body: filteredMedical.map((s) => ([
            s.nama,
            `Rp ${toNumber(s.potongan).toLocaleString("id-ID")}`,
            `Rp ${toNumber(s.bhpHarga).toLocaleString("id-ID")}`,
            `${s.bhpKomisi}%`,
            `Rp ${toNumber(s.farmasiHarga).toLocaleString("id-ID")}`,
            `Rp ${toNumber(s.bhpHarga).toLocaleString("id-ID")}`,
            `${s.farmasiKomisi}%`,
            `Rp ${toNumber(s.paketHarga).toLocaleString("id-ID")}`,
            `${s.paketKomisi}%`,
            `Rp ${toNumber(s.labHarga).toLocaleString("id-ID")}`,
          ])),
          foot: [[
            "TOTAL",
            `Rp ${totalMedical.potongan.toLocaleString("id-ID")}`,
            `Rp ${totalMedical.bhpHarga.toLocaleString("id-ID")}`,
            "-",
            `Rp ${totalMedical.farmasiHarga.toLocaleString("id-ID")}`,
            "-",
            "-",
            `Rp ${totalMedical.paketHarga.toLocaleString("id-ID")}`,
            "-",
            `Rp ${totalMedical.labHarga.toLocaleString("id-ID")}`,
          ]],
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
          footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [252, 231, 243] },
        });
      };

      const addProcedure = () => {
        addTitle("LAPORAN KOMISI - PROSEDUR / LAYANAN");
        autoTable(doc, {
          startY: 28,
          head: [[
            "PROSEDUR",
            "KODE",
            "QTY",
            "HARGA JUAL",
            "TOTAL PENJUALAN",
            "KOMISI (%)",
            "TOTAL KOMISI",
          ]],
          body: filteredProcedure.map((p) => ([
            p.name,
            p.code,
            p.quantity,
            `Rp ${toNumber(p.salePrice).toLocaleString("id-ID")}`,
            `Rp ${toNumber(p.totalSale).toLocaleString("id-ID")}`,
            `${p.avgComm}%`,
            `Rp ${toNumber(p.totalComm).toLocaleString("id-ID")}`,
          ])),
          foot: [[
            "TOTAL",
            "-",
            "-",
            "-",
            `Rp ${totalProcedure.totalSale.toLocaleString("id-ID")}`,
            "-",
            `Rp ${totalProcedure.totalComm.toLocaleString("id-ID")}`,
          ]],
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
          footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [252, 231, 243] },
        });
      };

      const addPacket = () => {
        addTitle("LAPORAN KOMISI - PAKET");
        autoTable(doc, {
          startY: 28,
          head: [[
            "PAKET",
            "SKU",
            "QTY",
            "HARGA JUAL",
            "TOTAL PENJUALAN",
            "KOMISI (%)",
            "TOTAL KOMISI",
          ]],
          body: filteredPacket.map((p) => ([
            p.name,
            p.sku,
            p.quantity,
            `Rp ${toNumber(p.salePrice).toLocaleString("id-ID")}`,
            `Rp ${toNumber(p.totalSale).toLocaleString("id-ID")}`,
            `${p.avgComm}%`,
            `Rp ${toNumber(p.totalComm).toLocaleString("id-ID")}`,
          ])),
          foot: [[
            "TOTAL",
            "-",
            "-",
            "-",
            `Rp ${totalPacket.totalSale.toLocaleString("id-ID")}`,
            "-",
            `Rp ${totalPacket.totalComm.toLocaleString("id-ID")}`,
          ]],
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
          footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [252, 231, 243] },
        });
      };

      const addPayment = () => {
        addTitle("LAPORAN PEMBAYARAN");
        autoTable(doc, {
          startY: 28,
          head: [[
            "TANGGAL",
            "NO. PEMBAYARAN",
            "PASIEN",
            "NO. KUNJUNGAN",
            "TOTAL TAGIHAN",
            "METODE",
            "JUMLAH BAYAR",
            "KEMBALIAN",
            "STATUS",
          ]],
          body: filteredPayment.map((p) => ([
            formatDate(p.createdAt),
            p.paymentNumber,
            p.visit.patient.fullName,
            p.visit.visitNumber,
            `Rp ${toNumber(p.amount).toLocaleString("id-ID")}`,
            methodLabel(p.paymentMethod),
            `Rp ${toNumber(p.paidAmount).toLocaleString("id-ID")}`,
            `Rp ${toNumber(p.changeAmount).toLocaleString("id-ID")}`,
            p.status === "PAID" ? "Lunas" : p.status === "PARTIAL" ? "Sebagian" : p.status,
          ])),
          foot: [[
            "TOTAL",
            "",
            "",
            "",
            `Rp ${totalPayment.totalBill.toLocaleString("id-ID")}`,
            "",
            `Rp ${totalPayment.amountPaid.toLocaleString("id-ID")}`,
            `Rp ${totalPayment.change.toLocaleString("id-ID")}`,
            "",
          ]],
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [219, 39, 119], textColor: 255, fontStyle: "bold" },
          footStyles: { fillColor: [251, 207, 232], textColor: 0, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [252, 231, 243] },
        });
      };

      if (scope === "all") {
        addMedical();
        doc.addPage();
        addProcedure();
        doc.addPage();
        addPacket();
        doc.addPage();
        addPayment();
      } else {
        if (scope === "medical") addMedical();
        if (scope === "procedure") addProcedure();
        if (scope === "packet") addPacket();
        if (scope === "payment") addPayment();
      }

      const name =
        scope === "all"
          ? "Laporan_Semua"
          : scope === "medical"
          ? "Laporan_Tenaga_Medis"
          : scope === "procedure"
          ? "Laporan_Prosedur"
          : scope === "packet"
          ? "Laporan_Paket"
          : "Laporan_Pembayaran";

      doc.save(`${name}_${new Date().toLocaleDateString("id-ID")}.pdf`);
      showToast("PDF berhasil diunduh!", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal mengunduh PDF", "error");
    }
  };

  const exportXLSX = async () => {
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.utils.book_new();

      const now = new Date();
      const stamp = now.toLocaleDateString("id-ID").replaceAll("/", "-");

      const appendSheet = (name: string, rows: Record<string, any>[]) => {
        const ws = XLSX.utils.json_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, name);
      };

      appendSheet(
        "Tenaga Medis",
        filteredMedical.map((s) => ({
          "Tenaga Medis": s.nama,
          "Potongan Awal": toNumber(s.potongan),
          "Harga Modal (BHP)": toNumber(s.bhpHarga),
          "Komisi BHP (%)": toNumber(s.bhpKomisi),
          "Farmasi": toNumber(s.farmasiHarga),
          "Harga Modal (Farmasi)": toNumber(s.bhpHarga),
          "Komisi Farmasi (%)": toNumber(s.farmasiKomisi),
          "Paket": toNumber(s.paketHarga),
          "Komisi Paket (%)": toNumber(s.paketKomisi),
          "Lab": toNumber(s.labHarga),
        }))
      );

      appendSheet(
        "Prosedur",
        filteredProcedure.map((p) => ({
          Prosedur: p.name,
          Kode: p.code,
          Qty: toNumber(p.quantity),
          "Harga Jual": toNumber(p.salePrice),
          "Total Penjualan": toNumber(p.totalSale),
          "Komisi (%)": toNumber(p.avgComm),
          "Total Komisi": toNumber(p.totalComm),
        }))
      );

      appendSheet(
        "Paket",
        filteredPacket.map((p) => ({
          Paket: p.name,
          SKU: p.sku,
          Qty: toNumber(p.quantity),
          "Harga Jual": toNumber(p.salePrice),
          "Total Penjualan": toNumber(p.totalSale),
          "Komisi (%)": toNumber(p.avgComm),
          "Total Komisi": toNumber(p.totalComm),
        }))
      );

      appendSheet(
        "Pembayaran",
        filteredPayment.map((p) => ({
          Tanggal: formatDate(p.createdAt),
          "No. Pembayaran": p.paymentNumber,
          Pasien: p.visit.patient.fullName,
          "No Kunjungan": p.visit.visitNumber,
          "Total Tagihan": toNumber(p.amount),
          Metode: methodLabel(p.paymentMethod),
          "Jumlah Bayar": toNumber(p.paidAmount),
          Kembalian: toNumber(p.changeAmount),
          Status: p.status === "PAID" ? "Lunas" : p.status === "PARTIAL" ? "Sebagian" : p.status,
        }))
      );

      appendSheet("Ringkasan", [
        {
          Kategori: "Tenaga Medis",
          "Total Potongan": totalMedical.potongan,
          "Total BHP": totalMedical.bhpHarga,
          "Total Farmasi": totalMedical.farmasiHarga,
          "Total Paket": totalMedical.paketHarga,
          "Total Lab": totalMedical.labHarga,
        },
        {
          Kategori: "Prosedur",
          "Total Penjualan": totalProcedure.totalSale,
          "Total Komisi": totalProcedure.totalComm,
        },
        {
          Kategori: "Paket",
          "Total Penjualan": totalPacket.totalSale,
          "Total Komisi": totalPacket.totalComm,
        },
        {
          Kategori: "Pembayaran",
          "Total Tagihan": totalPayment.totalBill,
          "Total Bayar": totalPayment.amountPaid,
          "Total Kembalian": totalPayment.change,
        },
      ]);

      XLSX.writeFile(wb, `Laporan_${stamp}.xlsx`);
      showToast("Excel berhasil diunduh!", "success");
    } catch (e) {
      console.error(e);
      showToast("Gagal mengunduh Excel", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFE6EE] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto" />
          <p className="mt-4 text-pink-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FFE6EE]">
      <DoctorNavbar />

      <div className="min-h-screen bg-[#FFF5F7]">
        <div className="p-6 max-w-7xl mx-auto">
          <Card className="shadow-md mb-6 border border-pink-200">
            <CardContent className="p-4 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[250px] mt-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                <Input
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPageMedical(1);
                    setPageProcedure(1);
                    setPagePacket(1);
                    setPagePayment(1);
                  }}
                  className="pl-10 border-pink-300"
                />
              </div>

              <div className="flex gap-2 ml-auto mt-6">
                <Button
                  variant="outline"
                  className="border-pink-300 text-pink-700 text-xs px-3 py-2 hover:bg-pink-50 flex items-center gap-1"
                  onClick={() => setShowPdfModal(true)}
                >
                  <Download className="w-3 h-3" />
                  PDF
                </Button>

                <Button
                  variant="outline"
                  className="border-pink-300 text-pink-700 text-xs px-3 py-2 hover:bg-pink-50 flex items-center gap-1"
                  onClick={exportXLSX}
                >
                  <Download className="w-3 h-3" />
                  XLSX
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center mt-4 mb-2">
            <h2 className="text-xl font-bold text-pink-600">KOMISI TENAGA MEDIS</h2>
            <button
              onClick={() => {
                setModalMode("medical");
                setShowModal(true);
              }}
              className="bg-pink-600 text-white text-xs px-3 py-2 rounded hover:bg-pink-700"
            >
              + Tambah Laporan
            </button>
          </div>

          <Card className="shadow-md overflow-hidden mb-6 border border-pink-200">
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-pink-100 border-b border-pink-200">
                  <tr>
                    {[
                      "TENAGA MEDIS",
                      "POTONGAN AWAL",
                      "HARGA MODAL (BHP)",
                      "KOMISI (AVG)",
                      "FARMASI",
                      "HARGA MODAL",
                      "KOMISI (AVG)",
                      "PAKET",
                      "KOMISI (AVG)",
                      "LAB",
                    ].map((col, i) => (
                      <th key={i} className={thClass}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-pink-100">
                  {displayedMedical.map((s, idx) => (
                    <tr key={idx} className="hover:bg-pink-50">
                      <td className={tdBase}>{s.nama}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(s.potongan))}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(s.bhpHarga))}</td>
                      <td className={`${tdBase} text-right`}>{s.bhpKomisi}%</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(s.farmasiHarga))}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(s.bhpHarga))}</td>
                      <td className={`${tdBase} text-right`}>{s.farmasiKomisi}%</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(s.paketHarga))}</td>
                      <td className={`${tdBase} text-right`}>{s.paketKomisi}%</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(s.labHarga))}</td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className={tfootClass}>
                  <tr>
                    <td className={`${tdBase} font-semibold`}>TOTAL</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalMedical.potongan)}</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalMedical.bhpHarga)}</td>
                    <td className={`${tdBase} text-right`}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalMedical.farmasiHarga)}</td>
                    <td className={`${tdBase} text-right`}>-</td>
                    <td className={`${tdBase} text-right`}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalMedical.paketHarga)}</td>
                    <td className={`${tdBase} text-right`}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalMedical.labHarga)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="px-4 py-2">
              {renderPagination(pageMedical, setPageMedical, totalPagesMedical)}
            </div>
          </Card>

          <div className="flex justify-between items-center mt-4 mb-2">
            <h2 className="text-xl font-bold text-pink-600">KOMISI PROSEDUR / LAYANAN</h2>
            <button
              onClick={() => {
                setModalMode("procedure");
                setShowModal(true);
              }}
              className="bg-pink-600 text-white text-xs px-3 py-2 rounded hover:bg-pink-700"
            >
              + Tambah Prosedur
            </button>
          </div>

          <Card className="shadow-md overflow-hidden mb-6 border border-pink-200">
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-pink-100 border-b border-pink-200">
                  <tr>
                    {[
                      "PROSEDUR",
                      "KODE",
                      "QTY",
                      "HARGA JUAL",
                      "TOTAL PENJUALAN",
                      "KOMISI (%)",
                      "TOTAL KOMISI",
                    ].map((col, i) => (
                      <th key={i} className={thClass}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-pink-100">
                  {displayedProcedure.map((p, idx) => (
                    <tr key={idx} className="hover:bg-pink-50">
                      <td className={tdBase}>{p.name}</td>
                      <td className={tdBase}>{p.code}</td>
                      <td className={`${tdBase} text-right`}>{p.quantity}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(p.salePrice))}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(p.totalSale))}</td>
                      <td className={`${tdBase} text-right`}>{p.avgComm}%</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(p.totalComm))}</td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className={tfootClass}>
                  <tr>
                    <td className={`${tdBase} font-semibold`}>TOTAL</td>
                    <td className={tdBase}>-</td>
                    <td className={tdBase}>-</td>
                    <td className={tdBase}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalProcedure.totalSale)}</td>
                    <td className={tdBase}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalProcedure.totalComm)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="px-4 py-2">
              {renderPagination(pageProcedure, setPageProcedure, totalPagesProcedure)}
            </div>
          </Card>

          <div className="flex justify-between items-center mt-4 mb-2">
            <h2 className="text-xl font-bold text-pink-600">KOMISI PAKET</h2>
            <button
              onClick={() => {
                setModalMode("packet");
                setShowModal(true);
              }}
              className="bg-pink-600 text-white text-xs px-3 py-2 rounded hover:bg-pink-700"
            >
              + Tambah Paket
            </button>
          </div>

          <Card className="shadow-md overflow-hidden mb-12 border border-pink-200">
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-pink-100 border-b border-pink-200">
                  <tr>
                    {[
                      "PAKET",
                      "SKU",
                      "QTY",
                      "HARGA JUAL",
                      "TOTAL PENJUALAN",
                      "KOMISI (%)",
                      "TOTAL KOMISI",
                    ].map((col, i) => (
                      <th key={i} className={thClass}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-pink-100">
                  {displayedPacket.map((p, idx) => (
                    <tr key={idx} className="hover:bg-pink-50">
                      <td className={tdBase}>{p.name}</td>
                      <td className={tdBase}>{p.sku}</td>
                      <td className={`${tdBase} text-right`}>{p.quantity}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(p.salePrice))}</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(p.totalSale))}</td>
                      <td className={`${tdBase} text-right`}>{p.avgComm}%</td>
                      <td className={`${tdBase} text-right`}>{formatCurrency(toNumber(p.totalComm))}</td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className={tfootClass}>
                  <tr>
                    <td className={`${tdBase} font-semibold`}>TOTAL</td>
                    <td className={tdBase}>-</td>
                    <td className={tdBase}>-</td>
                    <td className={tdBase}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalPacket.totalSale)}</td>
                    <td className={tdBase}>-</td>
                    <td className={`${tdBase} text-right`}>{formatCurrency(totalPacket.totalComm)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="px-4 py-2">
              {renderPagination(pagePacket, setPagePacket, totalPagesPacket)}
            </div>
          </Card>

          <div className="flex justify-between items-center mt-4 mb-2">
            <h2 className="text-xl font-bold text-pink-600">PEMBAYARAN</h2>
          </div>

          <Card className="shadow-md overflow-hidden mb-12 border border-pink-200">
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead className="bg-pink-100 border-b border-pink-200">
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
                    ].map((col, i) => (
                      <th key={i} className={thClass}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-pink-100">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-10 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                        </div>
                      </td>
                    </tr>
                  ) : displayedPayment.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-6 text-center text-pink-600">
                        Tidak ada data pembayaran.
                      </td>
                    </tr>
                  ) : (
                    displayedPayment.map((p) => (
                      <tr key={p.id} className="hover:bg-pink-50">
                        <td className={tdBase}>
                          {formatDate(p.createdAt)}
                        </td>
                        <td className={`${tdBase} font-semibold text-pink-700`}>{p.paymentNumber}</td>
                        <td className={`${tdBase} font-semibold`}>{p.visit.patient.fullName}</td>
                        <td className={tdBase}>{p.visit.visitNumber}</td>
                        <td className={`${tdBase} text-right font-semibold`}>
                          {formatCurrency(p.amount)}
                        </td>
                        <td className={tdBase}>{methodLabel(p.paymentMethod)}</td>
                        <td className={`${tdBase} text-right`}>
                          {formatCurrency(p.paidAmount)}
                        </td>
                        <td className={`${tdBase} text-right`}>
                          {formatCurrency(p.changeAmount)}
                        </td>
                        <td className={tdBase}>
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
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot className={tfootClass}>
                  <tr>
                    <td colSpan={4} className={`${tdBase} font-semibold`}>
                      TOTAL
                    </td>
                    <td className={`${tdBase} text-right`}>
                      {formatCurrency(totalPayment.totalBill)}
                    </td>
                    <td className={tdBase} />
                    <td className={`${tdBase} text-right`}>
                      {formatCurrency(totalPayment.amountPaid)}
                    </td>
                    <td className={`${tdBase} text-right`}>
                      {formatCurrency(totalPayment.change)}
                    </td>
                    <td className={tdBase} />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="px-4 py-2">
              {renderPagination(pagePayment, setPagePayment, totalPagesPayment)}
            </div>
          </Card>

          {showPdfModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowPdfModal(false)}
                aria-hidden
              />
              <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-pink-200 shadow-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-pink-100 bg-pink-50">
                  <h3 className="text-sm font-bold text-pink-700">Download PDF</h3>
                  <p className="text-xs text-pink-600 mt-1">
                    Pilih tabel yang ingin diunduh atau unduh semuanya.
                  </p>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: "all", label: "Semua Tabel" },
                      { key: "medical", label: "Komisi Tenaga Medis" },
                      { key: "procedure", label: "Komisi Prosedur/Layanan" },
                      { key: "packet", label: "Komisi Paket" },
                      { key: "payment", label: "Pembayaran" },
                    ].map((opt: any) => (
                      <button
                        key={opt.key}
                        onClick={() => setPdfScope(opt.key)}
                        className={`text-left px-4 py-3 rounded-xl border transition ${
                          pdfScope === opt.key
                            ? "border-pink-400 bg-pink-50 shadow-sm"
                            : "border-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        <div className="text-sm font-semibold text-pink-800">
                          {opt.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {opt.key === "all"
                            ? "Gabungkan jadi 1 file PDF (multi halaman)"
                            : "1 tabel menjadi 1 file PDF"}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-5">
                    <Button
                      variant="outline"
                      className="border-pink-200 text-pink-700 hover:bg-pink-50"
                      onClick={() => setShowPdfModal(false)}
                    >
                      Batal
                    </Button>

                    <Button
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                      onClick={() => {
                        setShowPdfModal(false);
                        exportPDF(pdfScope);
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowModal(false)}
                aria-hidden
              />
              <div className="relative z-10 w-full max-w-xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg border border-pink-100">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-pink-100">
                    <h3 className="text-sm font-semibold text-pink-700">
                      {modalMode === "medical"
                        ? "Tambah Laporan Keuangan"
                        : modalMode === "procedure"
                        ? "Tambah Prosedur"
                        : "Tambah Paket"}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="h-7 w-7 flex items-center justify-center rounded-md text-pink-600 hover:bg-pink-50 active:bg-pink-100 transition"
                      aria-label="Tutup"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-0">
                    {modalMode === "medical" && (
                      <AddFinance
                        onClose={() => setShowModal(false)}
                        handleSave={handleSaveFinance}
                      />
                    )}

                    {modalMode === "procedure" && (
                      <AddProcedure
                        onClose={() => setShowModal(false)}
                        handleSave={handleSaveProcedure}
                      />
                    )}

                    {modalMode === "packet" && (
                      <AddPacket
                        onClose={() => setShowModal(false)}
                        handleSave={handleSavePacket}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="fixed right-4 bottom-4 z-50">
            {toast.show && (
              <div
                role="status"
                aria-live="polite"
                className={`min-w-[220px] max-w-sm px-4 py-3 rounded shadow-md text-sm font-medium ${
                  toast.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-white border border-pink-200 text-pink-700"
                }`}
              >
                {toast.msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}