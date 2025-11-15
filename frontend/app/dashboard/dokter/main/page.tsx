'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardDokterUtama() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard/dokter/utama' },
    { id: 'kalender', label: 'Kalender', icon: 'bi-calendar3', path: '/dashboard/dokter/kalender' },
    { id: 'pasien', label: 'Data Pasien', icon: 'bi-people', path: '/dashboard/dokter/pasien' },
    { id: 'analisis', label: 'Analisis', icon: 'bi-graph-up', path: '/dashboard/dokter/analisis' },
    { id: 'prediksi', label: 'Prediksi', icon: 'bi-magic', path: '/dashboard/dokter/prediksi' },
    { id: 'keuangan', label: 'Keuangan', icon: 'bi-wallet2', path: '/dashboard/dokter/keuangan' },
  ];

  const stats = [
    { label: 'Total Kunjungan', value: '0', icon: 'bi-people-fill', color: '#ec4899' },
    { label: 'Kunjungan Hari Ini', value: '0', icon: 'bi-calendar-check-fill', color: '#fbbf24' },
    { label: 'Kunjungan Bulan Ini', value: '0', icon: 'bi-graph-up-arrow', color: '#f472b6' }
  ];

  const schedule = [
    { day: 'Minggu', startTime: '16:00', endTime: '21:00', location: 'Soso Dental Kemang' },
    { day: 'Senin', startTime: '16:00', endTime: '21:00', location: 'Soso Dental Kemang' },
    { day: 'Selasa', startTime: '-', endTime: '-', location: '-' },
    { day: 'Rabu', startTime: '-', endTime: '-', location: '-' },
    { day: 'Kamis', startTime: '10:00', endTime: '15:00', location: 'Soso Dental Tabet' },
    { day: 'Jumat', startTime: '-', endTime: '-', location: '-' },
    { day: 'Sabtu', startTime: '-', endTime: '-', location: '-' }
  ];

  const qualifications = [
    { title: 'Pendidikan', items: ['S1 Kedokteran Gigi', 'Universitas Indonesia, 2018'] },
    { title: 'Pengalaman', items: ['6+ tahun praktek', 'Spesialis Perawatan Gigi'] }
  ];

  const specializations = [
    'Perawatan Gigi Umum',
    'Estetika Gigi',
    'Kawat Gigi',
    'Ortodonsi'
  ];

  const handleNavigate = (path) => {
    router.push(path);
  };

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    handleNavigate(path);
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: linear-gradient(180deg, #fce7f3 0%, #fed7e2 50%, #fecdd3 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .navbar-pink {
          background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%);
          padding: 0.75rem 2rem;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
        }
        .navbar-brand-custom {
          color: white !important;
          font-weight: 700;
          font-size: 1.25rem;
        }
        .search-box {
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 25px;
          padding: 0.5rem 1.5rem;
          width: 400px;
        }
        .search-box:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
        }
        .btn-icon {
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .sidebar-menu {
          background: white;
          border-radius: 15px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 1.5rem;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 0.5rem;
        }
        .menu-item:hover {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          color: #be185d;
          transform: translateX(5px);
        }
        .menu-item.active {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
        }
        .menu-item i {
          font-size: 1.25rem;
          width: 24px;
          text-align: center;
        }
        .profile-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          margin-bottom: 1.5rem;
        }
        .doctor-image {
          width: 120px;
          height: 120px;
          border-radius: 15px;
          border: 4px solid #fbbf24;
          object-fit: cover;
        }
        .badge-custom {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          color: #be185d;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid #f9a8d4;
        }
        .btn-primary-custom {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          border: none;
          border-radius: 25px;
          padding: 0.6rem 2rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s;
        }
        .btn-primary-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        }
        .btn-outline-custom {
          border: 2px solid #ec4899;
          color: #ec4899;
          background: white;
          border-radius: 25px;
          padding: 0.6rem 2rem;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-outline-custom:hover {
          background: #ec4899;
          color: white;
        }
        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s;
          border-left: 4px solid;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .schedule-card, .qualification-card {
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          height: 100%;
        }
        .table-custom {
          margin: 0;
        }
        .table-custom thead {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
        }
        .table-custom thead th {
          border: none;
          color: #be185d;
          font-weight: 600;
          font-size: 0.9rem;
          padding: 1rem;
        }
        .table-custom tbody td {
          padding: 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #fce7f3;
        }
        .table-custom tbody tr:hover {
          background: #fef7fb;
        }

        
        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #831843;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .qualification-item {
          margin-bottom: 1.25rem;
        }
        .qualification-title {
          color: #ec4899;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .specialization-badge {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: inline-block;
          margin: 0.25rem;
        }
        .footer-text {
          color: #9ca3af;
          font-size: 0.85rem;
          margin-top: 3rem;
        }
        .rating-stars {
          color: #fbbf24;
        }
        .dropdown-custom {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          overflow: hidden;
          min-width: 180px;
          z-index: 1000;
        }
        .dropdown-custom a {
          display: block;
          padding: 0.75rem 1.25rem;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .dropdown-custom a:hover {
          background: #fef7fb;
          color: #ec4899;
        }
        .dropdown-custom hr {
          margin: 0;
          border-color: #fce7f3;
        }
        .content-area {
          flex: 1;
        }
      `}</style>

      <div className="min-vh-100">
        {/* HEADER */}
        <nav className="navbar-pink">
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Logo */}
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white p-2 rounded-3">
                <i className="bi bi-heart-pulse-fill text-danger fs-4"></i>
              </div>
              <div>
                <div className="navbar-brand-custom">RoxyDental</div>
                <small className="text-white opacity-75">Platform Kesehatan</small>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-md-block">
                <input 
                  type="search" 
                  className="search-box"
                  placeholder="Cari dokter, spesialis..."
                />
              </div>

              <div className="position-relative">
                <button 
                  className="btn-icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="bi bi-bell-fill text-danger"></i>
                </button>
                {showNotifications && (
                  <div className="dropdown-custom">
                    <div className="p-3 text-center text-muted">
                      <small>Tidak ada notifikasi baru</small>
                    </div>
                  </div>
                )}
              </div>

              <div className="position-relative">
                <button 
                  className="btn btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{fontSize: '0.9rem'}}
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-lg-inline">Halo, drg. Kartika</span>
                  <i className="bi bi-chevron-down small"></i>
                </button>
                {showDropdown && (
                  <div className="dropdown-custom">
                    <a onClick={() => handleNavigate('/dashboard/dokter/profil')}>
                      <i className="bi bi-person me-2"></i>Profile
                    </a>
                    <a onClick={() => handleNavigate('/dashboard/dokter/pengaturan')}>
                      <i className="bi bi-gear me-2"></i>Pengaturan
                    </a>
                    <hr />
                    <a className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* MAIN LAYOUT */}
        <div className="container-fluid py-4">
          <div className="row">
            {/* SIDEBAR MENU */}
            <div className="col-lg-2 col-md-3 mb-4">
              <div className="sidebar-menu">
                {menuItems.map((item) => (
                  <a
                    key={item.id}
                    className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                    onClick={() => handleMenuClick(item.id, item.path)}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="col-lg-10 col-md-9">
              <div className="content-area">
                {/* PROFILE CARD */}
                <div className="profile-card">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img 
                        src="https://placehold.co/120x120/fda4af/white?text=drg.K" 
                        alt="Doctor" 
                        className="doctor-image"
                      />
                    </div>
                    <div className="col">
                      <h4 className="fw-bold mb-2" style={{color: '#831843'}}>drg. Kartika Yusriya Dinanti</h4>
                      <p className="text-muted mb-2">Dokter Gigi</p>
                      <div className="mb-2">
                        <span className="rating-stars">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                        </span>
                        <span className="text-muted ms-2 small">(0 ulasan)</span>
                      </div>
                      <p className="mb-3 small text-muted">
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        Tempat Praktek
                      </p>
                      <div className="mb-3">
                        <span className="badge-custom me-2">Soso Dental Kemang</span>
                        <span className="badge-custom">Soso Dental Tabet</span>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn-primary-custom">Buat Janji Temu</button>
                        <button className="btn-outline-custom">Konsul Online</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATISTICS */}
                <div className="row g-3 mb-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="col-md-4">
                      <div className="stat-card" style={{borderLeftColor: stat.color}}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="text-muted small mb-1">{stat.label}</div>
                            <div className="fs-2 fw-bold" style={{color: stat.color}}>{stat.value}</div>
                          </div>
                          <div className="stat-icon" style={{background: `${stat.color}20`, color: stat.color}}>
                            <i className={`bi ${stat.icon}`}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SCHEDULE AND QUALIFICATION */}
                <div className="row g-4">
                  <div className="col-lg-8">
                    <div className="schedule-card">
                      <div className="section-title">
                        <i className="bi bi-clock-history"></i>
                        Jadwal Praktek
                      </div>
                      <div className="table-responsive">
                        <table className="table table-custom">
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
                  </div>

                  <div className="col-lg-4">
                    <div className="qualification-card">
                      <div className="section-title">
                        <i className="bi bi-award"></i>
                        Kualifikasi Tenaga Medis
                      </div>
                      
                      {qualifications.map((qual, idx) => (
                        <div key={idx} className="qualification-item">
                          <div className="qualification-title">
                            <i className={`bi ${idx === 0 ? 'bi-mortarboard' : 'bi-briefcase'}`}></i>
                            {qual.title}
                          </div>
                          {qual.items.map((item, i) => (
                            <div key={i} className={i === 0 ? 'fw-semibold small' : 'text-muted small'}>
                              {item}
                            </div>
                          ))}
                        </div>
                      ))}

                      <div>
                        <div className="qualification-title mb-3">Spesialisasi</div>
                        <div>
                          {specializations.map((spec, idx) => (
                            <span key={idx} className="specialization-badge">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="text-center footer-text">
                  © 2025 RoxyDental. Platform untuk kesehatan gigi dan mulut.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}