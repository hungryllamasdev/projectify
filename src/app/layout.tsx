import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/providers/react-query-provider";
// import Providers from "./providers";

export const metadata: Metadata = {
    title: "Project-ify",
    description: "million dollar baby",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    <div className="flex">
                        <Sidebar />
                        <main className="flex-1">{children}</main>
                    </div>
                    <Toaster />
                </QueryProvider>
            </body>
        </html>
    );
}
