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
