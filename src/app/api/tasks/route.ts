import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Fetch user's projects
        const userProjects = await prisma.projectAssignment.findMany({
            where: { userId },
            include: { project: true },
        });

        const projectIds = userProjects.map(
            (assignment) => assignment.projectId
        );

        // Fetch tasks for user's projects
        const tasks = await prisma.task.findMany({
            where: {
                projectID: { in: projectIds },
                assigneeId: session.user.id,
            },
            orderBy: { dueDate: "asc" },
        });

        // Fetch pinned tasks
        const pinnedTasks = tasks.filter((task) => task.isPinned);

        // Fetch upcoming deadlines (tasks due in the next 7 days)
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        const upcomingDeadlines = tasks.filter(
            (task) => task.dueDate && task.dueDate <= oneWeekFromNow
        );

        // Calculate project progress
        const projectProgress = await Promise.all(
            userProjects.map(async ({ project }) => {
                const totalTasks = await prisma.task.count({
                    where: { projectID: project.id },
                });
                const completedTasks = await prisma.task.count({
                    where: { projectID: project.id, isCompleted: true },
                });
                const progress =
                    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                return {
                    id: project.id,
                    name: project.name,
                    progress: Math.round(progress),
                    description: project.description,
                };
            })
        );

        return NextResponse.json({
            myTasks: tasks.map((task) => ({
                id: task.id,
                title: task.title,
                status: task.status,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                type: task.type,
            })),
            projects: projectProgress,
            pinnedTasks: pinnedTasks.map((task) => ({
                id: task.id,
                title: task.title,
                status: task.status,
                description: task.description,
                dueDate: task.dueDate,
            })),
            upcomingDeadlines: upcomingDeadlines.map((task) => ({
                id: task.id,
                title: task.title,
                date: task.dueDate,
                description: task.description,
            })),
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            projectID,
            title,
            type,
            description,
            priority,
            dueDate,
            userID,
        } = body;

        if (!projectID || !title || !type || !priority) {
            return NextResponse.json(
                { error: "projectID, title, type, priority are required" },
                { status: 400 }
            );
        }

        // Create the task
        const newTask = await prisma.task.create({
            data: {
                projectID,
                title,
                type,
                description: description || null,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
            },
        });

        // Log the activity
        await prisma.activityLog.create({
            data: {
                projectId: projectID,
                userId: userID || null,
                type: "CREATE_TASK",
                taskId: newTask.id,
                timestamp: new Date(),
            },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json(
            { error: "An error occurred while creating the task" },
            { status: 500 }
        );
    }
}
