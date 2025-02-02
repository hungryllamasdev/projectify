import { Button } from "@/components/ui/button";
import { Project, TeamMember, User } from "@/utils/types";
import { Share } from "lucide-react";
import { useState } from "react";
import { ShareDialog } from "./share-dialog";

interface ShareButtonProps {
  documentName: string;
  project: Project;
  teamMembers: TeamMember[];
  currentUser: User;
}

export function ShareButton({ documentName, project, teamMembers, currentUser }: ShareButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <ShareDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        documentName={documentName}
        project={project}
        teamMembers={teamMembers}
        currentUser={currentUser}
      />
    </>
  );
}