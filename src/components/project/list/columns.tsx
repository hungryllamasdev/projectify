"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { labels, priorities, statuses } from "./data/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
import type { TeamMember } from "@/utils/types";
import type { Task } from "@/utils/types";

export const createColumns = (
    assignableUsers: TeamMember[]
): ColumnDef<Task>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "pinned",
        header: "Pinned",
        cell: ({ row }) => {
            const isPinned = row.getValue("pinned") as boolean;
            const taskId = row.original.id as string;

            const togglePinned = async () => {
                try {
                    const response = await fetch(`/api/tasks/${taskId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isPinned: !isPinned }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to update task");
                    }

                    // Refresh the data after successful update
                    row.toggleSelected(false);
                } catch (error) {
                    console.error("Error updating task:", error);
                }
            };

            return (
                <Checkbox
                    checked={isPinned}
                    onCheckedChange={togglePinned}
                    aria-label="Toggle pinned"
                />
            );
        },
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
    //   cell: ({ row }) => <div className="w-[80px] font-medium">{row.getValue("id")}</div>,
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("title")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
            const taskType = row.getValue("type").toLowerCase(); // Convert to lowercase
            const label = labels.find((label) => label.value === taskType);

            return label ? (
                <Badge variant="outline">{label.label}</Badge>
            ) : null;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id).toLowerCase()); // Normalize for filtering
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusObj = statuses.find(
                (s) => s.value === status.toLowerCase()
            );

            if (!statusObj) {
                return status;
            }

            return (
                <div className="flex w-[100px] items-center">
                    {statusObj.icon && (
                        <statusObj.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{statusObj.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "dueDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Due Date" />
        ),
        cell: ({ row }) => {
            const dueDate = row.getValue("dueDate") as Date | undefined;
            return dueDate ? format(new Date(dueDate), "dd/MM") : "-";
        },
    },
    {
        accessorKey: "priority",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Priority" />
        ),
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string;
            const priorityObj = priorities.find(
                (p) => p.value === priority.toLowerCase()
            );

            if (!priorityObj) {
                return priority;
            }

            return (
                <div className="flex items-center">
                    {priorityObj.icon && (
                        <priorityObj.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{priorityObj.label}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "assignedTo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Assigned To" />
        ),
        cell: ({ row }) => {
            const assignedToId = row.getValue("assignedTo") as string;
            const user = assignableUsers.find(
                (user) => user.id === assignedToId
            );
            if (!user) return "Unassigned";

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const assignedToId = row.getValue(id) as string;
            return value.includes(assignedToId || "unassigned");
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
