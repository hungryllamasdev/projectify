"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Plus, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "@tanstack/react-form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProject } from "@/utils/api";

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
            <DialogContent
                title="New Project"
                className="max-w-4xl max-h-[90vh] overflow-y-auto"
            >
                <NewProjectPage />
            </DialogContent>
        </Dialog>
    );
}

function ProjectCard({ project }) {
    return (
        <Link href={`/p/${project.id}`} passHref>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        {project.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 line-clamp-2">
                        {project.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                            Start:{" "}
                            {new Date(project.startDate).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>
                            Updated:{" "}
                            {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex -space-x-2 overflow-hidden">
                        {project.members.map((member, index) => (
                            <Avatar
                                key={index}
                                className="inline-block border-2 border-background"
                            >
                                <AvatarFallback>
                                    {member.userId.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}

// Main Dashboard Component
export default function ProjectDashboard() {
    const {
        data: projects,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await fetch("/api/projects");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        },
    });

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    if (error)
        return (
            <div className="text-red-500 text-center">
                An error occurred: {error.message}
            </div>
        );

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
