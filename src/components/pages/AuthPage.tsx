import RecoverPasswordForm from '../auth/RecoverPasswordForm';
import AuthLayout from '@/components/layouts/AuthLayout';

export const ResetPasswordPage = () => {
    return (
        <AuthLayout>
            <div className="max-w-lg p-4 md:p-8 rounded-lg w-full">
                <div className="space-y-2 mb-6 text-center">
                    <h1 className="text-4xl font-bold">Cambiar contraseña</h1>
                    <p className="text-sm text-gray-600">Ingresa tu nueva contraseña.</p>
                </div>
                <RecoverPasswordForm />
            </div>
        </AuthLayout>
    );
};
