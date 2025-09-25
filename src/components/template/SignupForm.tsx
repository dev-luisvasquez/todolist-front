'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/useAuth';
import type { CreateUserDto } from '@/api/generated/models';
import Link from 'next/link';

export default function SignupForm() {
    const [formData, setFormData] = useState<CreateUserDto>({
        name: '',
        last_name: '',
        email: '',
        password: '',
        birthday: undefined,
    });

    const registerMutation = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerMutation.mutate(formData); // Pasar directamente formData, no { data: formData }
            // Redirigir después del registro exitoso
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
            }
        } catch (error) {
            // El error ya se maneja en el hook
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
                        Crear una cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Completa el formulario para crear una cuenta nueva
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="name" >
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"

                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="last_name" >
                            Apellido
                        </label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"

                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Apellido"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

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
                    <div>
                        <label htmlFor="password" >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"

                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>


                    {registerMutation.error && (
                        <div className="text-red-500 text-sm text-center">
                            Error al registrarse. Verifica tus credenciales.
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={registerMutation.isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {registerMutation.isLoading ? 'Registrando...' : 'Registrarse'}
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
