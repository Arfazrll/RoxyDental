'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RoleSelectionPage() {
  const router = useRouter();

  const roles = [
    {
      name: 'Dokter',
      image: '/dokter-icon.png', // ganti dengan ikon/gambar dokter
      bg: '#ffffff',
      route: '/register/dokter'
    },
    {
      name: 'Perawat',
      image: '/perawat-icon.png', // ganti dengan ikon/gambar perawat
      bg: '#ffffff',
      route: '/register/perawat'
    }
  ];

  const handleCardClick = (route) => {
    // animasi klik sudah ditangani via CSS :active
    router.push(route);
  };

  return (
    <div
      className="d-flex vh-100 vw-100 justify-content-center align-items-center px-3"
      style={{ background: '#ffffff', overflow: 'hidden' }}
    >
      <div className="text-center position-relative z-10" style={{ maxWidth: '900px', width: '100%' }}>
        <h1 className="fw-bold mb-2 text-dark" style={{ fontSize: '2.5rem' }}>Pilih Role Anda</h1>
        <p className="text-dark-50 mb-5" style={{ fontSize: '1.1rem' }}>Silahkan pilih role untuk melanjutkan pendaftaran</p>

        <div className="d-flex flex-column flex-md-row gap-4 justify-content-center mb-4">
          {roles.map((role, index) => (
            <div
              key={index}
              className="role-card rounded-4 shadow d-flex flex-column align-items-center justify-content-center cursor-pointer"
              style={{
                background: role.bg,
                width: '220px',
                height: '240px',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none'
              }}
              onClick={() => handleCardClick(role.route)}
            >
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: '#FFEFF1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Image src={role.image} alt={role.name} width={60} height={60} />
              </div>
              <h4 className="fw-bold mb-0" style={{ color: '#333', fontSize: '1.25rem' }}>{role.name}</h4>
            </div>
          ))}
        </div>

        {/* Tombol kembali ke login dengan panah */}
        <div
          className="d-flex align-items-center justify-content-center mt-3 cursor-pointer"
          onClick={() => router.push('/login')}
          style={{ color: '#FF5E8A', fontWeight: 500, gap: '0.5rem' }}
        >
          <FaArrowLeft />
          <span>Kembali ke Login</span>
        </div>
      </div>

      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
        }

        .cursor-pointer { cursor: pointer; }

        .role-card h4 { text-shadow: 0 1px 4px rgba(0,0,0,0.05); }

        /* Hover & click animation */
        .role-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 18px 36px rgba(0,0,0,0.25);
        }
        .role-card:active {
          transform: scale(0.97);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .d-flex.flex-md-row {
            flex-direction: column !important;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
