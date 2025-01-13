import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch projects where the user is a member
        const userProjects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
        });

        return NextResponse.json(userProjects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching projects" },
            { status: 500 }
        );
    }
}
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        console.log("User ID", session?.user?.id);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, description, startDate } = body;
        console.log("body", body);
        if (!name || !description || !startDate) {
            return NextResponse.json(
                { error: "name, description, startDate are required" },
                { status: 400 }
            );
        }

        const newProject = await prisma.project.create({
            data: {
                ownerID: session.user.id,
                name,
                description,
                startDate: new Date(startDate),
                members: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER",
                    },
                },
            },
        });

        if (!newProject) {
            return NextResponse.json(
                { error: "An error occurred while creating the project" },
                { status: 500 }
            );
        }

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "An error occurred while creating the project" },
            { status: 500 }
        );
    }
}
