import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  { user: "You", action: "completed task", item: "Implement user authentication", time: "2 hours ago" },
  { user: "You", action: "created a new project", item: "E-commerce App", time: "1 day ago" },
  { user: "You", action: "committed code to", item: "Personal Website", time: "2 days ago" },
  { user: "You", action: "completed task", item: "Design homepage mockup", time: "3 days ago" },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="@alexdev" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user} {activity.action} {activity.item}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

