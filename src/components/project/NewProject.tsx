'use client';

import { useState } from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { createProject } from "@/utils/api";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  startDate: z.string().refine(
    (value) => {
      const parsedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedDate >= today;
    },
    {
      message: "Start date cannot be in the past",
    }
  ),
});

type ProjectFormValue = z.infer<typeof projectSchema>;

export function NewProject({ onSuccess }: { onSuccess: (projectId: string) => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      onSuccess(data.id);
    },
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
                <Button
                  type="submit"
                  disabled={!canSubmit || createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}

