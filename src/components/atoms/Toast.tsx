'use client'
import { useState, useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, show, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
            default:
                return 'bg-blue-500 text-white';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
            <div className={`
                px-4 py-3 rounded-lg shadow-lg max-w-sm
                ${getToastStyles()}
            `}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{message}</span>
                    <button
                        onClick={onClose}
                        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
