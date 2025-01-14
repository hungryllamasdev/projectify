import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { pid: string } }
) {
    const { pid } = params;

    try {
        const updates = await req.json();

        const allowedFields = ["name", "description", "startDate"];
        const invalidFields = Object.keys(updates).filter(
            (field) => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return NextResponse.json(
                { error: `Invalid fields: ${invalidFields.join(", ")}` },
                { status: 400 }
            );
        }

        const updatedProject = await prisma.project.update({
            where: { id: pid },
            data: updates,
        });

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { pid: string } }
) {
    const { pid } = params;

    try {
        const project = await prisma.project.findUnique({
            where: { id: pid },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        await prisma.project.delete({
            where: { id: pid },
        });

        return NextResponse.json(
            { message: "Project deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
    } catch (error) {}
}
