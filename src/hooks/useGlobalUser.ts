import { useUserStore } from '@/stores/userStore';

// Hook personalizado que provee la interfaz del store de usuario
export const useGlobalUser = () => {
  const store = useUserStore();

  // Zustand con persist ya maneja la inicialización automáticamente
  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    error: store.error,
    setUser: store.setUser,
    updateUser: store.updateUser,
    clearUser: store.clearUser,
    setLoading: store.setLoading,
    setError: store.setError,
    refreshUserData: store.refreshUserData,
  };
};

// Hook más específico para componentes que solo necesitan leer el estado
export const useUserState = () => {
  const { user, isLoading, isAuthenticated, error } = useUserStore();
  return { user, isLoading, isAuthenticated, error };
};

// Hook para componentes que solo necesitan las acciones
export const useUserActions = () => {
  const { setUser, updateUser, clearUser, setLoading, setError, refreshUserData } = useUserStore();
  return { setUser, updateUser, clearUser, setLoading, setError, refreshUserData };
};
