"use client";

import { ProjectHeader, TeamMember } from "./project-header";

const sampleTeamMembers: TeamMember[] = [
    {
        id: "1",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "2",
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "3",
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "4",
        name: "Diana Ross",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "5",
        name: "Edward Norton",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: "6",
        name: "Fiona Apple",
        avatar: "/placeholder.svg?height=32&width=32",
    },
];

export default function DashboardPage() {
    const handleProjectNameChange = (newName: string) => {
        console.log("Project name changed:", newName);
        // Here you would typically update the project name in your backend
    };

    const handleShare = () => {
        console.log("Share button clicked");
        // Here you would typically open a share dialog or perform a share action
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProjectHeader
                initialProjectName="My Awesome Project"
                teamMembers={sampleTeamMembers}
                onProjectNameChange={handleProjectNameChange}
                onShare={handleShare}
            />
            <main className="p-4">
                {/* Your dashboard content goes here */}
                <p>Dashboard content</p>
            </main>
        </div>
    );
}
