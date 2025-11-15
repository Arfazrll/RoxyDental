'use client';

import Navbar from '@/app/components/Navbar';
import '@/app/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';

export default function DashboardDokterUtama() {
  const stats = [
    { label: 'Total Kunjungan', value: '0', icon: 'bi-people-fill', color: '#ff80ab' },
    { label: 'Kunjungan Hari Ini', value: '0', icon: 'bi-calendar-check-fill', color: '#fbbf24' },
    { label: 'Kunjungan Bulan Ini', value: '0', icon: 'bi-graph-up-arrow', color: '#f472b6' },
  ];

  const schedule = [
    { day: 'Minggu', startTime: '16:00', endTime: '21:00', location: 'Soso Dental Kemang' },
    { day: 'Senin', startTime: '16:00', endTime: '21:00', location: 'Soso Dental Kemang' },
    { day: 'Selasa', startTime: '-', endTime: '-', location: '-' },
    { day: 'Rabu', startTime: '-', endTime: '-', location: '-' },
    { day: 'Kamis', startTime: '10:00', endTime: '15:00', location: 'Soso Dental Tebet' },
    { day: 'Jumat', startTime: '-', endTime: '-', location: '-' },
    { day: 'Sabtu', startTime: '-', endTime: '-', location: '-' },
  ];

  const qualifications = [
    { title: 'Pendidikan', items: ['S1 Kedokteran Gigi', 'Universitas Indonesia, 2018'] },
    { title: 'Pengalaman', items: ['6+ tahun praktek', 'Spesialis Perawatan Gigi'] },
  ];

  const specializations = [
    'Perawatan Gigi Umum',
    'Estetika Gigi',
    'Kawat Gigi',
    'Ortodonsi',
  ];

  return (
    <div className="dashboard-page min-vh-100">
      <Navbar userName="drg. Kartika" />

      <div className="container py-4">
        {/* Profile Section */}
        <div className="profile-card d-flex align-items-center p-4 mb-4 shadow-lg rounded-4">
          <img
            src="https://placehold.co/130x130/fda4af/ffffff?text=drg.K"
            alt="Doctor"
            className="doctor-image rounded-circle me-4"
          />
          <div>
            <h4 className="doctor-name mb-1">drg. Kartika Yusriya Dinanti</h4>
            <p className="doctor-title mb-1">Dokter Gigi</p>
            <div className="doctor-rating mb-2">
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star text-warning"></i>
              <span className="text-muted small ms-2">(0 ulasan)</span>
            </div>
            <div className="badge-group mb-3">
              <span className="badge-location me-2">Soso Dental Kemang</span>
              <span className="badge-location">Soso Dental Tebet</span>
            </div>
            <div>
              <button className="btn-pink me-2">Buat Janji Temu</button>
              <button className="btn-outline-pink">Konsul Online</button>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-12 col-md-4">
              <div className="stat-card d-flex justify-content-between align-items-center p-3 rounded-4 shadow-sm">
                <div>
                  <div className="text-muted small">{stat.label}</div>
                  <div className="fw-bold fs-5" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
                <div
                  className="stat-icon d-flex justify-content-center align-items-center rounded-circle"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: `${stat.color}1A`,
                    color: stat.color,
                  }}
                >
                  <i className={`bi ${stat.icon}`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jadwal & Kualifikasi */}
        <div className="row g-4">
          {/* Jadwal */}
          <div className="col-md-7">
            <div className="pink-card p-4 rounded-4 shadow-sm">
              <h6 className="section-title mb-3">
                <i className="bi bi-clock-history me-2"></i>Jadwal Praktek
              </h6>
              <table className="table table-sm text-center align-middle table-custom">
                <thead>
                  <tr>
                    <th>Hari</th>
                    <th>Jam Awal</th>
                    <th>Jam Akhir</th>
                    <th>Tempat Praktek</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold">{item.day}</td>
                      <td>{item.startTime}</td>
                      <td>{item.endTime}</td>
                      <td className="text-muted">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kualifikasi */}
          <div className="col-md-5">
            <div className="pink-card p-4 rounded-4 shadow-sm">
              <h6 className="section-title mb-3">
                <i className="bi bi-award me-2"></i>Kualifikasi Tenaga Medis
              </h6>
              {qualifications.map((q, i) => (
                <div key={i} className="mb-3">
                  <div className="fw-semibold text-dark mb-1">
                    <i
                      className={`bi me-2 ${
                        i === 0 ? 'bi-mortarboard' : 'bi-briefcase'
                      }`}
                    ></i>
                    {q.title}
                  </div>
                  {q.items.map((item, j) => (
                    <div key={j} className="small text-muted ms-4">
                      {item}
                    </div>
                  ))}
                </div>
              ))}
              <div className="fw-semibold mb-2">Spesialisasi</div>
              <div className="d-flex flex-wrap gap-2">
                {specializations.map((spec, idx) => (
                  <span key={idx} className="specialization-badge">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="footer-text text-center mt-4">
          © 2025 RoxyDental Platform untuk kesehatan gigi dan mulut.
        </p>
      </div>
    </div>
  );
}
