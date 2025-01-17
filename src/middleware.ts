import NextAuth from "next-auth";
import authConfig from "./auth.config";

const protectedRoutes = ["/dashboard", "/p"];

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;
    const isAuthRoute = pathname.startsWith("/sign-"); // Matches `/sign-in` and `/sign-up`
    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname.startsWith(route) // Matches `/dashboard`, `/user`, `/p`, and deeper paths
    );

    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/dashboard`);
    }

    if (!isLoggedIn && isAuthRoute) {
        return;
    }

    if (!isLoggedIn && isProtectedRoute) {
        console.log("Protected Route");
        return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/sign-in`);
    }
    console.log(req.auth);
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
