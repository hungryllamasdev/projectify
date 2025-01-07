import { ChromeIcon as Google, Slack, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const accounts = [
    {
        name: "Google",
        icon: Google,
        connected: true,
        lastSynced: "2 hours ago",
    },
    { name: "Slack", icon: Slack, connected: false },
    { name: "GitHub", icon: Github, connected: false },
];

export function ConnectedAccounts() {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
            <div className="space-y-4">
                {accounts.map((account) => (
                    <div
                        key={account.name}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <account.icon className="w-8 h-8" />
                            <div>
                                <h3 className="font-semibold">
                                    {account.name}
                                </h3>
                                {account.connected && (
                                    <p className="text-sm text-gray-500">
                                        Last synced: {account.lastSynced}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant={account.connected ? "outline" : "default"}
                        >
                            {account.connected ? "Disconnect" : "Connect"}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
