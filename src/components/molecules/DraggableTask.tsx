'use client'
import { useDraggable } from '@dnd-kit/core';
import { TaskDto } from '@/api/generated';
import { CardTask } from './CardTaks';
import { useRef, useState } from 'react';

interface DraggableTaskProps {
    task: TaskDto;
    onEdit?: (task: TaskDto) => void;
    onDelete?: (taskId: string) => void;
}

export const DraggableTask = ({ task, onEdit, onDelete }: DraggableTaskProps) => {
    const dragRef = useRef<HTMLDivElement>(null);
    const [isDragHint, setIsDragHint] = useState(false);
    const [touchStartTime, setTouchStartTime] = useState(0);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.id,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Función para manejar el inicio del drag solo desde ciertas áreas
    const handlePointerDown = (e: React.PointerEvent) => {
        // Si el click es en un botón, no iniciar drag
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
            return;
        }
        
        // Para touch, guardar el tiempo de inicio
        if (e.pointerType === 'touch') {
            setTouchStartTime(Date.now());
        }
        
        // Llamar al listener original del drag
        if (listeners?.onPointerDown) {
            listeners.onPointerDown(e);
        }
    };

    // Manejar touch para mostrar hint de drag
    const handleTouchStart = () => {
        setTouchStartTime(Date.now());
        // Mostrar hint después de un tiempo
        setTimeout(() => {
            if (Date.now() - touchStartTime >= 300) {
                setIsDragHint(true);
            }
        }, 300);
    };

    const handleTouchEnd = () => {
        setIsDragHint(false);
        setTouchStartTime(0);
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                if (dragRef.current) {
                    dragRef.current = node;
                }
            }}
            style={style}
            className={`
                ${isDragging ? 'opacity-70 scale-105 rotate-3' : ''}
                ${isDragHint ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                transition-all duration-200 ease-out
            `}
        >
            {/* Indicador visual para móviles */}
            {isDragHint && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-30 animate-pulse">
                    Arrastra para mover
                </div>
            )}
            
            {/* Área draggable personalizada */}
            <div
                {...attributes}
                onPointerDown={handlePointerDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="cursor-grab active:cursor-grabbing touch-manipulation"
                style={{ touchAction: 'none' }} // Importante para móviles
            >
                <CardTask {...task} onEdit={onEdit} onDelete={onDelete} />
            </div>
        </div>
    );
};
