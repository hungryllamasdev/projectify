'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Calendar, UserPlus, FileText } from 'lucide-react'

const actions = [
  { label: 'Create Task', icon: PlusCircle },
  { label: 'Schedule Meeting', icon: Calendar },
  { label: 'Add Team Member', icon: UserPlus },
  { label: 'Generate Report', icon: FileText },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button key={index} variant="outline" className="h-20 flex-col">
              <action.icon className="mb-2 h-5 w-5" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

