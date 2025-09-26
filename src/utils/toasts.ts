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



export const PromiseToast = (promise: Promise<any>, messages: { loading: string; success: string; error: string; }) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {position: "top-right"}
    )
}