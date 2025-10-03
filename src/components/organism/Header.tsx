'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogPanel,   
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    PopoverGroup,
   
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useUserState } from '@/hooks/useGlobalUser'
import { useLogout } from '@/hooks/useAuth'
import { generateInitials } from '@/utils/initials'


export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, isLoading } = useUserState();
    const logout = useLogout();
    const [avatarError, setAvatarError] = useState(false);

    // No mostrar el header si está cargando o el usuario no está autenticado
    if (isLoading || !user) {
        return null;
    }

    return (
        <header className="bg-gray-900 sticky top-0 z-50 shadow-md">
            <nav aria-label="Global" className="mx-auto flex max-w-6xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1 justify-center lg:justify-start">
                    <span className="text-white text-xl font-bold">📝 Mi Lista de Tareas</span>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12 lg:items-center">

                    <Link href="/home" className="text-sm/6 font-semibold text-white hover:text-gray-300 transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/tasks" className="text-sm/6 font-semibold text-white hover:text-gray-300 transition-colors">
                        Mis Tareas
                    </Link>
                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-2 text-sm font-semibold text-white hover:text-gray-300 transition-colors">
                            {user.avatar && !avatarError ? (
                                // Mantener <img> por compatibilidad; usar next/image no es posible con referrerPolicy en algunos casos.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={user.avatar}
                                    alt={`Avatar de ${user.name || ''} ${user.last_name || ''}`.trim() || 'Avatar del usuario'}
                                    className="h-8 w-8 rounded-full object-cover"
                                    onError={() => setAvatarError(true)}
                                    onLoad={() => avatarError && setAvatarError(false)}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                 <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                     <span className="text-sm font-medium text-white">
                                         {user ? generateInitials(user.name || '', user.last_name || '') : 'U'}
                                     </span>
                                 </div>
                             )}

                            {user ? `${user.name || ''} ${user.last_name || ''}`.trim() || 'Usuario' : 'Usuario'}
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </MenuButton>
                        <MenuItems
                            className="absolute left-0 top-10 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <Link
                                        href="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 transition-colors"


                                    >
                                        <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Mi Perfil
                                    </Link>
                                </MenuItem>
                                
                                <hr className="my-1 border-gray-200" />
                                <MenuItem>
                                    <button
                                        onClick={logout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 data-focus:bg-red-50 transition-colors"
                                    >
                                        <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar Sesión
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>

                </PopoverGroup>

            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                    <div className="flex items-center justify-between">
                        <Link href="#" className="-m-1.5 p-1.5">
                            <span className="text-white">Todo List App</span>

                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-400"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-white/10">
                            <div className="space-y-2 py-6">

                                <Link
                                    href="/home"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/tasks"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Mis Tareas
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Mi Perfil
                                </Link>
                            </div>
                            <div className="py-6">
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-red-700 hover:bg-white/5 w-full text-left"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
