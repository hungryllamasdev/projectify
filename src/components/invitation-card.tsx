"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface InvitationData {
    projectName: string;
    projectLogo: string;
    projectDescription: string;
    inviterName: string;
    isLoggedIn: boolean;
    token: string;
}

export default function InvitationCard({
    invitation,
}: {
    invitation: InvitationData;
}) {
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAccept = async () => {
        setStatus("loading");
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (invitation.token === "error") {
            setStatus("error");
            setErrorMessage("An error occurred while accepting the invitation");
        } else {
            setStatus("success");
        }
    };

    const handleDecline = async () => {
        setStatus("loading");
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStatus("error");
        setErrorMessage("Invitation declined");
    };

    if (status === "loading") {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Processing your request...</p>
                </CardContent>
            </Card>
        );
    }

    if (status === "error") {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <XCircle className="h-16 w-16 text-destructive mx-auto" />
                    <p className="mt-4 text-lg">
                        {errorMessage || "An error occurred"}
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (status === "success") {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                    >
                        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    </motion.div>
                    <p className="mt-4 text-lg">
                        You&apos;ve successfully joined {invitation.projectName}!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                    <Image
                        src={invitation.projectLogo || "/placeholder.svg"}
                        alt={`${invitation.projectName} logo`}
                        width={64}
                        height={64}
                    />
                </div>
                <CardTitle className="text-2xl">
                    You&apos;ve been invited to join
                </CardTitle>
                <CardTitle className="text-3xl font-bold text-primary">
                    {invitation.projectName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {invitation.projectDescription && (
                    <p className="text-center text-muted-foreground mb-4">
                        {invitation.projectDescription}
                    </p>
                )}
                <p className="text-center text-sm text-muted-foreground">
                    Invited by {invitation.inviterName}
                </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                {!invitation.isLoggedIn && (
                    <p className="text-sm text-muted-foreground mb-2">
                        Please log in or sign up to accept this invitation.
                    </p>
                )}
                <Button
                    className="w-full"
                    onClick={handleAccept}
                    disabled={!invitation.isLoggedIn}
                >
                    Accept Invitation
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDecline}
                >
                    Decline
                </Button>
            </CardFooter>
        </Card>
    );
}
