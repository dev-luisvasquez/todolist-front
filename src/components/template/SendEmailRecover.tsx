'use client';

import { useState } from 'react';
import { useSendRecoverEmail } from '@/hooks/useAuth';
import type { AuthControllerRequestPasswordRecoveryBody } from '@/api/generated/models';
import Link from 'next/link';
import { ErrorToast, SuccessToast } from '@/utils/toasts';

export default function SendEmailRecover() {
    const [formData, setFormData] = useState<AuthControllerRequestPasswordRecoveryBody>({
        email: '',
        
    });

    const sendRecoverEmailMutation = useSendRecoverEmail();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendRecoverEmailMutation.mutate(formData.email); // Pasar solo el email como string
            // Redirigir después del registro exitoso
            SuccessToast('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        } catch {
            ErrorToast('Error al enviar correo. Intentalo mas tarde.');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Enviar Correo de Recuperación
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Completa el formulario para enviar un correo de recuperación
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"

                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    {sendRecoverEmailMutation.error && (
                        <div className="text-red-500 text-sm text-center">
                            Error al enviar correo. Intentalo mas tarde.
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={sendRecoverEmailMutation.isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sendRecoverEmailMutation.isLoading ? 'Enviando...' : 'Enviar Correo'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            ¿Ya tienes cuenta? Inicia sesión aquí
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
