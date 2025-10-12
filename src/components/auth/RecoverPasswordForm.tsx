'use client';

import { useState } from 'react';
import { useRecoverPassword } from '@/hooks/useAuth';
import type { AuthControllerRecoverPasswordBody } from '@/api/generated/models';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // 👈 CORRECTO en App Router
import { showToast } from '@/utils/Alerts/toastAlerts';

// Components
import { InputForm, InputPasswordForm } from '../atoms/InputForm';
import { ButtonAction } from '../atoms/buttons/ButtonAction';

export default function RecoverPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // 👈 aquí lees el query param ?token=1234

    const [formData, setFormData] = useState<AuthControllerRecoverPasswordBody>({
        newPassword: '',
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const recoverPasswordMutation = useRecoverPassword();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== confirmPassword) {
            showToast('Las contraseñas no coinciden', { type: 'error' });
            return;
        }

        if (!token) {
            showToast('Token de recuperación no válido, intenta de nuevo', { type: 'error' });
            return;
        }

        try {
            await recoverPasswordMutation.mutate(formData.newPassword, token as string);
            showToast('Contraseña cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.');
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
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-2">
                <InputForm
                    label="Nueva Contraseña"
                    type="password"
                    required
                    placeholder="Introduce tu nueva contraseña"
                    value={formData.newPassword}
                    onChange={handleChange}
                />

                <InputPasswordForm
                    label="Repite Contraseña"
                    type="password"
                    required
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            {recoverPasswordMutation.error && (
                <div className="text-red-500 text-sm text-center">
                    Error al cambiar la contraseña. Verifica que el token sea válido.
                </div>
            )}

            <div className="flex justify-center mt-4 mb-2">
                <ButtonAction
                    text={recoverPasswordMutation.isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    disabled={recoverPasswordMutation.isLoading}
                    typeButton="submit"
                    typeAction="action"
                />
            </div>

            <div className="text-start">
                <Link href="/auth" className="font-medium text-indigo-600 hover:text-indigo-500">
                    ¿Ya tienes cuenta? Inicia sesión aquí
                </Link>
            </div>
        </form>
    );
}
