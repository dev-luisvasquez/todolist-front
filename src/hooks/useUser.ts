import { useState, useEffect } from 'react';
import { getUsers } from '@/api/generated/users/users';
import getUser from '@/utils/auth';
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
      const storedUser = getUser.getUser();
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
      getUser.setUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Error al actualizar usuario en localStorage:', error);
    }
  };

  // Función para eliminar el usuario del localStorage
  const removeUserFromStorage = () => {
    try {
      getUser.clear();
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

// Hook para obtener información del usuario actual
export const useUser = () => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const currentUser = getUser.getUser();
      
      if (!currentUser?.id) {
        throw new Error('Usuario no encontrado');
      }

      const response = await usersAPI.usersControllerGetUserById(currentUser.id);
      setUser(response);
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
  }, []);

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

  const updateUser = async ({ id, ...userData }: UpdateUserDto & { id: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await usersAPI.usersControllerUpdateUserById(id, userData);
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
