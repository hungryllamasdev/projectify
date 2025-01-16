"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityLog from "@/components/project/ActivityLog";
import { ProjectHeader } from "@/components/project/header/project-header";
import { AddTaskButton } from "@/components/project/AddTaskButton";
import Dashboard from "@/components/project/Dashboard";
import { CustomKanban } from "@/components/project/Kanban";
import Calendar from "@/components/project/calendar/Calendar";
import List from "@/components/project/List";
import GanttChart from "@/components/project/GanttChart";
import { TeamMembers } from "@/components/project/header/team-members";

// Types
interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

interface ProjectLayoutProps {
  children: React.ReactNode;
}

//Fetch project data
const fetchProjectData = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}`);
  if (!response.ok) throw new Error("Failed to fetch project data");
  return response.json();
}

// Fetch function for assignable users
const fetchAssignableUsers = async (projectId: string): Promise<TeamMember[]> => {
  const response = await fetch(`/api/projects/${projectId}/assignable-users`);
  if (!response.ok) {
    throw new Error("Failed to fetch assignable users");
  }
  return response.json();
};

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const pid = params.pid as string;

  const {
    data: projectData = [],
    isLoading: isProjectLoading,
    isError: isProjectError
  } = useQuery({
    queryKey: ["projectData", pid],
    queryFn: () => fetchProjectData(pid),
    enabled: !!pid,
    staleTime: 5 * 60 * 1000, //Cache for 5 minutes
  });

  const {
    data: assignableUsers = [],
    isLoading: isUsersLoading,
    isError: isUsersError
  } = useQuery({
    queryKey: ["assignableUsers", pid],
    queryFn: () => fetchAssignableUsers(pid),
    enabled: !!pid,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleShare = () => {
    console.log("Share button clicked");
  };

  // Show loading state if either query is loading
  if (isProjectLoading || isUsersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading project data...</div>
      </div>
    );
  }

  // Show error state if either query has errored
  if (isProjectError || isUsersError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error loading project data.</div>
      </div>
    );
  }

  // Ensure projectData exists before rendering
  if (!projectData) {
    return null;
  }

  return (
    <>
      {/* Pass teamMembers to ProjectHeader */}
      <ProjectHeader
        initialProjectName={projectData.name}
        teamMembers={assignableUsers}
        onShare={handleShare}
      />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="overview" className="space-y-4 w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="gantt">Gantt</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              {/* Pass teamMembers to AddTaskButton (if required for assigning tasks) */}
              <AddTaskButton teamMembers={assignableUsers} />
            </div>
            <TabsContent value="overview">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
              <Dashboard  data={projectData.tasks}/>
            </TabsContent>
            <TabsContent value="kanban">
              <CustomKanban data={projectData.tasks}/>
            </TabsContent>
            <TabsContent value="list">
              <List data={projectData.tasks}/>
            </TabsContent>
            <TabsContent value="calendar">
              <Calendar data={projectData.tasks}/>
            </TabsContent>
            <TabsContent value="gantt">
              <GanttChart />
            </TabsContent>
            <TabsContent value="documentation">
              <h2 className="text-2xl font-bold mb-6">Documentation</h2>
              <p>Documentation content goes here.</p>
            </TabsContent>
            <TabsContent value="notes">
              <h2 className="text-2xl font-bold mb-6">Notes</h2>
              <p>Notes content goes here.</p>
            </TabsContent>
          </Tabs>
        </div>
        <ActivityLog projectId={pid} />
      </div>
    </>
  );
}
