"use client";

import { Suspense, useEffect } from "react";
import { notFound, redirect } from "next/navigation";
import InvitationCard from "@/components/invitation-card";
import { auth } from "@/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenData } from "@/utils/api";

// Dummy data to simulate API response
const dummyInvitationData = {
    projectName: "AwesomeProject",
    projectLogo: "/placeholder.svg?height=64&width=64",
    projectDescription: "A collaborative platform for building amazing things",
    inviterName: "Jane Doe",
    isLoggedIn: true,
    token: "dummy-token",
};

export default function InvitationPage({
    params,
}: {
    params: { token: string };
}) {
    // const session = await auth();

    // TODO: Make it work
    // if (!session?.user) {
    //     const currentUrl = `p/invite/${params.token}`;
    //     redirect(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`);
    // }

    const token = params.token;
    console.log(token);

    const { data, isLoading, error } = useQuery({
        queryKey: ["invitation", token],
        queryFn: () => fetchTokenData(token),
        enabled: !!token,
    });

    console.log(data);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading invitation. Please try again later.</div>;
    }

    if (!data) {
        notFound();
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <InvitationCard invitation={{ ...data.project, token }} />
            </Suspense>
        </div>
    );
}
