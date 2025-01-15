import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { pid: string } }
) {
    try {
        const { pid } = await params;

        // Validate Project ID
        if (!pid) {
            return NextResponse.json(
                { error: "Project ID is required" },
                { status: 400 }
            );
        }

        // Fetch assignable users
        const assignableUsers = await prisma.projectAssignment.findMany({
            where: { projectId: pid },
            include: { user: true },
        });

        // Map users with required fields
        const users = assignableUsers.map(({ user }) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image, // Use 'image' as per your schema
        }));
        
        return NextResponse.json(users);
    } catch (error) {
        // Narrow the type of error
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        console.error("Error fetching assignable users:", errorMessage);

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
