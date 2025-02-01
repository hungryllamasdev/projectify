"use client";

import { useState, Suspense } from "react";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityLog from "@/components/project/ActivityLog";
import { ProjectHeader } from "@/components/project/header/project-header";
import { AddTaskButton } from "@/components/project/AddTaskButton";
import Dashboard from "@/components/project/Dashboard";
import Calendar from "@/components/project/calendar/Calendar";
import List from "@/components/project/List";
import GanttChart from "@/components/project/GanttChart";
import CustomKanban from "@/components/project/Kanban";
import { PIDProvider } from "@/contexts/pid-context";
import {
    fetchAssignableUsers,
    fetchProjectData,
    fetchProjectDashboardData,
} from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectDocumentationEditor from "@/components/documentation/documentation-editor";

interface ProjectLayoutProps {
    children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
    const params = useParams();
    const pid = params.pid as string;
    const pathname = usePathname();

    const {
        data: projectData,
        isLoading: isProjectLoading,
        isError: isProjectError,
    } = useQuery({
        queryKey: ["projectData", pid],
        queryFn: () => fetchProjectData(pid),
        enabled: !!pid,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: dashboardData,
        isLoading: isDashboardLoading,
        isError: isDashboardError,
    } = useQuery({
        queryKey: ["dashboardData", pid],
        queryFn: () => fetchProjectDashboardData(pid),
        enabled: !!pid,
        staleTime: 5 * 60 * 1000,
    });

    const {
        data: assignableUsers = [],
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useQuery({
        queryKey: ["assignableUsers", pid],
        queryFn: () => fetchAssignableUsers(pid),
        enabled: !!pid,
        staleTime: 5 * 60 * 1000,
    });

    const [activeTab, setActiveTab] = useState("overview");

    const handleShare = () => {
        console.log("Share button clicked");
    };

    if (pathname?.includes("/invite")) {
        return <>{children}</>;
    }

    if (isProjectLoading || isUsersLoading || isDashboardLoading) {
        return <LoadingSkeleton />;
    }

    if (isProjectError || isUsersError || isDashboardError) {
        return <ErrorState />;
    }

    return (
        <PIDProvider pid={pid}>
            <ProjectHeader
                initialProjectName={projectData?.name || "Untitled Project"}
                teamMembers={assignableUsers}
                onShare={handleShare}
            />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-4 w-full"
                    >
                        <div className="flex justify-between items-center">
                            <TabsList>
                                <TabsTrigger value="overview">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                                <TabsTrigger value="list">List</TabsTrigger>
                                <TabsTrigger value="calendar">
                                    Calendar
                                </TabsTrigger>
                                <TabsTrigger value="gantt">Gantt</TabsTrigger>
                                <TabsTrigger value="documentation">
                                    Documentation
                                </TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>
                            <AddTaskButton teamMembers={assignableUsers} />
                        </div>
                        <Suspense fallback={<TabContentSkeleton />}>
                            <TabsContent value="overview">
                                <Dashboard data={dashboardData} />
                            </TabsContent>
                            <TabsContent value="kanban">
                                <CustomKanban data={projectData?.tasks || []} />
                            </TabsContent>
                            <TabsContent value="list">
                                <List
                                    members={assignableUsers}
                                    data={projectData?.tasks || []}
                                />
                            </TabsContent>
                            <TabsContent value="calendar">
                                <Calendar data={projectData?.tasks || []} />
                            </TabsContent>
                            <TabsContent value="gantt">
                                <GanttChart />
                            </TabsContent>
                            <TabsContent value="documentation">
                                <ProjectDocumentationEditor projectId={pid} />
                            </TabsContent>
                            <TabsContent value="notes">
                                <h2 className="text-2xl font-bold mb-6">
                                    Notes
                                </h2>
                                <p>Notes content goes here.</p>
                            </TabsContent>
                        </Suspense>
                    </Tabs>
                </div>
                <ActivityLog
                    projectId={pid}
                    members={assignableUsers.map((user) => ({
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                    }))}
                />
            </div>
        </PIDProvider>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Skeleton className="w-[200px] h-[20px]" />
        </div>
    );
}

function ErrorState() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-red-500">
                Error loading project data.
            </div>
        </div>
    );
}

function TabContentSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="w-full h-[200px]" />
            <Skeleton className="w-full h-[100px]" />
            <Skeleton className="w-full h-[100px]" />
        </div>
    );
}
