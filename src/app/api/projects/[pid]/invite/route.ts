import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { auth } from "@/auth";

export const POST = async (
    req: NextRequest,
    { params }: { params: { pid: string } }
) => {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pid } = await params;
    const body = await req.json();
    const { expirationTime, maxUses, accessLevel } = body;

    if (!pid || !expirationTime || !maxUses || !accessLevel) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    console.log(body)

    try {
        const project = await prisma.project.findUnique({
            where: { id: pid },
            include: { members: true },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        const token = nanoid(32);
        const expirationDate = new Date(Date.now() + expirationTime * 1000);

        const inviteToken = await prisma.inviteToken.create({
            data: {
                token,
                projectId: pid,
                expirationDate,
                maxUses,
                uses: 0,
                accessLevel,
            },
        });

        return NextResponse.json({ token, expirationDate }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
