import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "./Calendar";
import { EditTaskPopup } from "./EditTaskPopup";
import { TaskItem } from "./TaskItem";

interface TaskDetailsProps {
    tasks: Task[];
    selectedDate: Date | null;
    onTaskUpdate: (updatedTask: Task) => void;
    onTaskDelete: (taskId: string) => void;
}

export function TaskDetails({
    tasks,
    selectedDate,
    onTaskUpdate,
    onTaskDelete,
}: TaskDetailsProps) {
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }, [tasks]);

    if (!selectedDate) {
        return null;
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Tasks for {selectedDate.toDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
                {sortedTasks.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No tasks for this date.
                    </p>
                ) : (
                    <ul
                        className="space-y-4"
                        role="list"
                        aria-label="Task list"
                    >
                        {sortedTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onEdit={() => setEditingTask(task)}
                            />
                        ))}
                    </ul>
                )}
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
