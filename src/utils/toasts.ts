import toast from "react-hot-toast";



export const ErrorToast = (message: string) => {
    return toast.error(message, {position: "top-right"});
}

export const SuccessToast = (message: string) => {
    return toast.success(message, {position: "top-right"});
}

export const InfoToast = (message: string) => {
    return toast(message, {position: "top-right"} );
}

export const PromiseToast = <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string; }
): Promise<T> => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            // puedes usar el valor resuelto si quieres: (value: T) => `Hecho: ${value}`
            success: (_value: T) => messages.success,
            error: (_err: unknown) => messages.error,
        },
        { position: "top-right" }
    ) as Promise<T>;
}