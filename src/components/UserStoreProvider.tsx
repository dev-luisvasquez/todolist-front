'use client';

interface UserStoreProviderProps {
  children: React.ReactNode;
}

export const UserStoreProvider: React.FC<UserStoreProviderProps> = ({ children }) => {
  // Ya no necesitamos inicializar manualmente porque Zustand persist lo hace automáticamente
  return <>{children}</>;
};
