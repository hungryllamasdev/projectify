'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from 'lucide-react';
import { NewProject } from "./NewProject";

export function NewProjectCard() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors">
          <CardContent className="flex items-center justify-center h-full">
            <Plus className="w-12 h-12 text-muted-foreground" />
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent
        title="New Project"
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <NewProject onSuccess={(projectId) => {
          router.push(`/p/${projectId}`);
        }} />
      </DialogContent>
    </Dialog>
  );
}

