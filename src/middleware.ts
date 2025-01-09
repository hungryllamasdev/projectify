import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

const protectedRoutes: string[] = [];

export default async function middleware(request: NextRequest) {
    const session = await auth()
    const {pathname} = request.nextUrl

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: []
}