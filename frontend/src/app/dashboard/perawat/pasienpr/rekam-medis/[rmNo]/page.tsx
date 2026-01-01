"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import { visitService, Visit } from "@/services/visit.service";
import { dashboardNurseService } from "@/services/dashboard-nurse.service";
import { useToast } from "@/hooks/use-toast";

/**
 * Nurse read-only view.
 * - Perawat hanya melihat (no edit buttons).
 * - PDF generator includes parsed treatment & notes (structured format handling).
 *
 * Do NOT change backend behavior.
 */

/* Structured notes helpers (same format used by doctor UI) */
const STRUCTURED_PREFIX = "__POLABDC_STRUCTURED__";
const OPEN_TREAT = "<<TREATMENT>>";
const CLOSE_TREAT = "<</TREATMENT>>";
const OPEN_NOTES = "<<NOTES>>";
const CLOSE_NOTES = "<</NOTES>>";

const unpackNotes = (raw?: string) => {
  if (!raw) return { treatmentPlan: "", notes: "" };
  const txt = String(raw);
  if (!txt.startsWith(STRUCTURED_PREFIX)) {
    // legacy/unstructured -> fallback: both fields same
    return { treatmentPlan: txt.trim(), notes: txt.trim() };
  }

  const tStart = txt.indexOf(OPEN_TREAT);
  const tEnd = txt.indexOf(CLOSE_TREAT);
  const nStart = txt.indexOf(OPEN_NOTES);
  const nEnd = txt.indexOf(CLOSE_NOTES);

  const treatmentPlan =
    tStart !== -1 && tEnd !== -1 && tEnd > tStart
      ? txt.slice(tStart + OPEN_TREAT.length, tEnd).trim()
      : "";
  const notes =
    nStart !== -1 && nEnd !== -1 && nEnd > nStart
      ? txt.slice(nStart + OPEN_NOTES.length, nEnd).trim()
      : "";

  return { treatmentPlan, notes };
};

