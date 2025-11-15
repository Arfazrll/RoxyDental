'use client';

import React from 'react';
import Navbar from '@/app/components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPrediksi() {
  // Summary Cards Data
  const summaryCards = [
    { title: 'Total Pasien Aktif', value: '2,347', subtitle: '↑ 12% dari bulan lalu', icon: '👥', bgColor: '#FF1493', iconBg: '#FFE4F0' },
    { title: 'Kunjungan Terdaftar', value: '89', subtitle: '↑ Pointer 4% (Hari)', icon: '📅', bgColor: '#FFD700', iconBg: '#FFF9E6' },
    { title: 'Tingkat Retensi', value: '83.4%', subtitle: '↑ 3% dari bulan lalu', icon: '🔄', bgColor: '#FF1493', iconBg: '#FFE4F0' },
    { title: 'Pendapatan Bulan Ini', value: 'Rp 125 jt', subtitle: '↑ 15% dari bulan lalu', icon: '💰', bgColor: '#FFD700', iconBg: '#FFF9E6' }
  ];

  // Chart Data (sama seperti yang sudah kamu buat sebelumnya)
  // Chart 1: Tren Layanan per Bulan
const layananData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    { label: 'Bleaching', data: [45, 35, 50, 60, 55, 70, 65, 75, 80, 70, 85, 90], backgroundColor: '#FFD700' },
    { label: 'Cabut Gigi', data: [30, 40, 35, 45, 50, 55, 60, 50, 65, 70, 60, 75], backgroundColor: '#32CD32' },
    { label: 'Kawat Gigi', data: [60, 50, 45, 55, 60, 65, 70, 80, 75, 85, 90, 95], backgroundColor: '#FF1493' },
    { label: 'Scalling', data: [40, 45, 55, 50, 60, 50, 55, 65, 70, 75, 80, 85], backgroundColor: '#9370DB' },
    { label: 'Tambal Gigi', data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105], backgroundColor: '#4169E1' },
    { label: 'Pemutihan', data: [35, 30, 40, 45, 50, 45, 55, 60, 55, 65, 70, 75], backgroundColor: '#FF6347' }
  ]
};

// Chart 2: Prediksi Pasien
const prediksiPasienData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Pasien Baru',
      data: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95],
      borderColor: '#FF1493',
      backgroundColor: 'rgba(255, 20, 147, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#FF1493'
    },
    {
      label: 'Pasien Kembali',
      data: [80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135],
      borderColor: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#FFD700'
    }
  ]
};

// Chart 3: Distribusi Kategori Layanan
const kategoriData = {
  labels: ['Perawatan Preventif - 35%', 'Perawatan Restoratif - 28%', 'Kosmetik - 18%', 'Bedah Mulut - 10%', 'Ortodonti - 9%'],
  datasets: [
    {
      data: [35, 28, 18, 10, 9],
      backgroundColor: ['#FFD700', '#FF1493', '#4169E1', '#32CD32', '#9370DB'],
      borderWidth: 0
    }
  ]
};

// Chart 4: Prediksi Pendapatan
const pendapatanData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Pendapatan Aktual',
      data: [40, 45, 50, 55, 60, 65, 70, 75, 80, null, null, null],
      borderColor: '#FF1493',
      backgroundColor: 'rgba(255, 20, 147, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#FF1493',
      fill: true
    },
    {
      label: 'Prediksi Pengeluaran',
      data: [null, null, null, null, null, null, null, null, 80, 85, 90, 95],
      borderColor: '#FFD700',
      borderDash: [5, 5],
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#FFD700',
      fill: true
    }
  ]
};

// Chart 5: Tren Treatment Populer
const treatmentData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    { label: 'Bleaching', data: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115], backgroundColor: '#FFD700' },
    { label: 'Kawat Gigi', data: [70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125], backgroundColor: '#FF1493' },
    { label: 'Scalling', data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105], backgroundColor: '#4169E1' }
  ]
};


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFE5F0 0%, #FFF5E5 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Navbar */}
      <Navbar />

      {/* Container */}
      <div style={{ padding: '24px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {summaryCards.map((card, idx) => (
            <div key={idx} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{card.title}</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>{card.value}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{card.subtitle}</div>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {card.icon}
                </div>
              </div>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '100%', backgroundColor: card.bgColor }} />
            </div>
          ))}
        </div>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Tren Layanan */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFE4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#FF1493', fontWeight: 'bold' }}>📊</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Tren Layanan per Bulan</div>
                <div style={{ fontSize: '12px', color: '#999' }}>12 bulan terakhir</div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={layananData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } }, scales: { x: { stacked: false }, y: { stacked: false, beginAtZero: true } } }} />
            </div>
          </div>

          {/* Prediksi Pasien */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#FFD700', fontWeight: 'bold' }}>👥</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Prediksi Pasien</div>
                <div style={{ fontSize: '12px', color: '#999' }}>6 bulan terakhir & prediksi</div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={prediksiPasienData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
            </div>
          </div>
        </div>

        {/* Row 2: Distribusi Kategori */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E6F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#4169E1', fontWeight: 'bold' }}>🥧</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Distribusi Kategori Layanan</div>
              <div style={{ fontSize: '12px', color: '#999' }}>6 bulan terakhir</div>
            </div>
          </div>
          <div style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '400px', height: '350px' }}>
              <Pie data={kategoriData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'right', labels: { boxWidth: 15, padding: 15 } } } }} />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Prediksi Pendapatan */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFE4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#FF1493', fontWeight: 'bold' }}>💵</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Prediksi Pendapatan</div>
                <div style={{ fontSize: '12px', color: '#999' }}>Aktual vs Prediksi</div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Line data={pendapatanData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
            </div>
          </div>

          {/* Tren Treatment Populer */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: '#FFD700', fontWeight: 'bold' }}>⭐</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Tren Treatment Populer</div>
                <div style={{ fontSize: '12px', color: '#999' }}>Top 3 layanan</div>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <Bar data={treatmentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' } }, scales: { y: { beginAtZero: true } } }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#999', fontSize: '12px', marginTop: '32px' }}>
          © 2025 RoxyDenCare Platform untuk ...
        </div>
      </div>
    </div>
  );
}
