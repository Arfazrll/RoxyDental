'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import SettingSidebar from '@/app/components/SettingsSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function PasswordPage() {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleChangePassword = () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      showToastMessage('Isi semua field!');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToastMessage('Password tidak cocok!');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmChangePassword = () => {
    // TODO: API update password
    setShowConfirmModal(false);
    showToastMessage('Password berhasil diubah!');
    setShowSuccessModal(true);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="password-page">
      <Navbar />
      <div className="container-fluid px-4 py-4">
        <div className="row g-4">
          <div className="col-md-3">
            <SettingSidebar />
          </div>

          <div className="col-md-9">
            <div className="mb-4">
              <h1 className="mb-1" style={{ color: '#d63384' }}>Ganti Password</h1>
              <p className="text-muted">Perbarui password untuk keamanan akun Anda</p>
            </div>

            <div className="card p-5 shadow-sm rounded-4">
              <div className="row g-4">
                {/* Input Password */}
                <div className="col-md-12 position-relative">
                  <label className="form-label">Password Saat Ini</label>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    className="form-control py-2 px-3"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Masukkan password saat ini"
                  />
                  <i
                    className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
                    style={{ top: '38px', right: '16px', cursor: 'pointer', fontSize: '1.2rem' }}
                    onClick={() => setShowCurrent(!showCurrent)}
                  />
                </div>

                <div className="col-md-6 position-relative">
                  <label className="form-label">Password Baru</label>
                  <input
                    type={showNew ? 'text' : 'password'}
                    className="form-control py-2 px-3"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Masukkan password baru"
                  />
                  <i
                    className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
                    style={{ top: '38px', right: '16px', cursor: 'pointer', fontSize: '1.2rem' }}
                    onClick={() => setShowNew(!showNew)}
                  />
                </div>

                <div className="col-md-6 position-relative">
                  <label className="form-label">Konfirmasi Password Baru</label>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="form-control py-2 px-3"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Konfirmasi password baru"
                  />
                  <i
                    className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
                    style={{ top: '38px', right: '16px', cursor: 'pointer', fontSize: '1.2rem' }}
                    onClick={() => setShowConfirm(!showConfirm)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#d63384',
                    color: 'white',
                    fontWeight: 500,
                    padding: '10px 28px',
                    borderRadius: '8px',
                  }}
                  onClick={handleChangePassword}
                >
                  Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifikasi Pink */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4"></path>
              <circle cx="12" cy="16" r="1"></circle>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          </div>
          <div className="toast-text">{toastMessage}</div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h5>Konfirmasi</h5>
            <p>Yakin ingin mengubah password?</p>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-secondary me-2" onClick={() => setShowConfirmModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={confirmChangePassword}>Ya</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sukses */}
      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h5>Sukses!</h5>
            <p>Password berhasil diubah.</p>
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-primary" onClick={() => setShowSuccessModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff7eb9;
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          animation: slideIn 0.4s ease forwards, fadeOut 0.4s 2.6s ease forwards;
          z-index: 10000;
          font-weight: 500;
        }
        .toast-icon svg {
          display: block;
        }
        .toast-text {
          min-width: 80px;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .modal-backdrop {
          position: fixed;
          top:0; left:0;
          width:100%; height:100%;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