export default function RekamMedisDetailPage() {
  const params = useParams() as { rmNo?: string } | null;
  const rmNo = params?.rmNo;
  const router = useRouter();
  const { toast } = useToast();

  const medicalRecordNumber = rmNo;

  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [visit, setVisit] = useState<Visit | null>(null);
  const [currentNurseName, setCurrentNurseName] = useState<string>("-");
  const [currentDoctorName, setCurrentDoctorName] = useState<string>("-");

  useEffect(() => {
    const fetchNurseInfo = async () => {
      try {
        const res = await dashboardNurseService.getNurseSummary();
        const name = res?.data?.profile?.fullName;
        if (name) setCurrentNurseName(name);
      } catch {
        setCurrentNurseName("-");
      }
    };

    fetchNurseInfo();
  }, []);

  useEffect(() => {
    if (!medicalRecordNumber) return;
    fetchVisitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalRecordNumber]);

  const fetchVisitData = async () => {
    if (!medicalRecordNumber) return;
    try {
      setLoading(true);
      const response = await visitService.getVisitByMedicalRecord(
        medicalRecordNumber
      );
      setVisit(response);

      // also try to extract doctor name if available (optional)
      try {
        const docName = (response as any).doctorName || (response as any).doctor?.fullName;
        if (docName) setCurrentDoctorName(docName);
      } catch {
        // ignore
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Gagal memuat data rekam medis",
        variant: "destructive",
      });
      router.push("/dashboard/perawat/pasienpr/rekam-medis");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const calculateAge = (birthDate?: string) => {
    try {
      if (!birthDate) return 0;
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 0;
    }
  };

  const getTindakan = () => {
    if (!visit) return "-";
    const firstTreatment = (visit as any).treatments?.[0];
    return (
      (visit as any).chiefComplaint ||
      firstTreatment?.service?.serviceName ||
      "-"
    );
  };

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    if (!visit) return;

    setIsDownloading(true);

    try {
      if (!(window as any).PDFLib) {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
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

      // Typography & layout tweaks
      const LINE_HEIGHT = 14;
      const CELL_PADDING = 6;
      const FONT_SIZE_NORMAL = 9; // body / table text
      const FONT_SIZE_HEADER = 18; // main title
      const FONT_SIZE_SECTION = 11; // section titles
      const BG_SECTION = rgb(0.98, 0.94, 0.97); // pale pink background for section bar
      const COLOR_PRIMARY = rgb(0.90, 0.20, 0.50); // main pink (header)
      const COLOR_SECTION_TEXT = rgb(0.78, 0.12, 0.40); // darker pink for section title text
      const TEXT_COLOR = rgb(0.12, 0.12, 0.12); // dark gray for body text
      const SECTION_SPACING = 15;

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

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

      const splitTextToLines = (
        text: any,
        usedFont: any,
        size: number,
        maxW: number
      ) => {
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

      const drawHeader = (title: string) => {
        const headerHeight = FONT_SIZE_HEADER + 8;
        ensureSpace(headerHeight + 8);
        const titleWidth = fontBold.widthOfTextAtSize(title, FONT_SIZE_HEADER);
        const titleX = MARGIN + Math.max(0, (CONTENT_WIDTH - titleWidth) / 2);
        const titleY = cursorY;
        page.drawText(title, {
          x: titleX,
          y: titleY,
          size: FONT_SIZE_HEADER,
          font: fontBold,
          color: COLOR_PRIMARY,
        });
        cursorY -= headerHeight;
      };

      const drawMeta = (meta: string) => {
        ensureSpace(18);
        page.drawText(meta, {
          x: MARGIN,
          y: cursorY - 4,
          size: 9,
          font,
          color: TEXT_COLOR,
        });
        cursorY -= 18;
      };

      const drawSectionTitle = (title: string) => {
        cursorY -= SECTION_SPACING;
        const barH = 22;
        ensureSpace(barH + SECTION_SPACING);
        page.drawRectangle({
          x: MARGIN - 2,
          y: cursorY - barH + 2,
          width: CONTENT_WIDTH + 4,
          height: barH,
          color: BG_SECTION,
        });
        page.drawText(title, {
          x: MARGIN + 8,
          y: cursorY - barH + 8,
          size: FONT_SIZE_SECTION,
          font: fontBold,
          color: COLOR_SECTION_TEXT,
        });
        cursorY -= barH + 8;
      };

      const drawTable = (rows: string[][], colWidths: number[]) => {
        for (const row of rows) while (row.length < colWidths.length) row.push("");

        for (const row of rows) {
          const cellsLines = row.map((cell, idx) =>
            splitTextToLines(
              cell,
              idx % 2 === 0 ? fontBold : font,
              FONT_SIZE_NORMAL,
              Math.max(10, colWidths[idx] - CELL_PADDING * 2)
            )
          );
          const maxLines = Math.max(...cellsLines.map((cl) => cl.length));
          const rowHeight = maxLines * LINE_HEIGHT + CELL_PADDING * 2;
          ensureSpace(rowHeight + 8);
          const rowTop = cursorY;

          page.drawLine({
            start: { x: MARGIN, y: rowTop },
            end: {
              x: MARGIN + colWidths.reduce((a, b) => a + b, 0),
              y: rowTop,
            },
            thickness: 0.5,
            color: rgb(0.85, 0.85, 0.85),
          });

          let x = MARGIN;
          for (let ci = 0; ci < colWidths.length; ci++) {
            const cw = colWidths[ci];
            page.drawLine({
              start: { x, y: rowTop },
              end: { x, y: rowTop - rowHeight },
              thickness: 0.5,
              color: rgb(0.85, 0.85, 0.85),
            });

            let textY = rowTop - CELL_PADDING - FONT_SIZE_NORMAL;
            for (const ln of cellsLines[ci]) {
              page.drawText(ln, {
                x: x + CELL_PADDING,
                y: textY,
                size: FONT_SIZE_NORMAL,
                font: ci % 2 === 0 ? fontBold : font,
                color: TEXT_COLOR,
              });
              textY -= LINE_HEIGHT;
            }
            x += cw;
          }

          const totalW = colWidths.reduce((a, b) => a + b, 0);
          page.drawLine({
            start: { x: MARGIN + totalW, y: rowTop },
            end: { x: MARGIN + totalW, y: rowTop - rowHeight },
            thickness: 0.5,
            color: rgb(0.85, 0.85, 0.85),
          });
          page.drawLine({
            start: { x: MARGIN, y: rowTop - rowHeight },
            end: { x: MARGIN + totalW, y: rowTop - rowHeight },
            thickness: 0.5,
            color: rgb(0.85, 0.85, 0.85),
          });

          cursorY -= rowHeight + 6;
        }
      };

      drawHeader("REKAM MEDIS PASIEN");
      drawMeta(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`);

      drawSectionTitle("Informasi Pasien");
      const patientRows = [
        [
          "No. Rekam Medis",
          (visit as any).patient?.medicalRecordNumber || "-",
          "No. ID",
          (visit as any).patient?.patientNumber || "-",
        ],
        [
          "Nama Lengkap",
          (visit as any).patient?.fullName || "-",
          "Umur",
          `${calculateAge((visit as any).patient?.dateOfBirth)} tahun`,
        ],
        [
          "Jenis Kelamin",
          (visit as any).patient?.gender === "L" ? "Laki-laki" : "Perempuan",
          "Tanggal Lahir",
          formatDate((visit as any).patient?.dateOfBirth),
        ],
        [
          "Alamat",
          (visit as any).patient?.address || "-",
          "No. Telepon",
          (visit as any).patient?.phone || "-",
        ],
      ];

      const labelW = 90;
      const flexible = CONTENT_WIDTH - labelW * 2;
      const patientColWidths = [
        labelW,
        Math.floor(flexible * 0.45) + labelW,
        labelW,
        CONTENT_WIDTH -
          (labelW + (Math.floor(flexible * 0.45) + labelW) + labelW),
      ];
      drawTable(patientRows, patientColWidths);

      drawSectionTitle("Informasi Kunjungan Terkini");

      // parse notes for PDF
      const rawNotes = (visit as any).notes || "";
      const { treatmentPlan: pdfTreatmentPlan, notes: pdfNotes } = unpackNotes(rawNotes);

      const cleanText = (txt?: string) =>
        String(txt || "")
          .replace(/__POLABDC_STRUCTURED__/g, "")
          .replace(/<<\/?TREATMENT>>/gi, "")
          .replace(/<<\/?NOTES>>/gi, "")
          .replace(/<<.*?>>/g, "")
          .replace(/<\/<.*?>>/g, "")
          .trim() || "-";

      drawTable(
        [
          ["Tanggal Kunjungan", formatDate((visit as any).visitDate)],
          ["Dokter Pemeriksa", currentDoctorName],
          ["Perawat", currentNurseName],
          ["Tindakan", getTindakan()],
          ["Diagnosis", (visit as any).patient?.medicalHistory || "-"],
        ],
        [130, CONTENT_WIDTH - 130]
      );

      drawSectionTitle("Detail Pemeriksaan");
      drawTable(
        [
          ["Keluhan Utama", (visit as any).chiefComplaint || "-"],
          ["Hasil Pemeriksaan Fisik", (visit as any).bloodPressure || "-"],
          ["Rencana Perawatan", cleanText(pdfTreatmentPlan) || "-"],
          ["Catatan Kunjungan", cleanText(pdfNotes) || "-"],
        ],
        [160, CONTENT_WIDTH - 160]
      );

      drawSectionTitle("Obat yang Diberikan");

      const pdfMeds: any[] = (visit as any).medications || [];
      if (!Array.isArray(pdfMeds) || pdfMeds.length === 0) {
        drawTable([["Obat", "Tidak ada obat yang diresepkan."]], [
          90,
          CONTENT_WIDTH - 90,
        ]);
      } else {
        const medRows = pdfMeds.map((m: any, i: number) => [
          (i + 1).toString(),
          `${m.name || "-"} | Qty: ${m.quantity || "-"}${
            m.instructions ? " | " + m.instructions : ""
          }`,
        ]);

        drawTable([["No", "Rincian Obat"]], [40, CONTENT_WIDTH - 40]);
        drawTable(medRows, [40, CONTENT_WIDTH - 40]);
      }

      (pdfDoc.getPages() as any[]).forEach((p: any, idx: number) => {
        const { width: pw } = p.getSize();
        p.drawLine({
          start: { x: MARGIN, y: FOOTER_HEIGHT - 20 },
          end: { x: pw - MARGIN, y: FOOTER_HEIGHT - 20 },
          thickness: 0.5,
          color: rgb(0.85, 0.85, 0.85),
        });

        p.drawText(`© ${new Date().getFullYear()} POLABDC - Dental Clinic`, {
          x: MARGIN,
          y: FOOTER_HEIGHT - 34,
          size: 9,
          font,
          color: rgb(0.45, 0.45, 0.45),
        });

        const pageLabel = `Halaman ${idx + 1} / ${pdfDoc.getPages().length}`;
        const px = font.widthOfTextAtSize(pageLabel, 9);
        p.drawText(pageLabel, {
          x: pw - MARGIN - px,
          y: FOOTER_HEIGHT - 34,
          size: 9,
          font,
          color: rgb(0.45, 0.45, 0.45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(visit as any).patient?.medicalRecordNumber || "rekam_medis"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Gagal mengunduh PDF",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7]">
        <DoctorNavbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
        </div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-pink-700 font-semibold text-lg">Rekam medis tidak ditemukan</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Kembali ke daftar
          </Button>
        </div>
      </div>
    );
  }

  const meds: any[] = (visit as any).medications || [];
  const { treatmentPlan, notes } = unpackNotes((visit as any).notes || "");

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <DoctorNavbar />

      <div id="rekam-medis-root" className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => router.push("/dashboard/perawat/pasienpr/rekam-medis")}
            className="inline-flex items-center gap-2 bg-white/60 border border-pink-200 text-pink-700 px-3 py-2 rounded shadow-sm text-sm hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Button>

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
          <div>
            <Card className="shadow-lg">
              <CardHeader className="bg-pink-600 text-white rounded-t-md">
                <CardTitle className="text-lg font-semibold">Informasi Pasien</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 bg-white text-sm pt-4">
                <div>
                  <p className="text-xs text-gray-400">NO. REKAM MEDIS</p>
                  <p className="font-semibold text-pink-700 mt-1">
                    {(visit as any).patient?.medicalRecordNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">NO. ID</p>
                  <p className="font-medium mt-1">{(visit as any).patient?.patientNumber || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">NAMA LENGKAP</p>
                  <p className="font-medium mt-1">{(visit as any).patient?.fullName || "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">UMUR</p>
                    <p className="font-medium mt-1">{calculateAge((visit as any).patient?.dateOfBirth)} tahun</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">JENIS KELAMIN</p>
                    <p className="font-medium mt-1">
                      {(visit as any).patient?.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400">TANGGAL LAHIR</p>
                  <p className="font-medium mt-1">{formatDate((visit as any).patient?.dateOfBirth)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">ALAMAT</p>
                  <p className="font-medium mt-1">{(visit as any).patient?.address || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">NO. TELEPON</p>
                  <p className="font-medium mt-1">{(visit as any).patient?.phone || "-"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6 font-sans">
            <Card className="shadow-lg">
              <CardHeader className="bg-yellow-400/40 rounded-t-md py-5">
                <CardTitle className="text-lg font-semibold leading-none">Informasi Kunjungan Terkini</CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start bg-white text-sm pt-4">
                <div>
                  <p className="text-xs text-gray-400">TANGGAL KUNJUNGAN</p>
                  <p className="font-medium mt-1">{formatDate((visit as any).visitDate)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">PERAWAT</p>
                  <p className="font-medium mt-1">{currentNurseName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">TINDAKAN</p>
                  <p className="font-medium mt-1">{getTindakan()}</p>
                </div>

                <div className="md:col-span-3 mt-2">
                  <p className="text-xs text-gray-400">DIAGNOSIS</p>
                  <div className="mt-2 rounded-md bg-pink-50 p-3">
                    <p className="text-pink-700 font-semibold">{(visit as any).patient?.medicalHistory || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-pink-600 text-white rounded-t-md">
                <CardTitle className="text-lg font-semibold">Detail Pemeriksaan</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 bg-white text-sm pt-4">
                <div>
                  <p className="text-xs text-gray-400">KELUHAN UTAMA</p>
                  <p className="font-medium mt-1">{(visit as any).chiefComplaint || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">HASIL PEMERIKSAAN FISIK</p>
                  <p className="font-medium mt-1">{(visit as any).bloodPressure || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">RENCANA PERAWATAN</p>
                  <p className="font-medium mt-1">{treatmentPlan || ((visit as any).notes || "-")}</p>
                </div>

                {notes ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 rounded mt-2">
                    <p className="text-sm font-medium">Catatan:</p>
                    <p className="text-sm mt-1 text-gray-700 whitespace-pre-line">{notes}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="bg-yellow-400/40 rounded-t-md">
                <CardTitle className="text-lg font-semibold">Obat yang Diberikan</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 bg-white text-sm pt-4">
                {meds.length === 0 ? (
                  <div className="mt-4 py-6 flex justify-center">
                    <p className="text-gray-600 text-center">Tidak ada obat yang diresepkan pada kunjungan ini.</p>
                  </div>
                ) : (
                  meds.map((m: any, idx: number) => (
                    <div key={m.id ?? idx} className="rounded-md bg-pink-50 p-4 border border-pink-100 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-pink-700">{m.name}</p>
                          {m.instructions && <p className="text-gray-700 text-sm mt-1">{m.instructions}</p>}
                        </div>
                        <Badge variant="secondary">Qty: {m.quantity}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">  © 2025 POLABDC Dental Clinic.</div>
      </div>
    </div>
  );
}
