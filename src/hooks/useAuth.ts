import { useMutation } from '@tanstack/react-query';
import { 
  authControllerSignIn, 
  authControllerSignUp,
  getAuthControllerSignInMutationOptions,
  getAuthControllerSignUpMutationOptions 
} from '@/api/generated/auth/auth';
import type { 
  AuthDto, 
  CreateUserDto, 
  LoginResponseDto 
} from '@/api/generated/models';

// Hook para el login
export const useLogin = () => {
  return useMutation({
    ...getAuthControllerSignInMutationOptions(),
    onSuccess: (data: LoginResponseDto) => {
      // Guardar el token y la información del usuario
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Error en login:', error);
    },
  });
};

// Hook para el registro
export const useSignUp = () => {
  return useMutation({
    ...getAuthControllerSignUpMutationOptions(),
    onSuccess: (data: LoginResponseDto) => {
      // Guardar el token y la información del usuario
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    onError: (error) => {
      console.error('Error en registro:', error);
    },
  });
};

// Hook para logout
export const useLogout = () => {
  return () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/auth/signin';
  };
};
