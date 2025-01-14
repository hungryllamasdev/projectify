"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityLog from "@/components/project/ActivityLog";
import Header from "@/components/project/Header";

export default function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { projectId: string };
}) {
    // const router = useRouter();
    // const pathname = usePathname();

    // // Get user session using NextAuth
    // const session = await auth();

    // if (!session) {
    //     // Redirect to login if user is not authenticated
    //     router.push("/login");
    //     return null;
    // }

    // const { user } = session;
    // const projectId = await params.projectId;

    // const pathParts = pathname.split("/");
    // const currentPath = pathParts[3] || "overview";

    // const handleTabChange = (value: string) => {
    //     if (value === "overview") {
    //         router.push(`/p/${projectId}`);
    //     } else {
    //         router.push(`/p/${projectId}/${value}`);
    //     }
    // };

    const projectId = 2;

    return (
        <div className="container mx-auto p-6">
            <Header projectId={projectId} />

            <Tabs className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="gantt">Gantt</TabsTrigger>
                    <TabsTrigger value="documentation">
                        Documentation
                    </TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                {children}
            </Tabs>

            {/* Display activity log for the project */}
            <ActivityLog projectId={projectId} />
        </div>
    );
}
