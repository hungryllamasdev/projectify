'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

// Types
type TaskFormValues = {
  title: string
  type: 'FEATURE' | 'BUG' | 'TASK'
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate: string
  assignedTo: string
}

interface TeamMember {
  id: string
  name: string
  avatar: string
}

interface AddTaskButtonProps {
  teamMembers: TeamMember[]
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-500 text-sm">{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

// API function
const createTask = async (pid: string, task: TaskFormValues): Promise<any> => {
  const response = await fetch(`/api/projects/${pid}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create task')
  }

  return response.json()
}

export function AddTaskButton({ teamMembers }: AddTaskButtonProps) {
  const [open, setOpen] = useState(false)
  const params = useParams()
  const pid = params.pid as string
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: TaskFormValues) => createTask(pid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', pid] })
      setOpen(false)
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create task',
      })
    },
  })

  const form = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      type: 'TASK',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      assignedTo: '',
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div>
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'Title is required'
                    : undefined,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-medium" htmlFor={field.name}>Title</label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Task title"
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="type">
              {(field) => (
                <div>
                  <label className="text-sm font-medium" htmlFor={field.name}>Type</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as 'FEATURE' | 'BUG' | 'TASK')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FEATURE">Feature</SelectItem>
                      <SelectItem value="BUG">Bug</SelectItem>
                      <SelectItem value="TASK">Task</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="description">
              {(field) => (
                <div>
                  <label className="text-sm font-medium" htmlFor={field.name}>Description</label>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Task description"
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="priority">
              {(field) => (
                <div>
                  <label className="text-sm font-medium" htmlFor={field.name}>Priority</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as 'LOW' | 'MEDIUM' | 'HIGH')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field 
            name="dueDate"
            validators={{
              onChange: ({ value }) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Remove time portion for comparison
                const selectedDate = new Date(value);
          
                if (!value) {
                  return 'Due date is required';
                }
          
                if (selectedDate < today) {
                  return 'Due date cannot be in the past';
                }
          
                return undefined; // No error
              },
            }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-medium" htmlFor={field.name}>Due Date</label>
                  <Input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <div>
            <form.Field name="assignedTo">
              {(field) => (
                <div>
                  <label className="text-sm font-medium" htmlFor={field.name}>Assign To</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldInfo field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  )
}

