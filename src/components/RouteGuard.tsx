'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserState } from '@/hooks/useGlobalUser';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading } = useUserState();

  const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/send-email-recover', '/auth/reset-password'];
  const isPublicRoute = publicRoutes.includes(pathname);




  useEffect(() => {
    if (isLoading) return;

    if (isPublicRoute) {
      if (isAuthenticated) {
        router.replace('/home');
      }
    } else {
      if (!isAuthenticated) {
        router.replace('/auth/signin');
      }







    }
  }, [isAuthenticated, isLoading, pathname, router, isPublicRoute]);

  // Loading global
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // No renderizar vistas privadas sin sesión (evita disparar efectos)
  if (!isPublicRoute && !isAuthenticated) {
    return null;
  }

  // Evitar parpadeo en rutas públicas si ya hay sesión
  if (isPublicRoute && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;