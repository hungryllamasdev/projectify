'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const teamMembers = [
  { name: 'Alice', role: 'Designer', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Bob', role: 'Developer', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Charlie', role: 'PM', avatar: '/placeholder.svg?height=32&width=32' },
]

export default function TeamOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Assign New Task
        </Button>
      </CardContent>
    </Card>
  )
}

