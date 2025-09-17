'use client';

import { useTasks, useCreateTask, useUpdateTaskState, useDeleteTask } from '@/hooks/useTasks';
import { useState } from 'react';
import type { CreateTaskDto, TaskDto } from '@/api/generated/models';

export default function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskStateMutation = useUpdateTaskState();
  const deleteTaskMutation = useDeleteTask();

  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<Omit<CreateTaskDto, 'userId'>>({
    title: '',
    description: '',
    priority: 'medium',
    state: 'pending',
  });

  // Simular obtener userId del localStorage
  const userId = 'test-user-id'; // En una app real, esto vendría del contexto de auth

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: CreateTaskDto = {
      ...newTask,
      userId,
    };
    
    await createTaskMutation.mutateAsync({ data: taskData });
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      state: 'pending',
    });
    setIsCreating(false);
  };

  const handleStateChange = (taskId: string, newState: 'pending' | 'in_progress' | 'completed') => {
    updateTaskStateMutation.mutate({
      id: taskId,
      data: { state: newState },
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTaskMutation.mutate({ id: taskId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error al cargar las tareas. Por favor, intenta de nuevo.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Nueva Tarea
        </button>
      </div>

      {/* Formulario para crear nueva tarea */}
      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Tarea</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={newTask.description || ''}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {createTaskMutation.isPending ? 'Creando...' : 'Crear Tarea'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="space-y-4">
        {tasks && tasks.length > 0 ? (
          tasks.map((task: TaskDto) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                    <select
                      value={task.state}
                      onChange={(e) => handleStateChange(task.id, e.target.value as any)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No hay tareas disponibles. ¡Crea tu primera tarea!
          </div>
        )}
      </div>
    </div>
  );
}
