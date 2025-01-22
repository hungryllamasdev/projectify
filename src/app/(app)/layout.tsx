import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "next-auth/react";

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
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <SessionProvider>
            <body className="bg-background text-foreground">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        <div className="flex min-h-screen">
                            <Sidebar />
                            <main className="flex-1 p-6 overflow-auto">
                                {children}
                            </main>
                        </div>
                        <Toaster />
                    </QueryProvider>
                </ThemeProvider>
            </body>
            </SessionProvider>
        </html>
    );
}
