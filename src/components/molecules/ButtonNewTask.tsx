'use client'

import { useDeleteTask } from "@/hooks/useTasks"


export function ButtonNewTask(id: string) {
    const { mutate: deleteTask } = useDeleteTask()
    const handleDelete = async () => {
        try {
            await deleteTask(id);
            // Aquí puedes agregar lógica adicional después de eliminar la tarea, como mostrar una notificación o actualizar la lista de tareas.
        } catch (error) {
            console.error('Error eliminando la tarea:', error);
        }
    };

    return <button onClick={handleDelete}>Eliminar</button>;
}