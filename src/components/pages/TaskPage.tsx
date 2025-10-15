import { TasksLists } from "../template/TasksLists";

export const TaskPage = () => {
    return (    
        <div> 
             <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Mis Tareas</h1> 
            <TasksLists/>
        </div>
    )

}