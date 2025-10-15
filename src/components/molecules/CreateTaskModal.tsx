'use client';
import { useEffect, useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CreateTaskDto, CreateTaskDtoPriority, CreateTaskDtoState } from '@/api/generated';

// Components
import { InputForm, TextAreaForm, InputSelectForm } from '../atoms/inputs/InputForm';
import { ButtonAction } from '../atoms/buttons/ButtonAction';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: Omit<CreateTaskDto, 'userId'>) => void;
    isLoading?: boolean;
    initialState?: CreateTaskDtoState;
}

export default function CreateTaskModal({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    initialState,
}: CreateTaskModalProps) {
    // Función para obtener el estado inicial del formulario
    const getInitialFormState = (): Omit<CreateTaskDto, 'userId'> => ({
        title: '',
        description: '',
        priority: CreateTaskDtoPriority.medium,
        state: initialState ?? CreateTaskDtoState.pending,
    });

    const [formData, setFormData] = useState<Omit<CreateTaskDto, 'userId'>>(getInitialFormState());

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Referencia al dialog HTML
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    // Sincronizar apertura/cierre del dialog con la prop isOpen
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            // Inicializar el formulario con el initialState actual al abrir
            setFormData({
                title: '',
                description: '',
                priority: CreateTaskDtoPriority.medium,
                state: initialState ?? CreateTaskDtoState.pending,
            });

            // showModal puede lanzar si ya está abierto, por eso try/catch
            try {
                dialog.showModal();
            } catch {
                // ignore
            }
        } else {
            if (dialog.open) dialog.close();
        }
    }, [isOpen, initialState]);

    // Escuchar el evento native 'close' del dialog para sincronizar estado local y llamar onClose
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleNativeClose = () => {
            // Reseteamos el formulario y errores cuando se cierra el diálogo
            setFormData(getInitialFormState());
            setErrors({});
            onClose();
        };

        dialog.addEventListener('close', handleNativeClose);
        return () => dialog.removeEventListener('close', handleNativeClose);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación simple
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit(formData);
        // Limpiar el formulario después de enviar y cerrar el dialog
        setFormData(getInitialFormState());
        if (dialogRef.current?.open) dialogRef.current.close();
    };

    const handleClose = () => {
        setFormData(getInitialFormState());
        setErrors({});
        if (dialogRef.current?.open) {
            dialogRef.current.close();
        } else {
            onClose();
        }
    };

    const handleChange = (field: keyof Omit<CreateTaskDto, 'userId'>, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Renderizamos siempre el dialog; su apertura está controlada por isOpen y la API del dialog
    return (
        <dialog id="create_task_modal" ref={dialogRef} className="modal sm:modal-middle" aria-label="Crear nueva tarea">
            <div className="modal-box w-full max-w-md rounded-2xl p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium leading-6 text-black">
                        Crear Nueva Tarea
                    </h3>
                    <button
                        type="button"
                        className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleClose}
                        aria-label="Cerrar"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputForm
                        name="title"
                        type="text"
                        label="Título *"
                        required
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Ingresa el título de la tarea"
                        disabled={isLoading}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                    <TextAreaForm
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Describe la tarea (opcional)"
                    />

                    <InputSelectForm
                        name="priority"
                        label="Prioridad"
                        options={[
                            { value: CreateTaskDtoPriority.low, label: 'Baja' },
                            { value: CreateTaskDtoPriority.medium, label: 'Media' },
                            { value: CreateTaskDtoPriority.high, label: 'Alta' },
                        ]}
                        value={formData.priority}
                        onChange={(e) => handleChange('priority', e.target.value as CreateTaskDtoPriority)}
                        disabled={isLoading}
                    />

                    <div className="flex gap-3 pt-4">
                       
                        <ButtonAction
                            typeAction='cancel'
                            typeButton='button'
                            text='Cancelar'
                            onClick={handleClose}
                            disabled={isLoading}

                        />
                        <ButtonAction
                            typeAction='save'
                            typeButton='submit'
                            text={isLoading ? 'Creando...' : 'Crear Tarea'}
                            disabled={isLoading}

                        />
                        
                    </div>
                </form>
            </div>
        </dialog>
    );
}
