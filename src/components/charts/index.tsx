import dynamic from "next/dynamic";


export const TasksByPriorityChart = dynamic(
  () => import('@/components/charts/TasksByPriorityChart').then(mod => mod.TasksByPriorityChart),
  {
    ssr: false, // necesario porque Chart.js usa window
    loading: () => (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">Cargando gráfico...</p>
      </div>
    ),
  }
);

export const AvgTimeCompletedChart = dynamic(
  () => import('@/components/charts/AvgTimeCompletedChart').then(mod => mod.AvgTimeCompletedChart),
  {
    ssr: false, // necesario porque Chart.js usa window
    loading: () => (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">Cargando gráfico...</p>
      </div>
    ),
  }
);


export const TasksCompletedForDaysChart = dynamic(
  () => import('@/components/charts/TasksCompletedForDaysChart').then(mod => mod.TasksCompletedForDaysChart),
  {
    ssr: false, // necesario porque Chart.js usa window
    loading: () => (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">Cargando gráfico...</p>
      </div>
    ),
  }
);

export const TasksDistributionChart = dynamic(
  () => import('@/components/charts/TasksDistributionChart').then(mod => mod.TasksDistributionChart),
  {
    ssr: false, // necesario porque Chart.js usa window
    loading: () => (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">Cargando gráfico...</p>
      </div>
    ),
  }
);
