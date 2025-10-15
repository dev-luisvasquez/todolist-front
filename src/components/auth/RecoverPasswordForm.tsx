'use client';

// Hooks
import { useEffect, useState } from 'react';
import { useRecoverPassword } from '@/hooks/useAuth';

// Types
import type { AuthControllerRecoverPasswordBody } from '@/api/generated/models';

// Next
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Toast
import { showToast } from '@/utils/Alerts/toastAlerts';

// Components
import { InputForm, InputPasswordForm } from '../atoms/inputs/InputForm';
import { ButtonAction } from '../atoms/buttons/ButtonAction';

export default function RecoverPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState<AuthControllerRecoverPasswordBody>({
        newPassword: '',
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const recoverPasswordMutation = useRecoverPassword();

    function validationToken(token: string) {
        if (!token) {
            showToast('Token de recuperación no válido, intenta de nuevo', { type: 'error' });
            return;
        }
        return;
    }

    function validationPasswords(password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden', { type: 'error' });
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validationPasswords(formData.newPassword, confirmPassword)) {
            return;
        }

        validationToken(token as string);

        try {
            await recoverPasswordMutation.mutate(formData.newPassword, token as string);
            showToast('Contraseña cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.');
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

    useEffect(() => {
        validationToken(token as string);
    }, [token]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-2">
                <InputForm
                    label="Nueva Contraseña"
                    type="password"
                    name='newPassword'
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
                    Error al cambiar la contraseña.
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
