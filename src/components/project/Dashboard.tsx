import { Suspense } from "react";
// import ProjectHeader from "@/components/dashboard/ProjectHeader";
import ProgressOverview from "@/components/project/dashboard/progress-overview";
import TeamOverview from "@/components/project/dashboard/team-overview";
import PriorityItems from "@/components/project/dashboard/priority-items";
import QuickActions from "@/components/project/dashboard/quick-actions";
import KeyMetrics from "@/components/project/dashboard/key-metrics";
import { DashboardSkeleton } from "@/components/project/dashboard/dashboard-skeleton";

export default function Dashboard() {
    return (
        <div className="container mx-auto p-4 space-y-4">
            <Suspense fallback={<DashboardSkeleton />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* <div className="col-span-full">
                        <ProjectHeader />
                    </div> */}
                    <div className="col-span-full md:col-span-1 lg:col-span-2">
                        <ProgressOverview />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <TeamOverview />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <PriorityItems />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <QuickActions />
                    </div>
                    <div className="col-span-full">
                        <KeyMetrics />
                    </div>
                </div>
            </Suspense>
        </div>
    );
}
