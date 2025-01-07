'use client'

import { ScrollArea } from "@/components/ui/scroll-area"

type Activity = {
  id: string
  type: 'task_added' | 'task_updated' | 'task_completed'
  description: string
  timestamp: string
}

export default function ActivityLog({ projectId }: { projectId: string }) {
  // This would be fetched from your data source
  const activities: Activity[] = [
    { id: '1', type: 'task_added', description: 'New task added: Task 1', timestamp: '2023-05-28T10:00:00Z' },
    { id: '2', type: 'task_updated', description: 'Task 2 moved to In Progress', timestamp: '2023-05-28T11:30:00Z' },
    { id: '3', type: 'task_completed', description: 'Task 3 completed', timestamp: '2023-05-28T14:15:00Z' },
  ]

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
        <ul className="space-y-4">
          {activities.map(activity => (
            <li key={activity.id} className="flex items-start space-x-2">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  )
}

