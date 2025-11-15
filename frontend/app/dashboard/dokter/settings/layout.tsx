'use client';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.css';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>
        <div className="settings-container">
          <div className="settings-main">
            {children}
          </div>
        </div>
      </main>
      <footer style={{ textAlign: 'center', padding: 12, color: '#aaa' }}>
        © 2025 RoxyDental. Platform untuk .....
      </footer>
    </>
  );
}
