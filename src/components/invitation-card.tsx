// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { CheckCircle, XCircle } from "lucide-react";

// export default function InvitationCard({ invitation }) {
//     const [status, setStatus] = useState<
//         "idle" | "loading" | "success" | "error"
//     >("idle");
//     const [errorMessage, setErrorMessage] = useState("");

//     const handleAccept = async () => {
//         setStatus("loading");
//         // Simulating API call
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         if (invitation.token === "error") {
//             setStatus("error");
//             setErrorMessage("An error occurred while accepting the invitation");
//         } else {
//             setStatus("success");
//         }
//     };

//     const handleDecline = async () => {
//         setStatus("loading");
//         // Simulating API call
//         await new Promise((resolve) => setTimeout(resolve, 1500));
//         setStatus("error");
//         setErrorMessage("Invitation declined");
//     };

//     if (status === "loading") {
//         return (
//             <Card className="w-full max-w-md">
//                 <CardContent className="pt-6 text-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
//                     <p className="mt-4 text-lg">Processing your request...</p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (status === "error") {
//         return (
//             <Card className="w-full max-w-md">
//                 <CardContent className="pt-6 text-center">
//                     <XCircle className="h-16 w-16 text-destructive mx-auto" />
//                     <p className="mt-4 text-lg">
//                         {errorMessage || "An error occurred"}
//                     </p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (status === "success") {
//         return (
//             <Card className="w-full max-w-md">
//                 <CardContent className="pt-6 text-center">
//                     <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{
//                             type: "spring",
//                             stiffness: 260,
//                             damping: 20,
//                         }}
//                     >
//                         <CheckCircle className="h-16 w-16 text-primary mx-auto" />
//                     </motion.div>
//                     <p className="mt-4 text-lg">
//                         You&apos;ve successfully joined {invitation.name}!
//                     </p>
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <Card className="w-full max-w-md">
//             <CardHeader className="text-center">
//                 <div className="mx-auto mb-4">
//                     <Image
//                         src={invitation.projectLogo || "/placeholder.svg"}
//                         alt={`${invitation.projectName} logo`}
//                         width={64}
//                         height={64}
//                     />
//                 </div>
//                 <CardTitle className="text-2xl">
//                     You&apos;ve been invited to join
//                 </CardTitle>
//                 <CardTitle className="text-3xl font-bold text-primary">
//                     {invitation.projectName}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {invitation.description && (
//                     <p className="text-center text-muted-foreground mb-4">
//                         {invitation.description}
//                     </p>
//                 )}
//                 <p className="text-center text-sm text-muted-foreground">
//                     Invited by {invitation.inviterName}
//                 </p>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-2">
//                 {!invitation.isLoggedIn && (
//                     <p className="text-sm text-muted-foreground mb-2">
//                         Please log in or sign up to accept this invitation.
//                     </p>
//                 )}
//                 <Button
//                     className="w-full"
//                     onClick={handleAccept}
//                     // disabled={!invitation.isLoggedIn}
//                 >
//                     Accept Invitation
//                 </Button>
//                 <Button
//                     variant="outline"
//                     className="w-full"
//                     onClick={handleDecline}
//                 >
//                     Decline
//                 </Button>
//             </CardFooter>
//         </Card>
//     );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { acceptInvitation, declineInvitation } from "@/utils/api";

export default function InvitationCard({ invitation }) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const acceptInvitationMutation = useMutation({
        mutationFn: () => acceptInvitation(invitation.token, invitation.id),
        onSuccess: () => {
            router.push(`/p/${invitation.id}`);
        },
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });

    const declineInvitationMutation = useMutation({
        mutationFn: declineInvitation,
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });

    if (
        acceptInvitationMutation.isPending ||
        declineInvitationMutation.isPending
    ) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Processing your request...</p>
                </CardContent>
            </Card>
        );
    }

    if (acceptInvitationMutation.isError || declineInvitationMutation.isError) {
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

    if (acceptInvitationMutation.isSuccess) {
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
                        You&apos;ve successfully joined {invitation.projectName}
                        !
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
                {invitation.description && (
                    <p className="text-center text-muted-foreground mb-4">
                        {invitation.description}
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
                    onClick={() => acceptInvitationMutation.mutate()}
                    disabled={
                        acceptInvitationMutation.isPending
                    }
                >
                    Accept Invitation
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => declineInvitationMutation.mutate()}
                    disabled={declineInvitationMutation.isPending}
                >
                    Decline
                </Button>
            </CardFooter>
        </Card>
    );
}
