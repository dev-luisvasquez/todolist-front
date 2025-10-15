'use client';
import { TaskDto } from '@/api/generated';
import { useState, useRef, useEffect } from 'react';
import { DateTime } from 'luxon';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CardTaskProps extends TaskDto {
    onEdit?: (task: TaskDto) => void;
    onDelete?: (taskId: string) => void;
    isSelected?: boolean;
    onSelect?: (taskId: string) => void;
}

export const CardTask = ({
    id,
    title,
    description,
    priority,
    state,
    created_at,
    completed_at,
    updated_at,
    userId,
    onEdit,
    onDelete,
    isSelected,
    onSelect,
}: CardTaskProps) => {
    const [showMobileActions, setShowMobileActions] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const removeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const REMOVE_ANIM_MS = 300;

    useEffect(() => {
        return () => {
            if (removeTimeoutRef.current) {
                clearTimeout(removeTimeoutRef.current);
            }
        };
    }, []);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit({ id, title, description, priority, state, created_at, updated_at, userId });
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            // Inicia la animación de salida y luego llama a onDelete
            setIsRemoving(true);
            removeTimeoutRef.current = setTimeout(() => {
                onDelete(id);
            }, REMOVE_ANIM_MS);
        }
    };

    const handleLongPress = () => {
        // En móviles, un long press muestra las acciones
        setShowMobileActions(true);
        if (onSelect) {
            onSelect(id);
        }
    };

    const handleCardClick = () => {
        // En móviles, si las acciones están visibles, las ocultamos
        if (showMobileActions) {
            setShowMobileActions(false);
        }
    };

    // color de la franja izquierda según el estado (más visual, evita repetir la etiqueta de estado)
    const stripeColor =
        state === 'completed'
            ? 'bg-[var(--secondary-green)]'
            : state === 'in_progress'
              ? 'bg-[var(--secondary-cyan)]'
              : 'bg-[var(--secondary-orange)]';

    // estilos de prioridad más llamativos
    const priorityStyle =
        priority === 'high'
            ? 'bg-red-50 text-red-700 ring-1 ring-red-100'
            : priority === 'medium'
              ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100'
              : 'bg-gray-50 text-gray-700 ring-1 ring-gray-100';

    return (
        <div
            className={`
                relative w-full rounded-lg border border-gray-200 shadow-sm p-3 bg-white
                ${isSelected ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                ${showMobileActions ? 'scale-102 shadow-xl' : ''}
                ${isRemoving ? 'animate-fade-out-left animate-duration-300' : 'animate-fade-in-up animate-duration-400 opacity-100 translate-y-0'}
                transition-all duration-300 ease-in-out group
            `}
            onClick={handleCardClick}
            onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress();
            }}
            aria-hidden={isRemoving}
        >
            {/* Franja izquierda que indica el estado (sustituye la etiqueta de estado redundante) */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${stripeColor}`} />

           

            {/* Indicador de drag para móviles */}
            <div className="absolute top-2 left-3 md:hidden text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>

            {/* Contenido: título + prioridad */}
            <div className="flex items-start gap-3">
                <div className="flex-1 pl-4 md:pl-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg md:text-base font-semibold text-gray-900 leading-tight mb-1">{title}</h3>
                        <span
                            className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${priorityStyle}`}
                        >
                            {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                    </div>

                    {/* Descripción más prominente pero truncada */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>

                    {/* Fecha de creación / completado (si aplica) */}
                    <p className="text-xs text-gray-400">
                        Creada:{' '}
                        {created_at
                            ? DateTime.fromISO(created_at).toLocaleString(DateTime.DATETIME_MED)
                            : DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
                    </p>
                    {state === 'completed' && (
                        <p className="text-xs text-gray-400">
                            Completada:{' '}
                            {completed_at
                                ? DateTime.fromISO(completed_at).toLocaleString(DateTime.DATETIME_MED)
                                : DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
                        </p>
                    )}

                    {/* Botones de acción - ahora en la esquina inferior derecha */}
                    <div
                        className={`
                            absolute bottom-2 right-2 flex gap-0.5 transition-all duration-200 z-20
                            ${showMobileActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                            md:opacity-0 md:group-hover:opacity-100
                        `}
                    >
                        <button
                            onClick={handleEdit}
                            className="p-2 md:p-1 text-gray-400 hover:text-[var(--primary-600)] hover:bg-blue-50 rounded transition-colors pointer-events-auto touch-manipulation"
                            title="Ver tarea"
                            disabled={isRemoving}
                        >
                            <EyeIcon className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                        <button
                            onClick={handleEdit}
                            className="p-2 md:p-1 text-gray-400 hover:text-[var(--secondary-cyan)] hover:bg-blue-50 rounded transition-colors pointer-events-auto touch-manipulation"
                            title="Editar tarea"
                            disabled={isRemoving}
                        >
                            <PencilSquareIcon className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 md:p-1 text-gray-400 hover:text-[var(--danger)] hover:bg-red-50 rounded transition-colors pointer-events-auto touch-manipulation"
                            title="Eliminar tarea"
                            disabled={isRemoving}
                        >
                            <TrashIcon className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Instrucciones para móviles */}
            {!showMobileActions && (
                <div className="md:hidden text-xs text-gray-400 mt-2 text-center">
                    Mantén presionado para ver opciones
                </div>
            )}
        </div>
    );
};
