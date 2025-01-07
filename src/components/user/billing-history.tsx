"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const initialInvoices = [
    {
        id: 1,
        date: "2023-05-01",
        number: "INV-001",
        amount: "$29.99",
        status: "Paid",
    },
    {
        id: 2,
        date: "2023-04-01",
        number: "INV-002",
        amount: "$29.99",
        status: "Paid",
    },
    {
        id: 3,
        date: "2023-03-01",
        number: "INV-003",
        amount: "$29.99",
        status: "Paid",
    },
    {
        id: 4,
        date: "2023-02-01",
        number: "INV-004",
        amount: "$29.99",
        status: "Paid",
    },
    {
        id: 5,
        date: "2023-01-01",
        number: "INV-005",
        amount: "$29.99",
        status: "Paid",
    },
];

export function BillingHistory() {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInvoices = invoices.filter(
        (invoice) =>
            invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.date.includes(searchTerm)
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            <div className="flex justify-between items-center mb-4">
                <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>{invoice.number}</TableCell>
                            <TableCell>{invoice.amount}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
