'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import SettingSidebar from '@/app/components/SettingsSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

export default function InfoPage() {
  const [name, setName] = useState('drg. Kartika Yusriya Dinanti');
  const [email, setEmail] = useState('kartika.yusriya@roxydental.com');
  const [phone, setPhone] = useState('+62 812-3456-7890');
  const [specialist, setSpecialist] = useState('Dokter Gigi');
  const [str, setStr] = useState('STR-12345678');

  return (
    <div className="info-page">
      {/* Navbar */}
      <Navbar />

      {/* Layout Container */}
      <div className="container-fluid px-4 py-4">
        <div className="row g-4">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <SettingSidebar />
          </div>

          {/* MAIN CONTENT */}
          <div className="col-md-9">

            {/* HEADER */}
            <div className="header-section mb-4">
              <h1 className="hello-title">Halo, {name.split(' ')[0]}</h1>
              <p className="hello-subtitle">Platform Kesehatan RoxyDental</p>
            </div>

            {/* SETTINGS CARD */}
            <div className="settings-wrapper">
              <div className="top-tab">Informasi Profil</div>

              <div className="settings-card p-4 shadow-sm rounded-3">
                <div className="row align-items-start">

                  {/* FOTO PROFIL */}
                  <div className="col-md-4 text-center border-end pe-4 mb-4">
                    <div className="photo-wrapper mx-auto mb-3">
                      <img
                        src="/avatar-placeholder.png"
                        className="photo-img"
                        alt="profile"
                      />
                    </div>

                    <p className="format-text">Format: JPG, PNG. Maksimal 2MB</p>

                    <div className="d-flex justify-content-center mt-3">
                      <button className="btn btn-outline-secondary btn-sm me-2">
                        Ubah Foto
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        Hapus Foto
                      </button>
                    </div>
                  </div>

                  {/* FORM */}
                  <div className="col-md-8 ps-4">
                    <div className="row g-3">

                      <div className="col-md-6">
                        <label className="form-label">Nama Lengkap</label>
                        <input
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Nomor Telepon</label>
                        <input
                          className="form-control"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Jenis Akun</label>
                        <input className="form-control" value="Dokter" disabled />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Spesialisasi</label>
                        <input
                          className="form-control"
                          value={specialist}
                          onChange={(e) => setSpecialist(e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Nomor STR</label>
                        <input
                          className="form-control"
                          value={str}
                          onChange={(e) => setStr(e.target.value)}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Status Akun</label>
                        <input className="form-control" value="Aktif" disabled />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button className="btn btn-primary-custom">Simpan Perubahan</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          

          </div>
        </div>
      </div>
    </div>
  );
}
