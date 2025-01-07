"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, CreditCard, ShieldCheck, Folders, Bell } from "lucide-react";

// Navigation items configuration
const navItems = [
    { name: "Account", icon: User, href: "/account" },
    { name: "Billing", icon: CreditCard, href: "/billing" },
    { name: "Security", icon: ShieldCheck, href: "/security" },
    { name: "Projects", icon: Folders, href: "/projects" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
];

export default function SettingsLayout({ children }) {
    const router = useRouter();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex flex-col w-[280px] bg-white border-r">
                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-2 space-y-1">
                        {navItems.map((item) => {
                            const isActive = router.pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-150 ease-in-out ${
                                            isActive
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">{children}</div>
        </div>
    );
}
