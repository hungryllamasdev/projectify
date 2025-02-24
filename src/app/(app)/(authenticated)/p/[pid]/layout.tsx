"use client";

import { useState, Suspense, type ReactNode } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProjectProvider } from "@/contexts/project-context";

interface ProjectLayoutProps {
    children: ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
    const params = useParams();
    const pid = params.pid as string;
    const pathname = usePathname();
    const isMobile = useIsMobile();

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

    const tabOptions = [
        { value: "overview", label: "Overview" },
        { value: "kanban", label: "Kanban" },
        { value: "list", label: "List" },
        { value: "calendar", label: "Calendar" },
        { value: "finance", label: "Finance" },
        { value: "documentation", label: "Documentation" },
        { value: "notes", label: "Notes" },
    ];

    return (
        <ProjectProvider pid={params.pid as string}>
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
                <div className="container mx-auto px-4 sm:px-6 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                {isMobile ? (
                                    <Select
                                        value={activeTab}
                                        onValueChange={setActiveTab}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a view" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tabOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <TabsList className="flex flex-wrap gap-2">
                                        {tabOptions.map((option) => (
                                            <TabsTrigger
                                                key={option.value}
                                                value={option.value}
                                                className="flex-grow"
                                            >
                                                {option.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                )}
                                <AddTaskButton teamMembers={assignableUsers} />
                            </div>
                            <Suspense fallback={<TabContentSkeleton />}>
                                <TabsContent
                                    value="overview"
                                    className="overflow-x-auto"
                                >
                                    <Dashboard data={dashboardData} />
                                </TabsContent>
                                <TabsContent value="kanban">
                                    <CustomKanban
                                        data={projectData?.tasks || []}
                                    />
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
                                    <ProjectDocumentationEditor
                                        projectId={pid}
                                    />
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
        </ProjectProvider>
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
