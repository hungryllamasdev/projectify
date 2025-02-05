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
import CustomKanban from "@/components/project/Kanban";
import Finance from "@/components/project/Finance";
import { PIDProvider } from "@/contexts/pid-context";
import {
    fetchAssignableUsers,
    fetchProjectData,
    fetchProjectDashboardData,
} from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectDocumentationEditor from "@/components/project/documentation/documentation-editor";

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
        // console.log("Share button clicked");
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
        <PIDProvider pid={params.pid as string}>
            <ProjectHeader
                initialProjectName={projectData?.name || "Untitled Project"}
                teamMembers={assignableUsers}
                onShare={handleShare}
                project={projectData}
                currentUser={{
                    id:
                        dashboardData?.team.find(
                            (member) => member.role === "OWNER"
                        )?.email || "",
                    name:
                        dashboardData?.team.find(
                            (member) => member.role === "OWNER"
                        )?.name || "",
                    email:
                        dashboardData?.team.find(
                            (member) => member.role === "OWNER"
                        )?.email || "",
                    avatar:
                        dashboardData?.team.find(
                            (member) => member.role === "OWNER"
                        )?.image || "",
                }}
                onProjectNameChange={(newName) =>
                    console.log("Project name changed:", newName)
                }
            />
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="space-y-4 w-full"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <TabsList className="flex flex-wrap justify-start">
                                <TabsTrigger
                                    value="overview"
                                    className="mb-2 sm:mb-0"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="kanban"
                                    className="mb-2 sm:mb-0"
                                >
                                    Kanban
                                </TabsTrigger>
                                <TabsTrigger
                                    value="list"
                                    className="mb-2 sm:mb-0"
                                >
                                    List
                                </TabsTrigger>
                                <TabsTrigger
                                    value="calendar"
                                    className="mb-2 sm:mb-0"
                                >
                                    Calendar
                                </TabsTrigger>
                                <TabsTrigger
                                    value="finance"
                                    className="mb-2 sm:mb-0"
                                >
                                    Finance
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documentation"
                                    className="mb-2 sm:mb-0"
                                >
                                    Docs
                                </TabsTrigger>
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
                            <TabsContent value="finance">
                                <Finance projectId={pid} />
                            </TabsContent>
                            <TabsContent value="documentation">
                                <ProjectDocumentationEditor projectId={pid} />
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
        <div className="flex items-center justify-center min-h-screen p-4">
            <Skeleton className="w-full max-w-[200px] h-[20px]" />
        </div>
    );
}

function ErrorState() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="text-lg text-red-500 text-center">
                Error loading project data.
            </div>
        </div>
    );
}

function TabContentSkeleton() {
    return (
        <div className="space-y-4 p-4">
            <Skeleton className="w-full h-[100px] sm:h-[200px]" />
            <Skeleton className="w-full h-[50px] sm:h-[100px]" />
            <Skeleton className="w-full h-[50px] sm:h-[100px]" />
        </div>
    );
}
