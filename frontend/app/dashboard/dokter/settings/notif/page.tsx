'use client';

import Navbar from '@/app/components/Navbar';
import SettingSidebar from '@/app/components/SettingsSidebar';
import './NotifikasiPage.css';

export default function NotifikasiPage() {
  return (
    <div className="notif-page">
      <Navbar />

      <div className="container-fluid px-4 py-4">
        <div className="row">

          {/* SIDEBAR */}
          <div className="col-lg-3 col-md-4 mb-4">
            <SettingSidebar />
          </div>

          {/* MAIN CONTENT */}
          <div className="col-lg-9 col-md-8">

            {/* HEADER */}
            <div className="header-box">
              <h1 className="title">Pengaturan Notifikasi</h1>
              <p className="subtitle">Atur preferensi pemberitahuan sistem</p>
            </div>

            {/* GROUP SECTIONS */}
            <NotifGroup
              icon="bi-person-lines-fill"
              title="Informasi Akun"
              subtitle="Data profil & akun"
              options={[
                { label: "Notifikasi Email", desc: "Terima notifikasi melalui email" }
              ]}
            />

            <NotifGroup
              icon="bi-shield-lock"
              title="Ganti Password"
              subtitle="Keamanan akses"
              options={[
                { label: "Notifikasi", desc: "Beri tahu saya tentang aktivitas akun" }
              ]}
            />

            <NotifGroup
              icon="bi-calendar-heart"
              title="Jadwal Pasien"
              subtitle="Pengaturan Pemberitahuan"
              options={[
                { label: "Jadwal Pasien Baru", desc: "Pemberitahuan tentang jadwal pasien baru" }
              ]}
            />

            <NotifGroup
              icon="bi-incognito"
              title="Privasi & Keamanan"
              subtitle="Kontrol data & hapus akun"
              options={[
                { label: "Pengingat", desc: "Pengingat jadwal dan tugas" }
              ]}
            />

            {/* TIPS */}
            <div className="tips-box">
              <h5 className="fw-semibold mb-2">
                <span className="tip-icon">💡</span> Tips
              </h5>
              <p className="m-0">
                Perbarui informasi Anda secara berkala untuk menjaga keamanan akun.
              </p>
            </div>

            {/* SWITCH CARDS */}
            <div className="row g-3 mb-4">
              <SwitchCard title="Notifikasi Push" desc="Terima notifikasi push di browser" />
              <SwitchCard title="Jadwal Pasien" desc="Notifikasi real-time untuk jadwal pasien" />
              <SwitchCard title="Pesan" desc="Notifikasi untuk pesan baru" />
              <SwitchCard title="Update Sistem" desc="Notifikasi tentang update sistem" />
              <SwitchCard title="Notifikasi SMS" desc="Terima notifikasi melalui SMS" />
              <SwitchCard title="Jadwal Pasien (SMS)" desc="SMS untuk jadwal pasien penting" />
              <SwitchCard title="Pengingat (SMS)" desc="SMS pengingat jadwal" />
            </div>

            {/* SAVE BUTTON */}
            <div className="text-end mb-5">
              <button className="btn-save">Simpan Pengaturan</button>
            </div>

            {/* FOOTER */}
            <footer className="text-center">
              © 2025 RoxyDental. Platform untuk kesehatan & konsultasi dokter gigi.
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}

// GROUP COMPONENT
function NotifGroup({ icon, title, subtitle, options }: any) {
  return (
    <div className="group-box">
      <h4 className="group-title"><i className={`bi ${icon} me-2`}></i>{title}</h4>
      <p className="group-subtitle">{subtitle}</p>
      {options.map((o: any, i: number) => (
        <div key={i} className="option-item">
          <strong>{o.label}</strong>
          <p>{o.desc}</p>
        </div>
      ))}
    </div>
  );
}

// SWITCH CARD COMPONENT
function SwitchCard({ title, desc }: any) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="switch-card">
        <h5>{title}</h5>
        <p>{desc}</p>
        <div className="form-check form-switch mt-2">
          <input className="form-check-input" type="checkbox" />
        </div>
      </div>
    </div>
  );
}
