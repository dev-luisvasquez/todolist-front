'use client'
import { Fragment, useState, useEffect } from 'react'
import { Dialog, DialogPanel, Transition, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { UpdateTaskDto, UpdateTaskDtoPriority, UpdateTaskDtoState, TaskDto } from '@/api/generated'

interface UpdateTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (taskData: UpdateTaskDto) => void
    task: TaskDto | null
    isLoading?: boolean
}

export default function UpdateTaskModal({ isOpen, onClose, onSubmit, task, isLoading = false }: UpdateTaskModalProps) {
    const [formData, setFormData] = useState<UpdateTaskDto>({
        title: '',
        description: '',
        priority: UpdateTaskDtoPriority.medium,
        state: UpdateTaskDtoState.pending
    })

    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Mapear los datos de la tarea cuando se abra el modal
    useEffect(() => {
        if (task && isOpen) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority as UpdateTaskDtoPriority || UpdateTaskDtoPriority.medium,
                state: task.state as UpdateTaskDtoState || UpdateTaskDtoState.pending
            })
        }
    }, [task, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Validación simple
        const newErrors: { [key: string]: string } = {}
        
        if (!formData.title?.trim()) {
            newErrors.title = 'El título es requerido'
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        
        setErrors({})
        onSubmit(formData)
    }

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            priority: UpdateTaskDtoPriority.medium,
            state: UpdateTaskDtoState.pending
        })
        setErrors({})
        onClose()
    }

    const handleChange = (field: keyof UpdateTaskDto, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-grey-700 bg-opacity-25" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Editar Tarea
                                    </DialogTitle>
                                    <button
                                        type="button"
                                        className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Título */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                errors.title ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Ingresa el título de la tarea"
                                            disabled={isLoading}
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                        )}
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Describe la tarea (opcional)"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Prioridad */}
                                    <div>
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                            Prioridad
                                        </label>
                                        <select
                                            id="priority"
                                            value={formData.priority}
                                            onChange={(e) => handleChange('priority', e.target.value as UpdateTaskDtoPriority)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isLoading}
                                        >
                                            <option value={UpdateTaskDtoPriority.low}>Baja</option>
                                            <option value={UpdateTaskDtoPriority.medium}>Media</option>
                                            <option value={UpdateTaskDtoPriority.high}>Alta</option>
                                        </select>
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <select
                                            id="state"
                                            value={formData.state}
                                            onChange={(e) => handleChange('state', e.target.value as UpdateTaskDtoState)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            disabled={isLoading}
                                        >
                                            <option value={UpdateTaskDtoState.pending}>Pendiente</option>
                                            <option value={UpdateTaskDtoState.in_progress}>En Progreso</option>
                                            <option value={UpdateTaskDtoState.completed}>Completada</option>
                                        </select>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                                            onClick={handleClose}
                                            disabled={isLoading}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Actualizando...' : 'Actualizar Tarea'}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
