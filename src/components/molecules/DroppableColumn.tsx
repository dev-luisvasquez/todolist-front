'use client';
import { useDroppable } from '@dnd-kit/core';
import { TaskDto, TaskDtoState } from '@/api/generated';
import { DraggableTask } from './DraggableTask';

interface DroppableColumnProps {
    id: TaskDtoState;
    title: string;
    tasks: TaskDto[];
    onEdit?: (task: TaskDto) => void;
    onDelete?: (taskId: string) => void;
    onAdd?: (state: TaskDtoState) => void; // nuevo: recibe el estado de la columna
}

export const DroppableColumn = ({ id, title, tasks, onEdit, onDelete, onAdd }: DroppableColumnProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    const getColumnStyles = () => {
        return '';
    };

    const getTabColor = () => {
        switch (id) {
            case TaskDtoState.pending:
                return 'bg-[var(--secondary-orange)]';
            case TaskDtoState.in_progress:
                return 'bg-[var(--secondary-cyan)]';
            case TaskDtoState.completed:
                return 'bg-[var(--secondary-green)]';
            default:
                return 'bg-gray-300';
        }
    };


    return (
        <div
            ref={setNodeRef}
            className={`
                relative  min-h-[75vh] shadow-xl p-6 pt-12 rounded-lg border border-gray-300 transition-all duration-300 ease-out
                overflow-visible
                ${getColumnStyles()}
                ${isOver ? 'scale-105 shadow-lg' : ''}
            `}
        >
            {/* Pestaña superior mejorada (centrada, botón al final) */}
            <div
                className={`absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 z-30 shadow-sm ${getTabColor()} flex items-center justify-between gap-3 w-[min(92%,420px)] max-w-[420px]`}
            >
                <div className="flex items-center gap-3">
                    <h2 className={'text-sm font-semibold text-white'}>{title}</h2>
                    <div className={`px-2 py-[2px] w-6 h-6 rounded-2xl text-center text-white shadow-sm bg-white/20 text-sm`}>
                        {tasks.length}
                    </div>
                </div>

                {/* Botón para crear nueva tarea (alineado al final, texto dentro de la burbuja) */}
                <button
                    type="button"
                    onClick={() => onAdd && onAdd(id)}
                    title={`Agregar tarea a ${title}`}
                    className={
                        `flex items-center gap-2 px-3 py-1.5 h-8 shadow-sm justify-center rounded-full bg-white/10 hover:bg-white/20
                        transition duration-150 ease-in-out text-white
                        active:scale-95 active:translate-y-0.5 active:opacity-90
                        focus:outline-none focus:ring-2 focus:ring-white/25`
                    }
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="text-white text-sm font-medium whitespace-nowrap">nueva tarea</span>
                </button>
            </div>

            {/* Indicador visual cuando se está arrastrando sobre la columna */}
            {isOver && (
                <div
                    className={`absolute inset-0 ${getTabColor()} bg-opacity-30 rounded-lg flex items-center justify-center pointer-events-none z-20`}
                >
                    <div className="bg-[var(--neutral)] text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                        Soltar aquí
                    </div>
                </div>
            )}
            <div className="overflow-y-auto max-h-[520px] pr-1">
                <div className="space-y-3 relative z-10">
                    {tasks.map((task) => (
                        <DraggableTask key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                            No hay tareas en {title.toLowerCase()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
