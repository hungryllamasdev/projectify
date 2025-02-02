"use client";

import { useState } from "react";
import { ProjectName } from "./project-name";
import { TeamMembers } from "./team-members";
import { ShareButton } from "./share-button";
import { Project, User } from "@/utils/types";

export interface TeamMember {
    id: string;
    name: string;
    avatar: string;
}

export interface ProjectHeaderProps {
    initialProjectName: string;
    teamMembers: TeamMember[];
    onProjectNameChange: (newName: string) => void;
    project: Project;
    currentUser: User;
  }

  export function ProjectHeader({
    initialProjectName,
    teamMembers,
    onProjectNameChange,
    project,
    currentUser,
  }: ProjectHeaderProps) {
    const [projectName, setProjectName] = useState(initialProjectName);

    const handleProjectNameChange = (newName: string) => {
        setProjectName(newName);
        onProjectNameChange(newName);
    };

    return (
        <header className="flex flex-col gap-4  p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
                <ProjectName
                    initialName={projectName}
                    onChange={handleProjectNameChange}
                />
                <TeamMembers members={teamMembers} />
            </div>
            <div className="flex items-center gap-4">
            <ShareButton
                documentName={projectName}
                project={project}
                teamMembers={teamMembers}
                currentUser={currentUser}
            />
            </div>
        </header>
    );
}
