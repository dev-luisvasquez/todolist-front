import { useState, useCallback } from 'react';
import { getFiles } from '../api/generated/files/files';
import type {
  UploadFileWithReplaceDto,
  UploadFromUrlDto,
  FileResponseDto,
  OptimizedUrlResponseDto,
  TransformedUrlResponseDto,
  DeleteFileResponseDto,
} from '../api/generated/models';

const filesApi = getFiles();

// Hook para subir archivo
export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<FileResponseDto | null>(null);

  const uploadFile = useCallback(async (uploadFileDto: UploadFileWithReplaceDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await filesApi.filesControllerUploadFile(uploadFileDto);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al subir archivo');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    uploadFile,
    isLoading,
    error,
    data,
    reset,
  };
};

// Hook para subir archivo desde URL
export const useUploadFromUrl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<FileResponseDto | null>(null);

  const uploadFromUrl = useCallback(async (uploadFromUrlDto: UploadFromUrlDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await filesApi.filesControllerUploadFromUrl(uploadFromUrlDto);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al subir archivo desde URL');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    uploadFromUrl,
    isLoading,
    error,
    data,
    reset,
  };
};

// Hook para obtener URL optimizada
export const useOptimizedUrl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<OptimizedUrlResponseDto | null>(null);

  const getOptimizedUrl = useCallback(async (publicId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await filesApi.filesControllerGetOptimizedUrl(publicId);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al obtener URL optimizada');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    getOptimizedUrl,
    isLoading,
    error,
    data,
    reset,
  };
};

// Hook para obtener URL transformada
export const useTransformedUrl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TransformedUrlResponseDto | null>(null);

  const getTransformedUrl = useCallback(async (publicId: string, width: string, height: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await filesApi.filesControllerGetTransformedUrl(publicId, width, height);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al obtener URL transformada');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    getTransformedUrl,
    isLoading,
    error,
    data,
    reset,
  };
};

// Hook para eliminar archivo
export const useDeleteFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DeleteFileResponseDto | null>(null);

  const deleteFile = useCallback(async (publicId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await filesApi.filesControllerDeleteImage(publicId);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al eliminar archivo');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(false);
  }, []);

  return {
    deleteFile,
    isLoading,
    error,
    data,
    reset,
  };
};



// Hook para manejar múltiples operaciones de archivos
export const useFileManager = () => {
  const upload = useUploadFile();
  const uploadUrl = useUploadFromUrl();
  const optimized = useOptimizedUrl();
  const transformed = useTransformedUrl();
  const deleteFile = useDeleteFile();

  const isLoading = upload.isLoading || uploadUrl.isLoading || optimized.isLoading || 
                   transformed.isLoading || deleteFile.isLoading;

  const error = upload.error || uploadUrl.error || optimized.error || 
               transformed.error || deleteFile.error;

  const resetAll = useCallback(() => {
    upload.reset();
    uploadUrl.reset();
    optimized.reset();
    transformed.reset();
    deleteFile.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    upload: upload.uploadFile,
    uploadFromUrl: uploadUrl.uploadFromUrl,
    getOptimizedUrl: optimized.getOptimizedUrl,
    getTransformedUrl: transformed.getTransformedUrl,
    deleteFile: deleteFile.deleteFile,
    isLoading,
    error,
    resetAll,
  };
};