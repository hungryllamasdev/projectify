import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { token: string } }
) => {
    const { token } = await params;

    if (!token) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
        const inviteToken = await prisma.inviteToken.findFirst({
            where: {
                token,
            },
            include: {
                project: true,
            },
        });

        if (!inviteToken) {
            return NextResponse.json(
                { error: "Invalid or expired link" },
                { status: 404 }
            );
        }

        console.log(inviteToken);

        const isTokenValid = (token) => {
            const now = new Date();
            return (
                new Date(token.expirationDate) > now &&
                token.uses < token.maxUses
            );
        };

        console.log(isTokenValid(inviteToken));

        return isTokenValid(inviteToken)
            ? NextResponse.json({
                  project: inviteToken.project,
              })
            : NextResponse.json(
                  { error: "Invalid or expired link" },
                  { status: 404 }
              );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

export const POST = async (
    req: NextRequest,
    { params }: { params: { token: string } }
) => {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;
    const body = await req.json();
    const { projectId } = body;

    if (!projectId) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    try {
        const inviteToken = await prisma.inviteToken.findFirst({
            where: {
                token,
            },
        });

        if (!inviteToken) {
            return NextResponse.json(
                { error: "Invalid or expired link" },
                { status: 404 }
            );
        }

        // Check if the user is already a member of the project
        const existingMember = await prisma.projectAssignment.findFirst({
            where: {
                projectId,
                userId: session.user.id,
            },
        });

        if (existingMember) {
            return NextResponse.json({
                message: "You are already a member of this project",
            });
        }

        // Add the user to the project
        await prisma.projectAssignment.create({
            data: {
                userId: session.user.id,
                projectId,
                role: "MEMBER",
            },
        });

        await prisma.inviteToken.update({
            where: { token },
            data: {
                uses: { increment: 1 },
            },
        });

        return NextResponse.json(
            { message: "Successfully joined the project" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
