'use client';
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import SendEmailRecover from '@/components/auth/SendEmailRecover';
import AuthLayout from '@/components/layouts/AuthLayout';

type View = 'signin' | 'signup' | 'forgot';

function AuthPage() {
    const [view, setView] = useState<View>('signin');

    return (
        <AuthLayout>
            <div className="max-w-lg p-4 md:p-8 rounded-lg w-full">
                <div className="space-y-2 mb-6 text-center">
                    <h1 className="text-4xl font-bold">
                        {view === 'signin'
                            ? 'Iniciar sesión'
                            : view === 'signup'
                              ? 'Registrate'
                              : 'Recuperar contraseña'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {view === 'signin' && 'Ingresa con tu cuenta para gestionar tus tareas.'}
                        {view === 'signup' && 'Crea una cuenta para empezar a gestionar tus tareas.'}
                        {view === 'forgot' && 'Te enviaremos un correo para recuperar tu contraseña.'}
                    </p>
                </div>

                {view === 'signin' && <LoginForm onSwitch={(v: View) => setView(v)} />}
                {view === 'signup' && <SignupForm onSwitch={(v: View) => setView(v)} />}
                {view === 'forgot' && <SendEmailRecover onSwitch={(v: View) => setView(v)} />}
            </div>
        </AuthLayout>
    );
}

export default AuthPage;
