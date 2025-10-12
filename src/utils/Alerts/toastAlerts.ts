import { toast } from 'react-toastify';

interface ToastOptions {
    type?: 'success' | 'error' | 'info' | 'warning';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    autoClose?: number | false;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    progress?: number;
    theme?: 'light' | 'dark' | 'colored';
}

export const showToast = (message: string, options?: ToastOptions) => {
    toast[options?.type || 'success'](message, {
        position: options?.position || 'top-right',
        autoClose: options?.autoClose || 3000,
        hideProgressBar: options?.hideProgressBar || false,
        closeOnClick: options?.closeOnClick || true,
        pauseOnHover: options?.pauseOnHover || true,
        draggable: options?.draggable || true,
        progress: options?.progress || undefined,
        theme: options?.theme || 'colored',
    });
};

export const showPromiseToast = async <T, E = unknown>(
    promise: Promise<T>,
    messages: {
        pending: string;
        success: string | ((result: T) => string);
        error: string | ((err: E) => string);
    },
    options?: ToastOptions,
) => {
    const commonOptions = {
        position: options?.position || 'top-right',
        autoClose: options?.autoClose || 3000,
        hideProgressBar: options?.hideProgressBar || false,
        closeOnClick: options?.closeOnClick || true,
        pauseOnHover: options?.pauseOnHover || true,
        draggable: options?.draggable || true,
        progress: options?.progress || undefined,
        theme: options?.theme || 'light',
    };

    const payload = {
        pending: messages.pending,
        success:
            typeof messages.success === 'function'
                ? { render: (props: { data?: T }) => (messages.success as (r: T) => string)(props.data as T) }
                : messages.success,
        error:
            typeof messages.error === 'function'
                ? { render: (props: { data?: E }) => (messages.error as (e: E) => string)(props.data as E) }
                : messages.error,
    };

    return toast.promise(promise, payload, commonOptions);
};
