"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TabsContent } from "@/components/ui/tabs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from "@/components/project/Dashboard";
import { CustomKanban } from "@/components/project/Kanban";
import Calendar from "@/components/project/Calendar";

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
const TaskCard = ({
    title,
    value,
    icon: Icon,
    progress,
    task,
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    progress?: number;
    task?: Task;
}) => (
    <Popover>
        <PopoverTrigger asChild>
            <Card className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    {progress !== undefined && (
                        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </PopoverTrigger>
        {task && (
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                            {task.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Status: {task.status}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm">Type:</span>
                            <span className="col-span-2 text-sm font-medium">
                                {task.type}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <span className="text-sm">Priority:</span>
                            <span className="col-span-2 text-sm font-medium">
                                {task.priority}
                            </span>
                        </div>
                        {task.dueDate && (
                            <div className="grid grid-cols-3 items-center gap-4">
                                <span className="text-sm">Due Date:</span>
                                <span className="col-span-2 text-sm font-medium">
                                    {task.dueDate}
                                </span>
                            </div>
                        )}
                        {task.description && (
                            <div className="grid grid-cols-3 items-center gap-4">
                                <span className="text-sm">Description:</span>
                                <span className="col-span-2 text-sm font-medium">
                                    {task.description}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        )}
    </Popover>
);

export default function ProjectDashboard() {
    // const [projectData, setProjectData] = useState<ProjectData | null>(null);
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

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const projectId = params.projectId as string;

    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true);
            try {
                // const response = await fetch(`/api/project/${projectId}`);
                // if (!response.ok) {
                //     throw new Error("Failed to fetch project data");
                // }
                // const data = await response.json();
                // setProjectData(data);
            } catch (error) {
                // console.error("Error fetching project data:", error);
                // setError(
                //     "Failed to load project data. Please try again later."
                // );
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [projectId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!projectData) return <div>No project data found</div>;

    return (
        <>
            <TabsContent value="overview">
                {/* <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-12">
                    <TaskCard
                        title="Total Tasks"
                        value={projectData.tasks.byStatus.total}
                        icon={Columns}
                        progress={projectData.progress}
                    />
                    <TaskCard
                        title="In Progress"
                        value={projectData.tasks.byStatus.inProgress}
                        icon={Clock}
                    />
                    <TaskCard
                        title="Completed"
                        value={projectData.tasks.byStatus.completed}
                        icon={FileText}
                    />
                    <TaskCard
                        title="Not Started"
                        value={projectData.tasks.byStatus.notStarted}
                        icon={FileText}
                    />
                </div>
            </div> */}
                <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
                <Dashboard projectId={params.projectId} />
            </TabsContent>
            <TabsContent value="kanban">
                <CustomKanban />
            </TabsContent>
            <TabsContent value="calendar">
                <Calendar />
            </TabsContent>
        </>
    );
}
