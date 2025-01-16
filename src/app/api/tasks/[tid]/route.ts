import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
    const { tid } = await params;

    try {
        const session = await auth();

            // Check if the user is authenticated
            if (!session || !session.user?.id) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

        const updateData = await request.json();

        const updatedTask = await prisma.task.update({
        where: {
            id: tid,
        },
        data: updateData,
        });

        await prisma.activityLog.create({
        data: {
            type: 'UPDATE_TASK',
            projectId: updatedTask.projectID,
            taskId: updatedTask.id,
        },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
        );
    }
    }

export async function DELETE(
request: NextRequest,
{ params }: { params: { tid: string } }
) {
    
    const {tid} = await params;
    try {
        const session = await auth();

        // Check if the user is authenticated
        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const task = await prisma.task.findUnique({
        where: { id: tid },
        select: { id: true, projectID: true }
        });

        if (!task) {
        return NextResponse.json(
            { error: 'Task not found' },
            { status: 404 }
        );
        }

        await prisma.task.delete({
        where: { id: tid }
        });

        await prisma.activityLog.create({
        data: {
            type: 'DELETE_TASK',
            projectId: task.projectID,
            taskId: task.id,
        },
        });

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
        );
    }
}