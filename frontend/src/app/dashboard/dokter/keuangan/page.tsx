"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import DoctorNavbar from "@/components/ui/navbardr";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface MedicalStaff {
  name: string;
  procedur: number;
  initialCommission: number;
  modalPrice: number;
  commission: string;
  pharmacy: number;
  modalPriceComm: number;
  avgCommission: string;
  packet: number;
  avgPacket: string;
  lab: number;
}

interface Procedure {
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  totalSale: number;
  avgComm: string;
  totalComm: number;
}

interface Packet {
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  totalSale: number;
  avgComm: string;
  totalComm: number;
}

const PAGE_SIZE = 20;

export default function CommissionReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageMedical, setPageMedical] = useState(1);
  const [pageProcedure, setPageProcedure] = useState(1);
  const [pagePacket, setPagePacket] = useState(1);

  const [startDate, setStartDate] = useState<Date | null>(new Date("2025-09-29"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-10-26"));

  // --- Dummy Data ---
  const medicalStaff: MedicalStaff[] = Array.from({ length: 30 }, (_, i) => ({
    name: `Dr. Staff ${i + 1}`,
    procedur: (i + 1) * 1000000,
    initialCommission: (i + 1) * 100000,
    modalPrice: (i + 1) * 50000,
    commission: `${(20 + (i % 10)).toFixed(2)}%`,
    pharmacy: (i + 1) * 20000,
    modalPriceComm: (i + 1) * 10000,
    avgCommission: `${(15 + (i % 10)).toFixed(2)}%`,
    packet: (i + 1) * 50000,
    avgPacket: `${(10 + (i % 5)).toFixed(2)}%`,
    lab: (i + 1) * 10000,
  }));

  const procedures: Procedure[] = Array.from({ length: 30 }, (_, i) => {
    const sale = 100000 + i * 5000;
    const qty = 1 + (i % 5);
    const avgCommVal = 10 + (i % 10);
    return {
      name: `Procedure ${i + 1}`,
      code: `P${(i + 1).toString().padStart(3, "0")}`,
      quantity: qty,
      salePrice: sale,
      totalSale: sale * qty,
      avgComm: `${avgCommVal.toFixed(2)}%`,
      totalComm: Math.round((sale * qty * avgCommVal) / 100),
    };
  });

  const packets: Packet[] = Array.from({ length: 30 }, (_, i) => {
    const sale = 200000 + i * 10000;
    const qty = 1 + (i % 5);
    const avgCommVal = 10 + (i % 10);
    return {
      name: `Packet ${i + 1}`,
      sku: `PKT${(i + 1).toString().padStart(3, "0")}`,
      quantity: qty,
      salePrice: sale,
      totalSale: sale * qty,
      avgComm: `${avgCommVal.toFixed(2)}%`,
      totalComm: Math.round((sale * qty * avgCommVal) / 100),
    };
  });

  // --- Filtering ---
  const filteredMedical = useMemo(
    () => medicalStaff.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, medicalStaff]
  );
  const filteredProcedure = useMemo(
    () => procedures.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, procedures]
  );
  const filteredPacket = useMemo(
    () => packets.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, packets]
  );

  const displayedMedical = filteredMedical.slice((pageMedical - 1) * PAGE_SIZE, pageMedical * PAGE_SIZE);
  const displayedProcedure = filteredProcedure.slice((pageProcedure - 1) * PAGE_SIZE, pageProcedure * PAGE_SIZE);
  const displayedPacket = filteredPacket.slice((pagePacket - 1) * PAGE_SIZE, pagePacket * PAGE_SIZE);

  const totalPagesMedical = Math.ceil(filteredMedical.length / PAGE_SIZE);
  const totalPagesProcedure = Math.ceil(filteredProcedure.length / PAGE_SIZE);
  const totalPagesPacket = Math.ceil(filteredPacket.length / PAGE_SIZE);

  // --- TOTALS ---
  const totalMedical = filteredMedical.reduce(
    (acc, s) => ({
      procedur: acc.procedur + s.procedur,
      initialCommission: acc.initialCommission + s.initialCommission,
      modalPrice: acc.modalPrice + s.modalPrice,
      pharmacy: acc.pharmacy + s.pharmacy,
      modalPriceComm: acc.modalPriceComm + s.modalPriceComm,
      packet: acc.packet + s.packet,
      lab: acc.lab + s.lab,
    }),
    { procedur: 0, initialCommission: 0, modalPrice: 0, pharmacy: 0, modalPriceComm: 0, packet: 0, lab: 0 }
  );

  const totalProcedure = filteredProcedure.reduce(
    (acc, p) => ({
      totalSale: acc.totalSale + p.totalSale,
      totalComm: acc.totalComm + p.totalComm,
    }),
    { totalSale: 0, totalComm: 0 }
  );

  const totalPacket = filteredPacket.reduce(
    (acc, p) => ({
      totalSale: acc.totalSale + p.totalSale,
      totalComm: acc.totalComm + p.totalComm,
    }),
    { totalSale: 0, totalComm: 0 }
  );

  // --- Export PDF ---
  const exportPDF = () => {
    const doc = new jsPDF();
    const tableOptions = {
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    };

    doc.text("Commission Report", 14, 14);
    doc.setFontSize(10);
    doc.text("Komisi Tenaga Medis", 14, 20);

    autoTable(doc, {
      ...tableOptions,
      head: [[
        "TENAGA MEDIS","PROSEDUR","POTONGAN AWAL","HARGA MODAL (BHP)",
        "KOMISI (AVG)","FARMASI","HARGA MODAL","KOMISI (AVG)",
        "PAKET","KOMISI (AVG)","LAB"
      ]],
      body: filteredMedical.map((s) => [
        s.name,s.procedur,s.initialCommission,s.modalPrice,s.commission,
        s.pharmacy,s.modalPriceComm,s.avgCommission,s.packet,s.avgPacket,s.lab
      ]),
      foot: [[
        "TOTAL", totalMedical.procedur, totalMedical.initialCommission, totalMedical.modalPrice,
        "-", totalMedical.pharmacy, totalMedical.modalPriceComm, "-", totalMedical.packet, "-", totalMedical.lab
      ]],
    });

    doc.addPage();
    doc.text("Komisi per Prosedur", 14, 10);
    autoTable(doc, {
      ...tableOptions,
      startY: 14,
      head: [["PROSEDUR","KODE","KUANTITAS","HARGA JUAL (AVG)","TOTAL PENJUALAN","KOMISI (AVG)","TOTAL KOMISI"]],
      body: filteredProcedure.map((p) => [p.name,p.code,p.quantity,p.salePrice,p.totalSale,p.avgComm,p.totalComm]),
      foot: [["TOTAL","-","-", "-","", "-", totalProcedure.totalComm]],
    });

    doc.addPage();
    doc.text("Komisi Paket", 14, 10);
    autoTable(doc, {
      ...tableOptions,
      startY: 14,
      head: [["PAKET","SKU","KUANTITAS","HARGA JUAL (AVG)","TOTAL PENJUALAN","KOMISI (AVG)","TOTAL KOMISI"]],
      body: filteredPacket.map((p) => [p.name,p.sku,p.quantity,p.salePrice,p.totalSale,p.avgComm,p.totalComm]),
      foot: [["TOTAL","-","-","-","", "-", totalPacket.totalComm]],
    });

    doc.save("Commission_Report.pdf");
  };

  // --- Export XLS ---
  const exportXLS = () => {
    const wb = XLSX.utils.book_new();
    const wsMedical = XLSX.utils.json_to_sheet(filteredMedical.map((s) => ({
      "TENAGA MEDIS": s.name,
      PROSEDUR: s.procedur,
      "POTONGAN AWAL": s.initialCommission,
      "HARGA MODAL (BHP)": s.modalPrice,
      "KOMISI (AVG)": s.commission,
      FARMASI: s.pharmacy,
      "HARGA MODAL": s.modalPriceComm,
      "KOMISI (AVG) 2": s.avgCommission,
      PAKET: s.packet,
      "KOMISI (AVG) 3": s.avgPacket,
      LAB: s.lab,
    })));
    XLSX.utils.book_append_sheet(wb, wsMedical, "Medical");

    const wsProcedure = XLSX.utils.json_to_sheet(filteredProcedure.map((p) => ({
      PROSEDUR: p.name,
      KODE: p.code,
      KUANTITAS: p.quantity,
      "HARGA JUAL (AVG)": p.salePrice,
      "TOTAL PENJUALAN": p.totalSale,
      "KOMISI (AVG)": p.avgComm,
      "TOTAL KOMISI": p.totalComm,
    })));
    XLSX.utils.book_append_sheet(wb, wsProcedure, "Procedure");

    const wsPacket = XLSX.utils.json_to_sheet(filteredPacket.map((p) => ({
      PAKET: p.name,
      SKU: p.sku,
      KUANTITAS: p.quantity,
      "HARGA JUAL (AVG)": p.salePrice,
      "TOTAL PENJUALAN": p.totalSale,
      "KOMISI (AVG)": p.avgComm,
      "TOTAL KOMISI": p.totalComm,
    })));
    XLSX.utils.book_append_sheet(wb, wsPacket, "Packet");

    XLSX.writeFile(wb, "Commission_Report.xlsx");
  };

  const renderPagination = (page: number, setPage: (val: number) => void, totalPages: number) => (
    <div className="flex justify-end gap-4 items-center mt-2 mb-6">
      <span
        className={`cursor-pointer text-pink-600 text-lg font-bold ${page === 1 ? "opacity-40 pointer-events-none" : ""}`}
        onClick={() => setPage(page - 1)}
      >
        ←
      </span>
      <span className="text-xs text-pink-600">Page {page} of {totalPages}</span>
      <span
        className={`cursor-pointer text-pink-600 text-lg font-bold ${page === totalPages ? "opacity-40 pointer-events-none" : ""}`}
        onClick={() => setPage(page + 1)}
      >
        →
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Filter */}
        <Card className="shadow-md">
          <CardContent className="p-4 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[250px] mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <Input
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-pink-300"
              />
            </div>
            <div className="flex items-center gap-2 border border-pink-300 rounded-lg px-3 py-1 mt-6">
              <Calendar className="w-4 h-4 text-pink-600" />
              <DatePicker
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                className="border p-1 rounded text-xs"
              />
              <span>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => date && setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || undefined}
                dateFormat="dd/MM/yyyy"
                className="border p-1 rounded text-xs"
              />
            </div>
            <Button variant="outline" className="border-pink-300 text-pink-700 mt-6 text-xs px-2 py-1" onClick={exportPDF}>PDF</Button>
            <Button variant="outline" className="border-pink-300 text-pink-700 mt-6 text-xs px-2 py-1" onClick={exportXLS}>XLS</Button>
          </CardContent>
        </Card>

        {/* Medical */}
        <h2 className="text-xl font-bold text-pink-600 mb-2 mt-5">KOMISI TENAGA MEDIS</h2>
        <Card className="shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {["TENAGA MEDIS","PROSEDUR","POTONGAN AWAL","HARGA MODAL (BHP)","KOMISI (AVG)","FARMASI","HARGA MODAL","KOMISI (AVG)","PAKET","KOMISI (AVG)","LAB"].map(
                    col => <th key={col} className="px-3 py-2 text-left font-semibold text-pink-900">{col}</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {displayedMedical.map((s, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-3 py-2">{s.name}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.procedur.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.initialCommission.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.modalPrice.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{s.commission}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.pharmacy.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.modalPriceComm.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{s.avgCommission}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.packet.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{s.avgPacket}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${s.lab.toLocaleString()}`}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td className="px-3 py-2">TOTAL</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.procedur.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.initialCommission.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.modalPrice.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-right">-</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.pharmacy.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.modalPriceComm.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-right">-</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.packet.toLocaleString()}`}</td>
                  <td className="px-3 py-2 text-right">-</td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalMedical.lab.toLocaleString()}`}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
        {renderPagination(pageMedical, setPageMedical, totalPagesMedical)}

        {/* Procedure */}
        <h2 className="text-xl font-bold text-pink-600 mb-2">KOMISI PROSEDUR / LAYANAN</h2>
        <Card className="shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {["PROSEDUR","KODE","KUANTITAS","HARGA JUAL (AVG)","TOTAL PENJUALAN","KOMISI (AVG)","TOTAL KOMISI"].map(
                    col => <th key={col} className="px-3 py-2 text-left font-semibold text-pink-900">{col}</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {displayedProcedure.map((p, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-center">{p.code}</td>
                    <td className="px-3 py-2 text-center">{p.quantity}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${p.salePrice.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${p.totalSale.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{p.avgComm}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${p.totalComm.toLocaleString()}`}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td className="px-3 py-2">TOTAL</td>
                  <td colSpan={4}></td>
                  <td></td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalProcedure.totalComm.toLocaleString()}`}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
        {renderPagination(pageProcedure, setPageProcedure, totalPagesProcedure)}

        {/* Packet */}
        <h2 className="text-xl font-bold text-pink-600 mb-2">KOMISI PAKET</h2>
        <Card className="shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-pink-100">
                <tr>
                  {["PAKET","SKU","KUANTITAS","HARGA JUAL (AVG)","TOTAL PENJUALAN","KOMISI (AVG)","TOTAL KOMISI"].map(
                    col => <th key={col} className="px-3 py-2 text-left font-semibold text-pink-900">{col}</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {displayedPacket.map((p, idx) => (
                  <tr key={idx} className="hover:bg-pink-50">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-center">{p.sku}</td>
                    <td className="px-3 py-2 text-center">{p.quantity}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${p.salePrice.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${p.totalSale.toLocaleString()}`}</td>
                    <td className="px-3 py-2 text-right">{p.avgComm}</td>
                    <td className="px-3 py-2 text-right">{`Rp. ${p.totalComm.toLocaleString()}`}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pink-50 font-semibold">
                <tr>
                  <td className="px-3 py-2">TOTAL</td>
                  <td colSpan={4}></td>
                  <td></td>
                  <td className="px-3 py-2 text-right">{`Rp. ${totalPacket.totalComm.toLocaleString()}`}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
        {renderPagination(pagePacket, setPagePacket, totalPagesPacket)}

      </div>
    </div>
  );
}
