import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ItemDetailsModalProps {
    item: {
        id: number;
        title?: string;
        name?: string;
        status?: string;
        progress?: number;
        description?: string;
        dueDate?: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export function ItemDetailsModal({
    item,
    isOpen,
    onClose,
}: ItemDetailsModalProps) {
    return item ? (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{item?.title || item?.name}</DialogTitle>
                    {item.status && (
                        <DialogDescription>
                            Status: {item.status}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <div className="mt-4">
                    {item.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                            {item.description}
                        </p>
                    )}
                    {item.progress !== undefined && (
                        <div className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">
                                    Progress
                                </span>
                                <span className="text-sm font-medium">
                                    {item.progress}%
                                </span>
                            </div>
                            <Progress
                                value={item.progress}
                                className="w-full"
                            />
                        </div>
                    )}
                    {item.dueDate && (
                        <p className="text-sm">
                            <strong>Due Date:</strong> {item.dueDate}
                        </p>
                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    ) : null;
}
