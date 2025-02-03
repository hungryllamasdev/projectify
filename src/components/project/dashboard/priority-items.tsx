"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskStatus, TaskPriority } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PriorityItemsProps {
  data: {
    id: string
    title: string
    dueDate: string | null
    status: TaskStatus
    priority: TaskPriority
    assigneeName: string | null
  }[]
}

export default function PriorityItems({ data }: PriorityItemsProps) {
  const topPriorityItems = data.slice(0, 2)

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle>Priority Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <ul className="space-y-4">
            {topPriorityItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "No due date"}
                  </p>
                </div>
                <Badge
                  variant={
                    item.priority === TaskPriority.HIGH
                      ? "destructive"
                      : item.status === TaskStatus.BACKLOG
                        ? "outline"
                        : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

