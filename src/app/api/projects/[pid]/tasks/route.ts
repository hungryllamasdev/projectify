import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest, { params }: { params: { pid: string } }) {
    const { pid } = await params;

    try {
        const session = await auth();

        // Check if the user is authenticated
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Check if the user is a member of the project
        const isMember = await prisma.projectAssignment.findFirst({
            where: {
                projectId: pid,
                userId,
            },
        });

        if (!isMember) {
            return NextResponse.json(
                { error: "Forbidden: You are not a member of this project." },
                { status: 403 }
            );
        }

        // Fetch all tasks for the project
        const tasks = await prisma.task.findMany({
            where: { projectID: pid },
        });

        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST: Create a new task for a project
export async function POST(request: NextRequest, { params }: { params: { pid: string } }) {
    const { pid } = await params;

    try {
        const session = await auth();

        // Check if the user is authenticated
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Check if the user is a member of the project
        const isMember = await prisma.projectAssignment.findFirst({
            where: {
                projectId: pid,
                userId,
            },
        });

        if (!isMember) {
            return NextResponse.json(
                { error: "Forbidden: You are not a member of this project." },
                { status: 403 }
            );
        }

        // Parse the request body
        const body = await request.json();
        const { title, type, description, priority, dueDate } = body;

        // Validate required fields
        if (!title || !type || !priority) {
            return NextResponse.json(
                { error: "title, type, and priority are required fields." },
                { status: 400 }
            );
        }

        // Create the new task
        const newTask = await prisma.task.create({
            data: {
                projectID: pid,
                title,
                type,
                description,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
            },
        });

        // Log the activity
        await prisma.activityLog.create({
            data: {
                projectId: pid,
                userId,
                type: "CREATE_TASK",
                taskId: newTask.id,
            },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
