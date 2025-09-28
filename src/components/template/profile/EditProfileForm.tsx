import { useState, useRef, useEffect, useMemo } from "react";
import { useUser, useUpdateUser } from "@/hooks/useUser";
import { useGlobalUser } from "@/hooks/useGlobalUser";
import { useUploadFile } from "@/hooks/useFile";
import { UpdateUserDto } from "@/api/generated/models/updateUserDto";
import { PromiseToast, ErrorToast } from "@/utils/toasts";
import { generateInitials } from "@/utils/initials";


export const EditProfileForm = () => {
  const { data: userData, isLoading: userLoading, refetch } = useUser();
  const { mutate: updateUser } = useUpdateUser();
  const { uploadFile, isLoading: uploadLoading } = useUploadFile();
  const { updateUser: updateGlobalUser } = useGlobalUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para manejar modo edición y error de avatar
  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Datos iniciales derivados del usuario (normalizados)
  const initialData = useMemo(
    () => ({
      name: userData?.name || "",
      last_name: userData?.last_name || "",
      email: userData?.email || "",
      birthday: userData?.birthday ? userData.birthday.split("T")[0] : "",
      avatar: userData?.avatar || "",
    }),
    [userData]
  );

  // Estados para el formulario
  const [formData, setFormData] = useState<Partial<UpdateUserDto>>(initialData);

  // Sincronizar formData cuando cambie el usuario
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Resetear error cuando cambia la URL del avatar
  useEffect(() => {
    setAvatarError(false);
  }, [formData.avatar]);

  // Detectar si hay cambios vs datos iniciales
  const hasChanges = useMemo(() => {
    return (
      formData.name !== initialData.name ||
      formData.last_name !== initialData.last_name ||
      formData.email !== initialData.email ||
      formData.birthday !== initialData.birthday ||
      formData.avatar !== initialData.avatar
    );
  }, [formData, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (!userData?.id) {
      ErrorToast("No se encontró el usuario");
      return;
    }

    const uploadData = {
      file,
      folder: `${userData.id}/avatars`,
      oldImageUrl: formData.avatar,
    };

    const uploadPromise = uploadFile(uploadData);

    PromiseToast(uploadPromise, {
      loading: "Subiendo avatar...",
      success: "Avatar cargado. Recuerda guardar los cambios",
      error: "Error al subir el avatar",
    });

    try {
      const response = await uploadPromise;
      if (response?.url) {
        // Solo actualizamos el estado local; el update del usuario se hará al guardar
        setFormData((prev) => ({ ...prev, avatar: response.url }));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    if (!userData?.id) {
      ErrorToast("No se encontró el usuario");
      setIsSaving(false);
      return;
    }

    // Construir objeto solo con campos modificados
    const changes: Partial<UpdateUserDto> = {};
    if (formData.name !== initialData.name) changes.name = formData.name;
    if (formData.last_name !== initialData.last_name)
      changes.last_name = formData.last_name;
    if (formData.email !== initialData.email) changes.email = formData.email;
    if (formData.birthday !== initialData.birthday)
      changes.birthday = formData.birthday;
    if (formData.avatar !== initialData.avatar) changes.avatar = formData.avatar;

    if (Object.keys(changes).length === 0) {
      // Nada que actualizar
      setIsEditing(false);
      setIsSaving(false);
      return;
    }

    const updateData: UpdateUserDto & { id: string } = {
      id: userData.id,
      ...changes,
    } as UpdateUserDto & { id: string };

    const updatePromise = (async () => {
      const updatedUser = await updateUser(updateData);
      if (updatedUser) {
        updateGlobalUser(updatedUser);
        await refetch();
        return updatedUser;
      } else {
        throw new Error("No se pudo actualizar el usuario");
      }
    })();

    PromiseToast(updatePromise, {
      loading: "Actualizando información...",
      success: "Información actualizada correctamente",
      error: "Error al actualizar la información",
    });

    try {
      await updatePromise;
      setIsEditing(false);
    } catch {
      // ya gestionado por toasts
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
                className={`w-24 h-24 rounded-full ${
                  isEditing ? "cursor-pointer" : "cursor-default"
                } overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold shadow-lg transition-all duration-300 ${
                  isEditing ? "hover:shadow-xl hover:scale-105" : ""
                }`}
                onClick={handleAvatarClick}
              >
                {formData.avatar && !avatarError ? (
                  <img
                    src={formData.avatar}
                    alt={`Avatar de ${formData.name || ""} ${formData.last_name || ""}`.trim() || "Avatar del usuario"}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                    onLoad={() => avatarError && setAvatarError(false)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{generateInitials(formData.name, formData.last_name)}</span>
                )}
              </div>
              {isEditing && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
              )}
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
              {isEditing
                ? "Haz clic en la imagen para cambiar tu avatar"
                : "Avatar del perfil"}
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
                disabled={!isEditing}
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-600"
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
                disabled={!isEditing}
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-600"
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
                disabled={!isEditing}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-600"
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
                disabled={!isEditing}
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  Editar
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(initialData);
                      setIsEditing(false);
                      setAvatarError(false);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!hasChanges || isSaving}
                    aria-busy={isSaving}
                    className={`px-8 py-3 text-white font-bold rounded-lg transition-colors ${
                      hasChanges && !isSaving
                        ? "bg-blue-500 hover:bg-blue-700"
                        : "bg-blue-300 cursor-not-allowed"
                    }`}
                  >
                    {isSaving ? "Guardando..." : hasChanges ? "Guardar Cambios" : "No hay cambios"}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};