'use client';

import { useState } from 'react';
import { useSendRecoverEmail } from '@/hooks/useAuth';

// Componentes
import { InputForm } from '../atoms/inputs/InputForm';
import { ButtonAction } from '../atoms/buttons/ButtonAction';

// Toast
import { showToast } from '@/utils/Alerts/toastAlerts';

type View = 'signin' | 'signup' | 'forgot';

export default function SendEmailRecover({ onSwitch }: { onSwitch?: (v: View) => void }) {
    const [formData, setFormData] = useState({ email: '' });
    const sendRecoverEmailMutation = useSendRecoverEmail();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendRecoverEmailMutation.mutate(formData.email);
            showToast('Correo enviado. Revisa tu bandeja de entrada.');
            onSwitch?.('signin');
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
                    required
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            {sendRecoverEmailMutation.error && (
                <div className="text-red-500 text-sm text-center">Error al enviar correo.</div>
            )}

            <div className="flex justify-center mt-4 mb-2">
                <ButtonAction
                    typeButton="submit"
                    typeAction="action"
                    text={sendRecoverEmailMutation.isLoading ? 'Enviando...' : 'Enviar correo'}
                    disabled={sendRecoverEmailMutation.isLoading}
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
