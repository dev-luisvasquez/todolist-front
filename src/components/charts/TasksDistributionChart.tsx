'use client';

import { TaskDtoState } from "@/api/generated";
import { Doughnut } from "react-chartjs-2";
import { useKpiDistributionTasks } from "@/hooks/useKpi";
import { useEffect, useState } from "react";
import { TranslateState} from "@/utils/translate";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Colores para el gráfico donut
const COLORS = {
    'pending': '#fbbf24', // Amarillo
    'in_progress': '#3b82f6', // Azul
    'completed': '#10b981', // Verde  
};

// Función para obtener nombres de estado más amigables
const getStateName = (state: string): string => {
    const stateNames: Record<string, string> = {
        'PENDING': 'Pendientes',
        'IN_PROGRESS': 'En Progreso',
        'COMPLETED': 'Completadas',
       
    };
    return stateNames[state] || state;
};

interface ChartData {
    name: string;
    value: number;
    color: string;
    [key: string]: any;
}

export const TasksDistributionChart = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await useKpiDistributionTasks();
                console.log('Chart data result:', result);
                
                if (result && result.distribution) {
                    const transformedData: ChartData[] = result.distribution.map((item) => ({
                        name: TranslateState(item.state || ''),
                        value: item.count || 0,
                        color: COLORS[item.state as keyof typeof COLORS] || '#6b7280'
                    }));
                    
                    setChartData(transformedData);
                    setTotal(result.total || 0);
                } else {
                    setChartData([]);
                    setTotal(0);
                }
            } catch (err) {
                setError('Error al cargar los datos del gráfico');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartJsData = {
        labels: chartData.map(item => item.name),
        datasets: [
            {
                data: chartData.map(item => item.value),
                backgroundColor: chartData.map(item => item.color),
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                },
            },
            title: {
                display: true,
                text: 'Distribución de Tareas',
                font: {
                    size: 16,
                    weight: 'bold',
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
                        return `${label}: ${value} tareas (${percentage}%)`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 2,
            },
        },
    };

    return (
        <div className="shadow-lg p-4 w-full min-h-[350px] bg-white rounded-lg text-center hover:scale-102 transition-transform">
            
            <div className="relative w-full h-80 mt-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Cargando gráfico...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg">
                            {error}
                        </div>
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">No hay datos disponibles</div>
                    </div>
                ) : (
                    <>
                        <Doughnut data={chartJsData} options={options} />
                        {/* Mostrar el total en el centro */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-3xl font-bold text-gray-700">{total}</div>
                            <div className="text-sm text-gray-500">Total</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
