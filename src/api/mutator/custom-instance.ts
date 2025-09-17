import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AuthStorage from '@/utils/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    // Manejar refresh token automáticamente si viene en los headers
    const refreshToken = response.headers['x-refresh-token'];
    if (refreshToken) {
      AuthStorage.setRefreshToken(refreshToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si el token expiró (401) y no hemos intentado hacer refresh aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshToken = AuthStorage.getRefreshToken();
        
        if (refreshToken) {
          const refreshResponse = await axiosInstance.post('/auth/refresh-token', {}, {
            headers: {
              'x-refresh-token': refreshToken,
            },
          });
          
          const { access_token, user } = refreshResponse.data;
          
          // Guardar el nuevo token usando nuestras utilidades
          AuthStorage.setAccessToken(access_token);
          AuthStorage.setUser(user);
          
          // Si viene un nuevo refresh token en los headers, guardarlo también
          const newRefreshToken = refreshResponse.headers['x-refresh-token'];
          if (newRefreshToken) {
            AuthStorage.setRefreshToken(newRefreshToken);
          }
          
          // Actualizar el header de la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          
          // Reintentar la petición original
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        // Si el refresh falló, limpiar todo y redirigir al login
        AuthStorage.clear();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Si no es un error 401 o ya intentamos el refresh, rechazar
    return Promise.reject(error);
  }
);

export const customInstance = <T = any>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
