"use client";

import { useState } from "react";
import { CreditCard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const initialPaymentMethods = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/2024", isDefault: true },
    {
        id: 2,
        type: "Mastercard",
        last4: "5555",
        expiry: "10/2023",
        isDefault: false,
    },
];

export function PaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
    const { toast } = useToast();

    const handleAddMethod = () => {
        toast({
            title: "Add Payment Method",
            description:
                "You've initiated the process to add a new payment method.",
        });
    };

    const handleDeleteMethod = (id: number) => {
        setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
        toast({
            title: "Payment Method Deleted",
            description: "The selected payment method has been removed.",
        });
    };

    const handleSetDefault = (id: number) => {
        setPaymentMethods(
            paymentMethods.map((method) => ({
                ...method,
                isDefault: method.id === id,
            }))
        );
        toast({
            title: "Default Payment Method Updated",
            description: "Your default payment method has been updated.",
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <Button onClick={handleAddMethod}>Add Method</Button>
            </div>
            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <CreditCard className="w-8 h-8" />
                            <div>
                                <p className="font-medium">
                                    {method.type} ending in {method.last4}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Expires {method.expiry}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {method.isDefault ? (
                                <Badge>Default</Badge>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefault(method.id)}
                                >
                                    Set as Default
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteMethod(method.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
