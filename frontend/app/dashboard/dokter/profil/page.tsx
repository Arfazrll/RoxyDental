'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import './ProfilDokter.css';

export default function ProfilDokterPage() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      {/* External Styles */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      {/* Navbar */}
      <Navbar />

      {/* Page Header */}
      <header className="page-header container">
        <h4 className="page-title">Profil Tenaga Medis</h4>
        <p className="page-subtitle">
          Informasi Akun & Status Praktik Anda di Klinik Sehat
        </p>
      </header>

      {/* Main Content */}
      <main className="container py-4">

        {/* === STATUS SECTION === */}
        <section className="status-section mb-4">
          <h6 className="section-title mb-3">
            <i className="bi bi-speedometer2 me-2"></i>STATUS AKUN
          </h6>

          <div className="row g-4">

            {/* Status Akun */}
            <div className="col-12 col-md-3">
              <div className="status-card">
                <div className="status-header">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <span>Status Akun</span>
                </div>
                <h5 className="status-main mb-1 text-dark">Aktif</h5>
                <span className="badge bg-success-subtle text-success border border-success rounded-pill">
                  Terverifikasi
                </span>
                <p className="status-desc mt-2 mb-0 text-muted small">
                  Akun dan lisensi telah terverifikasi
                </p>
              </div>
            </div>

            {/* Kelengkapan Profil */}
            <div className="col-12 col-md-3">
              <div className="status-card">
                <div className="status-header">
                  <i className="bi bi-person-check text-primary me-2"></i>
                  <span>Kelengkapan Profil</span>
                </div>
                <h5 className="status-main mb-1 text-dark">95%</h5>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-dark"
                    role="progressbar"
                    style={{ width: '95%' }}
                  ></div>
                </div>
                <p className="status-desc mt-2 mb-0 text-muted small">
                  Hampir Sempurna
                </p>
              </div>
            </div>

            {/* Performa Bulan Ini */}
            <div className="col-12 col-md-3">
              <div className="status-card">
                <div className="status-header">
                  <i className="bi bi-graph-up-arrow text-warning me-2"></i>
                  <span>Performa Bulan Ini</span>
                </div>
                <h5 className="status-main mb-1 text-warning">Sangat Baik</h5>
                <span className="badge bg-warning-subtle text-dark border border-warning rounded-pill">
                  Top 10%
                </span>
                <p className="status-desc mt-2 mb-0 text-muted small">
                  156 pasien ditangani bulan ini
                </p>
              </div>
            </div>

            {/* Status Shift */}
            <div className="col-12 col-md-3">
              <div className="status-card">
                <div className="status-header">
                  <i className="bi bi-clock text-danger me-2"></i>
                  <span>Status Shift</span>
                </div>
                <h5 className="status-main mb-1 text-danger">On Duty</h5>
                <span className="badge bg-danger text-white rounded-pill">
                  08.00 - 16.00
                </span>
                <p className="status-desc mt-2 mb-0 text-muted small">
                  3 jam 20 menit tersisa
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* === GRID LAYOUT === */}
        <div className="row g-4">

          {/* === LEFT COLUMN === */}
          <div className="col-lg-4">
            <div className="section-card">
              <div className="section-header section-header-pink">
                <i className="bi bi-person-circle me-2"></i>INFORMASI PROFIL
              </div>

              <div className="profile-content text-center">
                <div className="doctor-avatar mx-auto mb-3">KY</div>
                <h5 className="doctor-name mb-0">drg. Kartika Yusriza Dinanti</h5>
                <p className="doctor-specialty text-muted mb-4">Dokter Gigi</p>

                <div className="info-list text-start">

                  <div className="info-item">
                    <i className="bi bi-person-vcard"></i>
                    <div>
                      <p className="info-label mb-0">ID Karyawan</p>
                      <small className="info-value">DKT-2024-001234</small>
                    </div>
                  </div>

                  <div className="info-item">
                    <i className="bi bi-award"></i>
                    <div>
                      <p className="info-label mb-0">No. SIP</p>
                      <small className="info-value">503/SIP/DPMPTSP/2024</small>
                    </div>
                  </div>

                  <div className="info-item">
                    <i className="bi bi-envelope"></i>
                    <div>
                      <p className="info-label mb-0">Email</p>
                      <small className="info-value">
                        kartika.dinanti@kliniksehat.com
                      </small>
                    </div>
                  </div>

                  <div className="info-item">
                    <i className="bi bi-geo-alt"></i>
                    <div>
                      <p className="info-label mb-0">Lokasi</p>
                      <small className="info-value">
                        Klinik Sehat - Jakarta Pusat
                      </small>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* === MIDDLE COLUMN === */}
          <div className="col-lg-5">
            <div className="section-card mb-4">

              <div className="section-header section-header-blue">
                <i className="bi bi-bar-chart-line me-2"></i>STATISTIK AKTIVITAS
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                {[
                  { icon: 'bi-person-hearts', number: 24, label: 'Pasien Hari Ini' },
                  { icon: 'bi-file-medical', number: 18, label: 'Resep Dibuat' },
                  { icon: 'bi-calendar-month', number: 156, label: 'Total Bulan Ini' },
                ].map((stat, i) => (
                  <div className="stat-item" key={i}>
                    <div className="stat-icon">
                      <i className={`bi ${stat.icon}`}></i>
                    </div>
                    <h4 className="stat-number mb-0">{stat.number}</h4>
                    <p className="stat-label mb-0 text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <hr className="my-3 mx-3" />

              {/* Recent Activities */}
              <div className="activity-section">
                <h6 className="activity-section-title mb-3">
                  <i className="bi bi-clock-history me-2"></i>Aktivitas Terkini
                </h6>

                {[
                  {
                    icon: 'bi-check-circle-fill',
                    title: 'Pasien Diperiksa',
                    time: '2 jam lalu',
                    badge: 'Selesai',
                    color: 'pink',
                  },
                  {
                    icon: 'bi-file-earmark-text',
                    title: 'Resep Dibuat',
                    time: '3 jam lalu',
                    badge: 'Menunggu',
                    color: 'yellow',
                  },
                  {
                    icon: 'bi-capsule',
                    title: 'Konsultasi Pasien',
                    time: '5 jam lalu',
                    badge: 'Selesai',
                    color: 'purple',
                  },
                ].map((activity, i) => (
                  <div className="activity-item" key={i}>
                    <div className={`activity-icon activity-icon-${activity.color}`}>
                      <i className={`bi ${activity.icon}`}></i>
                    </div>
                    <div className="activity-content">
                      <p className="activity-title mb-0">{activity.title}</p>
                      <small className="activity-time text-muted">{activity.time}</small>
                    </div>
                    <span
                      className={`activity-badge ${
                        activity.badge === 'Selesai'
                          ? 'badge-selesai'
                          : 'badge-menunggu'
                      }`}
                    >
                      {activity.badge}
                    </span>
                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* === RIGHT COLUMN === */}
          <div className="col-lg-3">
            <div className="section-card">

              <div className="section-header section-header-yellow">
                <i className="bi bi-calendar-check me-2"></i>JADWAL & LISENSI
              </div>

              <div className="license-info">

                <div className="license-status mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Status Praktik</span>
                    <span className="badge badge-aktif">Aktif</span>
                  </div>
                  <small className="text-muted d-block mt-2">
                    <i className="bi bi-calendar-event me-1"></i>
                    Berlaku hingga 15 Januari 2027
                  </small>
                </div>

                <hr className="my-3" />

                <div className="schedule-info">
                  <h6 className="schedule-title mb-3">
                    <i className="bi bi-calendar-week me-2"></i>Jadwal Minggu Ini
                  </h6>

                  {[
                    ['Senin - Rabu', '08:00 - 16:00'],
                    ['Kamis', '13:00 - 21:00'],
                    ['Jumat', 'Libur'],
                    ['Sabtu', 'On Call'],
                    ['Minggu', 'Libur'],
                  ].map(([day, time], i) => (
                    <div className="schedule-item" key={i}>
                      <span className="schedule-day">{day}</span>
                      <span
                        className={`schedule-time ${
                          time === 'Libur' ? 'text-muted' : ''
                        }`}
                      >
                        {time === 'On Call' ? (
                          <span className="badge badge-on-duty">On Call</span>
                        ) : (
                          time
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* === TOMBOL JADWAL LENGKAP === */}
                <button
                  className="btn w-100 mt-3"
                  onClick={() => router.push('/dashboard/dokter/jadwal')}
                  style={{
                    backgroundColor: '#ec4899',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '10px 0',
                    fontWeight: '500',
                  }}
                >
                  <i className="bi bi-calendar-range me-2"></i>
                  Lihat Jadwal Lengkap
                </button>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="profile-footer py-3">
        <div className="container text-center">
          <p className="mb-0 text-muted small">
            <i className="bi bi-shield-check me-2"></i>
            © 2025 RoxyDental — Platform Tenaga Medis
          </p>
        </div>
      </footer>
    </>
  );
}
