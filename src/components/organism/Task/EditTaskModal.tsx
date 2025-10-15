'use client';
import { useEffect, useState } from 'react';
import { UpdateTaskDto, UpdateTaskDtoPriority, UpdateTaskDtoState, TaskDto } from '@/api/generated';

import Modal from '@/components/atoms/Modal';
import ModalHeader from '@/components/molecules/ModalHeader';
import { InputForm, TextAreaForm, InputSelectForm } from '@/components/atoms/inputs/InputForm';
import { ButtonAction } from '@/components/atoms/buttons/ButtonAction';

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: UpdateTaskDto) => void;
    task: TaskDto | null;
    isLoading?: boolean;
}

export default function EditTaskModal({ isOpen, onClose, onSubmit, task, isLoading = false }: EditTaskModalProps) {
    const getInitialFormState = (): UpdateTaskDto => ({
        title: '',
        description: '',
        priority: UpdateTaskDtoPriority.medium,
        state: UpdateTaskDtoState.pending,
    });

    const [formData, setFormData] = useState<UpdateTaskDto>(getInitialFormState());
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Mapear los datos de la tarea cuando se abra el modal
    useEffect(() => {
        if (task && isOpen) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: (task.priority as UpdateTaskDtoPriority) || UpdateTaskDtoPriority.medium,
                state: (task.state as UpdateTaskDtoState) || UpdateTaskDtoState.pending,
            });
        } else if (!isOpen) {
            setFormData(getInitialFormState());
            setErrors({});
        }
    }, [task, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};
        if (!formData.title?.trim()) newErrors.title = 'El título es requerido';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData(getInitialFormState());
        setErrors({});
        onClose();
    };

    const handleChange = (field: keyof UpdateTaskDto, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} id="edit_task_modal" ariaLabel="Editar tarea">
            <ModalHeader title="Editar Tarea" onClose={handleClose} />

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
                        { value: UpdateTaskDtoPriority.low, label: 'Baja' },
                        { value: UpdateTaskDtoPriority.medium, label: 'Media' },
                        { value: UpdateTaskDtoPriority.high, label: 'Alta' },
                    ]}
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as UpdateTaskDtoPriority)}
                    disabled={isLoading}
                />
                <div className="flex gap-3 pt-4">
                    <ButtonAction typeAction="cancel" typeButton="button" text="Cancelar" onClick={handleClose} disabled={isLoading} />
                    <ButtonAction typeAction="save" typeButton="submit" text={isLoading ? 'Actualizando...' : 'Actualizar Tarea'} disabled={isLoading} />
                </div>
            </form>
        </Modal>
    );
}
