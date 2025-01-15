"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

interface Task {
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    dueDate: string | null;
    description: string | null;
}

interface ProjectData {
    name: string;
    progress: number;
    tasks: {
        byStatus: {
            total: number;
            completed: number;
            inProgress: number;
            notStarted: number;
        };
        byType: {
            FEATURE: number;
            BUG: number;
            TASK: number;
        };
        list: Task[];
    };
    team: {
        name: string;
        avatar: string | null;
    }[];
    timeTracked: string;
    currentSprint: {
        name: string;
        endDate: string;
    };
}

export default function ProjectDashboard() {
    const [projectData, setProjectData] = useState<ProjectData>({
        name: "Project Phoenix",
        progress: 65,
        tasks: {
            byStatus: {
                total: 120,
                completed: 80,
                inProgress: 30,
                notStarted: 10,
            },
            byType: {
                FEATURE: 50,
                BUG: 40,
                TASK: 30,
            },
            list: [
                {
                    id: "1",
                    title: "Implement user login",
                    status: "completed",
                    type: "FEATURE",
                    priority: "high",
                    dueDate: "2025-01-20",
                    description: "Implement user authentication system",
                },
                {
                    id: "2",
                    title: "Fix payment gateway bug",
                    status: "inProgress",
                    type: "BUG",
                    priority: "critical",
                    dueDate: "2025-01-15",
                    description: "Resolve issues with payment processing",
                },
                {
                    id: "3",
                    title: "Write documentation for API",
                    status: "notStarted",
                    type: "TASK",
                    priority: "medium",
                    dueDate: "2025-01-25",
                    description: "Create comprehensive API documentation",
                },
            ],
        },
        team: [
            {
                name: "Alice Johnson",
                avatar: "https://example.com/avatar1.png",
            },
            { name: "Bob Smith", avatar: null },
            {
                name: "Charlie Brown",
                avatar: "https://example.com/avatar2.png",
            },
        ],
        timeTracked: "35h 20m",
        currentSprint: {
            name: "Sprint 5 - Beta Release Prep",
            endDate: "2025-01-15",
        },
    });

    const params = useParams();
    if (!projectData) return <div>No project data found</div>;

    return null; // The content is now rendered in the layout component
}

