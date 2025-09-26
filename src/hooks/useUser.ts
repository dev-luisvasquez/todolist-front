import { useState, useEffect } from 'react';
import { getUsers } from '@/api/generated/users/users';
import AuthStorage from '@/utils/auth';
import { useUserStore } from '@/stores/userStore';

import { UserResponseDto, UpdateUserDto, UserInfoDto } from '@/api/generated';

// Crear instancia de las funciones de users
const usersAPI = getUsers();

// Hook para obtener el usuario del localStorage de manera reactiva
export const useLocalStorageUser = () => {
  const [user, setUser] = useState<UserInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener el usuario del localStorage
  const getUserFromStorage = () => {
    try {
      const storedUser = AuthStorage.getUser();
      setUser(storedUser);
    } catch (error) {
      console.error('Error al obtener usuario del localStorage:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar el usuario en el localStorage
  const updateUserInStorage = (newUser: UserResponseDto) => {
    try {
      // Solo actualizar el estado local, no localStorage
      // El localStorage debe ser manejado solo por Zustand store
      setUser(newUser);
    } catch (error) {
      console.error('Error al actualizar usuario en localStorage:', error);
    }
  };

  // Función para eliminar el usuario del localStorage
  const removeUserFromStorage = () => {
    try {
      AuthStorage.clear();
      setUser(null);
    } catch (error) {
      console.error('Error al eliminar usuario del localStorage:', error);
    }
  };

  // Efecto para cargar el usuario inicial
  useEffect(() => {
    getUserFromStorage();
  }, []);

  // Efecto para escuchar cambios en el localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        getUserFromStorage();
      }
    };

    // Agregar listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup del listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    isLoading,
    updateUser: updateUserInStorage,
    removeUser: removeUserFromStorage,
    refreshUser: getUserFromStorage,
    isAuthenticated: !!user,
  };
};

// Hook para obtener información del usuario actual (ahora usando Zustand store)
export const useUser = () => {
  const [user, setUserState] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user: storeUser, refreshUserData, setUser, updateUser: updateUserStore } = useUserStore();

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Asegurar que el store tenga el usuario (por si aún no se hidrata)
      if (!storeUser) {
        refreshUserData();
      }

      const currentUserId = storeUser?.id;
      if (!currentUserId) {
        throw new Error('Usuario no encontrado en el store');
      }

      const response = await usersAPI.usersControllerGetUserById(currentUserId);
      setUserState(response);

      // sincronizar store (si cambió algo como avatar o birthday)
      if (!storeUser || storeUser.avatar !== response.avatar || (storeUser as any).birthday !== (response as any).birthday || storeUser.name !== response.name || storeUser.last_name !== response.last_name || storeUser.email !== response.email) {
        // usar setUser para reemplazo completo seguro
        setUser(response as UserResponseDto);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar información del usuario';
      setError(errorMessage);
      console.error('Error fetching user info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeUser?.id]);

  return {
    data: user,
    isLoading,
    error,
    refetch: getUserInfo,
  };
};

// Hook para obtener todos los usuarios (admin)
export const useAllUsers = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await usersAPI.usersControllerGetAllUsers();
      setUsers(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return {
    data: users,
    isLoading,
    error,
    refetch: getAllUsers,
  };
};

// Hook para actualizar un usuario
export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser: updateUserStore } = useUserStore();

  const updateUser = async (userData: UpdateUserDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const birthdayFormatted = userData.birthday ? new Date(userData.birthday).toISOString() : undefined;
      const response = await usersAPI.usersControllerUpdateUserById({ ...userData, birthday: birthdayFormatted });

      // actualizar store con la respuesta (mantener avatar/birthday)
      updateUserStore(response as Partial<UserResponseDto>);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando usuario';
      setError(errorMessage);
      console.error('Error actualizando usuario:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: updateUser,
    isLoading,
    error,
  };
};

// Hook para eliminar un usuario
export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await usersAPI.usersControllerDeleteUserById(id);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error eliminando usuario';
      setError(errorMessage);
      console.error('Error eliminando usuario:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: deleteUser,
    isLoading,
    error,
  };
};

// Hook para obtener usuario por ID específico
export const useUserById = (userId: string) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserById = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!userId) {
        throw new Error('ID de usuario requerido');
      }
      const response = await usersAPI.usersControllerGetUserById(userId);
      setUser(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuario';
      setError(errorMessage);
      console.error('Error fetching user by id:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserById();
    }
  }, [userId]);

  return {
    data: user,
    isLoading,
    error,
    refetch: getUserById,
  };
};
