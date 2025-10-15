'use client';

import { usePathname } from 'next/navigation';
import  Header from '@/components/layouts/HeaderLayout';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Rutas donde no queremos mostrar el header
  const authRoutes = ['/auth', ];
  
  // No mostrar header en rutas de autenticación
  if (authRoutes.includes(pathname)) {
    return null;
  }
  
  return <Header />;
}
