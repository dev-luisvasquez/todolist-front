'use client'
import { useDroppable } from '@dnd-kit/core';
import { TaskDto, TaskDtoState } from '@/api/generated';
import { DraggableTask } from './DraggableTask';

interface DroppableColumnProps {
    id: TaskDtoState;
    title: string;
    tasks: TaskDto[];
    onEdit?: (task: TaskDto) => void;
    onDelete?: (taskId: string) => void;
}

export const DroppableColumn = ({ id, title, tasks, onEdit, onDelete }: DroppableColumnProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    const getColumnStyles = () => {
        switch (id) {
            case TaskDtoState.pending:
                return 'bg-gray-50 border-gray-200';
            case TaskDtoState.in_progress:
                return 'bg-blue-50 border-blue-200';
            case TaskDtoState.completed:
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getTitleStyles = () => {
        switch (id) {
            case TaskDtoState.pending:
                return 'text-gray-700';
            case TaskDtoState.in_progress:
                return 'text-blue-700';
            case TaskDtoState.completed:
                return 'text-green-700';
            default:
                return 'text-gray-700';
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`
                min-h-[500px] max-h-[600px] overflow-y-auto p-4 rounded-lg border-2 transition-all duration-300 ease-out
                ${getColumnStyles()}
                ${isOver ? 'border-blue-400 bg-blue-100 scale-105 shadow-lg' : ''}
            `}
        >
            <h2 className={`text-lg font-semibold mb-4 ${getTitleStyles()}`}>
                {title} ({tasks.length})
            </h2>
            
            {/* Indicador visual cuando se está arrastrando sobre la columna */}
            {isOver && (
                <div className="absolute inset-0 bg-blue-200 bg-opacity-30 rounded-lg border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                        Soltar aquí
                    </div>
                </div>
            )}
            
            <div className="space-y-3 relative z-10">
                {tasks.map((task) => (
                    <DraggableTask 
                        key={task.id} 
                        task={task} 
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
                
                {tasks.length === 0 && (
                    <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        No hay tareas en {title.toLowerCase()}
                    </div>
                )}
            </div>
        </div>
    );
};
