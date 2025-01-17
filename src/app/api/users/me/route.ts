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
