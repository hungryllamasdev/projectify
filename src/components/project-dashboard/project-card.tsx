import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project } from "@/lib/data";

export function ProjectCard({ project }: { project: Project }) {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <Badge
                        variant={
                            project.status === "Active"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        Due: {project.dueDate}
                    </span>
                </div>
                <div className="space-y-2">
                    <div className="text-sm">
                        <span className="font-medium">Progress:</span>{" "}
                        {project.progress}%
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${project.progress}%` }}
                        ></div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex -space-x-2">
                    {project.team.map((member, index) => (
                        <Avatar
                            key={index}
                            className="border-2 border-background"
                        >
                            <AvatarImage
                                src={member.avatar}
                                alt={member.name}
                            />
                            <AvatarFallback>
                                {member.name.slice(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}
