'use client';

import {
    TasksByPriorityChart,
    AvgTimeCompletedChart,
    TasksCompletedForDaysChart,
    TasksDistributionChart
} from "@/components/charts/index";
import { useGlobalUser } from "@/hooks/useGlobalUser";

const Home = () => {
    const { user, isLoading } = useGlobalUser();

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <div>No hay usuario autenticado.</div>;
    }
    return (
        <div>
            <h1 className="text-3xl font-semibold mb-3">Bienvenido de vuelta <strong>{user.name} {user.last_name}</strong> 😊</h1>
            <section className="mb-8 p-4 bg-white rounded-lg shadow">
                <h1 className="text-xl font-semibold">Tareas por prioridad</h1>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-1 lg:col-span-3">
                        <AvgTimeCompletedChart />
                    </div>
                    <div className="col-span-1 md:col-span-1 lg:col-span-1">
                        <TasksByPriorityChart />
                    </div>

                </div>
            </section>


            <section className="mb-8 p-4 bg-white rounded-lg shadow">
                <h1 className="text-xl font-semibold">Tareas completadas</h1>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="col-span-1 md:col-span-1 lg:col-span-3">
                        <TasksCompletedForDaysChart />
                    </div>
                    <div className="col-span-1 md:col-span-1 lg:col-span-1">
                        <TasksDistributionChart />
                    </div>


                </div>
            </section>
        </div>
    );
}
export default Home;