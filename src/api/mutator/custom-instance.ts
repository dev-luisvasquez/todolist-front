import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import AuthStorage from '@/utils/auth';
import { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
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

              AuthStorage.clear();
              
              if (typeof window !== 'undefined') {
                // En vez de forzar una recarga/navegación aquí, emitimos un evento para que
                // un componente cliente (montado en layout o provider) haga la navegación
                // usando el router de Next (evita recargas infinitas y el error de router en módulo).
                window.dispatchEvent(new CustomEvent('app:logout'));
              }
              return Promise.reject(new Error('Refresh token expirado'));
            }
          } catch (tokenError) {
            console.error('Error al validar refresh token:', tokenError);
            // Si hay error al decodificar el token, es inválido
            AuthStorage.clear();
            
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('app:logout'));
            }
            return Promise.reject(new Error('Refresh token inválido'));
          }
          
          const refreshResponse = await axiosInstance.post('/auth/refresh-token', {}, {
            headers: {
              'x-refresh-token': refreshToken,
            },
          });
          
          const { access_Token: accessToken, refresh_Token: newRefreshToken } = refreshResponse.data;
          
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
          // Si no hay refresh token, limpiar storage y notificar para navegación cliente
          AuthStorage.clear();
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('app:logout'));
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
          (refreshError as AxiosError).response?.status === 401
        ) {
         
          AuthStorage.clear();
          
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('app:logout'));
          }
          
          return Promise.reject(new Error('Refresh token no válido'));
        }
        
        // Para otros errores de refresh, también limpiar por seguridad
        AuthStorage.clear();
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('app:logout'));
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Si no es un error 401 o ya intentamos el refresh, rechazar
    return Promise.reject(error);
  }
);

type CancelablePromise<T> = Promise<T> & { cancel: () => void };

export const customInstance = <T = unknown>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): CancelablePromise<T> => {
  const source = axios.CancelToken.source();
  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }: AxiosResponse) => data) as CancelablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
