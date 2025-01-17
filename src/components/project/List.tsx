import { columns } from "./list/columns";
import { DataTable } from "./list/data-table";

interface Task {
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

interface ListProps {
    data: Task[];
}

export default function List({ data }: ListProps) {
    const transformedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        type: task.type,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        label: task.type.toLowerCase(),
        priority: task.priority,
    }));

    return (
        <div>
            <DataTable data={transformedTasks} columns={columns} />
        </div>
    );
}
