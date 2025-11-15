'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';

const DUMMY_USERS = {
  dokter: [
    { username: 'dr.sarah', password: 'dokter123' },
    { username: 'dr.budi', password: 'dokter123' },
  ],
  perawat: [
    { username: 'nurse.ani', password: 'perawat123' },
    { username: 'nurse.dini', password: 'perawat123' },
  ],
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [role, setRole] = useState<'dokter' | 'perawat'>();
  const slides = [
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1000&h=750&fit=crop',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1000&h=750&fit=crop',
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1000&h=750&fit=crop',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
  if (!role) {
    alert('Pilih role terlebih dahulu (Dokter atau Perawat)');
    return;
  }
  if (!username || !password) {
    alert('Username dan password harus diisi!');
    return;
  }

  // Validasi akun berdasarkan role
  const userList = DUMMY_USERS[role];
  const user = userList.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    alert('Username atau password salah!');
    return;
  }

  // Simpan sesi login (opsional)
  localStorage.setItem('userRole', role);
  localStorage.setItem('username', username);

  // Arahkan ke dashboard sesuai role
  if (role === 'dokter') {
    router.push('/dashboard/dokter/utama');
  } else if (role === 'perawat') {
    router.push('/dashboard/perawat');
  }
};


  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-lg-row p-0">
      {/* LEFT SIDE */}
      <div
        className="d-flex flex-column justify-content-center align-items-center align-items-lg-start text-center text-lg-start p-4 p-lg-5"
        style={{
          flex: 1.2,
          background: 'linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 50%, #FFB4C8 100%)',
        }}
      >
        <div className="mb-4">
          <h1
            className="fw-bold mb-0"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#111' }}
          >
            Selamat Datang
          </h1>
          <h1
            className="fw-bold"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#111' }}
          >
            di RoxyDental
          </h1>
        </div>

        {/* SLIDESHOW */}
       <div
  className="position-relative rounded-4 shadow-sm bg-white bg-opacity-50 p-2"
  style={{
    width: '100%',
    maxWidth: '720px',
    height: 'clamp(320px, 55vh, 520px)', // gambar lebih tinggi & besar
  }}
>

          <div className="position-relative overflow-hidden rounded-4 w-100 h-100">
            {slides.map((slide, index) => (
              <img
                key={index}
                src={slide}
                alt={`Slide ${index + 1}`}
                className={`position-absolute top-0 start-0 w-100 h-100 object-fit-cover transition-opacity ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transition: 'opacity 0.7s ease-in-out' }}
              />
            ))}
          </div>
          <div className="d-flex justify-content-center mt-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="border-0 rounded-pill mx-1"
                style={{
                  width: index === currentSlide ? '22px' : '7px',
                  height: '7px',
                  backgroundColor: index === currentSlide ? '#FF5E8A' : '#FFB4C8',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div
        className="d-flex flex-column align-items-center overflow-y-auto bg-white p-4 p-lg-5"
        style={{ flex: 1 }}
      >
        <div
          className="text-center mt-3 mt-lg-5"
          style={{ maxWidth: '420px', width: '100%' }}
        >
          {/* Logo Bulat */}
          <div
            className="rounded-circle mx-auto mb-3 d-flex justify-content-center align-items-center shadow-sm"
            style={{
              width: 'clamp(60px, 8vw, 90px)',
              height: 'clamp(60px, 8vw, 90px)',
              background: 'linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)',
              color: 'white',
              fontSize: 'clamp(1.5rem, 2vw, 2.3rem)',
              fontWeight: 700,
            }}
          >
            R
          </div>

          <h2 className="fw-bold" style={{ color: '#111' }}>
            RoxyDental
          </h2>
          <p className="text-muted mb-4 fw-semibold">Login ke Akun Kamu</p>

          {/* Role Selection */}
          <div className="d-flex justify-content-center mb-4 gap-2 flex-wrap">
            {['dokter', 'perawat'].map((r) => (
              <button
                key={r}
                className={`btn fw-semibold px-4 ${
                  role === r ? 'text-white' : 'text-secondary border'
                }`}
                style={{
                  background:
                    role === r ? 'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)' : '',
                  borderRadius: '50px',
                  flex: '1 1 45%',
                }}
                onClick={() => setRole(r as 'dokter' | 'perawat')}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* FORM INPUTS */}
          <div className="text-start">
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
                  style={{
                    color: '#FF5E8A',
                    borderColor: '#FF5E8A',
                    fontWeight: 600,
                  }}
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </div>

            <button
              className="btn text-white w-100 py-2 fw-bold mb-3"
              style={{
                background: 'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)',
                borderRadius: '8px',
              }}
              onClick={handleLogin}
            >
              Sign In
            </button>

            <button
              className="btn w-100 fw-semibold border-2"
              style={{
                color: '#FF5E8A',
                borderColor: '#FF5E8A',
                borderRadius: '8px',
              }}
              onClick={() => alert('Alternate sign in method')}
            >
              Sign in (Alternate)
            </button>
          </div>

          {/* LINKS */}
          <div className="text-center mt-4">
            <p className="text-secondary mb-2">
              Belum punya akun?{' '}
              <span
                onClick={() => router.push('/register/role')}
                className="fw-bold text-decoration-underline"
                style={{ color: '#FF5E8A', cursor: 'pointer' }}
              >
                Daftar
              </span>
            </p>
            <p>
              <span
                onClick={() => router.push('/forgot-password')}
                className="fw-bold text-decoration-underline"
                style={{ color: '#FF5E8A', cursor: 'pointer' }}
              >
                Lupa Password?
              </span>
            </p>
          </div>

          <p className="text-center text-muted mt-5 small">
            © 2025 RoxyDental • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
