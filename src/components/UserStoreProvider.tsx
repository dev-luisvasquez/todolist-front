'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

interface UserStoreProviderProps {
  children: React.ReactNode;
}

export const UserStoreProvider: React.FC<UserStoreProviderProps> = ({ children }) => {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const logoutHandler = () => {
      // Limpiar estado y storage
      clearUser();

      // Redirigir al login (evitar recargas infinitas comprobando la ruta actual)
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
        router.replace('/auth');
      }
    };

    window.addEventListener('app:logout', logoutHandler);
    return () => window.removeEventListener('app:logout', logoutHandler);
  }, [clearUser, router]);

  // Ya no necesitamos inicializar manualmente porque Zustand persist lo hace automáticamente
  return <>{children}</>;
};
