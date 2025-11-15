'use client';

import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

type Item = {
  id: number;
  noId: string;
  nama: string;
  jam: string;
  dokter: string;
  tindakan: string;
  status: 'Selesai' | 'Menunggu' | 'Sedang Dilayani';
  cabang: string;
};

const DATA: Item[] = [
  { id: 1, noId: '008-009777', nama: 'Adil Kasun Sweger', jam: '09:00', dokter: 'dr. Sarah Aminah', tindakan: 'Scaling Class 1', status: 'Selesai', cabang: 'Sozo Dental Tebet' },
  { id: 2, noId: '008-009779', nama: 'Affara', jam: '09:30', dokter: 'dr. Sarah Aminah', tindakan: 'Scaling Class 1', status: 'Sedang Dilayani', cabang: 'Sozo Dental Tebet' },
  { id: 3, noId: '008-009731', nama: 'Alrina Namadhani', jam: '10:00', dokter: 'dr. Budi Santoso', tindakan: 'Metal Braces Basic - OP', status: 'Menunggu', cabang: 'Sozo Dental Tebet' },
  { id: 4, noId: '-', nama: 'Agustini', jam: '10:30', dokter: 'dr. Sarah Aminah', tindakan: 'Scaling Class 1', status: 'Menunggu', cabang: 'Sozo Dental Tebet' },
  { id: 5, noId: '-', nama: 'Aila', jam: '11:00', dokter: 'dr. Budi Santoso', tindakan: 'Scaling Class 2', status: 'Menunggu', cabang: 'Sozo Dental Kemang' },
  { id: 6, noId: '008-009731', nama: 'Alvandra Dian Fatima', jam: '11:30', dokter: 'dr. Sarah Aminah', tindakan: 'Tambal Gigi Anterior', status: 'Menunggu', cabang: 'Sozo Dental Tebet' },
];

export default function AntrianPage() {
  const router = useRouter();
  const [selectedCabang, setSelectedCabang] = useState('Semua Cabang');

  // 🔹 Filter otomatis sesuai cabang
  const filteredData =
    selectedCabang === 'Semua Cabang'
      ? DATA
      : DATA.filter((item) => item.cabang === selectedCabang);

  return (
    <div className="antrian-page" style={{ backgroundColor: '#ffe5ec', minHeight: '100vh' }}>
      <Navbar />

      {/* 🌸 Container utama */}
      <div className="container py-4">

        {/* 🔹 Header atas: Tab kiri + Tombol kanan */}
        <div className="header-section d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* Tab kiri */}
          <div className="tab-navigation d-flex gap-2 flex-wrap">
            <button className="tab-link" onClick={() => router.push('/dashboard/dokter/pasien/daftar')}>
              Daftar Pasien
            </button>
            <button className="tab-link active" onClick={() => router.push('/dashboard/dokter/pasien/antrian')}>
              Daftar Antrian
            </button>
            <button className="tab-link" onClick={() => router.push('/dashboard/dokter/pasien/rekam-medis')}>
              Rekam Medis
            </button>
          </div>

          {/* Tombol kanan */}
          <button
            className="refresh-btn d-flex align-items-center gap-2"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise rotate-icon"></i>
            <span>Refresh</span>
          </button>
        </div>

        {/* Judul + Statistik */}
        <h6 className="fw-semibold text-dark mt-4 mb-3">Daftar Antrian</h6>

        <div className="stats-row mb-4">
          <div className="stat-card bg-white shadow-sm">
            <p>Total Antrian</p>
            <h5>{filteredData.length}</h5>
          </div>
          <div className="stat-card bg-waiting shadow-sm">
            <p>Menunggu</p>
            <h5>{filteredData.filter((d) => d.status === 'Menunggu').length}</h5>
          </div>
          <div className="stat-card bg-serving shadow-sm">
            <p>Sedang Dilayani</p>
            <h5>{filteredData.filter((d) => d.status === 'Sedang Dilayani').length}</h5>
          </div>
          <div className="stat-card bg-finished shadow-sm">
            <p>Selesai</p>
            <h5>{filteredData.filter((d) => d.status === 'Selesai').length}</h5>
          </div>
        </div>

        {/* Search + Filter */}
       <div className="search-filter-row">
        <div className="search-wrapper">
            <input className="search-input" placeholder="Cari nama pasien atau No. ID..." />
        </div>

        <select className="filter-select">
            <option value="default">Semua Cabang</option>
            <option>Sozo Dental Tebet</option>
            <option>Sozo Dental Kemang</option>
        </select>
        </div>

        {/* Table */}
        <div className="table-container shadow-sm rounded-4 overflow-hidden bg-white">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-header">
              <tr>
                <th>NO. ANTRIAN</th>
                <th>NO. ID</th>
                <th>NAMA PASIEN</th>
                <th>JAM</th>
                <th>DOKTER</th>
                <th>TINDAKAN</th>
                <th>STATUS</th>
                <th>CABANG</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id}>
                    <td><div className="number-circle">{row.id}</div></td>
                    <td className="text-muted">{row.noId}</td>
                    <td className="fw-semibold">{row.nama}</td>
                    <td>{row.jam}</td>
                    <td>{row.dokter}</td>
                    <td>{row.tindakan}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          row.status === 'Selesai'
                            ? 'status-selesai'
                            : row.status === 'Menunggu'
                            ? 'status-menunggu'
                            : 'status-dilayani'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>{row.cabang}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    Tidak ada data untuk cabang ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-pink text-center py-3 mt-5">
        <small>© 2025 RoxyDental. Platform untuk kesehatan gigi 🌸</small>
      </footer>
    </div>
  );
}
