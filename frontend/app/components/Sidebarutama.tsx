'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebarutama.css';

export default function Sidebarutama() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard/dokter/utama' },
    { name: 'Kalender', icon: 'bi-calendar-week', path: '/dashboard/dokter/kalender' },
    { name: 'Data Pasien', icon: 'bi-people-fill', path: '/dashboard/dokter/pasien' },
    { name: 'Analisis', icon: 'bi-bar-chart-line-fill', path: '/dashboard/dokter/analisis' },
    { name: 'Prediksi', icon: 'bi-graph-up-arrow', path: '/dashboard/dokter/prediksi' },
    { name: 'Keuangan', icon: 'bi-cash-stack', path: '/dashboard/dokter/keuangan' },
  ];

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebarutama ${isCollapsed ? 'collapsed' : ''}`}>
      {/* HEADER */}
      <div className="sidebarutama-header">
        {!isCollapsed && (
          <h5 className="sidebarutama-title">
            <i className="bi bi-heart-pulse-fill me-2"></i>RoxyDental
          </h5>
        )}
        <button
          className="btn-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
        >
          <i
            className={`bi ${
              isCollapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'
            }`}
          ></i>
        </button>
      </div>

      {/* MENU */}
      <ul className="sidebarutama-menu list-unstyled mt-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`sidebarutama-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => router.push(item.path)}
          >
            <div className="icon-wrapper">
              <i className={`bi ${item.icon}`}></i>
            </div>
            {!isCollapsed && <span>{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
