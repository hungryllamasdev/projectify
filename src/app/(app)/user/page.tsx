"use client";

import { useState } from "react";
import { User, CreditCard, ShieldCheck, Folders, Bell } from "lucide-react";
import { ProfileOverview } from "@/components/user/profile-overview";
import { PersonalInformation } from "@/components/user/personal-information";
import { ConnectedAccounts } from "@/components/user/connected-accounts";
import { AccountActivity } from "@/components/user/account-activity";
import { ExportData } from "@/components/user/export-data";
import { CurrentPlan } from "@/components/user/current-plan";
import { PaymentMethods } from "@/components/user/payment-methods";
import { BillingHistory } from "@/components/user/billing-history";
import { UsageAndLimits } from "@/components/user/usage-and-limits";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Navigation items configuration
const navItems = [
    { name: "Account", icon: User, id: "account" },
    { name: "Billing", icon: CreditCard, id: "billing" },
    { name: "Security", icon: ShieldCheck, id: "security" },
    { name: "Projects", icon: Folders, id: "projects" },
    { name: "Notifications", icon: Bell, id: "notifications" },
];

export default function UserPage() {
    const [activeTab, setActiveTab] = useState("account");
    const ContentSection = () => {
        switch (activeTab) {
            case "account":
                return (
                    <>
                        <div className="container mx-auto px-6 py-8 space-y-8">
                            <ProfileOverview />
                            <PersonalInformation />
                            <ConnectedAccounts />
                            <AccountActivity />
                            <ExportData />
                        </div>
                    </>
                );
            case "billing":
                return (
                    <>
                        <div className="container mx-auto px-6 py-8 space-y-8">
                            <CurrentPlan />
                            <PaymentMethods />
                            <BillingHistory />
                            <UsageAndLimits />
                        </div>
                    </>
                );
            case "security":
                return <div>Security Content</div>;
            case "projects":
                return <div>Projects Content</div>;
            case "notifications":
                return <div>Notifications Content</div>;
            default:
                return <div>404 - Section not found</div>;
        }
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Fixed Sidebar */}
            <div className="w-64 border-r bg-background">
                <div className="px-6 py-4">
                    <h2 className="text-xl font-semibold">User Settings</h2>
                </div>
                <nav className="px-4">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                activeTab === item.id
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            <item.icon className="mr-3 h-4 w-4" />
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center border-b px-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/user">
                                    User
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {
                                        navItems.find(
                                            (item) => item.id === activeTab
                                        )?.name
                                    }
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-4xl">
                        <h1 className="mb-6 text-3xl font-bold tracking-tight">
                            {
                                navItems.find((item) => item.id === activeTab)
                                    ?.name
                            }{" "}
                            Settings
                        </h1>
                        <ContentSection />
                    </div>
                </main>
            </div>
        </div>
    );
}
