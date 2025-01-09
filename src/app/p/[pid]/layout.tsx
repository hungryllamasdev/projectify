// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Navbar from "@/components/projects/Navbar";
// import { useUser } from "@/context/UserContext";
import ActivityLog from "@/components/project/ActivityLog";
import Header from "@/components/project/Header";
// import HorizontalNavigation from "@/components/project/HorizontalNavigation";

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ pid: string }>;
}) {
    // const router = useRouter();
    // const pathname = usePathname();
    // const { userId, isAuth } = useUser();

    // const pathParts = pathname.split("/");
    // const projectId = pathParts[2];
    // const currentPath = pathParts[3];

    // const currentTab = !currentPath ? "overview" : currentPath;

    // const [projectName, setProjectName] = useState("Loading...");
    // const [canAccessBacklog, setCanAccessBacklog] = useState(false);

    /* useEffect(() => {
        if (!isAuth || !userId) {
            router.push("/login"); // Redirect if not authenticated
            return;
        }

        const fetchProjectDetails = async () => {
            try {
                const res = await fetch(`/api/project/${projectId}`);
                if (!res.ok) throw new Error("Failed to fetch project details");
                const data = await res.json();
                setProjectName(data.name);
            } catch (error) {
                console.error("Error fetching project details:", error);
                setProjectName("Unknown Project");
            }
        };

        const checkAuthorization = async () => {
            try {
                const res = await fetch(`/api/project/${projectId}/auth`);
                if (!res.ok) throw new Error("Failed to verify authorization");
                const data = await res.json();
                setCanAccessBacklog(data.authorized);
            } catch (error) {
                console.error("Error verifying authorization:", error);
                setCanAccessBacklog(false);
            }
        };

        fetchProjectDetails();
        checkAuthorization();
    }, [projectId, userId, isAuth, router]); */

    const handleTabChange = (value: string) => {
        if (value === "overview") {
            router.push(`/p/${projectId}`);
        } else {
            router.push(`/p/${projectId}/${value}`);
        }
    };

    const pid = (await params).pid;

    return (
        <div className="container mx-auto p-6">
            {/* <Navbar projectName={projectName} href={`/p/${projectId}`} /> */}
            <Header projectId={pid} />
            {/* <HorizontalNavigation projectId={params.pid} /> */}
            <Tabs
                // value={currentTab}
                // onValueChange={handleTabChange}
                className="space-y-4"
            >
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                    {/* {canAccessBacklog && (
                        <TabsTrigger value="backlog">Backlog</TabsTrigger>
                    )} */}
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                    <TabsTrigger value="gantt">Gantt</TabsTrigger>
                    <TabsTrigger value="documentation">
                        Documentation
                    </TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                {children}
            </Tabs>
            <ActivityLog projectId={pid} />
        </div>
    );
}
