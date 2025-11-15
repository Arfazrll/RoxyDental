'use client';
import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import SettingsSidebar from '@/app/components/SettingsSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.css';
import './PrivacyPage.css';

export default function PrivacyPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginNotif, setLoginNotif] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [activityTracking, setActivityTracking] = useState(true);

  const handleSave = () => alert('Pengaturan berhasil disimpan!');

  return (
    <div className="privacy-page">
      <Navbar />

      <div className="container-fluid py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4">
            <SettingsSidebar />
          </div>

          {/* Konten utama */}
          <div className="col-lg-9 col-md-8">
            <div className="header-section mb-4">
              <h2 className="info-title">Privasi & Keamanan</h2>
              <p className="info-subtitle">
                Jaga dan kontrol keamanan akun Anda dengan mudah
              </p>
            </div>

            <div className="settings-card">
              {/* Keamanan Akun */}
              <h5 className="section-title">Keamanan Akun</h5>
              <Switch
                label="Autentikasi Dua Faktor"
                checked={twoFactor}
                description="Tambahkan lapisan keamanan ekstra dengan verifikasi 2 langkah"
                onChange={() => setTwoFactor(!twoFactor)}
              />
              <Switch
                label="Notifikasi Login"
                checked={loginNotif}
                description="Dapatkan notifikasi saat ada login dari perangkat baru"
                onChange={() => setLoginNotif(!loginNotif)}
              />

              {/* Privasi Data */}
              <h5 className="section-title mt-4">Privasi Data</h5>
              <Switch
                label="Berbagi Data untuk Analitik"
                checked={dataSharing}
                description="Bantu kami meningkatkan layanan dengan berbagi data anonim"
                onChange={() => setDataSharing(!dataSharing)}
              />
              <Switch
                label="Pelacakan Aktivitas"
                checked={activityTracking}
                description="Simpan riwayat aktivitas untuk analisis performa"
                onChange={() => setActivityTracking(!activityTracking)}
              />

              {/* Zona Berbahaya */}
              <h5 className="section-title mt-4 text-danger">Zona Berbahaya</h5>
              <button className="btn btn-danger w-100 mb-3" onClick={() => alert('Hapus akun ini bersifat permanen!')}>
                Hapus Akun
              </button>

              <div className="d-flex justify-content-end">
                <button className="btn btn-save" onClick={handleSave}>
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Switch
function Switch({ label, description, checked, onChange }: any) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <div className="form-check form-switch">
        <input
          className="form-check-input switch-input"
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <label className="form-check-label switch-label">{description}</label>
      </div>
    </div>
  );
}
