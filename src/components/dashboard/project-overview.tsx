import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const projects = [
  { id: 1, name: "Personal Website", progress: 75, status: "In Progress" },
  { id: 2, name: "E-commerce App", progress: 30, status: "In Progress" },
  { id: 3, name: "Blog Platform", progress: 100, status: "Completed" },
]

export function ProjectOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>Your active projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{project.name}</p>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="ml-4 text-right">
                <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                  {project.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

