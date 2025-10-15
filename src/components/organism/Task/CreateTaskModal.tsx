'use client';
import { useState } from 'react';
import { CreateTaskDto, CreateTaskDtoPriority, CreateTaskDtoState } from '@/api/generated';

import Modal from '@/components/atoms/Modal';
import ModalHeader from '@/components/molecules/ModalHeader';
import { InputForm, TextAreaForm, InputSelectForm } from '@/components/atoms/inputs/InputForm';
import { ButtonAction } from '@/components/atoms/buttons/ButtonAction';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: Omit<CreateTaskDto, 'userId'>) => void;
    isLoading?: boolean;
    initialState?: CreateTaskDtoState;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit, isLoading = false, initialState }: CreateTaskModalProps) {
    const getInitialFormState = (): Omit<CreateTaskDto, 'userId'> => ({
        title: '',
        description: '',
        priority: CreateTaskDtoPriority.medium,
        state: initialState ?? CreateTaskDtoState.pending,
    });

    const [formData, setFormData] = useState<Omit<CreateTaskDto, 'userId'>>(getInitialFormState());
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};
        if (!formData.title.trim()) newErrors.title = 'El título es requerido';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit(formData);
        setFormData(getInitialFormState());
    };

    const handleClose = () => {
        setFormData(getInitialFormState());
        setErrors({});
        onClose();
    };

    const handleChange = (field: keyof Omit<CreateTaskDto, 'userId'>, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} id="create_task_modal" ariaLabel="Crear nueva tarea">
            <ModalHeader title="Crear Nueva Tarea" onClose={handleClose} />

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
                    <ButtonAction typeAction="cancel" typeButton="button" text="Cancelar" onClick={handleClose} disabled={isLoading} />
                    <ButtonAction typeAction="save" typeButton="submit" text={isLoading ? 'Creando...' : 'Crear Tarea'} disabled={isLoading} />
                </div>
            </form>
        </Modal>
    );
}
