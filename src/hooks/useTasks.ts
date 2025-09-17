import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  taskControllerGetAllTasks,
  taskControllerCreateTask,
  taskControllerUpdateTaskById,
  taskControllerDeleteTask,
  taskControllerUpdateTaskState,
  getTaskControllerGetAllTasksQueryOptions,
  getTaskControllerCreateTaskMutationOptions,
  getTaskControllerUpdateTaskByIdMutationOptions,
  getTaskControllerDeleteTaskMutationOptions,
  getTaskControllerUpdateTaskStateMutationOptions,
} from '@/api/generated/tasks/tasks';
import type {
  TaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStateDto,
} from '@/api/generated/models';

// Hook para obtener todas las tareas
export const useTasks = () => {
  return useQuery({
    ...getTaskControllerGetAllTasksQueryOptions(),
  });
};

// Hook para crear una nueva tarea
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...getTaskControllerCreateTaskMutationOptions(),
    onSuccess: () => {
      // Invalidar la query de tareas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['taskControllerGetAllTasks'] });
    },
    onError: (error) => {
      console.error('Error creando tarea:', error);
    },
  });
};

// Hook para actualizar una tarea
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...getTaskControllerUpdateTaskByIdMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskControllerGetAllTasks'] });
    },
    onError: (error) => {
      console.error('Error actualizando tarea:', error);
    },
  });
};

// Hook para eliminar una tarea
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...getTaskControllerDeleteTaskMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskControllerGetAllTasks'] });
    },
    onError: (error) => {
      console.error('Error eliminando tarea:', error);
    },
  });
};

// Hook para actualizar el estado de una tarea
export const useUpdateTaskState = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    ...getTaskControllerUpdateTaskStateMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskControllerGetAllTasks'] });
    },
    onError: (error) => {
      console.error('Error actualizando estado de tarea:', error);
    },
  });
};
