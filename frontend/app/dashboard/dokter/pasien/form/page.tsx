'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import styles from './style.module.css';

// =======================
//   TOAST CENTER — WHITE VERSION
// =======================
function ToastCenter({ message }: { message: string }) {
  return (
    <div style={overlayBlur}>
      <div style={toastWhiteBox}>
        <div style={toastWhiteIcon}>✓</div>
        <h3 style={toastWhiteTitle}>Berhasil!</h3>
        <p style={toastWhiteMsg}>{message}</p>
      </div>
    </div>
  );
}

// ====== BACKDROP + ANIMASI ======
const overlayBlur: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(3px)',
  backgroundColor: 'rgba(0,0,0,0.25)',
  zIndex: 5000,
  animation: 'fadeIn 0.3s ease'
};

// ====== TOAST PUTIH ======
const toastWhiteBox: React.CSSProperties = {
  background: 'white',
  padding: '26px 30px',
  borderRadius: '20px',
  textAlign: 'center',
  color: '#333',
  width: '310px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  border: '2px solid #ff8db8',
  animation: 'popIn 0.25s ease-out'
};

const toastWhiteIcon: React.CSSProperties = {
  fontSize: '30px',
  fontWeight: 'bold',
  background: '#ff8db8',
  color: 'white',
  width: '55px',
  height: '55px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 10px auto',
  boxShadow: '0 4px 10px rgba(255,125,165,0.45)'
};

const toastWhiteTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '19px',
  fontWeight: 700,
  color: '#ff4f8a'
};

const toastWhiteMsg: React.CSSProperties = {
  marginTop: 6,
  fontSize: '15px',
  opacity: 0.9
};

// =======================
//   PAGE FORM
// =======================

export default function TambahRekamMedis() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    noPasien: '',
    namaPasien: '',
    diagnosis: '',
    keluhan: '',
    tindakan: '',
    resepObat: '',
    catatan: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setShowToast(true);

    setTimeout(() => {
      router.push('/rekam-medis');
    }, 1800);
  };

  return (
    <>
      <Navbar />

      {showToast && <ToastCenter message="Rekam medis berhasil ditambahkan!" />}

      <div className={styles.container}>
        <div className={styles.formCard}>

          <button onClick={() => router.back()} className={styles.backBtn}>
            <svg width="20" height="20" fill="currentColor" style={{ marginRight: 6 }}>
              <path
                d="M15 10H5m0 0l4 4m-4-4l4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali
          </button>

          <h1 className={styles.title}>Tambah Rekam Medis</h1>

          <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.formGroup}>
              <label className={styles.label}>No. Pasien</label>
              <input
                type="text"
                name="noPasien"
                className={styles.input}
                value={formData.noPasien}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Pasien</label>
              <input
                type="text"
                name="namaPasien"
                className={styles.input}
                value={formData.namaPasien}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Diagnosis</label>
              <input
                type="text"
                name="diagnosis"
                className={styles.input}
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Keluhan</label>
              <textarea
                name="keluhan"
                className={styles.textarea}
                value={formData.keluhan}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Tindakan</label>
              <textarea
                name="tindakan"
                className={styles.textarea}
                value={formData.tindakan}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Resep Obat</label>
              <textarea
                name="resepObat"
                className={styles.textarea}
                value={formData.resepObat}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Catatan</label>
              <textarea
                name="catatan"
                className={styles.textarea}
                value={formData.catatan}
                onChange={handleChange}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitBtn}>
                Simpan Rekam Medis
              </button>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.push('/rekam-medis')}
              >
                Batal
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
