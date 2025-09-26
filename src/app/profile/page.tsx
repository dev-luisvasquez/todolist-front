'use client';

import { useState, useRef, useEffect } from "react";
import { useUser, useUpdateUser } from "@/hooks/useUser";
import { useGlobalUser } from "@/hooks/useGlobalUser";
import { useUploadFile } from "@/hooks/useFile";
import { UpdateUserDto } from "@/api/generated/models/updateUserDto";
import { PromiseToast, ErrorToast, SuccessToast } from "@/utils/toasts";


const Profile = () => {
    const [activeTab, setActiveTab] = useState("informacion");
    const { data: userData, isLoading: userLoading, refetch } = useUser();
    const { mutate: updateUser } = useUpdateUser();
    const { uploadFile, isLoading: uploadLoading } = useUploadFile();
    const { updateUser: updateGlobalUser } = useGlobalUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // Estado para manejar error de carga del avatar
    const [avatarError, setAvatarError] = useState(false);
    
    // Estados para el formulario
    const [formData, setFormData] = useState<Partial<UpdateUserDto>>({
        name: userData?.name || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        birthday: userData?.birthday || '',
        avatar: userData?.avatar || '',
    });

    // Resetear error cuando cambia la URL del avatar
    useEffect(() => {
        setAvatarError(false);
    }, [formData.avatar]);

    // Actualizar formData cuando userData cambie
    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                birthday: userData.birthday ? userData.birthday.split('T')[0] : '',
                avatar: userData.avatar || '',
            });
        }
    }, [userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!userData?.id) {
            ErrorToast('No se encontró el usuario');
            return;
        }

        const uploadData = { file, folder: `${userData?.id}/avatars`, oldImageUrl: formData.avatar };
        const uploadPromise = uploadFile(uploadData);

        PromiseToast(uploadPromise, {
            loading: 'Subiendo avatar...',
            success: 'Avatar actualizado correctamente',
            error: 'Error al subir el avatar'
        });

        try {
            const response = await uploadPromise;
            
            if (response?.url) {
                // Actualizar el estado local
                setFormData(prev => ({
                    ...prev,
                    avatar: response.url
                }));

                // Actualizar el usuario en la base de datos inmediatamente
                const updateData: UpdateUserDto & { id: string } = {
                    id: userData.id,
                    avatar: response.url
                };

                const updatePromise = (async () => {
                    const updatedUser = await updateUser(updateData);
                    
                    if (updatedUser) {
                        updateGlobalUser(updatedUser);
                        await refetch();
                        return updatedUser;
                    } else {
                        throw new Error('No se pudo actualizar el avatar');
                    }
                })();

                // No mostrar toast aquí porque ya se mostró uno para la subida
                await updatePromise;
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!userData?.id) {
            ErrorToast('No se encontró el usuario');
            return;
        }

        const updateData: UpdateUserDto & { id: string } = {
            id: userData.id,
            ...formData
        };

        const updatePromise = (async () => {
            const updatedUser = await updateUser(updateData);
            
            if (updatedUser) {
                updateGlobalUser(updatedUser);
                await refetch();
                return updatedUser;
            } else {
                throw new Error('No se pudo actualizar el usuario');
            }
        })();

        PromiseToast(updatePromise, {
            loading: 'Actualizando información...',
            success: 'Información actualizada correctamente',
            error: 'Error al actualizar la información'
        });
    };

    const getInitials = (name?: string, lastName?: string) => {
        const firstInitial = name?.charAt(0)?.toUpperCase() || '';
        const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
        return firstInitial + lastInitial;
    };

    return (
        <div >
            <h1 className="text-3xl font-semibold">Perfil de Usuario</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white p-4 rounded-lg shadow h-fit">
                    <nav className="space-y-2">
                        <button 
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "informacion" 
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => setActiveTab("informacion")}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Información
                            </div>
                        </button>
                        <button 
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                activeTab === "contraseña" 
                                    ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-sm" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => setActiveTab("contraseña")}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2m0 0V7a2 2 0 012-2m6 0a2 2 0 00-2-2m0 0a2 2 0 00-2 2v2m0 0V9a2 2 0 012-2m0 0a2 2 0 012 2v2" />
                                </svg>
                                Contraseña
                            </div>
                        </button>
                        
                    </nav>
                </div>
                <div className="col-span-1 md:col-span-1 lg:col-span-3 bg-white p-4 rounded-lg shadow">
                    {activeTab === "informacion" ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Información Personal</h2>
                            
                            {userLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center space-y-4 pb-6 border-b border-gray-200">
                                        <div className="relative">
                                            <div
                                                className="w-24 h-24 rounded-full cursor-pointer overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                                onClick={handleAvatarClick}
                                            >
                                                {formData.avatar && !avatarError ? (
                                                    <img
                                                        src={formData.avatar}
                                                        alt={`Avatar de ${formData.name || ''} ${formData.last_name || ''}`.trim() || 'Avatar del usuario'}
                                                        className="w-full h-full object-cover"
                                                        onError={() => setAvatarError(true)}
                                                        onLoad={() => avatarError && setAvatarError(false)}
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <span>{getInitials(formData.name, formData.last_name)}</span>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            {uploadLoading && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <p className="text-sm text-gray-500 text-center">
                                            Haz clic en la imagen para cambiar tu avatar
                                        </p>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nombre */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="Tu nombre"
                                            />
                                        </div>

                                        {/* Apellido */}
                                        <div>
                                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="Tu apellido"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="tu@email.com"
                                            />
                                        </div>

                                        {/* Fecha de Nacimiento */}
                                        <div>
                                            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Nacimiento
                                            </label>
                                            <input
                                                type="date"
                                                id="birthday"
                                                name="birthday"
                                                value={formData.birthday}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (userData) {
                                                        setFormData({
                                                            name: userData.name || '',
                                                            last_name: userData.last_name || '',
                                                            email: userData.email || '',
                                                            birthday: userData.birthday ? userData.birthday.split('T')[0] : '',
                                                            avatar: userData.avatar || '',
                                                        });
                                                    }
                                                }}
                                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-8 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                                            >
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cambiar Contraseña</h2>
                            <div className="space-y-4">
                                <p className="text-gray-600">Aquí puedes cambiar tu contraseña...</p>
                                {/* Contenido para contraseña */}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        
        </div>
    );
}

export default Profile;