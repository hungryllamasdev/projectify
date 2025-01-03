// import { prisma } from "@/lib/prisma";
// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { session } from "@/lib/session";

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// const authOption: NextAuthOptions = {
//     session: {
//         strategy: "jwt",
//     },
//     providers: [
//         GoogleProvider({
//             clientId: GOOGLE_CLIENT_ID,
//             clientSecret: GOOGLE_CLIENT_SECRET,
//         }),
//     ],
//     callbacks: {
//         async signIn({ account, profile }) {
//             if (!profile?.email) {
//                 throw new Error("No profile");
//             }
//             await prisma.user.upsert({
//                 where: {
//                     email: profile.email,
//                 },
//                 create: {
//                     email: profile.email,
//                     name: profile.name,
//                 },
//                 update: {
//                     name: profile.name,
//                 },
//             });
//             return true;
//         },
//         session,
//         async jwt({ token, user, account, profile }) {
//             // Only need this if you want to pass through additional data
//             if (profile) {
//                 const user = await prisma.user.findUnique({
//                     where: {
//                         email: profile.email,
//                     },
//                 });
//                 if (!user) {
//                     throw new Error("No user found");
//                 }
//                 token.id = user.id;
//             }
//             return token;
//         },
//     },
// };

// const handler = NextAuth(authOption);
// export { handler as GET, handler as POST };

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
