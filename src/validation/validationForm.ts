import * as yup from 'yup';

export const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('La contraseña actual es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres'),
    newPassword: yup.string().required('La nueva contraseña es obligatoria').min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
    confirmNewPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Las contraseñas deben coincidir')
        .required('Por favor confirma la nueva contraseña'),
});