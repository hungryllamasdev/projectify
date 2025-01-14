"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import Dashboard from "@/components/project/Dashboard";
import { CustomKanban } from "@/components/project/Kanban";
import Calendar from "@/components/project/Calendar";
import List from "@/components/project/List";
import GanttChart from "@/components/project/GanttChart";

interface Task {
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    dueDate: string | null;
    description: string | null;
}

interface ProjectData {
    name: string;
    progress: number;
    tasks: {
        byStatus: {
            total: number;
            completed: number;
            inProgress: number;
            notStarted: number;
        };
        byType: {
            FEATURE: number;
            BUG: number;
            TASK: number;
        };
        list: Task[];
    };
    team: {
        name: string;
        avatar: string | null;
    }[];
    timeTracked: string;
    currentSprint: {
        name: string;
        endDate: string;
    };
}

export default function ProjectDashboard() {
    const [projectData, setProjectData] = useState<ProjectData>({
        name: "Project Phoenix",
        progress: 65,
        tasks: {
            byStatus: {
                total: 120,
                completed: 80,
                inProgress: 30,
                notStarted: 10,
            },
            byType: {
                FEATURE: 50,
                BUG: 40,
                TASK: 30,
            },
            list: [
                {
                    id: 1,
                    title: "Implement user login",
                    status: "completed",
                    type: "FEATURE",
                },
                {
                    id: 2,
                    title: "Fix payment gateway bug",
                    status: "inProgress",
                    type: "BUG",
                },
                {
                    id: 3,
                    title: "Write documentation for API",
                    status: "notStarted",
                    type: "TASK",
                },
            ],
        },
        team: [
            {
                name: "Alice Johnson",
                avatar: "https://example.com/avatar1.png",
            },
            { name: "Bob Smith", avatar: null },
            {
                name: "Charlie Brown",
                avatar: "https://example.com/avatar2.png",
            },
        ],
        timeTracked: "35h 20m",
        currentSprint: {
            name: "Sprint 5 - Beta Release Prep",
            endDate: "2025-01-15",
        },
    });

    const params = useParams();
    if (!projectData) return <div>No project data found</div>;

    return (
        <>
            <TabsContent value="overview">
                <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
                <Dashboard projectId={params.pid} />
            </TabsContent>
            <TabsContent value="kanban">
                <CustomKanban />
            </TabsContent>
            <TabsContent value="calendar">
                <Calendar />
            </TabsContent>
            <TabsContent value="list">
                <List />
            </TabsContent>
            <TabsContent value="gantt">
                <GanttChart />
            </TabsContent>
        </>
    );
}
