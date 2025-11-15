'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;
    if (showToast) {
      timeoutId = window.setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [showToast, router]);

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg('Password dan konfirmasi tidak cocok!');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    setShowToast(true);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: 'linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 50%, #FFB4C8 100%)',
        fontFamily: 'Poppins, sans-serif',
        color: '#333',
      }}
    >
      <div style={{ maxWidth: '420px', width: '100%' }} className="px-3">
        {/* Logo */}
        <div className="text-center mb-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
            style={{
              width: '85px',
              height: '85px',
              background: 'linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(255, 94, 138, 0.3)',
            }}
          >
            R
          </div>
          <h2 className="fw-bold mb-1 text-dark">Reset Password</h2>
          <p className="text-dark opacity-75 small mb-4">Silakan buat kata sandi baru untuk akun kamu</p>
        </div>

        {/* Form Reset */}
        <form onSubmit={handleReset} className="text-start">
          {/* Password Baru */}
          <label htmlFor="newPassword" className="form-label fw-semibold small text-secondary">
            Masukkan Password Baru
          </label>
          <div className="input-group shadow-sm mb-3 rounded" style={{ height: '45px' }}>
            <span className="input-group-text bg-white border-0">
              <i className="bi bi-lock-fill text-muted"></i>
            </span>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control border-0 bg-white"
              placeholder="Ketik password baru"
              required
              minLength={6}
              style={{ height: '45px', padding: '0 12px' }}
            />
            <button
              type="button"
              className="btn btn-light border-0"
              onClick={() => setShowNewPassword((s) => !s)}
            >
              <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
            </button>
          </div>

          {/* Konfirmasi Password */}
          <label htmlFor="confirmPassword" className="form-label fw-semibold small text-secondary">
            Konfirmasi Password Baru
          </label>
          <div className="input-group shadow-sm mb-3 rounded" style={{ height: '45px' }}>
            <span className="input-group-text bg-white border-0">
              <i className="bi bi-shield-lock-fill text-muted"></i>
            </span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control border-0 bg-white"
              placeholder="Ketik ulang password baru"
              required
              minLength={6}
              style={{ height: '45px', padding: '0 12px' }}
            />
            <button
              type="button"
              className="btn btn-light border-0"
              onClick={() => setShowConfirmPassword((s) => !s)}
            >
              <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
            </button>
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 small" role="alert">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 mb-3"
            style={{
              background: 'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(255, 94, 138, 0.3)',
            }}
          >
            Reset Password
          </button>
        </form>

        {/* Kembali ke Login */}
        <div className="text-center">
          <button className="btn btn-link text-danger small" onClick={() => router.push('/login')}>
            <i className="bi bi-arrow-left me-1"></i> Kembali ke Login
          </button>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="toast show position-fixed bottom-0 end-0 m-3 text-white" style={{ background: '#FF5E8A' }}>
            <div className="toast-body">
              ✅ Password berhasil di-reset — Mengalihkan ke login...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
