import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import { getAuth } from '@/api/generated/auth/auth';
import { AuthDto, CreateUserDto,UserResponseDto, LoginResponseDto } from '@/api/generated';
import AuthStorage from '@/utils/auth';
import { useUserActions } from '@/hooks/useGlobalUser';
import { useRouter } from 'next/navigation'


// Toast
import { showToast } from '@/utils/Alerts/toastAlerts';

// Crear instancia de las funciones de auth
const authAPI = getAuth();

// Hook para login
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserActions();

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
        // Usar directamente los datos que vienen del backend sin forzar avatar vacío
        const userForStorage = {
          ...response.user,
          created_at: (response as unknown as UserResponseDto).created_at,
          updated_at: (response as unknown as UserResponseDto).updated_at
        } as UserResponseDto;
        setUser(userForStorage);
      }
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      showToast('Error al iniciar sesión. Verifica tus credenciales.', { type: "error" });
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
  const { setUser } = useUserActions();

  const register = async (userData: CreateUserDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const formattedBirthday = userData.birthday ? new Date(userData.birthday).toISOString() : undefined;
      userData.birthday = formattedBirthday;

      const response = await authAPI.authControllerSignUp(userData);

      // Si el signup no devuelve tokens, intentar hacer signin automático
      let finalResponse = response as LoginResponseDto;

      if (!response.access_Token) {
        try {
          // Asegurar que email y password existan
          if (userData.email && userData.password) {
            const signInPayload: AuthDto = {
              email: userData.email,
              password: userData.password,
            } as AuthDto;

            const signInResponse = await authAPI.authControllerSignIn(signInPayload);
            // Usar la respuesta del signin si devuelve tokens/usuario
            finalResponse = signInResponse || finalResponse;
          }
        } catch (signinErr) {
          // No detener el flujo si el signin falla; dejar la respuesta del signup
          console.warn('Signin automático después del registro falló:', signinErr);
        }
      }

      // Guardar tokens y usuario (usando la respuesta final que puede venir del signup o del signin)
      if (finalResponse.access_Token) {
        AuthStorage.setAccessToken(finalResponse.access_Token);
      }
      if (finalResponse.refresh_Token) {
        AuthStorage.setRefreshToken(finalResponse.refresh_Token);
      }
      if (finalResponse.user) {
        const userForStorage = {
          ...finalResponse.user,
          created_at: (finalResponse as unknown as UserResponseDto).created_at,
          updated_at: (finalResponse as unknown as UserResponseDto).updated_at
        } as UserResponseDto;
        setUser(userForStorage);
      }

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
      setError(errorMessage);
      if((err as unknown as { status: number }).status === 409) {
        showToast('El email ya está en uso. Intenta con otro.', { type: "error" });
      }
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
  const { clearUser } = useUserActions();
  const router = useRouter();
  
  return () => {
    // Limpiar estado global y storage (desmonta vistas privadas vía RouteGuard)
    clearUser();

    // Navegar sin recargar la página
    router.replace('/auth');
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
      if(err instanceof AxiosError) {
        if(err.response?.status === 404) {
          showToast('Email no encontrado', { type: "error" });
        } else {
          showToast('Error al enviar email de recuperación', { type: "error" });
        }
      }
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

// Hook para cambiar la contraseña (usuario autenticado)
export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await authAPI.authControllerChangePassword({ oldPassword, newPassword });
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(errorMessage);
      console.error('Error changing password:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }
  return {
    mutate: changePassword,
    isLoading,
    error,
    success,
  };
}