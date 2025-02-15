"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchProjectData,
    fetchAssignableUsers,
    fetchProjectDashboardData,
    updateProjectData,
} from "@/utils/api";

// -- Define TypeScript interfaces based on your schema/types --
export interface Task {
    id: string;
    title: string;
    type: "FEATURE" | "BUG" | "TASK";
    description?: string;
    status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
    isCompleted: boolean;
    isPinned: boolean;
    priority: "HIGH" | "MEDIUM" | "LOW";
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    startDate: string;
    createdAt: string;
    updatedAt: string;
    ownerID: string;
    tasks: Task[];
}

interface ProjectContextType {
    projectData: Project | null;
    dashboardData: any | null; // Replace 'any' with your DashboardData type if available
    assignableUsers: User[];
    updateProjectName: (newName: string) => Promise<void>;
    refetchProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
    pid: string;
    children: ReactNode;
}

export const ProjectProvider = ({ pid, children }: ProjectProviderProps) => {
    const queryClient = useQueryClient();

    // Query for project data using the new object-based API
    const {
        data: projectData,
        isLoading: isProjectLoading,
        isError: isProjectError,
        refetch: refetchProjectData,
    } = useQuery({
        queryKey: ["projectData", pid],
        queryFn: () => fetchProjectData(pid),
        enabled: !!pid,
        staleTime: 5 * 60 * 1000,
    });

    // Query for dashboard data using the object-based API
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

    // Query for assignable users using the object-based API
    const {
        data: assignableUsers = [],
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useQuery<User[]>({
        queryKey: ["assignableUsers", pid],
        queryFn: () => fetchAssignableUsers(pid),
        enabled: !!pid,
        staleTime: 5 * 60 * 1000,
    });

    // Mutation to update the project name using the object-based API
    const updateProjectNameMutation = useMutation({
        mutationFn: (newName: string) =>
            updateProjectData(pid, { name: newName }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projectData", pid] });
            queryClient.invalidateQueries({ queryKey: ["dashboardData", pid] });
        },
    });

    const updateProjectName = async (newName: string) => {
        await updateProjectNameMutation.mutateAsync(newName);
    };

    // Function to refetch project data manually if needed
    const refetchProject = () => {
        refetchProjectData();
    };

    // Render a fallback UI while loading or if an error occurs
    if (isProjectLoading || isDashboardLoading || isUsersLoading) {
        return <div>Loading project data...</div>;
    }
    if (isProjectError || isDashboardError || isUsersError) {
        return <div>Error loading project data.</div>;
    }

    const contextValue: ProjectContextType = {
        projectData: projectData || null,
        dashboardData: dashboardData || null,
        assignableUsers,
        updateProjectName,
        refetchProject,
    };

    return (
        <ProjectContext.Provider value={contextValue}>
            {children}
        </ProjectContext.Provider>
    );
};

// Custom hook for consuming the project context
export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error(
            "useProjectContext must be used within a ProjectProvider"
        );
    }
    return context;
};
