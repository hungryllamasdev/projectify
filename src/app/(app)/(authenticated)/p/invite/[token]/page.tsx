import InvitationCard from "@/components/invitation-card";
import { fetchTokenData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";

export default function InvitationPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = use(params); // Unwrap params properly
    console.log(token);
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["invitation", token],
        queryFn: () => fetchTokenData(token),
        enabled: !!token,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading invitation. Please try again later.</div>;
    if (!data) notFound();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <InvitationCard invitation={{ project: data.project, token, inviter: data.inviter }} />
            </Suspense>
        </div>
    );
}
