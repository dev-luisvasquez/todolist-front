'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useUserState } from '@/hooks/useGlobalUser';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useUserState();

  // Rutas de autenticación (públicas)
  const isAuthRoute = pathname.startsWith('/auth');
  // Permitir estas rutas de /auth incluso si hay sesión (para cerrar sesión, por ejemplo)
  const allowWhileAuthenticated =
    pathname === '/auth/signout' || pathname === '/auth/logout';

  useEffect(() => {
    if (isLoading) return;
    // Si hay sesión, no permitir ir a /auth/* (excepto logout/signout)
    if (isAuthenticated) {
      if (isAuthRoute && !allowWhileAuthenticated) {
        const requestedNext = searchParams.get('next') || '/';
        // Evita bucles redirigiendo a home si el next apunta a /auth/*
        const safeNext = requestedNext.startsWith('/auth') ? '/' : requestedNext;
        router.replace(safeNext);
      }
      return;
    }

    // Si no hay sesión, no permitir rutas privadas
    if (!isAuthRoute) {
      const next = encodeURIComponent(pathname);
      router.replace(`/auth/signin?next=${next}`);
    }
  }, [isAuthenticated, isLoading, isAuthRoute, allowWhileAuthenticated, pathname, router, searchParams]);

  // Loading global
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Bloquear render en rutas de auth cuando hay sesión (para evitar parpadeo)
  if (isAuthenticated && isAuthRoute && !allowWhileAuthenticated) {
    return null;
  }

  // Bloquear render en rutas privadas cuando no hay sesión
  if (!isAuthenticated && !isAuthRoute) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
