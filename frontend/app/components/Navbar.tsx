'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar({ userName = "drg. Kartika" }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (path: string) => {
    setShowDropdown(false);
    setShowNotifications(false);
    router.push(path);
  };

  const notifications = [
    {
      title: "Jadwal Kontrol",
      message: "Pasien Adil Kasun Sweger memiliki jadwal kontrol besok, 18 Juli 2025 pukul 10:00",
      time: "5 menit yang lalu"
    },
    {
      title: "Update Rekam Medis",
      message: "dr. Sarah Aminah telah memperbarui rekam medis pasien Siti Nurhaliza",
      time: "1 jam yang lalu"
    },
    {
      title: "Pengingat Pembayaran",
      message: "Pasien Ahmad Dhani memiliki tagihan tertunda sebesar Rp 850.000",
      time: "2 jam yang lalu"
    },
    {
      title: "Pasien Baru Terdaftar",
      message: "Pasien baru atas nama Rina Wijaya telah terdaftar di sistem",
      time: "3 jam yang lalu"
    },
    {
      title: "Pembatalan Janji",
      message: "Pasien Budi Santoso membatalkan janji temu tanggal 20 Juli 2025",
      time: "5 jam yang lalu"
    },
  ];

  return (
    <>
      {/* CDN */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      {/* GLOBAL STYLE */}
      <style>{`
        .navbar-pink {
          background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%);
          padding: 0.75rem 2rem;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
          z-index: 999;
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
          font-size: 0.9rem;
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
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        /* NOTIF DROPDOWN */
        .notif-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.75rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          width: 380px;
          z-index: 1000;
          max-height: 420px;
          overflow-y: auto;
          padding-bottom: 0.5rem;
          animation: fadeIn 0.15s ease-in-out;
        }

        .notif-header {
          padding: 1rem;
          border-bottom: 1px solid #f3d0e0;
        }

        .notif-item {
          padding: 0.9rem 1rem;
          border-bottom: 1px solid #f8dde9;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .notif-item:hover {
          background: #fdf2f8;
        }

        .notif-title {
          font-weight: 600;
          color: #be185d;
        }

        .notif-message {
          font-size: 0.85rem;
          color: #444;
        }

        .notif-time {
          font-size: 0.75rem;
          color: #888;
        }

        .notif-footer {
          text-align: center;
          padding: 0.8rem;
        }

        .notif-footer a {
          text-decoration: none;
          font-weight: 600;
          color: #ec4899;
          cursor: pointer;
        }

        /* PROFILE DROPDOWN */
        .dropdown-custom {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          overflow: hidden;
          min-width: 190px;
          z-index: 1000;
          animation: fadeIn 0.15s ease-in-out;
        }

        .dropdown-custom a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 0.95rem;
          cursor: pointer;
          color: #444;
          transition: background 0.2s, color 0.2s;
          text-decoration: none;
        }

        .dropdown-custom a:hover {
          background: #fdf2f8;
          color: #ec4899;
        }

        .dropdown-custom hr {
          margin: 6px 0;
          border-color: #f0c6d8;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <nav className="navbar-pink">
        <div className="d-flex justify-content-between align-items-center w-100">

          {/* LOGO */}
          <div 
            className="d-flex align-items-center gap-3" 
            style={{cursor: 'pointer'}}
            onClick={() => handleNavigate('/dashboard/dokter/utama')}
          >
            <div className="bg-white p-2 rounded-3">
              <i className="bi bi-heart-pulse-fill text-danger fs-4"></i>
            </div>
            <div>
              <div className="navbar-brand-custom">RoxyDental</div>
              <small className="text-white opacity-75">Platform Kesehatan</small>
            </div>
          </div>

          {/* SEARCH + BUTTONS */}
          <div className="d-flex align-items-center gap-3">

            {/* SEARCH */}
            <div className="d-none d-md-block">
              <input 
                type="search" 
                className="search-box"
                placeholder="Cari dokter, spesialis..."
              />
            </div>

            {/* NOTIF BUTTON */}
            <div className="position-relative">
              <button 
                className="btn-icon"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell-fill text-danger"></i>
              </button>

              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header d-flex justify-content-between">
                    <strong>Notifikasi</strong>
                    <span className="text-danger fw-bold">{notifications.length} Baru</span>
                  </div>

                  {notifications.map((n, idx) => (
                    <div key={idx} className="notif-item">
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  ))}

                  <div className="notif-footer">
                    <a onClick={() => handleNavigate('/dashboard/dokter/notifikasi')}>
                      Lihat Semua Notifikasi
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="position-relative">
              <button 
                className="btn btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-person-circle"></i>
                <span className="d-none d-lg-inline">Halo, {userName}</span>
                <i className="bi bi-chevron-down small"></i>
              </button>

              {showDropdown && (
                <div className="dropdown-custom">
                  <a onClick={() => handleNavigate('/dashboard/dokter/utama')}>
                    <i className="bi bi-house-door"></i> Dashboard
                  </a>
                  <a onClick={() => handleNavigate('/dashboard/dokter/profil')}>
                    <i className="bi bi-person"></i> Profil
                  </a>
                  <a onClick={() => handleNavigate('/dashboard/dokter/analisis')}>
                    <i className="bi bi-bar-chart-line"></i> Analisis
                  </a>
                  <a onClick={() => handleNavigate('/dashboard/dokter/prediksi')}>
                    <i className="bi bi-graph-up"></i> Prediksi
                  </a>
                  <a onClick={() => handleNavigate('/dashboard/dokter/pasien/antrian')}>
                    <i className="bi bi-people"></i> Data Pasien
                  </a>
                  <a onClick={() => handleNavigate('/dashboard/dokter/keuangan')}>
                    <i className="bi bi-wallet2"></i> Keuangan
                  </a>
                  <a onClick={() => handleNavigate('/dashboard/dokter/settings/info')}>
                    <i className="bi bi-sliders"></i> Pengaturan
                  </a>

                  <hr />

                  <a className="text-danger" onClick={() => handleNavigate('/login')}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}
