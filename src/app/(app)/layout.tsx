// import type { Metadata } from "next";
// import "./globals.css";
// import { Sidebar } from "@/components/sidebar/sidebar";
// import { Toaster } from "@/components/ui/toaster";
// import QueryProvider from "@/components/providers/react-query-provider";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//     title: "Project-ify",
//     description: "million dollar baby",
// };

// export default function RootLayout({
//     children,
// }: Readonly<{
//     children: React.ReactNode;
// }>) {
//     return (
//         <html lang="en">
//             <body>
//                 <QueryProvider>
//                     <div className="flex">
//                         <Sidebar />
//                         <main className="flex-1">{children}</main>
//                     </div>
//                     <Toaster />
//                 </QueryProvider>
//             </body>
//         </html>
//     );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/providers/react-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Project-ify",
    description: "Million dollar baby",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={inter.className}>
            <body className="bg-background text-foreground">
                <QueryProvider>
                    <div className="flex min-h-screen">
                        <Sidebar />
                        <main className="flex-1 p-6 overflow-auto">
                            {children}
                        </main>
                    </div>
                    <Toaster />
                </QueryProvider>
            </body>
        </html>
    );
}
