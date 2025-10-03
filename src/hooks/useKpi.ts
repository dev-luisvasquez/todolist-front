import { getKpi } from "@/api/generated/kpi/kpi";
import { KpiControllerGetCompletedForDaysParams } from "@/api/generated";

const kpiAPI = getKpi();

// Funciones normales (no hooks) para obtener KPIs. Se renombraron para evitar que ESLint las trate como React Hooks.
export const fetchKpiTasksByPriority = async () => {
    try {
        const response = await kpiAPI.kpiControllerGetTasksByPriority();
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}

export const fetchKpiAvgTasksCompletedTime = async () => {
    try {
        const response = await kpiAPI.kpiControllerGetAvgCompletionTime();
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}

export const fetchKpiDistributionTasks = async () => {
    try {
        const response = await kpiAPI.kpiControllerGetTaskDistribution();
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}

export const fetchKpiCompletedTasksForDays = async (days?: number) => {
    try {
        const params: KpiControllerGetCompletedForDaysParams = days ? { days } : {};
        const response = await kpiAPI.kpiControllerGetCompletedForDays(params);
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}