import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { pid: string } }
) {
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
}

export async function PATCH(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    const { email } = session.user;

    try {
        const body = await req.json();
        const { name } = body;

        // Validate input
        if (name && typeof name !== "string") {
            return new Response(JSON.stringify({ error: "Invalid name" }), {
                status: 400,
            });
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name,
            },
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
