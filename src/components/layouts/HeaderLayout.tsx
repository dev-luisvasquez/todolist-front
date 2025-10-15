'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
    HomeIcon,
    ClipboardDocumentListIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useUserState } from '@/hooks/useGlobalUser'
import { useLogout } from '@/hooks/useAuth'
import { generateInitials } from '@/utils/initials'


export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname();
    const isActive = (href: string) => {
        if (!pathname) return false;
        // Marca como activo si la ruta exacta coincide o si es un prefijo (útil para rutas anidadas)
        return pathname === href || (href !== '/' && pathname.startsWith(href));
    }
    const { user, isLoading } = useUserState();
    const logout = useLogout();
    const [avatarError, setAvatarError] = useState(false);

    // No mostrar el header si está cargando o el usuario no está autenticado
    if (isLoading || !user) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 mx-4 mb-4 rounded-bl-xl rounded-br-xl shadow-2xl backdrop-blur-sm bg-[color:var(--primary-600)]/95 ring-1 ring-black/10">
            <nav aria-label="Global" className="mx-auto flex max-w-6xl items-center justify-between p-4 lg:px-8">
                <div className="flex lg:flex-1 justify-center lg:justify-start">
                    <span className="text-white text-xl font-bold flex items-center gap-3">
                        <span className="bg-white/10 rounded-md px-2 py-1 shadow-sm">📝</span>
                        <span>Mi Lista de Tareas</span>
                    </span>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-200 hover:bg-white/5 transition-transform hover:scale-105"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-6 lg:items-center">

                    <Link href="/home" className={`${isActive('/home') ? 'bg-white/10 shadow-md rounded-2xl px-3 py-1 ring-1 ring-white/10' : ''} text-sm/6 font-semibold text-white hover:text-gray-100 transition-colors flex items-center gap-2`}>
                        <HomeIcon className="h-5 w-5 text-white/90" aria-hidden="true" />
                        Dashboard
                    </Link>
                    <Link href="/tasks" className={`${isActive('/tasks') ? 'bg-white/10 shadow-md rounded-2xl px-3 py-1 ring-1 ring-white/10' : ''} text-sm/6 font-semibold text-white hover:text-gray-100 transition-colors flex items-center gap-2`}>
                        <ClipboardDocumentListIcon className="h-5 w-5 text-white/90" aria-hidden="true" />
                        Mis Tareas
                    </Link>
                    <Menu as="div" className="relative">
                        <MenuButton className="flex items-center gap-3 text-sm font-semibold text-white hover:text-gray-100 transition transform hover:scale-[1.02]">
                            {user.avatar && !avatarError ? (
                                // Mantener <img> por compatibilidad; usar next/image no es posible con referrerPolicy en algunos casos.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={user.avatar}
                                    alt={`Avatar de ${user.name || ''} ${user.last_name || ''}`.trim() || 'Avatar del usuario'}
                                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20 shadow-sm"
                                    onError={() => setAvatarError(true)}
                                    onLoad={() => avatarError && setAvatarError(false)}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                 <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/10 shadow-sm">
                                     <span className="text-sm font-medium text-white">
                                         {user ? generateInitials(user.name || '', user.last_name || '') : 'U'}
                                     </span>
                                 </div>
                             )}

                            <span className="truncate max-w-[10rem]">{user ? `${user.name || ''} ${user.last_name || ''}`.trim() || 'Usuario' : 'Usuario'}</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </MenuButton>
                        <MenuItems
                            className="absolute left-0 top-12 z-10 mt-2 w-56 origin-top-left rounded-lg bg-white/95 shadow-2xl ring-1 ring-black/5 focus:outline-none overflow-hidden"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <Link
                                        href="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <UserIcon className="mr-3 h-4 w-4 text-gray-500" aria-hidden="true" />
                                        Mi Perfil
                                    </Link>
                                </MenuItem>
                                
                                <hr className="my-1 border-gray-200/60" />
                                <MenuItem>
                                    <button
                                        onClick={logout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                                    >
                                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-red-600" aria-hidden="true" />
                                        Cerrar Sesión
                                    </button>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>

                </PopoverGroup>

            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[var(--primary-600)]/95 p-6 sm:max-w-sm sm:backdrop-blur-md sm:rounded-l-xl sm:shadow-2xl transform transition-transform duration-300">
                    <div className="flex items-center justify-between">
                        <Link href="#" className="-m-1.5 p-1.5">
                            <span className="text-white font-semibold">Todo List App</span>

                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-200 hover:bg-white/5 transition"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-white/10">
                            <div className="space-y-2 py-6">

                                <Link
                                    href="/home"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`${isActive('/home') ? 'bg-white/10' : ''} -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 transition flex items-center gap-3`}
                                >
                                    <HomeIcon className="h-5 w-5" aria-hidden="true" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/tasks"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`${isActive('/tasks') ? 'bg-white/10' : ''} -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 transition flex items-center gap-3`}
                                >
                                    <ClipboardDocumentListIcon className="h-5 w-5" aria-hidden="true" />
                                    Mis Tareas
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`${isActive('/profile') ? 'bg-white/10' : ''} -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 transition flex items-center gap-3`}
                                >
                                    <UserIcon className="h-5 w-5" aria-hidden="true" />
                                    Mi Perfil
                                </Link>
                            </div>
                            <div className="py-6">
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-[var(--danger)] hover:bg-white/5 w-full text-left transition flex items-center gap-3"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-[var(--danger)]" aria-hidden="true" />
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
