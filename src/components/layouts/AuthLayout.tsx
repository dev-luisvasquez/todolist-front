'use client';
import { Showcase } from '@/components/template/Showcase';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="fixed inset-0 flex flex-col md:flex-row bg-gradient-to-b from-purple-50 to-white">
            {/* Showcase renderizado una sola vez para todas las rutas bajo /auth */}
            <Showcase />
            <div className="w-full md:w-1/2 lg:w-4/5 flex items-center justify-center h-full bg-white md:bg-transparent md:rounded-none rounded-t-[28px]">
                {children}
            </div>
        </div>
    );
}