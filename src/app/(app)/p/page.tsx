"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@/utils/api";
import { ProjectCard } from "@/components/project-dashboard/project-card";

// Types
interface TeamMember {
    name: string;
    avatar: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    status: "Active" | "Completed" | "On Hold";
    progress: number;
    dueDate: string;
    team: TeamMember[];
}

// Dummy Data
const projects: Project[] = [
    {
        id: "1",
        name: "Website Redesign",
        description: "Overhaul of company website for better UX",
        status: "Active",
        progress: 75,
        dueDate: "2023-12-31",
        team: [
            {
                name: "Alice Johnson",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                name: "Bob Smith",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
    },
    {
        id: "2",
        name: "Mobile App Development",
        description: "Creating a new mobile app for client",
        status: "Active",
        progress: 40,
        dueDate: "2024-03-15",
        team: [
            {
                name: "Charlie Brown",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                name: "Diana Ross",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
    },
    {
        id: "3",
        name: "Database Migration",
        description: "Migrating data to new cloud infrastructure",
        status: "On Hold",
        progress: 10,
        dueDate: "2024-02-28",
        team: [
            {
                name: "Eve Williams",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                name: "Frank Ocean",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
    },
    {
        id: "4",
        name: "AI Integration",
        description: "Implementing AI-driven features across products",
        status: "Active",
        progress: 60,
        dueDate: "2024-06-30",
        team: [
            {
                name: "Grace Hopper",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            { name: "Hank Pym", avatar: "/placeholder.svg?height=32&width=32" },
        ],
    },
    {
        id: "5",
        name: "Security Audit",
        description: "Comprehensive security review of all systems",
        status: "Completed",
        progress: 100,
        dueDate: "2023-11-30",
        team: [
            {
                name: "Irene Adler",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                name: "Jack Ryan",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
    },
];

function NewProjectPage() {
    const [serverError, setServerError] = useState<string | null>(null);

    const projectSchema = z.object({
        name: z
            .string()
            .min(3, "Project name must be at least 3 characters long"),
        description: z
            .string()
            .min(5, "Description must be at least 5 characters long"),
        startDate: z.string().refine(
            (value) => {
                const parsedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set to the start of today
                return parsedDate >= today;
            },
            {
                message: "Start date cannot be in the past",
            }
        ),
    });

    type ProjectFormValue = z.infer<typeof projectSchema>;

    const createProjectMutation = useMutation({
        mutationFn: createProject,
    });

    const form = useForm<ProjectFormValue>({
        defaultValues: {
            name: "",
            description: "",
            startDate: new Date().toISOString().split("T")[0],
        },
        onSubmit: async ({ value }) => {
            console.log(value);
            createProjectMutation.mutate(value);
        },
        validators: {
            onSubmit: projectSchema,
        },
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Create New Project
                </h1>
                <p className="mt-2 text-gray-600">
                    Set up your project details and prepare to invite team
                    members.
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form
                        className="space-y-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            void form.handleSubmit();
                        }}
                    >
                        {/* Project Details Section */}
                        <div className="space-y-4">
                            <form.Field
                                name="name"
                                validators={{
                                    onChange: projectSchema.shape.name,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <Label
                                            htmlFor="name"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Project Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter project name"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            type="text"
                                            className="w-full"
                                        />
                                        {field.state.meta.errors && (
                                            <AlertDescription>
                                                {field.state.meta.errors}
                                            </AlertDescription>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field
                                name="description"
                                validators={{
                                    onChange: projectSchema.shape.description,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <Label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            placeholder="Enter description"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            type="text"
                                            className="w-full"
                                        />
                                        {field.state.meta.errors && (
                                            <AlertDescription>
                                                {field.state.meta.errors}
                                            </AlertDescription>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field
                                name="startDate"
                                validators={{
                                    onChange: projectSchema.shape.startDate,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <Label
                                            htmlFor="startDate"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Start Date
                                        </Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                        />
                                        {field.state.meta.errors && (
                                            <AlertDescription>
                                                {field.state.meta.errors}
                                            </AlertDescription>
                                        )}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        {serverError && (
                            <Alert variant="destructive">
                                <AlertTitle>Server Error</AlertTitle>
                                <AlertDescription>
                                    {serverError}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form.Subscribe selector={(state) => state.canSubmit}>
                            {(canSubmit) => (
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="submit"
                                        disabled={
                                            !canSubmit ||
                                            createProjectMutation.isPending
                                        }
                                    >
                                        {createProjectMutation.isPending
                                            ? "Creating..."
                                            : "Create Project"}
                                    </Button>
                                </div>
                            )}
                        </form.Subscribe>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function NewProjectCard() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors">
                    <CardContent className="flex items-center justify-center h-full">
                        <Plus className="w-12 h-12 text-muted-foreground" />
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <NewProjectPage />
            </DialogContent>
        </Dialog>
    );
}

// Main Dashboard Component
export default function ProjectDashboard() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
                <NewProjectCard />
            </div>
        </div>
    );
}
