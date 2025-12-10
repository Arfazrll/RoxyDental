'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'DOKTER' | 'PERAWAT';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        router.replace('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);

        if (requiredRole && user.role !== requiredRole) {
          const redirectPath = user.role === 'DOKTER' 
            ? '/dashboard/dokter' 
            : '/dashboard/perawat/mainpr';
          router.replace(redirectPath);
          return;
        }

        setIsChecking(false);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7]">
        <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return <>{children}</>;
}