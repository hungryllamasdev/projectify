import { Suspense } from "react";
import { notFound } from "next/navigation";
import InvitationCard from "@/components/invitation-card";

// Dummy data to simulate API response
const dummyInvitationData = {
    projectName: "AwesomeProject",
    projectLogo: "/placeholder.svg?height=64&width=64",
    projectDescription: "A collaborative platform for building amazing things",
    inviterName: "Jane Doe",
    isLoggedIn: true,
    token: "dummy-token",
};

async function getInvitationData(token: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate different scenarios based on token
    if (token === "expired") {
        throw new Error("Invitation has expired");
    } else if (token === "not-found") {
        return null;
    }

    return { ...dummyInvitationData, token };
}

export default async function InvitationPage({
    params,
}: {
    params: { token: string };
}) {
    const invitationData = await getInvitationData(params.token);

    if (!invitationData) {
        notFound();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Suspense fallback={<div>Loading...</div>}>
                <InvitationCard invitation={invitationData} />
            </Suspense>
        </div>
    );
}
