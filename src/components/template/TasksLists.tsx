'use client'
import { useState, useMemo, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { CardTask } from "../molecules/CardTaks";
import { useTasks, useUpdateTaskState, useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import { TaskDto, TaskDtoState, CreateTaskDto, UpdateTaskDto } from "@/api/generated";
import { DroppableColumn } from "../molecules/DroppableColumn";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateTaskModal from "../molecules/CreateTaskModal";
import UpdateTaskModal from "../molecules/UpdateTaskModal";
import getUser from "@/utils/auth";
import { DateTime } from "luxon";

export const TasksLists = () => {
    const [activeTask, setActiveTask] = useState<TaskDto | null>(null);
    const [editingTask, setEditingTask] = useState<TaskDto | null>(null);
    const [optimisticTasks, setOptimisticTasks] = useState<TaskDto[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Usar el hook que ahora usa Axios directamente
    const { data: serverTasks, isLoading, error, refetch } = useTasks();
    const { mutate: updateTaskState } = useUpdateTaskState();
    const { mutate: createTask, isLoading: isCreatingTask } = useCreateTask();
    const { mutate: deleteTask } = useDeleteTask();
    const { mutate: updateTask } = useUpdateTask();

    // Sincronizar tareas del servidor con el estado optimista
    useEffect(() => {
        if (serverTasks) {
            setOptimisticTasks(serverTasks);
        }
    }, [serverTasks]);

    // Usar las tareas optimistas para el render
    const tasks = optimisticTasks;

    // Organizar tareas por estado
    const tasksByState = useMemo(() => {
        if (!tasks) return { pending: [], in_progress: [], completed: [] };

        return {
            pending: tasks.filter(task => task.state === TaskDtoState.pending),
            in_progress: tasks.filter(task => task.state === TaskDtoState.in_progress),
            completed: tasks.filter(task => task.state === TaskDtoState.completed)
        };
    }, [tasks]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks?.find(t => t.id === active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const newState = over.id as TaskDtoState;

        // Encontrar la tarea actual
        const currentTask = tasks?.find(t => t.id === taskId);
        if (!currentTask) return;

        // Si el estado no cambió, no hacer nada
        if (currentTask.state === newState) return;

        // Guardar el estado anterior para poder revertir en caso de error
        const previousTasks = [...optimisticTasks];

        // Actualización optimista: actualizar inmediatamente la UI
        setOptimisticTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, state: newState }
                    : task
            )
        );

        try {
            // Actualizar el estado de la tarea en el backend
            await updateTaskState({
                id: taskId,
                state: newState
            });

            // Opcional: refrescar desde el servidor para sincronizar
            // Comentamos esto para evitar el pestañeo innecesario
            // refetch();
        } catch (error) {
            console.error('Error al actualizar el estado de la tarea:', error);

            // Revertir la actualización optimista en caso de error
            setOptimisticTasks(previousTasks);

            // Mostrar mensaje de error al usuario
            // TODO: Implementar un sistema de notificaciones
            alert('Error al actualizar la tarea. Se ha revertido el cambio.');
        }
    };

    const handleEditTask = (taskData: UpdateTaskDto) => {
        if (!editingTask?.id) return;
        try {
            const updatedTask = { ...editingTask, ...taskData };
            updateTask(updatedTask);
            setEditingTask(null); // Cerrar el modal después de actualizar
            serverTasks && setOptimisticTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            alert('Error al actualizar la tarea');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            // Actualización optimista: remover la tarea inmediatamente
            setOptimisticTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            await deleteTask(taskId);
        } catch (error) {
            // Revertir en caso de error
            setOptimisticTasks(optimisticTasks);
            alert('Error al eliminar la tarea.');
        }
    };

    const handleCreateTask = async (taskData: Omit<CreateTaskDto, 'userId'>) => {
        try {
            const user = getUser.getUser();
            if (!user?.id) {
                alert('Error: Usuario no autenticado');
                return;
            }

            const fullTaskData: CreateTaskDto = {
                ...taskData,
                userId: user.id
            };

            // Crear una tarea temporal para la actualización optimista
            const tempTask: TaskDto = {
                id: `temp-${Date.now()}`, // ID temporal
                title: taskData.title,
                description: taskData.description || '',
                priority: taskData.priority,
                state: taskData.state,
                userId: user.id,
                created_at: DateTime.now().toISO(),
                updated_at: DateTime.now().toISO()
            };

            

            // Actualización optimista: agregar la tarea inmediatamente
            setOptimisticTasks(prevTasks => [...prevTasks, tempTask]);
            
            // Cerrar el modal inmediatamente
            setIsCreateModalOpen(false);

            // Crear la tarea en el backend
            await createTask(fullTaskData);
            
            
            
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            
            // Revertir la actualización optimista en caso de error
            setOptimisticTasks(prevTasks => 
                prevTasks.filter(task => !task.id.startsWith('temp-'))
            );
            
            alert('Error al crear la tarea');
        }
    };

    if (error) {
        return <div className="text-red-500">Error al cargar las tareas: {error}</div>;
    }

    if (isLoading) {
        return (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="min-h-[500px] p-4 rounded-lg border-2 border-gray-300 bg-gray-50 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
                <div className="min-h-[500px] p-4 rounded-lg border-2 border-gray-300 bg-gray-50 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
                <div className="min-h-[500px] p-4 rounded-lg border-2 border-gray-300 bg-gray-50 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="space-y-3">
                        {[...Array(1)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold">Lista de tareas</h1>
            <button onClick={() => setIsCreateModalOpen(true)} className="my-4 border p-3 border-gray-300 flex bg-white text-gray-700 hover:bg-gray-100 rounded">Nueva Tarea <PlusIcon className="w-6 font-bold ml-2" /></button>
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {/* Instrucciones para móviles */}
                <div className="md:hidden mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 text-center">
                        💡 <strong>Móvil:</strong> Mantén presionado una tarea para ver opciones o arrástrala entre columnas
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Columna Pendientes */}
                    <DroppableColumn
                        id={TaskDtoState.pending}
                        title="Pendientes"
                        tasks={tasksByState.pending}
                        onEdit={(task) => setEditingTask(task)}
                        onDelete={handleDeleteTask}
                    />

                    {/* Columna En Progreso */}
                    <DroppableColumn
                        id={TaskDtoState.in_progress}
                        title="En Progreso"
                        tasks={tasksByState.in_progress}
                        onEdit={(task) => setEditingTask(task)}
                        onDelete={handleDeleteTask}
                    />

                    {/* Columna Completadas */}
                    <DroppableColumn
                        id={TaskDtoState.completed}
                        title="Completadas"
                        tasks={tasksByState.completed}
                        onEdit={(task) => setEditingTask(task)}
                        onDelete={handleDeleteTask}
                    />
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="rotate-3 scale-105 shadow-2xl">
                            <CardTask {...activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Modal para crear tarea */}
            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTask}
                isLoading={isCreatingTask}
            />
           
            <UpdateTaskModal
                isOpen={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleEditTask}
                isLoading={isCreatingTask}
            />
        </>

    );
}