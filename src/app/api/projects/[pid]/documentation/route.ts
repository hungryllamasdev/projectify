import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch the documentation for a given project
export async function GET(
    request: Request,
    { params }: { params: { pid: string } }
) {
    try {
        const { pid } = await params;
        let document = await prisma.document.findUnique({
            where: { projectId: pid },
        });

        if (!document) {
            document = {
                id: "",
                title: "Project Documentation",
                content: "<p>Start writing your documentation here...</p>",
                projectId: pid,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        return NextResponse.json({ document });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PATCH: Update (or create) the documentation for a given project
export async function PATCH(
    request: Request,
    { params }: { params: { pid: string } }
) {
    try {
        const body = await request.json();
        const { title, content } = body;
        const { pid } = await params;

        // Try to find an existing documentation record.
        let document = await prisma.document.findUnique({
            where: { projectId: pid },
        });

        if (document) {
            // Update the existing document.
            document = await prisma.document.update({
                where: { projectId: pid },
                data: { title, content },
            });
        } else {
            // If none exists, create a new one.
            document = await prisma.document.create({
                data: {
                    title,
                    content,
                    projectId: pid,
                },
            });
        }

        return NextResponse.json({ document });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
