import { useState, useEffect, useMemo } from "react";
import { useUser, useUpdateUser } from "@/hooks/useUser";
import { useGlobalUser } from "@/hooks/useGlobalUser";
import { useUploadFile } from "@/hooks/useFile";
import { UpdateUserDto } from "@/api/generated/models/updateUserDto";

// Toast
import { showToast, showPromiseToast } from "@/utils/Alerts/toastAlerts";
import { generateInitials } from "@/utils/initials";

// Componentes
import { InputForm } from "@/components/atoms/inputs/InputForm";
import { ButtonAction } from "@/components/atoms/buttons/ButtonAction";
import { AvatarPicker } from "@/components/atoms/AvatarPicker";


export const EditProfileForm = () => {
  const { data: userData, isLoading: userLoading, refetch } = useUser();
  const { mutate: updateUser } = useUpdateUser();
  const { uploadFile, isLoading: uploadLoading } = useUploadFile();
  const { updateUser: updateGlobalUser } = useGlobalUser();

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

  // Reemplaza handleFileChange por una versión que no actualice usuario ni borre el avatar anterior
  const handleAvatarSelected = async (file: File) => {
    if (!isEditing) return;

    if (!userData?.id) {
      showToast("No se encontró el usuario", { type: "error" });
      return;
    }

    const uploadData = {
      file,
      folder: `${userData.id}/avatars/drafts`, // opcional: usar carpeta temporal
      // No enviar oldImageUrl aquí para no borrar el avatar actual hasta guardar
    };

    const uploadPromise = uploadFile(uploadData);

    showPromiseToast(uploadPromise, {
      pending: "Subiendo avatar...",
      success: "Avatar cargado. Recuerda guardar los cambios",
      error: "Error al subir el avatar",
    });

    try {
      const response = await uploadPromise;
      if (response?.url) {
        // Solo actualiza el formulario local; se confirmará en Guardar
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
      showToast("No se encontró el usuario", { type: "error" });
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

    showPromiseToast(updatePromise, {
      pending: "Actualizando información...",
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
            <AvatarPicker
              imageUrl={formData.avatar || ""}
              initials={generateInitials(formData.name || "", formData.last_name || "")}
              isEditing={isEditing}
              loading={uploadLoading}
              onFileSelected={(file) => {
                handleAvatarSelected(file);
              }}
            />
            <p className="text-sm text-gray-500 text-center">
              {isEditing
                ? "Haz clic en la imagen para cambiar tu avatar"
                : "Avatar del perfil"}
            </p>
            {avatarError && (
              <p className="text-sm text-red-500 text-center">
                {avatarError}
              </p>
            )}
          </div>

          {/* Form Fields */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <InputForm
              label="Nombre"
              name="name"
              placeholder="Tu nombre"
              value={formData.name || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
              {/* Apellido */}
            <InputForm
              label="Apellido"
              name="last_name"
              placeholder="Tu apellido"
              value={formData.last_name || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />

            {/* Email */}
            <InputForm
              label="Correo Electrónico"
              name="email"
              placeholder="tu@email.com"
              value={formData.email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />

            {/* Fecha de Nacimiento */}
            <InputForm
              label="Fecha de Nacimiento"
              name="birthday"
              type="date"
              placeholder="YYYY-MM-DD"
              value={formData.birthday || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>

          
          <div className="flex justify-end">
            <div className="flex  space-x-2 w-md">
              {!isEditing ? (
                <ButtonAction text="Editar" onClick={() => setIsEditing(true)} typeAction="edit" />
              ) : (
                <>
                  <ButtonAction
                    onClick={() => {
                      setFormData(initialData);
                      setIsEditing(false);
                      setAvatarError(false);
                    }}
                    text="Cancelar"
                    typeAction="cancel"
                  />
                  {isEditing && (
                    <ButtonAction
                      typeButton="submit"
                      text={isSaving ? "Guardando..." : "Guardar"}
                      disabled={!hasChanges || isSaving}
                      typeAction="save"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};