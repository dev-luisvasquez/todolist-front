'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    ariaLabel?: string;
    sizeClass?: string; // p. ej. 'w-full max-w-md'
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, id, ariaLabel = undefined, sizeClass = 'w-full max-w-md', children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            try {
                dialog.showModal();
            } catch {
                // ignore if already open
            }
        } else {
            if (dialog.open) dialog.close();
        }
    }, [isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleNativeClose = () => {
            onClose();
        };

        dialog.addEventListener('close', handleNativeClose);
        return () => dialog.removeEventListener('close', handleNativeClose);
    }, [onClose]);

    return (
        <dialog id={id} ref={dialogRef} className="modal sm:modal-middle" aria-label={ariaLabel}>
            <div className={`modal-box ${sizeClass} rounded-2xl p-6 bg-white`}>
                {children}
            </div>
        </dialog>
    );
}


