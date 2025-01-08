'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity } from 'lucide-react'

export default function ActivityLog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)

  // This data would be fetched from your API
  const activities = [
    { id: 1, type: 'task_completed', user: 'John Doe', task: 'Task 1', timestamp: '2023-06-28 14:30' },
    { id: 2, type: 'task_added', user: 'Jane Smith', task: 'New Task', timestamp: '2023-06-28 13:45' },
    // Add more activities
  ]

  const pendingTasks = [
    { id: 1, title: 'Urgent Task', deadline: '2023-06-30', assignee: 'John Doe' },
    { id: 2, title: 'Important Task', deadline: '2023-07-02', assignee: 'Jane Smith' },
    // Add more pending tasks
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50">
          <Activity className="mr-2 h-4 w-4" />
          Activity Log
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Activity Log</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
            <ul className="space-y-2">
              {pendingTasks.map(task => (
                <li key={task.id} className="text-sm">
                  <span className="font-medium">{task.title}</span>
                  <br />
                  <span className="text-gray-600">Due: {task.deadline}</span>
                  <br />
                  <span className="text-gray-600">Assigned to: {task.assignee}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Activities</h3>
            <ScrollArea className="h-[300px]">
              <ul className="space-y-2">
                {activities.map(activity => (
                  <li key={activity.id} className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.type === 'task_completed' ? 'completed' : 'added'} {activity.task}
                    <br />
                    <span className="text-gray-600">{activity.timestamp}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

