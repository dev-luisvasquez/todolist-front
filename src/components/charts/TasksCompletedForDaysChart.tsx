'use client';

import { KpiControllerGetCompletedForDays200, KpiControllerGetCompletedForDays200TasksByDayItem } from "@/api/generated";
import { Bar } from "react-chartjs-2";
import { useKpiCompletedTasksForDays } from "@/hooks/useKpi";
import { FormatDate } from "@/utils/translate";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const TasksCompletedForDaysChart = () => {
    const [days, setDays] = useState<number>(7);
    const [data, setData] = useState<KpiControllerGetCompletedForDays200TasksByDayItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleDaysChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDays(parseInt(event.target.value, 10));
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await useKpiCompletedTasksForDays(days);
                setData(response.tasksByDay || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [days]);

    const chartData = {
        labels: data.map(item => FormatDate(item.dateISO ?? '') || ''),
        datasets: [
            {
                label: 'Tareas Completadas',
                data: data.map(item => item.count || 0),
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `Tareas completadas durante los últimos ${days} días`,
                font: {
                    size: 16,
                    weight: 'bold',
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y} tareas`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad de Tareas'
                },
                ticks: {
                    stepSize: 1
                }
            },
        },
    };

    return (
        <div className="shadow-lg p-4 w-full min-h-[400px] bg-white rounded-lg text-center hover:scale-102 transition-transform">
            <div className="justify-start flex gap-2">
                <label htmlFor="days">Seleccionar período </label>
                <select onChange={handleDaysChange} value={days} className="mb-4  border rounded">
                    <option value={7}>7 días</option>
                    <option value={15}>15 días</option>
                    <option value={30}>30 días</option>
                </select>
            </div>

            <div className="w-full h-80">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-600">Cargando gráfico...</div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-500">No hay datos disponibles para el período seleccionado</div>
                    </div>
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>
        </div>
    );
}