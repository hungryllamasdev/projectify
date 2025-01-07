import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportData() {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Your Data</h2>
            <div className="space-y-4">
                <p>Last export: Never</p>
                <div className="flex space-x-4">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export as JSON
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export as CSV
                    </Button>
                </div>
                <p className="text-sm text-gray-500">
                    <a href="#" className="text-blue-500 hover:underline">
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
}
