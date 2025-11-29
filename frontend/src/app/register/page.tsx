'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';

export default function RegisterPerawatPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  const slides = ["/images/logo1.jpg", "/images/logo2.jpg", "/images/logo3.jpg"];

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

    if (valid) setShowSuccess(true);
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    router.push('/login'); 
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      
      {/* LEFT SLIDES */}
      <div className="hidden md:flex flex-[1.2] relative">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {slides.map((slide, index) => (
            <Image
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              fill
              className={`absolute top-0 left-0 object-cover transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              priority
            />
          ))}
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col items-center overflow-y-auto flex-1 bg-white p-10 md:p-16">
        <div className="w-full max-w-md">

          {/* BACK BUTTON */}
          <div
            className="flex items-center mb-4 cursor-pointer text-pink-500 font-medium gap-2"
            onClick={() => router.push('/login')}
          >
            <FaArrowLeft />
            <span>Kembali</span>
          </div>

          {/* TITLE */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Daftar Akun Perawat</h2>
            <p className="text-gray-500 font-semibold">Isi data di bawah untuk membuat akun baru</p>
          </div>

          <div className="space-y-4">

            {/* NAMA */}
            <div>
              <label className="block text-sm font-semibold mb-1">Nama Lengkap</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-300"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* USERNAME */}
            <div>
              <label className="block text-sm font-semibold mb-1">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-300"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-300"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* NOMOR REGISTRASI */}
            <div>
              <label className="block text-sm font-semibold mb-1">No. Registrasi</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-300"
                placeholder="Masukkan nomor registrasi perawat"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
              {errors.registrationNumber && <p className="text-xs text-red-500 mt-1">{errors.registrationNumber}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-300"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* KONFIRMASI PASSWORD */}
            <div>
              <label className="block text-sm font-semibold mb-1">Konfirmasi Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-300"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* BUTTON SUBMIT */}
            <button
              className="w-full py-2 font-bold text-white rounded-md bg-gradient-to-r from-pink-400 to-pink-500 hover:shadow-lg transition-all mt-2"
              onClick={handleRegister}
            >
              Daftar Sekarang
            </button>
          </div>

          <p className="text-center text-gray-500 mt-4 text-sm">
            Sudah punya akun?{' '}
            <span
              onClick={() => router.push('/login')}
              className="font-bold text-pink-500 underline cursor-pointer"
            >
              Login di sini
            </span>
          </p>

          <p className="text-center text-gray-400 mt-8 text-xs">
            © 2025 RoxyDental • All rights reserved
          </p>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-[90%] animate-fadeIn text-center">
            <h5 className="font-bold text-gray-900 mb-3">Berhasil!</h5>
            <p className="text-gray-600 mb-4">Akun perawat {name} berhasil dibuat.</p>
            <button
              className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-pink-400 to-pink-500"
              onClick={closeSuccessModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(-20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        *:focus { outline: none !important; box-shadow: none !important; }
      `}</style>
    </div>
  );
}
