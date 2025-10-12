'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import type { AuthDto } from '@/api/generated/models';

// Components
import { InputForm, InputPasswordForm } from '../atoms/InputForm';
import { ButtonAction } from '../atoms/buttons/ButtonAction';


type View = 'signin' | 'signup' | 'forgot';

export default function LoginForm({ onSwitch }: { onSwitch?: (v: View) => void }) {
    const [formData, setFormData] = useState<AuthDto>({
        email: '',
        password: '',
    });



    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await loginMutation.mutate(formData); // Pasar directamente formData, no { data: formData }
        } catch {
           return;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-2">
                <InputForm
                    name="email"
                    type="email"
                    label="Email"
                    autocomplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputPasswordForm
                    name="password"
                    type="password"
                    label="Contraseña"
                    autocomplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            {loginMutation.error && (
                <div className="text-red-500 text-sm text-center">
                    Error al iniciar sesión. Verifica tus credenciales.
                </div>
            )}

            <div className="text-end my-2">
                <button
                    type="button"
                    onClick={() => onSwitch?.('forgot')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>

            <div className="flex justify-center mb-2">
                <ButtonAction
                    typeButton="submit"
                    typeAction="action"
                    text={loginMutation.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    disabled={loginMutation.isLoading}
                />
            </div>

            <div className="text-start">
                <button
                    type="button"
                    onClick={() => onSwitch?.('signup')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    ¿No tienes cuenta? Regístrate aquí
                </button>
            </div>

            
        </form>
    );
}
