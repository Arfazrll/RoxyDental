'use client';

import React, { useState } from 'react';
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
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import './AnalisisPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const AnalisisPage: React.FC = () => {
  const [checked, setChecked] = useState<number[]>([]);

  const handleCheck = (idx: number) => {
    setChecked(prev => (prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]));
  };

  const barData = {
    labels: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'],
    datasets: [
      { label: 'Scaling', data: [12,18,14,22,20,26,24,18,28,30,26,32], backgroundColor: '#FF6FA8', borderRadius: 6, barThickness: 12 },
      { label: 'Tambal', data: [8,12,9,14,13,18,16,13,18,19,17,20], backgroundColor: '#4169E1', borderRadius: 6, barThickness: 12 },
    ]
  };

  const lineData = {
    labels: barData.labels,
    datasets: [
      { label: 'Pasien Baru', data: [40,48,42,55,50,60,58,52,62,66,63,70], borderColor: '#FF6FA8', backgroundColor: 'rgba(255,111,168,0.06)', fill: true, tension: 0.35 },
      { label: 'Pasien Retensi', data: [28,30,30,34,36,38,37,39,41,42,43,45], borderColor: '#FFD166', backgroundColor: 'rgba(255,209,102,0.04)', fill: true, tension: 0.35 },
    ]
  };

  const pieData = {
    labels: ['Scaling','Tambal','Cabut','Behel','Whitening'],
    datasets: [{ data: [32,26,18,16,8], backgroundColor: ['#FF6FA8','#4169E1','#FFD700','#FFB6C1','#8EE28E'] }]
  };

  const peluang = [
    { nama: 'Andi Wijaya', jenis:'Perawatan Lanjutan', layanan:'Scaling & Polishing', waktu:'3 bulan lalu', pendapatan:'Rp 500.000', tag:'Prioritas Tinggi', tagColor:'rose' },
    { nama: 'Siti Rahayu', jenis:'Layanan Tambahan', layanan:'Pemutihan Gigi', waktu:'1 bulan lalu', pendapatan:'Rp 1.500.000', tag:'Prioritas Sedang', tagColor:'yellow' },
    { nama: 'Budi Santoso', jenis:'Retensi Pasien', layanan:'Kontrol Rutin', waktu:'6 bulan lalu', pendapatan:'Rp 300.000', tag:'Prioritas Tinggi', tagColor:'rose' },
    { nama: 'Linda Kusuma', jenis:'Layanan Tambahan', layanan:'Kawat Gigi', waktu:'2 minggu lalu', pendapatan:'Rp 8.000.000', tag:'Prioritas Tinggi', tagColor:'rose' },
    { nama: 'Rudi Hartono', jenis:'Perawatan Lanjutan', layanan:'Cabut Gigi Bungsu', waktu:'1 bulan lalu', pendapatan:'Rp 1.200.000', tag:'Prioritas Sedang', tagColor:'yellow' }
  ];

  const insights = [
    { nama:'Andi Wijaya', teks:'Pasien mengeluh sensitivitas gigi pada kunjungan terakhir. Rekomendasi: scaling dan fluoride treatment.', label:'Perawatan Preventif', percent:92 },
    { nama:'Siti Rahayu', teks:'Pasien menunjukkan minat terhadap estetika gigi. Potensi untuk layanan pemutihan atau veneer.', label:'Layanan Estetika', percent:87 },
    { nama:'Budi Santoso', teks:'Tidak ada kunjungan dalam 6 bulan terakhir. Riwayat perawatan periodontal memerlukan follow-up rutin.', label:'Retensi Pasien', percent:95 },
    { nama:'Linda Kusuma', teks:'Konsultasi ortodonti telah dilakukan. Pasien menunjukkan ketertarikan tinggi untuk prosedur kawat gigi.', label:'Ortodonti', percent:89 },
  ];

  return (
    <div className="rosy-viewport">
      <Navbar />

      <div className="container-fluid main-wrap">
        {/* top summary */}
        <div className="row g-3 align-items-stretch top-summary">
          <Summary title="Total Pasien Aktif" value="1,247" note="Naik 7%" color="#FF6FA8" icon="bi-people-fill" />
          <Summary title="Peluang Terkonfirmasi" value="89" note="Potensi tiap 4-6 bln" color="#FFD166" icon="bi-bell-fill" />
          <Summary title="Tingkat Retensi" value="86%" note="Retention rate" color="#6f42c1" icon="bi-arrow-repeat" />
          <Summary title="Pendapatan Bulan Ini" value="Rp 125.2J" note="Naik 11%" color="#90EE90" icon="bi-cash-stack" />
        </div>

        {/* charts row */}
        <div className="row g-4 charts-row">
          <div className="col-lg-6 col-md-12">
            <div className="card rosy-card">
              <div className="card-body">
                <div className="card-header-mini">
                  <div className="title">Trend Layanan per Bulan</div>
                  <div className="sub">12 bulan terakhir</div>
                </div>
                <div className="chart-area small">
                  <Bar data={barData} options={{ maintainAspectRatio:false, plugins:{legend:{display:false}} }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="card rosy-card">
              <div className="card-body">
                <div className="card-header-mini">
                  <div className="title">Retensi Pasien</div>
                  <div className="sub">Pasien baru vs kembali</div>
                </div>
                <div className="chart-area small">
                  <Line data={lineData} options={{ maintainAspectRatio:false, plugins:{legend:{display:false}} }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* pie chart full-width */}
        <div className="row g-4">
          <div className="col-12">
            <div className="card rosy-card">
              <div className="card-body">
                <div className="card-header-mini mb-3">
                  <div className="title">Distribusi Kategori Layanan</div>
                  <div className="sub">Berdasarkan total kunjungan</div>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="pie-area">
                    <Pie data={pieData} options={{ maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom row responsive */}
        <div className="row g-4 bottom-row">
          <div className="col-lg-6 col-md-12">
            <div className="card rosy-card h-100">
              <div className="card-body">
                <div className="header-with-icon mb-3">
                  <div className="icon-box rose"><i className="bi bi-activity"></i></div>
                  <div>
                    <div className="title">Peluang Layanan Terdeteksi</div>
                    <div className="sub">Rekomendasi berbasis data pasien</div>
                  </div>
                </div>
                <div className="list-compact">
                  {peluang.map((p, i) => (
                    <div key={i} className="list-card">
                      <div>
                        <div className="fw-semibold">{p.nama}</div>
                        <div className="small text-muted">Jenis: {p.jenis}</div>
                        <div className="small text-muted">Kunjungan Terakhir: {p.waktu}</div>
                        <div className="small text-muted">Layanan: <span className="text-dark">{p.layanan}</span></div>
                        <div className="small text-muted">Pendapatan: <span className="text-dark">{p.pendapatan}</span></div>
                      </div>
                      <div className="text-end">
                        <span className={`pill ${p.tagColor === 'rose' ? 'pill-rose' : 'pill-yellow'}`}>{p.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="card rosy-card h-100">
              <div className="card-body">
                <div className="header-with-icon mb-3">
                  <div className="icon-box yellow"><i className="bi bi-lightbulb"></i></div>
                  <div>
                    <div className="title">Insights NLP</div>
                    <div className="sub">Analisis catatan medis & riwayat kunjungan</div>
                  </div>
                </div>
                <div className="insights-compact">
                  {insights.map((it, idx) => (
                    <div key={idx} className="insight-row">
                      <div className="d-flex align-items-start gap-3">
                        <input className="form-check-input mt-1" type="checkbox" checked={checked.includes(idx)} onChange={() => handleCheck(idx)} />
                        <div style={{flex:1}}>
                          <div className="fw-semibold">{it.nama}</div>
                          <div className="small text-muted mb-2">{it.teks}</div>
                          <div className="d-flex align-items-center justify-content-between">
                            <div style={{fontSize:12}} className="badge small yellow-bg">{it.label}</div>
                            <div style={{width:'65%'}}>
                              <div className="progress prog-xs">
                                <div className="progress-bar progress-rose" role="progressbar" style={{width:`${it.percent}%`}} />
                              </div>
                            </div>
                          </div>
                          <div className="small text-muted mt-1">{it.percent}% confidence</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-muted py-3 mt-4">© 2025 RosyDental. Platform untuk perawatan gigi modern.</footer>
      </div>
    </div>
  );
};

export default AnalisisPage;

type SummaryProps = { title:string; value:string; note?:string; color?:string; icon?:string };
const Summary: React.FC<SummaryProps> = ({ title, value, note, color='#FF6FA8', icon='bi-people-fill' }) => (
  <div className="col-12 col-md-6 col-lg">
    <div className="card summary-card h-100 p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="small text-muted">{title}</div>
          <div className="fw-bold fs-5">{value}</div>
          {note && <div className="small" style={{color}}>{note}</div>}
        </div>
        <div className="icon-circle" style={{background:`${color}22`, color}}>
          <i className={`bi ${icon} fs-4`}></i>
        </div>
      </div>
    </div>
  </div>
);
