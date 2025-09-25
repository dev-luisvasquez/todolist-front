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
          // Validar si el refresh token es válido (no expirado)
          try {
            const payload = JSON.parse(atob(refreshToken.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            // Si el refresh token ya expiró, limpiar storage
            if (payload.exp && payload.exp < currentTime) {
              console.log('Refresh token expirado, limpiando storage...');
              AuthStorage.clear();
              
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
              }
              return Promise.reject(new Error('Refresh token expirado'));
            }
          } catch (tokenError) {
            console.error('Error al validar refresh token:', tokenError);
            // Si hay error al decodificar el token, es inválido
            AuthStorage.clear();
            
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/signin';
            }
            return Promise.reject(new Error('Refresh token inválido'));
          }
          
          const refreshResponse = await axiosInstance.post('/auth/refresh-token', {}, {
            headers: {
              'x-refresh-token': refreshToken,
            },
          });
          
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          
          // Guardar los nuevos tokens
          AuthStorage.setAccessToken(accessToken);
          
          if (newRefreshToken) {
            AuthStorage.setRefreshToken(newRefreshToken);
          }
          
          // También verificar si viene en los headers como respaldo
          const headerRefreshToken = refreshResponse.headers['x-refresh-token'];
          if (headerRefreshToken) {
            AuthStorage.setRefreshToken(headerRefreshToken);
          }
          
          // Actualizar el header de la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          // Reintentar la petición original
          return axiosInstance(originalRequest);
        } else {
          // Si no hay refresh token, limpiar storage y redirigir
          AuthStorage.clear();
          
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin';
          }
          return Promise.reject(new Error('No hay refresh token disponible'));
        }
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError);
        
        // Si el refresh token también devuelve 401, significa que ya no es válido
        if (
          typeof refreshError === 'object' &&
          refreshError !== null &&
          'response' in refreshError &&
          (refreshError as any).response?.status === 401
        ) {
          console.log('Refresh token rechazado por el servidor (401), limpiando storage...');
          AuthStorage.clear();
          
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin';
          }
          
          return Promise.reject(new Error('Refresh token no válido'));
        }
        
        // Para otros errores de refresh, también limpiar por seguridad
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
