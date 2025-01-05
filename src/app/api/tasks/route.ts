import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
}

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
}
