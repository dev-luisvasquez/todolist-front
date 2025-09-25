'use client';

import { RecoverPasswordPage } from "@/components/pages/RecoverPasswordPage";
import { useSearchParams } from 'next/navigation';

function RecoverPassword() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    console.log(token);
    return (
        <RecoverPasswordPage token={token} />
    )
}

export default RecoverPassword;
      
                