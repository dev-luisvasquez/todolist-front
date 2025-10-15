import { ResetPasswordPage } from '@/components/pages/AuthPage';

import { Suspense } from 'react';
export default function RecoverPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage />
        </Suspense>
    );
}
