'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalHeaderProps {
    title?: string;
    onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-black">{title}</h3>
            <button
                type="button"
                className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="Cerrar"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
}
