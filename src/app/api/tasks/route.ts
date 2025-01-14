import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectID, title, type, description, priority, dueDate, userID } = body;

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
                type: 'CREATE_TASK',
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
