"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/utils/api";

export function AccountForm() {
    const { data: session, status } = useSession();

    // Zod schema definition
    const accountFormSchema = z.object({
        name: z
            .string()
            .min(2, { message: "Name must be at least 2 characters." })
            .max(30, {
                message: "Name must not be longer than 30 characters.",
            }),
    });

    // TypeScript inference for form values
    type AccountFormValues = z.infer<typeof accountFormSchema>;

    // Initialize React Hook Form
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: "", // Start with an empty value
        },
    });

    // Update defaultValues once session data is loaded
    useEffect(() => {
        if (status === "authenticated" && session?.user?.name) {
            form.reset({ name: session.user.name });
        }
    }, [status, session, form]);

    const mutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            toast({
                title: "Profile updated successfully",
                description: `Your new name is ${data.name}`,
            });
            form.reset({ name: data.name });
        },
        onError: (error: any) => {
            toast({
                title: "Error updating profile",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: AccountFormValues) => {
        mutation.mutate(data);
    };

    if (status === "loading") {
        return <p>Loading...</p>; // Show a loading state while session is being fetched
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name that will be displayed on your
                                profile and in emails.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Update account</Button>
            </form>
        </Form>
    );
}
