'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const priorityItems = [
  { title: 'Complete wireframes', deadline: '2 days', status: 'urgent' },
  { title: 'Review code PR', deadline: '1 day', status: 'blocked' },
  { title: 'Update documentation', deadline: 'Overdue', status: 'overdue' },
]

export default function PriorityItems() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Items</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {priorityItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.deadline}</p>
              </div>
              <Badge
                variant={item.status === 'urgent' ? 'destructive' : item.status === 'blocked' ? 'outline' : 'secondary'}
              >
                {item.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

