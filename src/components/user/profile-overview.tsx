"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function ProfileOverview() {
    const [name, setName] = useState("John Doe");
    const [jobTitle, setJobTitle] = useState("Project Manager");
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Profile updated",
            description: "Your profile information has been saved.",
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <div className="w-[100px] h-[100px] rounded-full bg-gray-300"></div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-2">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-2xl font-bold"
                    />
                    <p className="text-gray-600">john@example.com</p>
                    <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="text-gray-600"
                    />
                    <div className="text-sm text-gray-500">
                        <p>Account created: January 1, 2023</p>
                        <p>Last login: May 15, 2023, 10:30 AM</p>
                    </div>
                </div>
            </div>
            <Button onClick={handleSave} className="mt-4">
                Save Changes
            </Button>
        </div>
    );
}
