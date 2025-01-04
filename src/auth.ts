import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    session: {
        strategy: "jwt", // Use JWT sessions
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                // Use `upsert` to ensure the user exists in the database
                const user = await prisma.user.upsert({
                    where: { email: profile.email },
                    update: {
                        name: profile.name,
                        avatar: profile.picture, // Matching `avatar` in your schema
                    },
                    create: {
                        email: profile.email,
                        name: profile.name,
                        avatar: profile.picture,
                    },
                });

                // Add the user ID to the token
                token.id = user.id;
                token.avatar = user.avatar;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach the user's ID from the token to the session object
            if (token) {
                session.user.id = token.id;
                session.user.avatar = token.avatar;
            }
            return session;
        },
    },
});
