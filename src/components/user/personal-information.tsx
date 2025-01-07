"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function PersonalInformation() {
    const [displayName, setDisplayName] = useState("John Doe");
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Personal information updated",
            description: "Your personal information has been saved.",
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select>
                        <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">Eastern Time</SelectItem>
                            <SelectItem value="pst">Pacific Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="language">Language Preference</Label>
                    <Select>
                        <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select>
                        <SelectTrigger id="dateFormat">
                            <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
            </div>
        </div>
    );
}
