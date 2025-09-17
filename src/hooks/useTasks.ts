import { useState, useEffect } from 'react';
import { getTasks } from '@/api/generated/tasks/tasks';
import getUser from '@/utils/auth';
import { TaskDto, CreateTaskDto, UpdateTaskDto, UpdateTaskStateDto } from '@/api/generated';

// Crear instancia de las funciones de tasks
const tasksAPI = getTasks();

// Hook para obtener todas las tareas
export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GetAllTasksByUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = getUser.getUser();
      
      if (!user?.id) {
        throw new Error('Usuario no encontrado');
      }

      const response = await tasksAPI.taskControllerGetAllTasks(user.id);
      setTasks(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetAllTasksByUser();
  }, []);

  return {
    data: tasks,
    isLoading,
    error,
    refetch: GetAllTasksByUser,
  };
};

// Hook para crear una nueva tarea
export const useCreateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = async (taskData: CreateTaskDto) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await tasksAPI.taskControllerCreateTask(taskData);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando tarea';
      setError(errorMessage);
      console.error('Error creando tarea:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: createTask,
    isLoading,
    error,
  };
};

// Hook para actualizar una tarea
export const useUpdateTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async ({ id, ...taskData }: UpdateTaskDto & { id: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await tasksAPI.taskControllerUpdateTaskById(id, taskData);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando tarea';
      setError(errorMessage);
      console.error('Error actualizando tarea:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: updateTask,
    isLoading,
    error,
  };
};

// Hook para eliminar una tarea
export const useDeleteTask = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await tasksAPI.taskControllerDeleteTask(id);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error eliminando tarea';
      setError(errorMessage);
      console.error('Error eliminando tarea:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: deleteTask,
    isLoading,
    error,
  };
};

// Hook para actualizar el estado de una tarea
export const useUpdateTaskState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskState = async ({ id, ...stateData }: { id: string } & UpdateTaskStateDto) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await tasksAPI.taskControllerUpdateTaskState(id, stateData);
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando estado de tarea';
      setError(errorMessage);
      console.error('Error actualizando estado de tarea:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate: updateTaskState,
    isLoading,
    error,
  };
};
