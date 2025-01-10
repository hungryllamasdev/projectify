'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from '@tanstack/react-form';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const projectSchema = z.object({
    name: z.string().min(3, 'Project name must be at least 3 characters long'),
    description: z.string().min(5, 'Description must be at least 5 characters long'),
    startDate: z
    .string()
    .refine((value) => {
        const parsedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of today
        return parsedDate >= today;
    }, {
        message: 'Start date cannot be in the past',
    }),

});

type ProjectFormValue = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
    const [serverError, setServerError] = useState<string | null>(null);

    // Define the mutation for creating a project
    const createProjectMutation = useMutation({
        mutationFn: async (project: ProjectFormValue) => {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create project');
            }

            return response.json();
        },
        onError: (error: any) => {
            setServerError(error.message || 'An error occurred');
        },
        onSuccess: (data) => {
            console.log('Project created successfully:', data);
            setServerError(null);
        },
    });

    const form = useForm<ProjectFormValue>({
        defaultValues: {
            name: '',
            description: '',
            startDate: new Date().toISOString().split('T')[0],
        },
        onSubmit: async ({ value }) => {
            createProjectMutation.mutate(value);
        },
        validators: {
            onSubmit: projectSchema,
        },
    });

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
                    <p className="mt-2 text-gray-600">
                        Set up your project details and prepare to invite team members.
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
                                            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Project Name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Enter project name"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type="text"
                                                className="w-full"
                                            />
                                            {field.state.meta.errors && (
                                            <AlertDescription>{field.state.meta.errors}</AlertDescription>
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
                                            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </Label>
                                            <Input
                                                id="description"
                                                placeholder="Enter description"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type="text"
                                                className="w-full"
                                            />
                                            {field.state.meta.errors && (
                                                <AlertDescription>{field.state.meta.errors}</AlertDescription>
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
                                            <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date
                                            </Label>
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                className="w-full"
                                            />
                                            {field.state.meta.errors && (
                                                <AlertDescription>{field.state.meta.errors}</AlertDescription>
                                            )}
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                            {serverError && (
                                <Alert variant="destructive">
                                    <AlertTitle>Server Error</AlertTitle>
                                    <AlertDescription>{serverError}</AlertDescription>
                                </Alert>
                            )}

                            <form.Subscribe selector={(state) => state.canSubmit}>
                                {(canSubmit) => (
                                    <div className="flex justify-end space-x-4">
                                        <Button type="submit" disabled={!canSubmit || createProjectMutation.isPending}>
                                            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                                        </Button>
                                    </div>
                                )}
                            </form.Subscribe>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
