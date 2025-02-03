import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account && profile) {
                // Use `upsert` to ensure the user exists in the database
                const user = await prisma.user.upsert({
                    where: { email: profile.email! },
                    update: {
                        name: profile.name,
                        image: profile.picture, // Matching `avatar` in your schema
                    },
                    create: {
                        email: profile.email!,
                        name: profile.name,
                        image: profile.picture,
                    },
                });

                // Add the user ID to the token
                token.id = user.id;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token, user }) {
            // Attach the user's ID from the token to the session object
            if (token) {
                session.user.id = token.id;
                session.user.image = token.image;
            }
            // session.user.id = token.id;
            // session.user.image = token.image;

            // console.log("session in auth callback", session);

            return session;
        },

        // authorized: async ({ auth }) => {
        //     // Logged in users are authenticated, otherwise redirect to login page
        //     return !!auth;
        // },
    },
    ...authConfig,
});
