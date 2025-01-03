import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const tasks = [
  { id: 1, title: "Design homepage mockup", project: "Personal Website" },
  { id: 2, title: "Implement user authentication", project: "E-commerce App" },
  { id: 3, title: "Write API documentation", project: "Blog Platform" },
  { id: 4, title: "Set up CI/CD pipeline", project: "E-commerce App" },
]

export function TaskList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Your most important tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <Checkbox id={`task-${task.id}`} />
              <div className="flex-1 space-y-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {task.title}
                </label>
                <p className="text-sm text-muted-foreground">{task.project}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

