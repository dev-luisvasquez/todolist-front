'use client';

import { useState } from 'react';
import { useRecoverPassword } from '@/hooks/useAuth';
import type { AuthControllerRecoverPasswordBody } from '@/api/generated/models';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // 👈 CORRECTO en App Router

export default function RecoverPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // 👈 aquí lees el query param ?token=1234

    const [formData, setFormData] = useState<AuthControllerRecoverPasswordBody>({
        newPassword: '',   
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const recoverPasswordMutation = useRecoverPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (!token) {
            alert('Token de recuperación no válido');
            return;
        }

        try {
            await recoverPasswordMutation.mutate(formData.newPassword, token as string);
            alert('Contraseña cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.');
        } catch {
            // El error ya se maneja en el hook
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Cambio de contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Completa el formulario para cambiar tu contraseña
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword">
                            Nueva Contraseña
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nueva contraseña"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">
                            Repite Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    
                    {recoverPasswordMutation.error && (
                        <div className="text-red-500 text-sm text-center">
                            Error al cambiar la contraseña. Verifica que el token sea válido.
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={recoverPasswordMutation.isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {recoverPasswordMutation.isLoading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
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
