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
        const { name, description, startDate } = body;

        if (!name || !description || !startDate) {
            return NextResponse.json(
                { error: "name, description, startDate are required" },
                { status: 400 }
            );
        }

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                startDate: new Date(startDate),
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
