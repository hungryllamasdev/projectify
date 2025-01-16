import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2 } from 'lucide-react';
import { Task } from "./Calendar";
import { EditTaskPopup } from "./EditTaskPopup";

interface TaskDetailsProps {
  tasks: Task[];
  selectedDate: Date | null;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskDetails({ tasks, selectedDate, onTaskUpdate, onTaskDelete }: TaskDetailsProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (!selectedDate || tasks.length === 0) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tasks for {selectedDate.toDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="border-b pb-2 last:border-b-0 relative">
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-500">{task.description}</p>
              <div className="flex justify-between mt-2 text-sm">
                <span className={`px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2"
                onClick={() => setEditingTask(task)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
      {editingTask && (
        <EditTaskPopup
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
        />
      )}
    </Card>
  );
}

function getStatusColor(status: Task['status']) {
  const colors = {
    BACKLOG: "bg-gray-200 text-gray-800",
    TODO: "bg-yellow-200 text-yellow-800",
    IN_PROGRESS: "bg-blue-200 text-blue-800",
    DONE: "bg-green-200 text-green-800"
  };
  return colors[status];
}

function getPriorityColor(priority: Task['priority']) {
  const colors = {
    HIGH: "bg-red-200 text-red-800",
    MEDIUM: "bg-orange-200 text-orange-800",
    LOW: "bg-green-200 text-green-800"
  };
  return colors[priority];
}

