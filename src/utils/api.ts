import { ProjectItem } from "./types";

export const createProject = async (project) => {
    const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create project");
    }

    return response.json();
};

export const createInviteToken = async ({
    projectId,
    expirationTime,
    maxUses,
    accessLevel,
}: {
    projectId: string;
    expirationTime: number;
    maxUses: number;
    accessLevel: string;
}) => {
    const response = await fetch(`/api/projects/${projectId}/invite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ expirationTime, maxUses, accessLevel }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create invite token");
    }

    return response.json();
};

export const fetchTokenData = async (token: string) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/invite/${token}`
    );
    if (res.status === 404) {
        return null; // Invalid token
    }
    if (!res.ok) {
        throw new Error("Failed to fetch project data");
    }
    return res.json();
};

export const acceptInvitation = async (token: string, projectId: string) => {
    const response = await fetch(`/api/invite/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
    });

    if (!response.ok) {
        throw new Error("Failed to accept invitation");
    }

    return response.json();
};

export const declineInvitation = async () => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    throw new Error("Invitation declined");
};

export const fetchDashboardData = async () => {
    const res = await fetch("api/tasks");
    if (res.status === 404) {
        return null;
    }
    if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
    }
    return res.json();
};

export const getProjects = async (): Promise<ProjectItem[]> => {
    const response = await fetch('/api/projects')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  }