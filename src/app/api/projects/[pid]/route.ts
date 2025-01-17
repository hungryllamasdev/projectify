import { NextResponse, NextRequest } from "next/server";
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// DELETE: Delete a project by ID
export async function DELETE(request: NextRequest, { params }: { params: { pid: string } }) {
    const { pid } = params;

    // Authenticate user
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: pid },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        if (project.ownerID !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.project.delete({ where: { id: pid } });

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}   

export async function PATCH(
    req: NextRequest,
    { params }: { params: { pid: string } }
) {
    const { pid } = params;

    try {
      
        // Authenticate user
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
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

// GET: Fetch project details
export async function GET(request: NextRequest, { params }: { params: { pid: string } }) {
    const { pid } = await params;

    // Authenticate user
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {

        const userId = session.user.id;

        const project = await prisma.project.findUnique({
            where: { id: pid },
            include: {
                owner: true,
                members: { include: { user: true } },
                tasks: true,
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const isMember = project.members.some(
            (member) => member.userId === userId
        );

        if (!isMember && project.ownerID !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
