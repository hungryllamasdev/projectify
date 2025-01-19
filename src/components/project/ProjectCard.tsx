import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock } from 'lucide-react';

export function ProjectCard({ project }) {
  return (
    <Link href={`/p/${project.id}`} passHref>
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <CardDescription className="text-sm text-gray-500 line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex -space-x-2 overflow-hidden">
            {project.members.map((member, index) => (
              <Avatar key={index} className="inline-block border-2 border-background">
                <AvatarFallback>{member.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

