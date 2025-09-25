import { Bar } from "react-chartjs-2";
import { KpiControllerGetAvgCompletionTime200Item } from "@/api/generated";
import { FormatTime, TranslatePriority } from "@/utils/translate";
import { useKpiAvgTasksCompletedTime } from "@/hooks/useKpi";
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

const Colors = {
    'low': '#34d399', // Verde
    'medium': '#fbbf24', // Amarillo
    'high': '#f87171', // Rojo
    'none': '#9ca3af', // Gris
}

export const AvgTimeCompletedChart = () => {
    const [data, setData] = useState<KpiControllerGetAvgCompletionTime200Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await useKpiAvgTasksCompletedTime();
                console.log('Chart data result:', result);
                setData(result);
            } catch (err) {
                setError('Error al cargar los datos del gráfico');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Transformamos los datos para que Chart.js pueda utilizarlos
    const chartData = {
        labels: data.map(item => TranslatePriority(item.priority || 'Sin prioridad')),
        datasets: [
            {
                label: 'Tiempo Promedio',
                data: data.map(item => {
                    // Usar directamente avgCompletionTimeMinutes en lugar del formateado
                    // ya que el formateado puede estar redondeado hacia abajo
                    return item.avgCompletionTimeMinutes || 0;
                }),
                backgroundColor: data.map(item => {
                    const priority = item.priority?.toLowerCase() || 'none';
                    return Colors[priority as keyof typeof Colors] || Colors.none;
                }),
                borderColor: data.map(item => {
                    const priority = item.priority?.toLowerCase() || 'none';
                    return Colors[priority as keyof typeof Colors] || Colors.none;
                }),
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        
        plugins: {
            legend: {
                position: 'top' as const
                
            },
            title: {
                display: true,
                text: 'Tiempo Promedio de Tareas Completadas por Prioridad',
                font: {
                    size: 16,
                    weight: 'bold',
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.parsed.y;
                        return `${context.dataset.label}: ${FormatTime(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Prioridad'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Tiempo'
                },
                ticks: {
                    stepSize: data.some(item => (item.avgCompletionTimeMinutes || 0) < 1) ? 0.1 : 1, // Usar pasos de 0.1 si hay valores menores a 1 minuto
                    callback: function (value) {
                        return FormatTime(Number(value));
                    }
                }
            },
        },
    };

    return (
        <div className="shadow-lg p-4 w-full min-h-[400px] bg-white rounded-lg text-center hover:scale-102 transition-transform">
            <div className="w-full h-80">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-600">Cargando gráfico...</div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg">
                            {error}
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div>No hay datos registrados, agrega nuevas tareas </div>
                    </div>
                ) : (
                    <Bar data={chartData} options={options}  />
                )}
            </div>

        </div>
    );
}