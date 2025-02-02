import React, { useEffect } from "react";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { labels } from "./data/data";

interface Task {
    label: string | undefined;
    id: string;
    projectID: string;
    title: string;
    type: "FEATURE" | "BUG" | "TASK";
    description?: string;
    status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
    isCompleted: boolean;
    isPinned: boolean;
    priority: "HIGH" | "MEDIUM" | "LOW";
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const task = row.original as Task;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedTask, setEditedTask] = useState<Partial<Task>>({});
    const queryClient = useQueryClient();

    const editTask = useMutation({
        mutationFn: async (updatedTask: Partial<Task>) => {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update task");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setIsEditDialogOpen(false);
            toast({
                title: "Success",
                description: "Task updated successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to update task",
                variant: "destructive",
            });
        },
    });

    const deleteTask = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/tasks/${task.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete task");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete task",
                variant: "destructive",
            });
        },
    });

    const handleEdit = () => {
        setEditedTask({
            title: task.title,
            type: task.type,
            description: task.description,
            status: task.status,
            isCompleted: task.isCompleted,
            isPinned: task.isPinned,
            priority: task.priority,
            dueDate: task.dueDate,
            projectID: task.projectID,
        });
        setIsEditDialogOpen(true);
    };

    const handleSave = () => {
        if (!editedTask.title?.trim()) {
            toast({
                title: "Error",
                description: "Task title cannot be empty",
                variant: "destructive",
            });
            return;
        }

        editTask.mutate(editedTask);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask.mutate();
        }
    };

    const handleFieldChange = (field: keyof Task, value: any) => {
        setEditedTask((prev) => ({
            ...prev,
            [field]: field === "status" ? value.toUpperCase() : value,
        }));
    };

    function handleMakeCopy(): void {
        throw new Error("Function not implemented.");
    }

    function handleFavorite(): void {
        throw new Error("Function not implemented.");
    }

    console.log(task);
    console.log("editedTask:", editedTask);

    useEffect(() => {
        if (isEditDialogOpen) {
            setEditedTask({
                title: task.title,
                type: task.type,
                description: task.description,
                status: task.status,
                isCompleted: task.isCompleted,
                isPinned: task.isPinned,
                priority: task.priority,
                dueDate: task.dueDate,
                projectID: task.projectID,
            });
        }
    }, [isEditDialogOpen, task]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={handleEdit}
                        disabled={editTask.isPending}
                    >
                        {editTask.isPending ? "Updating..." : "Edit"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMakeCopy}>
                        Make a copy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleFavorite}>
                        Favorite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={task.label}>
                                {labels.map((label) => (
                                    <DropdownMenuRadioItem
                                        key={label.value}
                                        value={label.value}
                                    >
                                        {label.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={deleteTask.isPending}
                        className="text-red-600"
                    >
                        {deleteTask.isPending ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label>Title</label>
                            <Input
                                value={editedTask.title || ""}
                                onChange={(e) =>
                                    handleFieldChange("title", e.target.value)
                                }
                                placeholder="Task title"
                                disabled={editTask.isPending}
                                defaultValue={editedTask.title}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label>Type</label>
                            <Select
                                value={editedTask.type}
                                onValueChange={(value) =>
                                    handleFieldChange("type", value)
                                }
                                disabled={editTask.isPending}
                                defaultValue={editedTask.type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FEATURE">
                                        Feature
                                    </SelectItem>
                                    <SelectItem value="BUG">Bug</SelectItem>
                                    <SelectItem value="TASK">Task</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label>Description</label>
                            <Textarea
                                value={editedTask.description || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Task description"
                                disabled={editTask.isPending}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label>Status</label>
                            <Select
                                value={editedTask.status}
                                onValueChange={(value) =>
                                    handleFieldChange("status", value)
                                }
                                disabled={editTask.isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BACKLOG">
                                        Backlog
                                    </SelectItem>
                                    <SelectItem value="TODO">Todo</SelectItem>
                                    <SelectItem value="IN_PROGRESS">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="DONE">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label>Priority</label>
                            <Select
                                value={editedTask.priority}
                                onValueChange={(value) =>
                                    handleFieldChange("priority", value)
                                }
                                disabled={editTask.isPending}
                                defaultValue={task.priority.toUpperCase()}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="MEDIUM">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <label>Due Date</label>
                            <Input
                                type="datetime-local"
                                value={
                                    editedTask.dueDate
                                        ? new Date(editedTask.dueDate)
                                              .toISOString()
                                              .slice(0, 16)
                                        : ""
                                }
                                onChange={(e) =>
                                    handleFieldChange(
                                        "dueDate",
                                        new Date(e.target.value)
                                    )
                                }
                                disabled={editTask.isPending}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Completed</label>
                            <Switch
                                checked={editedTask.isCompleted || false}
                                onCheckedChange={(checked) =>
                                    handleFieldChange("isCompleted", checked)
                                }
                                disabled={editTask.isPending}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label>Pinned</label>
                            <Switch
                                checked={editedTask.isPinned || false}
                                onCheckedChange={(checked) =>
                                    handleFieldChange("isPinned", checked)
                                }
                                disabled={editTask.isPending}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={editTask.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={editTask.isPending}
                        >
                            {editTask.isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
