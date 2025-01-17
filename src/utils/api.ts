export const createProject = async (project) => {
    const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
    });

    return response.json();
};

