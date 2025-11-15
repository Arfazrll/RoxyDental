'use client';

import Navbar from '@/app/components/Navbar';
import SettingSidebar from '@/app/components/SettingsSidebar';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
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
              <h1>Informasi Aplikasi</h1>
              <p>Detail aplikasi dan versi yang digunakan</p>
            </div>

            {/* INFO GRID */}
            <div className="row g-3 mb-4">
              <InfoCard icon="bi-app" title="Nama Aplikasi" value="Sistem Manajemen Rumah Sakit" />
              <InfoCard icon="bi-gear" title="Versi" value="v2.5.0" />
              <InfoCard icon="bi-hammer" title="Build" value="2024.10.29" />
              <InfoCard icon="bi-clock" title="Terakhir Update" value="29 Oktober 2025" />
              <InfoCard icon="bi-file-earmark-lock" title="Lisensi" value="Enterprise" />
            </div>

            {/* SUPPORT & LEGAL */}
            <div className="row g-3 mb-4">
              <ListCard 
                icon="bi-life-preserver" 
                title="Dukungan & Bantuan" 
                items={['Pusat Bantuan', 'Dokumentasi API', 'Laporkan Bug', 'Hubungi Support']}
              />
              <ListCard 
                icon="bi-file-text" 
                title="Legal" 
                items={['Syarat & Ketentuan', 'Kebijakan Privasi', 'Lisensi Open Source']}
              />
            </div>

            {/* THANK YOU */}
            <div className="thankyou-card">
              <h5>Terima Kasih</h5>
              <p>
                Terima kasih telah menggunakan aplikasi kami! Sistem Manajemen Rumah Sakit
                dirancang untuk membantu tenaga medis memberikan pelayanan terbaik kepada pasien.
              </p>
            </div>

            {/* FOOTER */}
            <footer>
              © 2025 RoxyDental. Platform untuk kesehatan & konsultasi dokter gigi.
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}

// COMPONENTS
function InfoCard({ icon, title, value }: { icon: string, title: string, value: string }) {
  return (
    <div className="col-md-6">
      <div className="info-card">
        <i className={`bi ${icon} mb-2`}></i>
        <h5>{title}</h5>
        <p>{value}</p>
      </div>
    </div>
  );
}

function ListCard({ icon, title, items }: { icon: string, title: string, items: string[] }) {
  return (
    <div className="col-md-6">
      <div className="list-card">
        <h5><i className={`bi ${icon} me-2`}></i>{title}</h5>
        <ul>
          {items.map((item, idx) => <li key={idx}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}
