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
import Calendar from "@/components/project/Calendar";
import List from "@/components/project/List";
import GanttChart from "@/components/project/GanttChart";

// Types
interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

interface ProjectLayoutProps {
  children: React.ReactNode;
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

  const [projectName, setProjectName] = useState("My Awesome Project");

  // Fetch assignable users with React Query
  const { data: teamMembers = [], isLoading, isError } = useQuery({
    queryKey: ["assignableUsers", pid],
    queryFn: () => fetchAssignableUsers(pid),
    enabled: !!pid,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleProjectNameChange = (newName: string) => {
    setProjectName(newName);
    console.log("Project name changed:", newName);
  };

  const handleShare = () => {
    console.log("Share button clicked");
  };

  if (isLoading) {
    return <div>Loading project data...</div>;
  }

  if (isError) {
    return <div>Error fetching project data.</div>;
  }

  return (
    <>
      {/* Pass teamMembers to ProjectHeader */}
      <ProjectHeader
        initialProjectName={projectName}
        teamMembers={teamMembers}
        onProjectNameChange={handleProjectNameChange}
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
              <AddTaskButton teamMembers={teamMembers} />
            </div>
            <TabsContent value="overview">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
              <Dashboard projectId={pid} />
            </TabsContent>
            <TabsContent value="kanban">
              <CustomKanban />
            </TabsContent>
            <TabsContent value="list">
              <List />
            </TabsContent>
            <TabsContent value="calendar">
              <Calendar />
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
