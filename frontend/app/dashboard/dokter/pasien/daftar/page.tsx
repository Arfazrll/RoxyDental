'use client';

import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

type Pasien = {
  id: string;
  noId: string;
  nama: string;
  jk: 'Pria' | 'Wanita';
  tglLahir: string;
  tglKunjungan: string;
  tindakan: string;
  cabang: string;
  umur: string;
};

// ===== Dummy Data 20 pasien =====
const DATA_PASIEN: Pasien[] = [
  { id: '1', noId: '008-009777', nama: 'Adit Kasun Sweger', jk: 'Pria', tglLahir: '19/05/2012', tglKunjungan: 'Kamis, 17 Juli 2025', tindakan: 'T5003 - Scaling Class 1', cabang: 'Sozo Dental Tebet, Tebet', umur: '13 th 5 bl 7 hr' },
  { id: '2', noId: '-', nama: 'Affan Farhanki', jk: 'Wanita', tglLahir: '01/03/2000', tglKunjungan: 'Kamis, 07 Mei 2025', tindakan: 'T5003 - Scaling Class 1', cabang: 'Sozo Dental Tebet, Tebet', umur: '25 th 7 bl 25 hr' },
  { id: '3', noId: '-', nama: 'Agustini', jk: 'Wanita', tglLahir: '10/06/1960', tglKunjungan: 'Kamis, 26 Juni 2025', tindakan: 'T5003 - Scaling Class 1, T5007 - Subgingival...', cabang: 'Sozo Dental Tebet, Tebet', umur: '65 th 0 bl 16 hr' },
  { id: '4', noId: '-', nama: 'Aila', jk: 'Wanita', tglLahir: '02/07/1983', tglKunjungan: 'Senin, 07 Juli 2025', tindakan: 'T5002 - Scaling Class 2', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '42 th 3 bl 24 hr' },
  { id: '5', noId: '008-009779', nama: 'Affaira', jk: 'Wanita', tglLahir: '25/12/2003', tglKunjungan: 'Senin, 09 Maret 2025', tindakan: 'T5003 - Scaling Class 1, T5007 - Subgingival...', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '21 th 10 bl 1 hr' },
  { id: '6', noId: '008-009731', nama: 'Alina Namadhani', jk: 'Wanita', tglLahir: '14/02/2004', tglKunjungan: 'Minggu, 19 Agustus 2025', tindakan: 'T0001 - Metal Braces Basic - OP', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '21 th 0 bl 12 hr' },
  { id: '7', noId: '008-009731', nama: 'Alvandra Dian Fatima', jk: 'Wanita', tglLahir: '23/07/2009', tglKunjungan: 'Senin, 01 Maret 2025', tindakan: 'T6009 - Tambal Gigi Anterior', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '16 th 3 bl 3 hr' },
  { id: '8', noId: '008-009731', nama: 'Anarsyiah Carolina Disti', jk: 'Wanita', tglLahir: '23/07/2009', tglKunjungan: 'Senin, 01 Maret 2025', tindakan: 'T5002 - Scaling Class 2', cabang: 'Sozo Dental Tebet, Tebet', umur: '16 th 3 bl 3 hr' },
  { id: '9', noId: '008-009782', nama: 'Bima Santoso', jk: 'Pria', tglLahir: '12/11/2010', tglKunjungan: '10/06/2025', tindakan: 'T5010 - Filling Composite', cabang: 'Sozo Dental Tebet, Tebet', umur: '14 th 0 bl 5 hr' },
  { id: '10', noId: '008-009783', nama: 'Cahya Putri', jk: 'Wanita', tglLahir: '05/08/1998', tglKunjungan: '15/04/2025', tindakan: 'T5004 - Scaling Class 2', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '26 th 3 bl 9 hr' },
  { id: '11', noId: '008-009784', nama: 'Daffa Rahman', jk: 'Pria', tglLahir: '21/03/2005', tglKunjungan: '11/07/2025', tindakan: 'T5003 - Scaling Class 1', cabang: 'Sozo Dental Tebet, Tebet', umur: '20 th 4 bl 24 hr' },
  { id: '12', noId: '008-009785', nama: 'Eka Lestari', jk: 'Wanita', tglLahir: '02/12/2002', tglKunjungan: '21/06/2025', tindakan: 'T5005 - Braces Adjustment', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '22 th 5 bl 19 hr' },
  { id: '13', noId: '008-009786', nama: 'Farhan Arif', jk: 'Pria', tglLahir: '10/10/2004', tglKunjungan: '30/07/2025', tindakan: 'T5011 - Root Canal', cabang: 'Sozo Dental Tebet, Tebet', umur: '21 th 0 bl 4 hr' },
  { id: '14', noId: '008-009787', nama: 'Gita Ananda', jk: 'Wanita', tglLahir: '22/01/2001', tglKunjungan: '03/08/2025', tindakan: 'T5002 - Scaling Class 2', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '24 th 10 bl 23 hr' },
  { id: '15', noId: '008-009788', nama: 'Hafiz Nur', jk: 'Pria', tglLahir: '15/09/2006', tglKunjungan: '12/09/2025', tindakan: 'T5006 - Extraction', cabang: 'Sozo Dental Tebet, Tebet', umur: '18 th 2 bl 29 hr' },
  { id: '16', noId: '008-009789', nama: 'Intan Nuraeini', jk: 'Wanita', tglLahir: '01/04/2005', tglKunjungan: '18/08/2025', tindakan: 'T5007 - Subgingival Cleaning', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '20 th 4 bl 13 hr' },
  { id: '17', noId: '008-009790', nama: 'Jihan Putra', jk: 'Pria', tglLahir: '20/02/2010', tglKunjungan: '09/07/2025', tindakan: 'T5003 - Scaling Class 1', cabang: 'Sozo Dental Tebet, Tebet', umur: '15 th 8 bl 25 hr' },
  { id: '18', noId: '008-009791', nama: 'Kirana Dewi', jk: 'Wanita', tglLahir: '30/06/2003', tglKunjungan: '05/05/2025', tindakan: 'T5004 - Scaling Class 2', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '22 th 4 bl 14 hr' },
  { id: '19', noId: '008-009792', nama: 'Lukman Hakim', jk: 'Pria', tglLahir: '11/11/2007', tglKunjungan: '25/07/2025', tindakan: 'T5010 - Filling Composite', cabang: 'Sozo Dental Tebet, Tebet', umur: '17 th 0 bl 6 hr' },
  { id: '20', noId: '008-009793', nama: 'Maya Sari', jk: 'Wanita', tglLahir: '07/08/2002', tglKunjungan: '17/03/2025', tindakan: 'T5002 - Scaling Class 2', cabang: 'Sozo Dental Kemang, Matraman Prakan', umur: '23 th 3 bl 7 hr' },
];

