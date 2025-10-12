'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/useAuth';
import type { CreateUserDto } from '@/api/generated/models';

// Componentes
import { InputForm, InputPasswordForm } from '../atoms/InputForm';
import { ButtonAction } from '../atoms/buttons/ButtonAction';


type View = 'signin' | 'signup' | 'forgot';

export default function SignupForm({ onSwitch }: { onSwitch?: (v: View) => void }) {
    const [formData, setFormData] = useState<CreateUserDto>({
        name: '',
        last_name: '',
        email: '',
        password: '',
        birthday: '',
    });

    console.log(formData.birthday);

    const registerMutation = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerMutation.mutate(formData);
            // en lugar de forzar redirect, usamos el switch si existe
            if (onSwitch) {
                onSwitch('signin');
            } else if (typeof window !== 'undefined') {
                window.location.href = '/auth';
            }
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
                    name="name"
                    type="text"
                    label="Nombre"
                    required
                    value={formData.name}
                    onChange={handleChange}
                />

                <InputForm
                    name="last_name"
                    type="text"
                    label="Apellido"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                />

                <InputForm
                    name="email"
                    type="email"
                    label="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputForm
                    name="birthday"
                    type="date"
                    label="Fecha de Nacimiento"
                    required
                    value={formData.birthday}
                    onChange={handleChange}
                />

                <InputPasswordForm
                    name="password"
                    label="Contraseña"
                    required
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            {/* {registerMutation.error && (
                <div className="text-red-500 text-sm text-center">Error al registrarse. Verifica tus datos.</div>
            )} */}

            <div className="flex justify-center mt-4 mb-2">
                <ButtonAction
                    typeButton="submit"
                    typeAction="action"
                    text={registerMutation.isLoading ? 'Registrando...' : 'Registrarse'}
                    disabled={registerMutation.isLoading}
                />
            </div>

            <div className="text-start">
                <button
                    type="button"
                    onClick={() => onSwitch?.('signin')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                    ¿Ya tienes cuenta? Inicia sesión aquí
                </button>
            </div>
        </form>
    );
}
