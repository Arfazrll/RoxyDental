'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegisterPerawatPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gambar slide perawat
  const slides = [
    '/perawat1.jpg',
    '/perawat2.jpg',
    '/perawat3.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = () => {
    if (!name || !username || !registrationNumber || !password || !confirmPassword) {
      alert('Harap isi semua data terlebih dahulu!');
      return;
    }
    if (password !== confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    alert(`Akun perawat bernama ${name} berhasil dibuat!`);
    router.push('/login');
  };

  return (
    <div className="d-flex vh-100 vw-100 overflow-hidden">
      {/* LEFT SIDE - SLIDE */}
      <div
        className="d-none d-md-flex position-relative"
        style={{ flex: 1.2 }}
      >
        {slides.map((slide, index) => (
          <Image
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            fill
            style={{
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.7s ease-in-out',
            }}
            priority
          />
        ))}

        <div className="position-absolute bottom-0 start-0 p-4 text-white w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
          <h5 className="fw-bold mb-1">RoxyDental</h5>
          <p className="mb-0 small">Senyum Sehat, Hidup Lebih Cerah ✨</p>
        </div>

        {/* Indicator */}
        <div className="position-absolute bottom-3 start-50 translate-middle-x d-flex gap-1">
          {slides.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: idx === currentSlide ? '#FF5E8A' : '#FFB4C8',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div
        className="d-flex flex-column align-items-center overflow-y-auto bg-white"
        style={{ flex: 1, padding: '2.5rem 2rem 4rem' }}
      >
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#111' }}>Daftar Akun Perawat</h2>
            <p className="text-muted mb-4 fw-semibold">Isi data di bawah untuk membuat akun baru</p>
          </div>

          {/* Form */}
          <div className="text-start">
            <div className="mb-3">
              <label className="form-label fw-semibold small">Nama Lengkap</label>
              <input
                type="text"
                className="form-control py-2"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Username</label>
              <input
                type="text"
                className="form-control py-2"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">No. Registrasi</label>
              <input
                type="text"
                className="form-control py-2"
                placeholder="Masukkan nomor registrasi perawat"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold small">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control py-2"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: '#FF5E8A', borderColor: '#FF5E8A', fontWeight: 600 }}
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small">Konfirmasi Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control py-2"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="btn text-white w-100 py-2 fw-bold mb-3"
              style={{
                background: 'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)',
                borderRadius: '8px',
              }}
              onClick={handleRegister}
            >
              Daftar Sekarang
            </button>
          </div>

          <p className="text-center text-secondary mt-2 mb-0">
            Sudah punya akun?{' '}
            <span
              onClick={() => router.push('/login')}
              className="fw-bold text-decoration-underline"
              style={{ color: '#FF5E8A', cursor: 'pointer' }}
            >
              Login di sini
            </span>
          </p>

          <p className="text-center text-muted mt-4 small mb-0">© 2025 RoxyDental • All rights reserved</p>
        </div>
      </div>

      {/* Scrollbar minimalis */}
      <style jsx global>{`
        *:focus {
          outline: none !important;
          box-shadow: none !important;
        }

        div[style*='overflow-y: auto'] {
          scrollbar-width: thin;
          scrollbar-color: #ccc transparent;
        }

        div[style*='overflow-y: auto']::-webkit-scrollbar {
          width: 5px;
        }
        div[style*='overflow-y: auto']::-webkit-scrollbar-track {
          background: transparent;
        }
        div[style*='overflow-y: auto']::-webkit-scrollbar-thumb {
          background-color: #ccc;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
