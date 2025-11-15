'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './SettingsSidebar.css'; // pastikan ada file CSS

export default function SettingsSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { title: 'Informasi Akun', desc: 'Data profil & akun', path: '/dashboard/dokter/settings/info' },
    { title: 'Ganti Password', desc: 'Keamanan akses', path: '/dashboard/dokter/settings/password' },
    { title: 'Notifikasi', desc: 'Pengaturan pemberitahuan', path: '/dashboard/dokter/settings/notif' },
    { title: 'Privasi & Keamanan', desc: 'Kontrol data & hapus akun', path: '/dashboard/dokter/settings/privacy' },
    { title: 'Tentang', desc: 'Info aplikasi', path: '/dashboard/dokter/settings/about' },
  ];

  return (
    <aside className="sidebar-full">
      {/* Header */}
      <div className="sidebar-header">
        <h5>Menu Pengaturan</h5>
        <p>Pilih kategori pengaturan</p>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
          >
            <div className="sidebar-item-text">
              <span className="item-title">{item.title}</span>
              <span className="item-subtitle">{item.desc}</span>
            </div>
          </div>
        ))}
      </nav>

      {/* Tips */}
      <div className="sidebar-tips">
        <span className="tips-icon">💡</span>
        <div className="tips-text">
          <h6>Tips</h6>
          <p>Perbarui informasi Anda secara berkala untuk menjaga keamanan akun</p>
        </div>
      </div>
    </aside>
  );
}
