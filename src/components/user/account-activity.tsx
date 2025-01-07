import { Clock, LogIn, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
    {
        icon: LogIn,
        description: "Logged in from new device",
        timestamp: "2 hours ago",
        location: "New York, USA",
        status: "success",
    },
    {
        icon: Settings,
        description: "Changed password",
        timestamp: "1 day ago",
        location: "New York, USA",
        status: "success",
    },
    {
        icon: LogIn,
        description: "Logged in",
        timestamp: "3 days ago",
        location: "San Francisco, USA",
        status: "success",
    },
];

export function AccountActivity() {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">
                                {activity.description}
                            </p>
                            <p className="text-sm text-gray-500">
                                {activity.timestamp} • {activity.location}
                            </p>
                        </div>
                        <div
                            className={`text-sm ${activity.status === "success" ? "text-green-500" : "text-red-500"}`}
                        >
                            {activity.status === "success"
                                ? "Success"
                                : "Failed"}
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="mt-4">
                View All Activity
            </Button>
        </div>
    );
}
