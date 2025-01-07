"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast"


export function CurrentPlan() {
    const [progress, setProgress] = useState(66);
    const { toast } = useToast();

    const handleChangePlan = () => {
        toast({
            title: "Change Plan",
            description: "You've initiated the process to change your plan.",
        });
    };

    const handleCancelSubscription = () => {
        toast({
            title: "Cancel Subscription",
            description:
                "You've initiated the process to cancel your subscription.",
            variant: "destructive",
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold">Professional Plan</h2>
                    <Badge>Current Plan</Badge>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold">$29.99/mo</p>
                    <p className="text-sm text-gray-500">Billed monthly</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                <div>
                    <div className="flex justify-between text-sm font-medium">
                        <span>10 team members included</span>
                        <span>6/10 used</span>
                    </div>
                    <Progress value={progress} className="mt-2" />
                </div>
                <div>
                    <div className="flex justify-between text-sm font-medium">
                        <span>20 projects included</span>
                        <span>15/20 used</span>
                    </div>
                    <Progress value={75} className="mt-2" />
                </div>
            </div>
            <div className="mt-6 flex space-x-4">
                <Button onClick={handleChangePlan}>Change Plan</Button>
                <Button variant="outline" onClick={handleCancelSubscription}>
                    Cancel Subscription
                </Button>
            </div>
        </div>
    );
}
