"use client";

import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
    id: string;
    title: string;
    status: "Todo" | "In Progress" | "Done";
    createdDate: string;
    dueDate: string;
    assignee: string;
    priority: "Low" | "Medium" | "High";
};

const SortableTask = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 mb-2 rounded shadow-sm border border-gray-200 cursor-move w-full flex justify-between items-center"
        >
            <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                <p className="text-sm text-gray-500">
                    Assignee: {task.assignee}
                </p>
                <p
                    className={`text-sm font-semibold ${
                        task.priority === "High"
                            ? "text-red-500"
                            : task.priority === "Medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                    }`}
                >
                    Priority: {task.priority}
                </p>
            </div>
        </div>
    );
};

export default function TaskManagement() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Complete project proposal",
            status: "In Progress",
            createdDate: "2023-06-01",
            dueDate: "2023-06-15",
            assignee: "Alice",
            priority: "High",
        },
        {
            id: "2",
            title: "Review code changes",
            status: "Todo",
            createdDate: "2023-06-02",
            dueDate: "2023-06-10",
            assignee: "Bob",
            priority: "Medium",
        },
        {
            id: "3",
            title: "Update documentation",
            status: "Done",
            createdDate: "2023-06-03",
            dueDate: "2023-06-05",
            assignee: "Charlie",
            priority: "Low",
        },
    ]);

    const [filters, setFilters] = useState({
        dueDate: "",
        assignee: "",
        priority: "",
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id
                );
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const filteredTasks = tasks.filter(
        (task) =>
            (filters.dueDate ? task.dueDate === filters.dueDate : true) &&
            (filters.assignee ? task.assignee === filters.assignee : true) &&
            (filters.priority ? task.priority === filters.priority : true)
    );

    const uniqueDueDates = Array.from(
        new Set(tasks.map((task) => task.dueDate))
    );
    const uniqueAssignees = Array.from(
        new Set(tasks.map((task) => task.assignee))
    );
    const priorities = ["Low", "Medium", "High"];

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-4">Task Management</h1> */}

            <div className="mb-4 flex flex-wrap gap-2">
                <select
                    value={filters.dueDate}
                    onChange={(e) =>
                        setFilters({ ...filters, dueDate: e.target.value })
                    }
                    className="p-2 border rounded"
                >
                    <option value="">Filter by Due Date</option>
                    {uniqueDueDates.map((date) => (
                        <option key={date} value={date}>
                            {date}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.assignee}
                    onChange={(e) =>
                        setFilters({ ...filters, assignee: e.target.value })
                    }
                    className="p-2 border rounded"
                >
                    <option value="">Filter by Assignee</option>
                    {uniqueAssignees.map((assignee) => (
                        <option key={assignee} value={assignee}>
                            {assignee}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) =>
                        setFilters({ ...filters, priority: e.target.value })
                    }
                    className="p-2 border rounded"
                >
                    <option value="">Filter by Priority</option>
                    {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                            {priority}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() =>
                        setFilters({ dueDate: "", assignee: "", priority: "" })
                    }
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Clear Filters
                </button>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center text-gray-500">No tasks found</div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={filteredTasks}
                        strategy={horizontalListSortingStrategy}
                    >
                        {filteredTasks.map((task) => (
                            <SortableTask key={task.id} task={task} />
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
