'use client';

import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './rekam.css';

type Rekam = {
  id: string;
  noId: string;
  nama: string;
  tanggal: string;
  dokter: string;
  diagnosis: string;
  tindakan: string;
  cabang: string;
};

const DATA_REKAM: Rekam[] = [
  { id: 'RM-001', noId: '008-009777', nama: 'Adil Kasun Sweger', tanggal: '17 Juli 2025', dokter: 'dr. Sarah Aminah', diagnosis: 'Kalkulus supragingiva', tindakan: 'Scaling Class 1', cabang: 'Sozo Dental Tebet' },
  { id: 'RM-002', noId: '008-009779', nama: 'Affara', tanggal: '09 Maret 2025', dokter: 'dr. Sarah Aminah', diagnosis: 'Kalkulus supragingiva dan subgingiva', tindakan: 'Scaling Class 1', cabang: 'Sozo Dental Kemang' },
  { id: 'RM-003', noId: '008-009731', nama: 'Alrina Namadhani', tanggal: '19 Agustus 2025', dokter: 'dr. Budi Santoso', diagnosis: 'Maloklusi kelas II', tindakan: 'Metal Braces Basic - OP', cabang: 'Sozo Dental Kemang' },
  { id: 'RM-004', noId: '-', nama: 'Agustini', tanggal: '26 Juni 2025', dokter: 'dr. Sarah Aminah', diagnosis: 'Periodontitis kronis', tindakan: 'Scaling Class 1', cabang: 'Sozo Dental Tebet' },
  { id: 'RM-005', noId: '-', nama: 'Aila', tanggal: '07 Juli 2025', dokter: 'dr. Budi Santoso', diagnosis: 'Kalkulus subgingiva', tindakan: 'Scaling Class 2', cabang: 'Sozo Dental Kemang' },
  { id: 'RM-006', noId: '008-009731', nama: 'Alvandra Dian Fatima', tanggal: '01 Maret 2025', dokter: 'dr. Sarah Aminah', diagnosis: 'Karies dentin gigi 11', tindakan: 'Tambal Gigi Anterior', cabang: 'Sozo Dental Kemang' },
];

export default function RekamPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('Semua Cabang');

  const filtered =
    filter === 'Semua Cabang'
      ? DATA_REKAM
      : DATA_REKAM.filter((d) => d.cabang === filter);

  return (
    <div className="rekam-page" style={{ backgroundColor: '#ffe5ec', minHeight: '100vh' }}>
      <Navbar />

      <div className="container py-4">
        {/* ===== HEADER ===== */}
        <div className="header-section d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="tab-navigation d-flex gap-2 flex-wrap">
            <button className="tab-link" onClick={() => router.push('/dashboard/dokter/pasien/daftar')}>
              Daftar Pasien
            </button>
            <button className="tab-link " onClick={() => router.push('/dashboard/dokter/pasien/antrian')}>
              Daftar Antrian
            </button>
            <button className="tab-link active" onClick={() => router.push('/dashboard/dokter/pasien/rekam')}>
              Rekam Medis
            </button>
          </div>


          {/* Tambah Rekam */}
          <button
            className="refresh-btn d-flex align-items-center gap-2"
            onClick={() => router.push('/dashboard/dokter/pasien/form')}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Tambah Rekam Medis</span>
          </button>
        </div>

        {/* ===== TITLE ===== */}
        <h6 className="fw-semibold text-dark mt-4 mb-3">Rekam Medis</h6>

        {/* ===== SEARCH + FILTER ===== */}
        <div className="search-filter-row">
          <div className="search-wrapper">
            <input className="search-input" placeholder="Cari No. RM / No. ID / Nama Pasien" />
          </div>

          <select className="filter-select" onChange={(e) => setFilter(e.target.value)}>
            <option>Semua Cabang</option>
            <option>Sozo Dental Tebet</option>
            <option>Sozo Dental Kemang</option>
          </select>
        </div>

        {/* ===== TABLE ===== */}
        <div className="table-container shadow-sm rounded-4 overflow-hidden bg-white">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-header">
              <tr>
                <th>NO. RM</th>
                <th>NO. ID</th>
                <th>NAMA PASIEN</th>
                <th>TANGGAL</th>
                <th>DOKTER</th>
                <th>DIAGNOSIS</th>
                <th>TINDAKAN</th>
                <th>CABANG</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td className="fw-semibold">{row.id}</td>
                  <td className="text-muted">{row.noId}</td>
                  <td>{row.nama}</td>
                  <td>{row.tanggal}</td>
                  <td>{row.dokter}</td>
                  <td>{row.diagnosis}</td>
                  <td>{row.tindakan}</td>
                  <td>{row.cabang}</td>
                  <td>
                    <button
                      className="detail-btn"
                      onClick={() => router.push(`/rekam/${row.id}`)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer-pink text-center py-3 mt-5">
        <small>© 2025 RoxyDental. Platform untuk kesehatan gigi 🌸</small>
      </footer>
    </div>
  );
}