import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { pid: string } }
) {
    try {
        const { pid } = params;

        if (!pid) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            );
        }

        const assignableUsers = await prisma.projectAssignment.findMany({
            where: { projectId: pid },
            include: { user: true },
        });

        return NextResponse.json(
            assignableUsers.map(({ user }) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            }))
        );
    } catch (error) {
        console.error("Error fetching assignable users:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching assignable users" },
            { status: 500 }
        );
    }
}
