import { getKpi } from "@/api/generated/kpi/kpi";
import { KpiControllerGetCompletedForDaysParams } from "@/api/generated";

const kpiAPI = getKpi();

export const useKpiTasksByPriority = async () => {
    try {
        const response = await kpiAPI.kpiControllerGetTasksByPriority();
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}

export const useKpiAvgTasksCompletedTime = async () => {
    try {
        const response = await kpiAPI.kpiControllerGetAvgCompletionTime();
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}

export const useKpiDistributionTasks = async () => {
    try {
        const response = await kpiAPI.kpiControllerGetTaskDistribution();
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}

export const useKpiCompletedTasksForDays = async (days?: number) => {
    try {
        const params: KpiControllerGetCompletedForDaysParams = days ? { days } : {};
        const response = await kpiAPI.kpiControllerGetCompletedForDays(params);
        return response;
    } catch (error) {
        console.error("Error fetching KPI data:", error);
        throw error;
    }
}