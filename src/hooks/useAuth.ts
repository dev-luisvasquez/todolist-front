import { useState, useEffect } from 'react';
import { getAuth } from '@/api/generated/auth/auth';
import { AuthDto, CreateUserDto } from '@/api/generated';
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);
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

// Hook para enviar email de recuperación de contraseña
export const useSendRecoverEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendRecoverEmail = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await authAPI.authControllerRequestPasswordRecovery({ email });
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar email de recuperación';
      setError(errorMessage);
      console.error('Error sending recovery email:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    mutate: sendRecoverEmail,
    isLoading,
    error,
    success,
  };
};

// Hook para recuperar contraseña
export const useRecoverPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const recoverPassword = async (newPassword: string, token: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await authAPI.authControllerRecoverPassword({ newPassword }, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al recuperar contraseña';
      setError(errorMessage);
      console.error('Error recovering password:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: recoverPassword,
    isLoading,
    error,
    success,
  };
};