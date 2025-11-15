import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard/dokter/utama' },
    { id: 'kalender', label: 'Kalender', icon: 'bi-calendar3', path: '/dashboard/dokter/kalender' },
    { id: 'pasien', label: 'Data Pasien', icon: 'bi-people', path: '/dashboard/dokter/pasien' },
    { id: 'analisis', label: 'Analisis', icon: 'bi-graph-up', path: '/dashboard/dokter/analisis' },
    { id: 'prediksi', label: 'Prediksi', icon: 'bi-magic', path: '/dashboard/dokter/prediksi' },
    { id: 'keuangan', label: 'Keuangan', icon: 'bi-wallet2', path: '/dashboard/dokter/keuangan' },
  ];

  const handleNavigate = (path: string) => {
  router.push(path);
  };


  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
        rel="stylesheet"
      />

      <style>{`
        .sidebar-menu {
          background: white;
          border-radius: 15px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          margin-bottom: 1.5rem;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
          text-decoration: none;
          margin-bottom: 0.5rem;
        }
        .menu-item:hover {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
          color: #be185d;
          transform: translateX(5px);
        }
        .menu-item.active {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
        }
        .menu-item i {
          font-size: 1.25rem;
          width: 24px;
          text-align: center;
        }
      `}</style>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <a
            key={item.id}
            className={`menu-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigate(item.path)}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}