"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, Loader2, Pencil } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";

/* ========== TYPES ========== */
interface Medication {
  id?: string;
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

interface Visit {
  date: string;
  doctor: string;
  action: string;
  diagnosis: string;
}

interface Examination {
  chiefComplaint: string;
  physical: string;
  treatmentPlan: string;
}

interface RecordType {
  rmNo: string;
  noId?: string;
  name?: string;
  age?: number;
  gender?: string;
  birthDate?: string;
  address?: string;
  notes?: string;
  phone?: string;
  catatan?: string;
  clinicLogoUrl?: string;
  visit?: {
    date?: string;
    doctor?: string;
    action?: string;
    diagnosis?: string;
  };
  examination?: {
    chiefComplaint?: string;
    physical?: string;
    treatmentPlan?: string;
    note?: string;
  };
  medications?: Medication[];
}

/* ========== DUMMY DATA ========== */
const dummyRecords: RecordType[] = Array.from({ length: 30 }).map((_, i) => ({
  rmNo: `RM-${(i + 1).toString().padStart(3, "0")}`,
  noId: `008-00${900 + i}`,
  name: `Adil Kasun Sweger`,
  age: 35,
  gender: "Laki-laki",
  birthDate: "15 Mei 1990",
  address: "Jl. Merdeka No. 123, Jakarta Selatan",
  phone: "+62 812-3456-7890",
  bloodType: "A+",
  catatan: "Penisilin, Kacang",
  visit: {
    date: "17 Juli 2025",
    doctor: "dr. Sarah Aminah",
    action: "Scaling Class 1",
    diagnosis: i % 3 === 0 ? "Kalkulus supragingiva" : "Karies dentini",
  },
  examination: {
    chiefComplaint:
      "Pasien mengeluhkan adanya karang gigi dan gusi berdarah saat menyikat gigi",
    physical:
      "Terlihat kalkulus supragingiva pada regio anterior rahang bawah dan atas. Gingiva terlihat meradang dengan warna kemerahan.",
    treatmentPlan: "Scaling dan pembersihan menyeluruh, edukasi kebersihan mulut",
  },
  medications:
    i % 2 === 0
      ? [
          {
            id: "m1",
            name: "Chlorhexidine Mouthwash 0.2%",
            dosage: "2x sehari",
            duration: "7 hari",
            instructions: "Berkumur 15 ml selama 30 detik",
          },
          {
            id: "m2",
            name: "Asam Mefenamat 500mg",
            dosage: "3x1 tablet",
            duration: "3 hari jika nyeri",
            instructions: "Diminum setelah makan",
          },
        ]
      : [],
}));

/* ========== COMPONENT ========== */
export default function RekamMedisDetailPage() {
  const [selectedRm] = useState("RM-001");
  const [isDownloading, setIsDownloading] = useState(false);

  const rm = selectedRm.trim();
  const found = dummyRecords.find((r) => r.rmNo.toLowerCase() === rm.toLowerCase());

  // main editable state (data)
  const [data, setData] = useState<RecordType | undefined>(found);

  // edit toggles
  const [editVisit, setEditVisit] = useState(false);
  const [editExam, setEditExam] = useState(false);
  const [editMeds, setEditMeds] = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(data?.notes ?? "");


  // ===== medsDraft: inisialisasi dari data (jangan pakai meds sebelum dideklarasikan) =====
  const [medsDraft, setMedsDraft] = useState<Medication[]>(data?.medications ?? []);

  // safe draft states (never undefined)
  const emptyVisit: Visit = { date: "", doctor: "", action: "", diagnosis: "" };
  const emptyExam: Examination = { chiefComplaint: "", physical: "", treatmentPlan: "" };

  const [visitDraft, setVisitDraft] = useState<Visit>({
    date: data?.visit?.date ?? "",
    doctor: data?.visit?.doctor ?? "",
    action: data?.visit?.action ?? "",
    diagnosis: data?.visit?.diagnosis ?? "",
  });

  const [examDraft, setExamDraft] = useState<Examination>({
    chiefComplaint: data?.examination?.chiefComplaint ?? "",
    physical: data?.examination?.physical ?? "",
    treatmentPlan: data?.examination?.treatmentPlan ?? "",
  });

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    setIsDownloading(true);

    try {
      if (!(window as any).PDFLib) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const { PDFDocument, StandardFonts, rgb } = (window as any).PDFLib;

      const PAGE_WIDTH = 595;
      const PAGE_HEIGHT = 842;
      const MARGIN = 50;
      const FOOTER_HEIGHT = 60;
      const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
      const LINE_HEIGHT = 13;
      const CELL_PADDING = 6;
      const FONT_SIZE_NORMAL = 7;
      const FONT_SIZE_HEADER = 16;
      const FONT_SIZE_SECTION = 9;
      const BG_SECTION = rgb(0.96, 0.98, 1);
      const COLOR_PRIMARY = rgb(0.06, 0.2, 0.5);
      const SECTION_SPACING = 15;

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let { width, height } = page.getSize();
      let cursorY = height - MARGIN;

      const newPage = () => {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        ({ width, height } = page.getSize());
        cursorY = height - MARGIN;
      };
      const ensureSpace = (needed: number) => {
        if (cursorY - needed < FOOTER_HEIGHT) newPage();
      };
      const splitTextToLines = (text: any, usedFont: any, size: number, maxW: number) => {
        if (!text || String(text).trim() === "") return ["-"];
        const words = String(text).split(/\s+/);
        const lines: string[] = [];
        let line = "";
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (usedFont.widthOfTextAtSize(test, size) + 1 > maxW) {
            if (line) lines.push(line);
            line = w;
          } else line = test;
        }
        if (line) lines.push(line);
        return lines.length ? lines : ["-"];
      };

      // logo
      let logoImage: any = null;
      let logoW = 0, logoH = 0;
      try {
        const logoUrl = data?.clinicLogoUrl;
        if (logoUrl) {
          const res = await fetch(logoUrl);
          if (res.ok) {
            const arr = new Uint8Array(await res.arrayBuffer());
            try { logoImage = await pdfDoc.embedPng(arr); } catch { logoImage = await pdfDoc.embedJpg(arr); }
            const maxLogoW = 70;
            const scale = Math.min(1, maxLogoW / logoImage.width);
            logoW = logoImage.width * scale;
            logoH = logoImage.height * scale;
          }
        }
      } catch (e) { console.warn("Logo load failed", e); }

      const drawHeader = (title: string) => {
        const headerHeight = Math.max(logoH, FONT_SIZE_HEADER) + 8;
        ensureSpace(headerHeight + 8);
        const titleWidth = fontBold.widthOfTextAtSize(title, FONT_SIZE_HEADER);
        const titleX = MARGIN + Math.max(0, (CONTENT_WIDTH - titleWidth) / 2);
        const titleY = cursorY;
        if (logoImage) page.drawImage(logoImage, { x: MARGIN, y: cursorY - logoH + 6, width: logoW, height: logoH });
        page.drawText(title, { x: titleX, y: titleY, size: FONT_SIZE_HEADER, font: fontBold, color: COLOR_PRIMARY });
        cursorY -= headerHeight;
      };

      const drawMeta = (meta: string) => {
        ensureSpace(18);
        page.drawText(meta, { x: MARGIN, y: cursorY - 4, size: 9, font });
        cursorY -= 18;
      };

      const drawSectionTitle = (title: string) => {
        cursorY -= SECTION_SPACING;
        const barH = 20;
        ensureSpace(barH + SECTION_SPACING);
        page.drawRectangle({
          x: MARGIN - 2,
          y: cursorY - barH + 2,
          width: CONTENT_WIDTH + 4,
          height: barH,
          color: BG_SECTION,
        });
        page.drawText(title, {
          x: MARGIN + 6,
          y: cursorY - barH + 7,
          size: FONT_SIZE_SECTION,
          font: fontBold,
          color: rgb(0.06, 0.3, 0.6),
        });
        cursorY -= barH + 8;
      };

      const drawTable = (rows: string[][], colWidths: number[]) => {
        for (const row of rows) while (row.length < colWidths.length) row.push("");
        for (const row of rows) {
          const cellsLines = row.map((cell, idx) =>
            splitTextToLines(cell, idx % 2 === 0 ? fontBold : font, FONT_SIZE_NORMAL, Math.max(10, colWidths[idx] - CELL_PADDING * 2))
          );
          const maxLines = Math.max(...cellsLines.map((cl) => cl.length));
          const rowHeight = maxLines * LINE_HEIGHT + CELL_PADDING * 2;
          ensureSpace(rowHeight + 8);
          const rowTop = cursorY;

          page.drawLine({ start: { x: MARGIN, y: rowTop }, end: { x: MARGIN + colWidths.reduce((a, b) => a + b, 0), y: rowTop }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });

          let x = MARGIN;
          for (let ci = 0; ci < colWidths.length; ci++) {
            const cw = colWidths[ci];
            page.drawLine({ start: { x, y: rowTop }, end: { x, y: rowTop - rowHeight }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
            let textY = rowTop - CELL_PADDING - FONT_SIZE_NORMAL;
            for (const ln of cellsLines[ci]) {
              page.drawText(ln, { x: x + CELL_PADDING, y: textY, size: FONT_SIZE_NORMAL, font: ci % 2 === 0 ? fontBold : font });
              textY -= LINE_HEIGHT;
            }
            x += cw;
          }

          const totalW = colWidths.reduce((a, b) => a + b, 0);
          page.drawLine({ start: { x: MARGIN + totalW, y: rowTop }, end: { x: MARGIN + totalW, y: rowTop - rowHeight }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
          page.drawLine({ start: { x: MARGIN, y: rowTop - rowHeight }, end: { x: MARGIN + totalW, y: rowTop - rowHeight }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
          cursorY -= rowHeight + 6;
        }
      };

      // build pdf content using `data`
      drawHeader("REKAM MEDIS PASIEN");
      drawMeta(`Tanggal Cetak: ${new Date().toLocaleDateString()}`);

      drawSectionTitle("Informasi Pasien");
      const patientRows = [
        ["No. Rekam Medis", data?.rmNo ?? "-", "No. ID", data?.noId ?? "-"],
        ["Nama Lengkap", data?.name ?? "-", "Umur", data?.age ? `${data.age} tahun` : "-"],
        ["Jenis Kelamin", data?.gender ?? "-", "Tanggal Lahir", data?.birthDate ?? "-"],
        ["Alamat", data?.address ?? "-", "No. Telepon", data?.phone ?? "-"],
        ["Catatan", data?.catatan ?? "-", "", ""],
      ];
      const labelW = 90;
      const flexible = CONTENT_WIDTH - labelW * 2;
      const patientColWidths = [labelW, Math.floor(flexible * 0.45) + labelW, labelW, CONTENT_WIDTH - (labelW + (Math.floor(flexible * 0.45) + labelW) + labelW)];
      drawTable(patientRows, patientColWidths);

      drawSectionTitle("Informasi Kunjungan Terkini");
      drawTable(
        [
          ["Tanggal Kunjungan", data?.visit?.date ?? "-"],
          ["Dokter Pemeriksa", data?.visit?.doctor ?? "-"],
          ["Tindakan", data?.visit?.action ?? "-"],
          ["Diagnosis", data?.visit?.diagnosis ?? "-"],
        ],
        [130, CONTENT_WIDTH - 130]
      );

      drawSectionTitle("Detail Pemeriksaan");
      drawTable(
        [
          ["Keluhan Utama", data?.examination?.chiefComplaint ?? "-"],
          ["Hasil Pemeriksaan Fisik", data?.examination?.physical ?? "-"],
          ["Rencana Perawatan", data?.examination?.treatmentPlan ?? "-"],
        ],
        [160, CONTENT_WIDTH - 160]
      );

      if (data?.examination?.note) {
        cursorY -= 4;
        ensureSpace(40);
        page.drawRectangle({ x: MARGIN, y: cursorY + 12, width: 6, height: 6, color: rgb(1, 0.85, 0.15) });
        let ty = cursorY + 10;
        for (const ln of splitTextToLines(`Catatan: ${data.examination.note}`, font, FONT_SIZE_NORMAL, CONTENT_WIDTH - 20)) {
          page.drawText(ln, { x: MARGIN + 12, y: ty, size: FONT_SIZE_NORMAL, font });
          ty -= LINE_HEIGHT;
        }
        cursorY = ty - 8;
      }

      drawSectionTitle("Obat yang Diberikan");
      const pdfMeds = data?.medications ?? [];
      if (!Array.isArray(pdfMeds) || pdfMeds.length === 0) {
        drawTable([["Obat", "Tidak ada obat yang diresepkan."]], [90, CONTENT_WIDTH - 90]);
      } else {
        const medRows = pdfMeds.map((m: any, i: number) => [
          (i + 1).toString(),
          `${m.name}${m.dosage ? " | Dosis: " + m.dosage : ""}${m.duration ? " | Durasi: " + m.duration : ""}${m.instructions ? " | Petunjuk: " + m.instructions : ""}`,
        ]);
        drawTable([["No", "Rincian Obat"]], [40, CONTENT_WIDTH - 40]);
        drawTable(medRows, [40, CONTENT_WIDTH - 40]);
      }

      (pdfDoc.getPages() as any[]).forEach((p: any, idx: number) => {
        const { width: pw } = p.getSize();
        p.drawLine({ start: { x: MARGIN, y: FOOTER_HEIGHT - 20 }, end: { x: pw - MARGIN, y: FOOTER_HEIGHT - 20 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
        p.drawText(`© ${new Date().getFullYear()} RoxyDental`, { x: MARGIN, y: FOOTER_HEIGHT - 34, size: 9, font, color: rgb(0.45, 0.45, 0.45) });
        const pageLabel = `Halaman ${idx + 1} / ${pdfDoc.getPages().length}`;
        const px = font.widthOfTextAtSize(pageLabel, 9);
        p.drawText(pageLabel, { x: pw - MARGIN - px, y: FOOTER_HEIGHT - 34, size: 9, font, color: rgb(0.45, 0.45, 0.45) });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data?.rmNo ?? "rekam_medis"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh PDF. Cek console untuk detail.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-pink-700 font-semibold text-lg">No RM tidak ditemukan</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Kembali ke daftar
          </Button>
        </div>
      </div>
    );
  }

  const meds = data.medications ?? [];

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div id="rekam-medis-root" className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/dashboard/dokter/pasien/rekam-medis"
            className="inline-flex items-center gap-2 bg-white/60 border border-pink-200 text-pink-700 px-3 py-2 rounded shadow-sm text-sm cursor-pointer hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </a>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white border text-pink-400 text-sm"
            >
              <Printer className="w-4 h-4" /> Cetak
            </Button>

            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-pink-600 text-white hover:bg-pink-700 text-sm"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Mengunduh...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Unduh PDF
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
          {/* Left column */}
          <div>
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-600 text-white rounded-t-md">
                <CardTitle className="text-lg font-semibold">Informasi Pasien</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white text-sm pt-4">
                <div>
                  <p className="text-xs text-gray-400">NO. REKAM MEDIS</p>
                  <p className="font-semibold text-pink-700 mt-1">{data.rmNo}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">NO. ID</p>
                  <p className="font-medium mt-1">{data.noId}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">NAMA LENGKAP</p>
                  <p className="font-medium mt-1">{data.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">UMUR</p>
                    <p className="font-medium mt-1">{data.age ?? "-"} tahun</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">JENIS KELAMIN</p>
                    <p className="font-medium mt-1">{data.gender ?? "-"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400">TANGGAL LAHIR</p>
                  <p className="font-medium mt-1">{data.birthDate ?? "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">ALAMAT</p>
                  <p className="font-medium mt-1">{data.address ?? "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">NO. TELEPON</p>
                  <p className="font-medium mt-1">{data.phone ?? "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">CATATAN</p>
                  <p className="text-pink-700 font-medium mt-1">{data.catatan?? "-"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6 font-sans">
            {/* Kunjungan */}
            <Card className="shadow-lg">
              <CardHeader className="bg-yellow-400/40 rounded-t-md py-3">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-lg font-semibold leading-none">
                    Informasi Kunjungan Terkini
                  </CardTitle>

                  {!editVisit ? (
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setVisitDraft({
                          date: data.visit?.date ?? "",
                          doctor: data.visit?.doctor ?? "",
                          action: data.visit?.action ?? "",
                          diagnosis: data.visit?.diagnosis ?? "",
                        });
                        setEditVisit(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setData((prev) => (prev ? { ...prev, visit: { ...visitDraft } } : prev));
                          setEditVisit(false);
                        }}
                      >
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        className="h-8"
                        variant="outline"
                        onClick={() => {
                          setVisitDraft({
                            date: data.visit?.date ?? "",
                            doctor: data.visit?.doctor ?? "",
                            action: data.visit?.action ?? "",
                            diagnosis: data.visit?.diagnosis ?? "",
                          });
                          setEditVisit(false);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start bg-white text-sm pt-4">
                <div>
                  <p className="text-xs text-gray-400">TANGGAL KUNJUNGAN</p>
                  {editVisit ? (
                    <input className="border rounded px-2 py-1 w-full" value={visitDraft.date} onChange={(e) => setVisitDraft({ ...visitDraft, date: e.target.value })} />
                  ) : (
                    <p className="font-medium mt-1">{data.visit?.date ?? "-"}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400">DOKTER PEMERIKSA</p>
                  {editVisit ? (
                    <input className="border rounded px-2 py-1 w-full" value={visitDraft.doctor} onChange={(e) => setVisitDraft({ ...visitDraft, doctor: e.target.value })} />
                  ) : (
                    <p className="font-medium mt-1">{data.visit?.doctor ?? "-"}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400">TINDAKAN</p>
                  {editVisit ? (
                    <input className="border rounded px-2 py-1 w-full" value={visitDraft.action} onChange={(e) => setVisitDraft({ ...visitDraft, action: e.target.value })} />
                  ) : (
                    <p className="font-medium mt-1">{data.visit?.action ?? "-"}</p>
                  )}
                </div>

                <div className="md:col-span-3 mt-2">
                  <p className="text-xs text-gray-400">DIAGNOSIS</p>
                  {editVisit ? (
                    <textarea rows={3} className="w-full border rounded px-2 py-1" value={visitDraft.diagnosis} onChange={(e) => setVisitDraft({ ...visitDraft, diagnosis: e.target.value })} />
                  ) : (
                    <div className="mt-2 rounded-md bg-pink-50 p-3">
                      <p className="text-pink-700 font-semibold">{data.visit?.diagnosis ?? "-"}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pemeriksaan */}
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-600 text-white rounded-t-md">
                <div className="flex w-full items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Detail Pemeriksaan
                  </CardTitle>

                  {!editExam ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setExamDraft({
                          chiefComplaint: data.examination?.chiefComplaint ?? "",
                          physical: data.examination?.physical ?? "",
                          treatmentPlan: data.examination?.treatmentPlan ?? "",
                        });
                        setEditExam(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setData((prev) => (prev ? { ...prev, examination: { ...examDraft } } : prev));
                          setEditExam(false);
                        }}
                      >
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExamDraft({
                            chiefComplaint: data.examination?.chiefComplaint ?? "",
                            physical: data.examination?.physical ?? "",
                            treatmentPlan: data.examination?.treatmentPlan ?? "",
                          });
                          setEditExam(false);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 bg-white text-sm pt-4">
                <div>
                  <p className="text-xs text-gray-400">KELUHAN UTAMA</p>
                  {editExam ? (
                    <textarea rows={3} className="w-full border rounded px-2 py-1" value={examDraft.chiefComplaint} onChange={(e) => setExamDraft({ ...examDraft, chiefComplaint: e.target.value })} />
                  ) : (
                    <p className="font-medium mt-1">{data.examination?.chiefComplaint ?? "-"}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400">HASIL PEMERIKSAAN FISIK</p>
                  {editExam ? (
                    <textarea rows={3} className="w-full border rounded px-2 py-1" value={examDraft.physical} onChange={(e) => setExamDraft({ ...examDraft, physical: e.target.value })} />
                  ) : (
                    <p className="font-medium mt-1">{data.examination?.physical ?? "-"}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400">RENCANA PERAWATAN</p>
                  {editExam ? (
                    <textarea rows={3} className="w-full border rounded px-2 py-1" value={examDraft.treatmentPlan} onChange={(e) => setExamDraft({ ...examDraft, treatmentPlan: e.target.value })} />
                  ) : (
                    <p className="font-medium mt-1">{data.examination?.treatmentPlan ?? "-"}</p>
                  )}
                </div>

               <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded mt-2">
  <div className="flex items-center justify-between mb-1">
    <p className="text-sm font-medium">Catatan:</p>

    {!editNotes ? (
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-xs"
        onClick={() => {
          setNotesDraft(data?.notes ?? "");
          setEditNotes(true);
        }}
      >
        <Pencil className="w-3 h-3 mr-1" /> Edit
      </Button>
    ) : (
      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => {
            setData({ ...data, notes: notesDraft });
            setEditNotes(false);
          }}
        >
          Simpan
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs"
          onClick={() => {
            setNotesDraft(data?.notes ?? "");
            setEditNotes(false);
          }}
        >
          Batal
        </Button>
      </div>
    )}
  </div>

  {editNotes ? (
    <textarea
      rows={3}
      className="w-full border rounded px-2 py-1 text-sm"
      value={notesDraft}
      onChange={(e) => setNotesDraft(e.target.value)}
    />
  ) : (
    <p className="text-sm mt-1 text-gray-700">
      {data?.notes || "-"}
    </p>
  )}
</div>

              </CardContent>
            </Card>

            {/* Obat */}
            <Card className="shadow-lg">
              <CardHeader className="bg-yellow-400/40 rounded-t-md">
                <div className="flex w-full items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Obat yang Diberikan</CardTitle>

                  {!editMeds ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setMedsDraft(data?.medications ? JSON.parse(JSON.stringify(data.medications)) : []);
                        setEditMeds(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          // simpan: update data.medications
                          setData((prev) => (prev ? { ...prev, medications: medsDraft } : prev));
                          setEditMeds(false);
                        }}
                      >
                        Simpan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setMedsDraft(data?.medications ? JSON.parse(JSON.stringify(data.medications)) : []);
                          setEditMeds(false);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 bg-white text-sm pt-4">
                {(editMeds ? medsDraft : meds).length === 0 ? (
                  <p className="text-gray-600">Tidak ada obat yang diresepkan pada kunjungan ini.</p>
                ) : (
                  (editMeds ? medsDraft : meds).map((m, idx) => (
                    <div key={m.id ?? idx} className="rounded-md bg-pink-50 p-4 border border-pink-100 space-y-2">
                      {!editMeds ? (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-pink-700">{m.name}</p>
                              {m.instructions && <p className="text-gray-700 text-sm mt-1">{m.instructions}</p>}
                            </div>
                            <Badge variant="secondary">Dosis: {m.dosage}</Badge>
                          </div>
                          <p className="text-xs text-gray-600">Durasi: {m.duration}</p>
                        </>
                      ) : (
                        <>
                          <input className="w-full border rounded p-2" placeholder="Nama Obat" value={m.name} onChange={(e) => {
                            const copy = [...medsDraft];
                            copy[idx] = { ...copy[idx], name: e.target.value };
                            setMedsDraft(copy);
                          }} />

                          <input className="w-full border rounded p-2" placeholder="Dosis" value={m.dosage} onChange={(e) => {
                            const copy = [...medsDraft];
                            copy[idx] = { ...copy[idx], dosage: e.target.value };
                            setMedsDraft(copy);
                          }} />

                          <input className="w-full border rounded p-2" placeholder="Durasi" value={m.duration} onChange={(e) => {
                            const copy = [...medsDraft];
                            copy[idx] = { ...copy[idx], duration: e.target.value };
                            setMedsDraft(copy);
                          }} />

                          <textarea className="w-full border rounded p-2" placeholder="Instruksi" value={m.instructions} onChange={(e) => {
                            const copy = [...medsDraft];
                            copy[idx] = { ...copy[idx], instructions: e.target.value };
                            setMedsDraft(copy);
                          }} />
                        </>
                      )}
                    </div>
                  ))
                )}

                {!editMeds && data.notes && meds.length > 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-300">
                    <p className="text-sm text-gray-600">{data.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">© 2025 RoxyDental.</div>
      </div>
    </div>
  );
}
