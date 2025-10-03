'use client'
import { TaskDto } from "@/api/generated";
import { useState } from "react";
import  {DateTime} from "luxon";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface CardTaskProps extends TaskDto {
    onEdit?: (task: TaskDto) => void;
    onDelete?: (taskId: string) => void;
    isSelected?: boolean;
    onSelect?: (taskId: string) => void;
}

export const CardTask = ({ id, title, description, priority, state, created_at, completed_at, updated_at, userId, onEdit, onDelete, isSelected, onSelect }: CardTaskProps) => {
    const [showMobileActions, setShowMobileActions] = useState(false);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit({ id, title, description, priority, state, created_at, updated_at, userId });
        } else {
            // Fallback para pruebas
            alert(`Editar tarea: ${title}`);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(id);
        } else {
            // Fallback para pruebas
            alert(`Eliminar tarea: ${title}`);
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

    return (
        <div 
            className={`
                w-full rounded-lg border border-gray-300 shadow-sm p-3 bg-white hover:shadow-md transition-all duration-200 relative group
                ${isSelected ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
                ${showMobileActions ? 'shadow-lg scale-105' : ''}
            `}
            onClick={handleCardClick}
            onContextMenu={(e) => {
                e.preventDefault();
                handleLongPress();
            }}
        >
            {/* Botones de acción - aparecen en hover en desktop y siempre visible en mobile cuando están activos */}
            <div className={`
                absolute top-2 right-2 flex gap-0.5 transition-all duration-200 z-20
                ${showMobileActions ? 'opacity-100' : 'opacity-100 group-hover:opacity-100'}
                md:opacity-0 md:group-hover:opacity-100
            `}>
                
                <button 
                    onClick={handleEdit}
                    className="p-2 md:p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors pointer-events-auto touch-manipulation"
                    title="Editar tarea"
                >
                    <PencilSquareIcon className="w-5 h-5 md:w-4 md:h-4" />
                </button>
                <button 
                    onClick={handleDelete}
                    className="p-2 md:p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors pointer-events-auto touch-manipulation"
                    title="Eliminar tarea"
                >
                    <TrashIcon className="w-5 h-5 md:w-4 md:h-4" />
                </button>
            </div>

            {/* Indicador de drag para móviles */}
            <div className="absolute top-2 left-2 md:hidden text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>

            {/* Título - con padding para evitar overlap con botones */}
            <h3 className="text-base font-semibold text-gray-900 mb-1 pr-20 pl-6 md:pl-0">{title}</h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 pl-6 md:pl-0">
                {description}
            </p>

            {/* Estado + Prioridad */}
            <div className="flex gap-2 mb-2 pl-6 md:pl-0">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                            state === "completed"
                                ? "bg-green-100 text-green-800"
                                : state === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {state === "completed" ? "Completada" : state === "in_progress" ? "En Progreso" : "Pendiente"}
                </span>

                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                            priority === "high"
                                ? "bg-red-100 text-red-700"
                                : priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {priority === "high" ? "Alta" : priority === "medium" ? "Media" : "Baja"}
                </span>
            </div>

            {/* Fecha */}
            <p className="text-xs text-gray-400 pl-6 md:pl-0">
                Creada: {created_at ? DateTime.fromISO(created_at).toLocaleString(DateTime.DATETIME_MED) : DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
            </p>
            {state === "completed" && (
               <p className="text-xs text-gray-400 pl-6 md:pl-0">
                Completada: { completed_at ? DateTime.fromISO(completed_at).toLocaleString(DateTime.DATETIME_MED) : DateTime.now().toLocaleString(DateTime.DATETIME_MED)}
            </p> 
            )}
            

            {/* Instrucciones para móviles */}
            {!showMobileActions && (
                <div className="md:hidden text-xs text-gray-400 mt-2 text-center">
                    Mantén presionado para ver opciones
                </div>
            )}
        </div>
    );
};


