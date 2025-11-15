'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegisterDokterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    registrationNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/dokter1.jpg', '/dokter2.jpg', '/dokter3.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = () => {
    let valid = true;
    const newErrors = { name: '', username: '', email: '', registrationNumber: '', password: '', confirmPassword: '' };

    if (!name) { newErrors.name = 'Nama harus diisi'; valid = false; }
    if (!username) { newErrors.username = 'Username harus diisi'; valid = false; }
    if (!email) { 
      newErrors.email = 'Email harus diisi'; 
      valid = false; 
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) { newErrors.email = 'Email tidak valid'; valid = false; }
    }
    if (!registrationNumber) { newErrors.registrationNumber = 'No. registrasi harus diisi'; valid = false; }
    if (!password) { newErrors.password = 'Password harus diisi'; valid = false; }
    else if (password.length < 6) { newErrors.password = 'Password minimal 6 karakter'; valid = false; }

    if (!confirmPassword) { newErrors.confirmPassword = 'Konfirmasi password harus diisi'; valid = false; }
    if (password && confirmPassword && password !== confirmPassword) { 
      newErrors.confirmPassword = 'Password tidak cocok'; 
      valid = false; 
    }

    setErrors(newErrors);

    if (valid) {
      setShowSuccess(true);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    router.push('/login'); 
  };

  return (
    <div className="d-flex vh-100 vw-100 overflow-hidden">
      {/* LEFT SIDE - SLIDE */}
      <div className="d-none d-md-flex position-relative flex-column justify-content-center align-items-center" style={{ flex: 1.2 }}>
        <div className="position-relative w-100 h-100">
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
                borderRadius: '12px'
              }}
              priority
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="d-flex flex-column align-items-center overflow-y-auto bg-white" style={{ flex: 1, padding: '2.5rem 2rem 4rem' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          
          {/* Tombol Kembali ke Role */}
          <div
            className="d-flex align-items-center cursor-pointer mb-3"
            onClick={() => router.push('/register/role')}
            style={{ color: '#FF5E8A', fontWeight: 500, gap: '0.5rem', justifyContent: 'flex-start' }}
          >
            <FaArrowLeft />
            <span>Kembali</span>
          </div>

          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: '#111' }}>Daftar Akun Dokter</h2>
            <p className="text-muted mb-4 fw-semibold">Isi data di bawah untuk membuat akun baru</p>
          </div>

          <div className="text-start">
            <div className="mb-3">
              <label className="form-label fw-semibold small">Nama Lengkap</label>
              <input type="text" className="form-control py-2" placeholder="Masukkan nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <small className="text-danger" style={{ fontSize: '12px' }}>{errors.name}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Username</label>
              <input type="text" className="form-control py-2" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} />
              {errors.username && <small className="text-danger" style={{ fontSize: '12px' }}>{errors.username}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">Email</label>
              <input type="email" className="form-control py-2" placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <small className="text-danger" style={{ fontSize: '12px' }}>{errors.email}</small>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold small">No. Registrasi</label>
              <input type="text" className="form-control py-2" placeholder="Masukkan nomor registrasi dokter" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
              {errors.registrationNumber && <small className="text-danger" style={{ fontSize: '12px' }}>{errors.registrationNumber}</small>}
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold small">Password</label>
              <div className="input-group">
                <input type={showPassword ? 'text' : 'password'} className="form-control py-2" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)} style={{ color: '#FF5E8A', borderColor: '#FF5E8A', fontWeight: 600 }}>
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.password && <small className="text-danger" style={{ fontSize: '12px' }}>{errors.password}</small>}
            </div>

            <div className="mb-4 position-relative">
              <label className="form-label fw-semibold small">Konfirmasi Password</label>
              <div className="input-group">
                <input type={showConfirm ? 'text' : 'password'} className="form-control py-2" placeholder="Ulangi password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirm(!showConfirm)} style={{ color: '#FF5E8A', borderColor: '#FF5E8A', fontWeight: 600 }}>
                  {showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              {errors.confirmPassword && <small className="text-danger" style={{ fontSize: '12px' }}>{errors.confirmPassword}</small>}
            </div>

            <button className="btn text-white w-100 py-2 fw-bold mb-3" style={{ background: 'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)', borderRadius: '8px' }} onClick={handleRegister}>
              Daftar Sekarang
            </button>
          </div>

          <p className="text-center text-secondary mt-2 mb-0">
            Sudah punya akun?{' '}
            <span onClick={() => router.push('/login')} className="fw-bold text-decoration-underline" style={{ color: '#FF5E8A', cursor: 'pointer' }}>
              Login di sini
            </span>
          </p>

          <p className="text-center text-muted mt-4 small mb-0">© 2025 RoxyDental • All rights reserved</p>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 999 }}>
          <div className="bg-white p-4 rounded shadow-lg text-center" style={{ minWidth: '300px', maxWidth: '90%', animation: 'fadeIn 0.3s ease-in-out' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#333' }}>Berhasil!</h5>
            <p className="mb-4" style={{ color: '#555' }}>Akun dokter {name} berhasil dibuat.</p>
            <button className="btn btn-primary px-4 py-2" onClick={closeSuccessModal} style={{ background: 'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)', border: 'none' }}>
              Tutup
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        *:focus { outline: none !important; box-shadow: none !important; }
        div[style*='overflow-y: auto'] { scrollbar-width: thin; scrollbar-color: #ccc transparent; }
        div[style*='overflow-y: auto']::-webkit-scrollbar { width: 5px; }
        div[style*='overflow-y: auto']::-webkit-scrollbar-track { background: transparent; }
        div[style*='overflow-y: auto']::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 3px; }
      `}</style>
    </div>
  );
}
