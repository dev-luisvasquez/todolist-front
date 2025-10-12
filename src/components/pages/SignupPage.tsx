import SignupForm from '../auth/SignupForm';

// Components
import { Showcase } from '@/components/template/Showcase';

export const SignupPage = () => {
    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-gradient-to-b from-purple-50 to-white">
            <Showcase />
            <div className="w-full md:w-1/2 lg:w-4/5 flex items-center justify-center h-full bg-white md:bg-transparent md:rounded-none rounded-t-[28px] overflow-auto">
                <div className="w-full max-w-md p-6 md:p-0">
                    <div className="mb-4">
                        <h1 className="text-3xl font-semibold ">Crea tu cuenta</h1>
                        <p className="text-sm text-gray-600">Ingresa tus datos para crear una cuenta.</p>
                    </div>

                    <SignupForm />
                </div>
            </div>
        </div>
    );
};
