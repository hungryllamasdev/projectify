"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityLog from "@/components/project/ActivityLog";
import { ProjectHeader } from "@/components/project/header/project-header";
import { AddTaskButton } from "@/components/project/AddTaskButton";
import Dashboard from "@/components/project/Dashboard";
import { CustomKanban } from "@/components/project/Kanban";
import Calendar from "@/components/project/Calendar";
import List from "@/components/project/List";
import GanttChart from "@/components/project/GanttChart";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const pid = params.pid as string;

  const [projectName, setProjectName] = useState("My Awesome Project");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "3", name: "Charlie Brown", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "4", name: "Diana Ross", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "5", name: "Edward Norton", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "6", name: "Fiona Apple", avatar: "/placeholder.svg?height=32&width=32" },
  ]);

  const handleProjectNameChange = (newName: string) => {
    setProjectName(newName);
    console.log("Project name changed:", newName);
  };

  const handleShare = () => {
    console.log("Share button clicked");
  };

  return (
    <>
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
              <AddTaskButton />
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

