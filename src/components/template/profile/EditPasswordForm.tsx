// Componentes
import { ButtonAction } from "@/components/atoms/buttons/ButtonAction";
import { InputPasswordForm } from "@/components/atoms/InputForm";

// Hooks
import { useState } from "react";

// Toast
import { showToast, showPromiseToast } from "@/utils/Alerts/toastAlerts";


// API 
import { useChangePassword } from "@/hooks/useAuth";

// Validaciones
import { passwordSchema } from "@/validation/validationForm";
import { ValidationError } from "yup";




export const EditPasswordForm = () => {
    const [passwords, setNewPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const { mutate: changePassword, isLoading, error: _error } = useChangePassword();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPassword((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mapeo al esquema (currentPassword vs oldPassword)
        const dataToValidate = {
            currentPassword: passwords.oldPassword,
            newPassword: passwords.newPassword,
            confirmNewPassword: passwords.confirmNewPassword,
        };

        try {
            // Valida con Yup (reúne todos los errores)
            await passwordSchema.validate(dataToValidate, { abortEarly: false });

            // Si pasa la validación, procede con el cambio
            await showPromiseToast(
                changePassword(passwords.oldPassword, passwords.newPassword),
                {
                    pending: "Actualizando contraseña...",
                    success: "Contraseña actualizada",
                    error: "Error al actualizar la contraseña, intente de nuevo",
                }
            );

            setNewPassword({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                // Muestra todos los mensajes de error de Yup
                showToast(err.errors.join("\n"), { type: "error" });
                return;
            }
            return;
        }
    }

    const isTyping = Object.values(passwords).some((v) => v.trim() !== "");

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Cambio de Contraseña</h2>
            <form className="space-y-4" onSubmit={handleChangePassword}>
                <InputPasswordForm
                    label="Contraseña Actual"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handleInputChange}
                />
                <InputPasswordForm
                    label="Nueva Contraseña"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handleInputChange}
                />
                <InputPasswordForm
                    label="Confirmar Nueva Contraseña"
                    name="confirmNewPassword"
                    value={passwords.confirmNewPassword}
                    onChange={handleInputChange}
                />
                <div className="flex justify-end">
                    {isLoading ? (
                        <ButtonAction
                            typeButton="submit"
                            text="Actualizando Contraseña..."
                            typeAction="save"
                            disabled={true}
                        />
                    ) : (
                        <ButtonAction
                            typeButton="submit"
                            text="Actualizar Contraseña"
                            typeAction="save"
                            disabled={!isTyping}
                        />
                    )}
                </div>
            </form >
        </div >
    );
};