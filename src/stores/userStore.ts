import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserResponseDto } from '@/api/generated';
import AuthStorage from '@/utils/auth';

interface UserState {
  user: UserResponseDto | null; // Solo información no sensible del usuario
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: UserResponseDto) => void;
  updateUser: (userData: Partial<UserResponseDto>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
refreshUserData: () => void;
}

// IMPORTANTE: Este store está configurado para NO almacenar información sensible como contraseñas
// Solo se persisten campos seguros del usuario a través del partialize

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false, // Cambiar a false porque Zustand persist maneja la carga automáticamente
      isAuthenticated: false,
      error: null,

      setUser: (user: UserResponseDto) => {
        // Filtrar campos sensibles antes de guardar
        const safeUser: UserResponseDto = {
          id: user.id,
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          avatar: user.avatar,
          // incluir birthday si existe
          ...(user as any).birthday !== undefined && { birthday: (user as any).birthday }
        } as UserResponseDto;
        set({
          user: safeUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      },

      refreshUserData: () => {
        const storedUser = AuthStorage.getUser();
        if (storedUser) {
          set({ user: storedUser, isAuthenticated: true });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateUser: (userData: Partial<UserResponseDto>) => {
        const currentUser = get().user;
        if (currentUser) {
          // Crear objeto seguro sin campos sensibles
          const safeUserData: Partial<UserResponseDto> = {
            ...(userData.id && { id: userData.id }),
            ...(userData.name && { name: userData.name }),
            ...(userData.last_name && { last_name: userData.last_name }),
            ...(userData.email && { email: userData.email }),
            // permitir actualizar avatar si viene incluso string vacio (para borrarlo) -> usar hasOwnProperty
            ...(Object.prototype.hasOwnProperty.call(userData, 'avatar') && { avatar: userData.avatar }),
            // birthday opcional
            ...(Object.prototype.hasOwnProperty.call(userData, 'birthday') && { birthday: (userData as any).birthday })
          } as Partial<UserResponseDto>;
          
          const updatedUser = { ...currentUser, ...safeUserData } as UserResponseDto;
          
          set({
            user: updatedUser,
            isAuthenticated: true,
            error: null
          });
        }
      },

      clearUser: () => {
        AuthStorage.clear();
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'user-storage', // Nombre único para el storage
      storage: createJSONStorage(() => localStorage), // Sincronizar con localStorage
      // Whitelist de campos que se pueden persistir (excluye información sensible)
      partialize: (state) => ({
        user: state.user ? {
          id: state.user.id,
          name: state.user.name,
          last_name: state.user.last_name,
          email: state.user.email,
          avatar: state.user.avatar,
          ...(state.user as any).birthday !== undefined && { birthday: (state.user as any).birthday }
        } : null,
        isAuthenticated: state.isAuthenticated,
        // Deliberadamente NO persistimos isLoading ni error
      }),
      // Migrar datos existentes para remover campos sensibles
      migrate: (persistedState: any, version: number) => {
        if (persistedState.user && typeof persistedState.user === 'object') {
          const { password, ...safeUserData } = persistedState.user;
          return {
            ...persistedState,
            user: safeUserData
          };
        }
        return persistedState;
      },
      version: 1, // Incrementar si necesitas más migraciones en el futuro
    }
  )
);
