import { useState, useEffect } from 'react';
import { getAuth } from '@/api/generated/auth/auth';
import { AuthDto, CreateUserDto, LoginResponseDto } from '@/api/generated';
import AuthStorage from '@/utils/auth';

// Crear instancia de las funciones de auth
const authAPI = getAuth();

// Hook para login
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: AuthDto) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.authControllerSignIn(credentials);
      
      // Guardar tokens y usuario
      if (response.access_Token) {
        AuthStorage.setAccessToken(response.access_Token);
      }
      if (response.refresh_Token) {
        AuthStorage.setRefreshToken(response.refresh_Token);
      }
      if (response.user) {
        AuthStorage.setUser(response.user);
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      console.error('Error logging in:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: login,
    isLoading,
    error,
  };
};

// Hook para registro
export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.authControllerSignUp(userData);
      
      // Guardar tokens y usuario después del registro
      if (response.access_Token) {
        AuthStorage.setAccessToken(response.access_Token);
      }
      if (response.refresh_Token) {
        AuthStorage.setRefreshToken(response.refresh_Token);
      }
      if (response.user) {
        AuthStorage.setUser(response.user);
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
      console.error('Error registering:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: register,
    isLoading,
    error,
  };
};

// Hook para logout
export const useLogout = () => {
  return () => {
    AuthStorage.clear();
    window.location.href = '/auth/signin';
  };
};

// Hook para verificar si el usuario está autenticado
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = AuthStorage.isAuthenticated();
      const userData = AuthStorage.getUser();
      
      setIsAuthenticated(authStatus);
      setUser(userData);
      setIsLoading(false);
    };

    checkAuth();
  }, []);
  
  return {
    isAuthenticated,
    isLoading,
    user,
  };
};
