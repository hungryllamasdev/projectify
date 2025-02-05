"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CheckCircle2, Folder, Pin, Star } from "lucide-react";
import { ItemDetailsModal } from "@/components/dashboard/item-details.modal";
import { fetchDashboardData } from "@/utils/api";

export default function Dashboard() {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: fetchDashboardData,
    });

    const openModal = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching dashboard data</div>;
    }

    const { myTasks, projects, pinnedTasks, upcomingDeadlines } = data;

    return (
        <div className="container mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">
                Dashboard
            </h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            My Tasks
                        </CardTitle>
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[150px] sm:h-[200px]">
                            {myTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="mb-4 cursor-pointer hover:bg-accent p-2 rounded"
                                    onClick={() => openModal(task)}
                                >
                                    <h3 className="font-medium">
                                        {task.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {task.status}
                                    </p>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Projects
                        </CardTitle>
                        <Folder className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[150px] sm:h-[200px]">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="mb-4 cursor-pointer hover:bg-accent p-2 rounded"
                                    onClick={() => openModal(project)}
                                >
                                    <h3 className="font-medium">
                                        {project.name}
                                    </h3>
                                    <div className="w-full bg-secondary mt-2 rounded-full h-2.5">
                                        <div
                                            className="bg-primary h-2.5 rounded-full"
                                            style={{
                                                width: `${project.progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Pinned Tasks
                        </CardTitle>
                        <Pin className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[150px] sm:h-[200px]">
                            {pinnedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="mb-4 cursor-pointer hover:bg-accent p-2 rounded"
                                    onClick={() => openModal(task)}
                                >
                                    <h3 className="font-medium">
                                        {task.title}
                                    </h3>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">
                            Upcoming Deadlines
                        </CardTitle>
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[150px] sm:h-[200px]">
                            {upcomingDeadlines.map((deadline) => (
                                <div
                                    key={deadline.id}
                                    className="mb-4 cursor-pointer hover:bg-accent p-2 rounded"
                                    onClick={() => openModal(deadline)}
                                >
                                    <h3 className="font-medium">
                                        {deadline.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {deadline.date}
                                    </p>
                                </div>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>
                        A quick glance at your project stats
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="tasks" className="w-full space-y-4">
                        <TabsList className="w-full sm:w-auto">
                            <TabsTrigger
                                value="tasks"
                                className="flex-1 sm:flex-none"
                            >
                                Tasks
                            </TabsTrigger>
                            <TabsTrigger
                                value="projects"
                                className="flex-1 sm:flex-none"
                            >
                                Projects
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tasks">
                            <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">
                                            Total Tasks
                                        </CardTitle>
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {myTasks.length}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">
                                            In Progress
                                        </CardTitle>
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {
                                                myTasks.filter(
                                                    (task) =>
                                                        task.status ===
                                                        "IN_PROGRESS"
                                                ).length
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">
                                            To Do
                                        </CardTitle>
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {
                                                myTasks.filter(
                                                    (task) =>
                                                        task.status === "TODO"
                                                ).length
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium">
                                            Done
                                        </CardTitle>
                                        <Star className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {
                                                myTasks.filter(
                                                    (task) =>
                                                        task.status === "DONE"
                                                ).length
                                            }
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="projects">
                            <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className="cursor-pointer hover:bg-accent"
                                        onClick={() => openModal(project)}
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {project.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1">
                                                    <div className="w-full bg-secondary rounded-full h-2.5">
                                                        <div
                                                            className="bg-primary h-2.5 rounded-full"
                                                            style={{
                                                                width: `${project.progress}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {project.progress}%
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <ItemDetailsModal
                item={selectedItem}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
}