export default function AntrianPage() {
  const router = useRouter();
  const [selectedCabang, setSelectedCabang] = useState('Semua Cabang');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const filteredData =
    selectedCabang === 'Semua Cabang'
      ? DATA_PASIEN
      : DATA_PASIEN.filter((p) => p.cabang.includes(selectedCabang));

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="antrian-page">
      <Navbar />
      <div className="container py-4">

        {/* Header + Tabs */}
        <div className="header-section d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="tab-navigation d-flex gap-2 flex-wrap">
            <button className="tab-link active" onClick={() => router.push('/dashboard/dokter/pasien/daftar')}>
              Daftar Pasien
            </button>
            <button className="tab-link" onClick={() => router.push('/dashboard/dokter/pasien/antrian')}>
              Daftar Antrian
            </button>
            <button className="tab-link" onClick={() => router.push('/dashboard/dokter/pasien/rekam-medis')}>
              Rekam Medis
            </button>
          </div>
          <button className="refresh-btn d-flex align-items-center gap-2" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise rotate-icon"></i>
            <span>Refresh</span>
          </button>
        </div>

        {/* Search + Filter */}
        <div className="search-filter-row mb-4">
          <div className="search-wrapper">
            <input className="search-input" placeholder="Cari No. ID / Nama / Tgl. Lahir / Ponsel..." />
          </div>
          <select className="filter-select" onChange={(e) => setSelectedCabang(e.target.value)}>
            <option>Semua Cabang</option>
            <option>Sozo Dental Tebet</option>
            <option>Sozo Dental Kemang</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-container shadow-sm rounded-4 overflow-hidden bg-white">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-header">
              <tr>
                <th>NO. ID</th>
                <th>NAMA</th>
                <th>J/K</th>
                <th>TGL. LAHIR (UMUR)</th>
                <th>TGL. KUNJUNGAN</th>
                <th>TINDAKAN</th>
                <th>CABANG</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.noId || '-'}</td>
                    <td className="fw-semibold">{row.nama}</td>
                    <td>{row.jk}</td>
                    <td>{row.tglLahir} ({row.umur})</td>
                    <td>{row.tglKunjungan}</td>
                    <td>{row.tindakan}</td>
                    <td>{row.cabang}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    Tidak ada data untuk cabang ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Sebelumnya
          </button>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <button
            className="btn btn-sm btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Berikutnya
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="footer-pink text-center py-3 mt-5">
        <small>© 2025 RoxyDental. Platform untuk kesehatan gigi 🌸</small>
      </footer>
    </div>
  );
}
