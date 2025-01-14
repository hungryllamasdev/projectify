import { Metadata } from "next";
// import { DashboardHeader } from "@/components/dashboard/header"; deprecated
import { ProjectOverview } from "@/components/dashboard/project-overview";
import { TaskList } from "@/components/dashboard/task-list";
import { Metrics } from "@/components/dashboard/metrics";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { auth } from "@/auth";
import { UserNav } from "@/components/nav/user-nav";

export const metadata: Metadata = {
    title: "Dashboard | Projectify",
    description: "Project management for solo developers and small teams",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session) return <div>Not authenticated</div>;
    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Welcome back!
                    </h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of your tasks for this month!
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <UserNav />
                </div>
            </div>{" "}
            <div className="container mx-auto p-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <ProjectOverview />
                    <TaskList />
                </div>
                <Metrics />
                <RecentActivity />
            </div>
        </div>
    );
}
