import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import type { Task } from "./Calendar";

interface TaskItemProps {
    task: Task;
    onEdit: () => void;
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
    return (
        <li className="border-b pb-4 last:border-b-0" role="listitem">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{task.title}</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEdit}
                    aria-label={`Edit task: ${task.title}`}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-sm text-gray-500 mb-2">{task.description}</p>
            <div className="flex justify-between items-center">
                <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}
                    role="status"
                >
                    {task.status}
                </span>
                <span
                    className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}
                    role="status"
                >
                    {task.priority}
                </span>
            </div>
        </li>
    );
}

function getStatusColor(status: Task["status"]) {
    const colors = {
        BACKLOG: "bg-gray-200 text-gray-800",
        TODO: "bg-yellow-200 text-yellow-800",
        IN_PROGRESS: "bg-blue-200 text-blue-800",
        DONE: "bg-green-200 text-green-800",
    };
    return colors[status];
}

function getPriorityColor(priority: Task["priority"]) {
    const colors = {
        HIGH: "bg-red-200 text-red-800",
        MEDIUM: "bg-orange-200 text-orange-800",
        LOW: "bg-green-200 text-green-800",
    };
    return colors[priority];
}
