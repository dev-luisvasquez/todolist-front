'use client';
import { AvgTimeCompletedChart } from "@/components/charts/AvgTimeCompletedChart";
import { TasksCompletedForDaysChart } from "@/components/charts/TasksCompletedForDaysChart";
import {TasksDistributionChart} from "@/components/charts/TasksDistributionChart";

function Home() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
               <AvgTimeCompletedChart />
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
                 <TasksCompletedForDaysChart />
            </div>
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
                 <TasksDistributionChart />
            </div>  
        </div>
    );
}
export default Home;