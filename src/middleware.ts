import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;
    const isAuthRoute = pathname.startsWith("/sign-"); 
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/p");

    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/dashboard`);
    }

    if (!isLoggedIn && isProtectedRoute) {
        return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/sign-in`);
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};