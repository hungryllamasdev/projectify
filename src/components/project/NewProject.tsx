"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProject } from "@/utils/api"
import { DialogTitle } from "@/components/ui/dialog"

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  startDate: z.string().refine(
    (value) => {
      const parsedDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return parsedDate >= today
    },
    {
      message: "Start date cannot be in the past",
    },
  ),
})

type ProjectFormValue = z.infer<typeof projectSchema>

export function NewProject({ onSuccess }: { onSuccess: (projectId: string) => void }) {
  const [serverError, setServerError] = useState<string | null>(null)

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      onSuccess(data.id)
    },
    onError: (error) => {
      setServerError("Failed to create project. Please try again.")
    },
  })

  const form = useForm<ProjectFormValue>({
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      createProjectMutation.mutate(value)
    },
    validators: {
      onSubmit: projectSchema,
    },
  })

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <DialogTitle>Create New Project</DialogTitle>

          <form.Field
            name="name"
            validators={{
              onChange: projectSchema.shape.name,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full"
                />
                {field.state.meta.errors && <p className="text-sm text-destructive">{field.state.meta.errors}</p>}
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
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full"
                  rows={4}
                />
                {field.state.meta.errors && <p className="text-sm text-destructive">{field.state.meta.errors}</p>}
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
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full"
                />
                {field.state.meta.errors && <p className="text-sm text-destructive">{field.state.meta.errors}</p>}
              </div>
            )}
          </form.Field>

          {serverError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe selector={(state) => state.canSubmit}>
            {(canSubmit) => (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!canSubmit || createProjectMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}

