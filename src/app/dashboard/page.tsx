import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { ProjectOverview } from "@/components/dashboard/project-overview";
import { TaskList } from "@/components/dashboard/task-list";
import { Metrics } from "@/components/dashboard/metrics";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Sidebar } from "@/components/sidebar/sidebar";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "Dashboard | Projectify",
    description: "Project management for solo developers and small teams",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session) return <div>Not authenticated</div>;
    return (
        <div className="container mx-auto p-6 space-y-8">
            <DashboardHeader />
            <div className="grid gap-6 md:grid-cols-2">
                <ProjectOverview />
                <TaskList />
            </div>
            <Metrics />
            <RecentActivity />
        </div>
    );
}
