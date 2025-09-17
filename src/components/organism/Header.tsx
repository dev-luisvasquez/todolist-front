'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    ArrowPathIcon,
    Bars3Icon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useLocalStorageUser } from '@/hooks/useUser'
import { useLogout } from '@/hooks/useAuth'
import { generateInitials } from '@/utils/initials'


export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, isLoading, isAuthenticated } = useLocalStorageUser();
    const logout = useLogout();

    // No mostrar el header si está cargando o el usuario no está autenticado
    if (isLoading || !user) {
        return null;
    }

    return (
        <header className="bg-gray-900">
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
                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user ? generateInitials(user.name || '', user.last_name || '') : 'U'}
                                </span>
                            </div>
                            {user ? `${user.name || ''} ${user.last_name || ''}`.trim() || 'Usuario' : 'Usuario'}
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </MenuButton>
                        <MenuItems 
                            anchor="bottom"
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <a 
                                        href="/profile" 
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 transition-colors"
                                    >
                                        <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Mi Perfil
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a 
                                        href="/settings" 
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 transition-colors"
                                    >
                                        <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Configuración
                                    </a>
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
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="text-white">Todo List App</span>

                        </a>
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

                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Dashboard
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Mis Tareas
                                </a>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5"
                                >
                                    Mi Perfil
                                </a>
                            </div>
                            <div className="py-6">
                                <button
                                    onClick={logout}
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
