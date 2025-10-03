import { useState, useEffect } from 'react';

interface UseAsyncDataState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useAsyncData<T>(
    asyncFunction: () => Promise<T>,
    initialData: T | null = null
): UseAsyncDataState<T> {
    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await asyncFunction();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Nota: fetchData no depende de props externos aquí; si asyncFunction cambia, queremos re-ejecutarlo.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}
