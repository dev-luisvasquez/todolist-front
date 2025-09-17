'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/auth/signin', '/auth/signup'];
  
  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // No hacer nada si aún está cargando
    if (isLoading) return;

    if (isPublicRoute) {
      // Si el usuario está autenticado y trata de acceder a signin/signup, redirigir a home
      if (isAuthenticated) {
        router.push('/home');
      }
    } else {
      // Si es una ruta protegida y el usuario no está autenticado, redirigir a signin
      if (!isAuthenticated) {
        router.push('/auth/signin');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isPublicRoute]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
