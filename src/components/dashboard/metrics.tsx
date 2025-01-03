import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle2, Clock, GitCommit } from 'lucide-react'

const metrics = [
  { title: "Total Hours", value: "32.5", icon: Clock, description: "Hours worked this week" },
  { title: "Tasks Completed", value: "12", icon: CheckCircle2, description: "Tasks finished this week" },
  { title: "Commits", value: "47", icon: GitCommit, description: "Code commits this week" },
  { title: "Productivity", value: "85%", icon: Activity, description: "Based on completed tasks" },
]

export function Metrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

