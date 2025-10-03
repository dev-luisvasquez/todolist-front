import { RecoverPasswordPage } from '@/components/pages/RecoverPasswordPage';
import { Suspense } from 'react';
export default function RecoverPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RecoverPasswordPage />
        </Suspense>
    );
}
