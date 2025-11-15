'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'sent'>('input');
  const [loading, setLoading] = useState(false);
  const [showResent, setShowResent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert('Masukkan email yang valid!');
      return;
    }
    setStep('sent');
  };

  const handleResend = () => {
    setLoading(true);
    setShowResent(false);
    setTimeout(() => {
      setLoading(false);
      setShowResent(true);
    }, 1500);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100 text-center position-relative"
      style={{
        background:
          'linear-gradient(135deg, #FFDDE6 0%, #FFCAD4 50%, #FFB4C8 100%)',
        fontFamily: 'Poppins, sans-serif',
        overflow: 'hidden',
        color: '#333',
      }}
    >
      {/* Ornamen background lembut */}
      <div
        className="position-absolute rounded-circle"
        style={{
          top: '-80px',
          left: '-100px',
          width: '260px',
          height: '260px',
          background: 'rgba(255, 255, 255, 0.35)',
          filter: 'blur(60px)',
        }}
      ></div>
      <div
        className="position-absolute rounded-circle"
        style={{
          bottom: '-120px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.25)',
          filter: 'blur(60px)',
        }}
      ></div>

      {/* Step 1: Input Email */}
      {step === 'input' && (
        <div
          className="text-center animate__animated animate__fadeIn"
          style={{ maxWidth: '400px', width: '100%' }}
        >
          {/* Logo */}
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle mb-4 shadow-lg"
            style={{
              width: '90px',
              height: '90px',
              background: 'linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 700,
            }}
          >
            R
          </div>

          <h2 className="fw-bold mb-2" style={{ color: '#111' }}>
            Lupa Password?
          </h2>
          <p className="text-dark opacity-75 small mb-5">
            Masukkan email kamu untuk menerima tautan reset password
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="text-start">
            <label className="form-label fw-semibold small text-secondary">
              Email
            </label>
            <div className="input-group shadow-sm mb-4">
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-envelope-fill text-muted"></i>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control border-0 py-3"
                placeholder="Masukkan email kamu"
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold text-white py-3"
              style={{
                background:
                  'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(255, 94, 138, 0.3)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
            >
              Kirim Email
            </button>
          </form>

          <button
            className="btn btn-link fw-semibold text-decoration-none mt-4"
            style={{ color: '#FF5E8A', fontSize: '0.9rem' }}
            onClick={() => router.push('/login')}
          >
            <i className="bi bi-arrow-left me-1"></i> Kembali ke Login
          </button>
        </div>
      )}

      {/* Step 2: Email Sent */}
      {step === 'sent' && (
        <div
          className="text-center animate__animated animate__fadeIn"
          style={{ maxWidth: '440px', width: '100%' }}
        >
          <div
            className="d-flex align-items-center justify-content-center mx-auto rounded-circle mb-4"
            style={{
              width: '110px',
              height: '110px',
              background:
                'linear-gradient(135deg, #FF7AA2 0%, #FF5E8A 100%)',
              color: 'white',
              fontSize: '2.5rem',
              boxShadow: '0 4px 16px rgba(255, 94, 138, 0.35)',
            }}
          >
            <i className="bi bi-envelope-check-fill"></i>
          </div>

          <h2 className="fw-bold mb-2" style={{ color: '#111' }}>
            Email Terkirim!
          </h2>
          <p
            className="text-dark opacity-75 mb-4"
            style={{ fontSize: '0.95rem' }}
          >
            Kami telah mengirimkan tautan reset password ke{" "}
            <strong>{email}</strong>.  
            Silakan cek inbox atau folder spam kamu.
          </p>

          {/* Notifikasi resend */}
          {showResent && (
            <div
              className="mx-auto mb-3"
              style={{
                background: '#ffe6ef',
                color: '#b82e5a',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 500,
                display: 'inline-block',
                transition: 'opacity 0.3s ease',
              }}
            >
              ✨ Email verifikasi telah dikirim ulang!
            </div>
          )}

          {/* Tombol */}
          <div className="d-flex flex-column gap-3 mt-4 w-100 mx-auto" style={{ maxWidth: '300px' }}>
            <button
              onClick={() => router.push('/login')}
              className="btn fw-bold text-white py-3"
              style={{
                background:
                  'linear-gradient(90deg, #FF7AA2 0%, #FF5E8A 100%)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 6px 14px rgba(255, 94, 138, 0.3)',
              }}
            >
              Kembali ke Login
            </button>

            <button
              className="btn btn-link fw-semibold text-decoration-none"
              style={{
                color: loading ? '#aaa' : '#FF5E8A',
                fontSize: '0.9rem',
                pointerEvents: loading ? 'none' : 'auto',
              }}
              onClick={handleResend}
            >
              {loading ? (
                <span>
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    style={{ color: '#FF5E8A' }}
                  ></div>
                  Mengirim ulang...
                </span>
              ) : (
                'Kirim Ulang Email'
              )}
            </button>
          </div>

          <p className="mt-5 text-dark opacity-50 small">
            © 2025 RoxyDental • All rights reserved
          </p>
        </div>
      )}
    </div>
  );
}
