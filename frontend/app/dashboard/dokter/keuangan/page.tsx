'use client';

import Navbar from '@/app/components/Navbar';
import './Keuangan.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

export default function KeuanganPage() {
  const [startDate, setStartDate] = useState('2025-09-29');
  const [endDate, setEndDate] = useState('2025-10-26');

  // === EXPORT TO PDF ===
  const handleExportPDF = async () => {
    const element = document.getElementById('keuangan-content');
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Laporan_Keuangan.pdf');
  };

  // === EXPORT TO XLS ===
  const handleExportXLS = () => {
    const tables = document.querySelectorAll<HTMLTableElement>('table');
    const wb = XLSX.utils.book_new();

    tables.forEach((table, index) => {
      const ws = XLSX.utils.table_to_sheet(table);
      XLSX.utils.book_append_sheet(wb, ws, `Sheet${index + 1}`);
    });

    XLSX.writeFile(wb, 'Laporan_Keuangan.xlsx');
  };

  return (
    <>
      <Navbar />
      <div className="keuangan-container bg-light">
        <div className="container py-4" id="keuangan-content">
          <h5 className="fw-semibold mb-4 text-dark">Keuangan</h5>

          {/* === FILTER SECTION === */}
          <div className="filter-section p-3 rounded mb-4 shadow-sm">
            <div className="row align-items-center g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sazo Dental Kenang, Mampang Prap..."
                />
              </div>

              <div className="col-md-2">
                <select className="form-select">
                  <option>Semua Penjualan</option>
                </select>
              </div>

              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-outline-danger fw-semibold" onClick={handleExportPDF}>
                  PDF
                </button>
                <button className="btn btn-outline-danger fw-semibold" onClick={handleExportXLS}>
                  XLS
                </button>
              </div>

              {/* DATE RANGE PICKER */}
              <div className="col-md-4 d-flex align-items-center gap-2">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="fw-semibold">-</span>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* === KOMISI TENAGA MEDIS === */}
          <section className="section-box mb-4">
            <h6 className="section-title">KOMISI TENAGA MEDIS</h6>
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead>
                  <tr>
                    <th>TENAGA MEDIS</th>
                    <th>PROSEDUR</th>
                    <th>POTONGAN AWAL</th>
                    <th>HARGA MODAL</th>
                    <th>KOMISI (AVG)</th>
                    <th>FARMASI</th>
                    <th>HARGA MODAL</th>
                    <th>PAKET</th>
                    <th>KOMISI (AVG)</th>
                    <th>LAB</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>drg. Kartika Yuniati Dian...</td>
                    <td>Rp. 22.237.000</td>
                    <td>Rp. 2.956.680</td>
                    <td>Rp. 0</td>
                    <td>24.94%</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                  </tr>
                  <tr>
                    <td>Dr. Ahmad Hidayat</td>
                    <td>Rp. 18.500.000</td>
                    <td>Rp. 1.850.000</td>
                    <td>Rp. 0</td>
                    <td>22.50%</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                  </tr>
                  <tr className="fw-semibold">
                    <td>TOTAL</td>
                    <td>Rp. 22.237.000</td>
                    <td>Rp. 2.956.680</td>
                    <td colSpan={7}>Rp. 0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* === KOMISI PROSEDUR / LAYANAN === */}
          <section className="section-box mb-4">
            <h6 className="section-title">KOMISI PROSEDUR / LAYANAN</h6>
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead>
                  <tr>
                    <th>PROSEDUR</th>
                    <th>KODE</th>
                    <th>KUANTITAS</th>
                    <th>HARGA JUAL (AVG)</th>
                    <th>HARGA MODAL (AVG)</th>
                    <th>TOTAL PENJUALAN</th>
                    <th>POTONGAN AWAL</th>
                    <th>TOTAL MODAL</th>
                    <th>KOMISI (AVG)</th>
                    <th>TOTAL BAYAR</th>
                    <th>TOTAL KOMISI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rontgen Cephalometri - Sato</td>
                    <td>AE001</td>
                    <td>3</td>
                    <td>Rp. 275.000</td>
                    <td>Rp. 0</td>
                    <td>Rp. 825.000</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>5%</td>
                    <td>Rp. 825.000</td>
                    <td>Rp. 41.250</td>
                  </tr>
                  <tr>
                    <td>Wire F.L.T - GP</td>
                    <td>AG060</td>
                    <td>8</td>
                    <td>Rp. 60.000</td>
                    <td>Rp. 0</td>
                    <td>Rp. 480.000</td>
                    <td>Rp. 0</td>
                    <td>Rp. 0</td>
                    <td>30.00%</td>
                    <td>Rp. 480.000</td>
                    <td>Rp. 144.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* === KOMISI PAKET === */}
          <section className="section-box">
            <h6 className="section-title">KOMISI PAKET</h6>
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead>
                  <tr>
                    <th>PAKET</th>
                    <th>SKU</th>
                    <th>KUANTITAS</th>
                    <th>HARGA JUAL</th>
                    <th>TOTAL PENJUALAN</th>
                    <th>KOMISI (AVG)</th>
                    <th>TOTAL BAYAR</th>
                    <th>TOTAL KOMISI (RP)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Paket Best Dental Care</td>
                    <td>PKT001</td>
                    <td>12</td>
                    <td>Rp. 500.000</td>
                    <td>Rp. 6.000.000</td>
                    <td>15%</td>
                    <td>Rp. 6.000.000</td>
                    <td>Rp. 900.000</td>
                  </tr>
                  <tr>
                    <td>Paket Orthodontic Premium</td>
                    <td>PKT002</td>
                    <td>8</td>
                    <td>Rp. 1.800.000</td>
                    <td>Rp. 14.400.000</td>
                    <td>12%</td>
                    <td>Rp. 14.400.000</td>
                    <td>Rp. 1.728.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="footer text-center py-3 text-secondary">
          © 2025 RoxyDental. Platform untuk ....
        </footer>
      </div>
    </>
  );
}
