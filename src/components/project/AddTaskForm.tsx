'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
interface User {
  id: string;
  name: string;
}

interface TaskData {
  title: string;
  description?: string;
  priority?: string;
  userId?: string | null;
  projectId: string;
}


// API functions
const fetchAssignableUsers = async (projectId: string): Promise<User[]> => {
  const response = await fetch(`/api/projects/${projectId}/assignable-users`);
  if (!response.ok) {
    throw new Error('Failed to fetch assignable users');
  }
  return response.json();
};

const createTask = async (taskData: TaskData): Promise<any> => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
};

// Hook to fetch assignable users
const useAssignableUsers = (projectId: string) => {
  return useQuery({
    queryKey: ['assignable-users', projectId],
    queryFn: () => fetchAssignableUsers(projectId),
  });
};

// Hook to add a task
const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });
};

// AddTaskForm Component
function AddTaskForm({
  onClose,
  assignableUsers,
  onSubmit,
  projectId,
}: {
  onClose: () => void;
  assignableUsers: User[];
  onSubmit: (taskData: Omit<TaskData, 'projectId'>) => void;
  projectId: string;
}) {
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [assignedUser, setAssignedUser] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isBatchMode) {
      const tasks = taskDescription.split('\n').map((line) => ({
        title: line.trim(),
        priority: taskPriority,
        userId: assignedUser || null,
      }));
      tasks.forEach((task) => onSubmit(task));
    } else {
      onSubmit({
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        userId: assignedUser || null,
      });
    }
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isBatchMode ? 'Add Multiple Tasks' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isBatchMode ? (
            <Textarea
              placeholder="Enter multiple tasks, one per line"
              className="h-40"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          ) : (
            <>
              <Input
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <Textarea
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <Select onValueChange={setTaskPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setAssignedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign To" />
                </SelectTrigger>
                <SelectContent>
                  {assignableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBatchMode(!isBatchMode)}
            >
              {isBatchMode ? 'Single Task Mode' : 'Batch Mode'}
            </Button>
            <Button type="submit">Add Task{isBatchMode ? 's' : ''}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}



// AddTaskContainer Component
export function AddTaskContainer({ projectId }: { projectId: string }) {
  const { data: assignableUsers, isLoading: isLoadingUsers } = useAssignableUsers(projectId);
  const addTaskMutation = useAddTask();

  const handleSubmit = (taskData: Omit<TaskData, 'projectId'>) => {
    addTaskMutation.mutate({
      ...taskData,
      projectId,
    });
  };

  if (isLoadingUsers) {
    return <p>Loading users...</p>;
  }

  return (
    <AddTaskForm
      onClose={() => console.log('Form Closed')}
      assignableUsers={assignableUsers || []}
      onSubmit={handleSubmit}
      projectId={projectId}
    />
  );
}
