'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddTaskForm } from './AddTaskForm'

export default function Header({ projectId }: { projectId: string }) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  // This would be fetched from your API
  const project = {
    name: 'Project Name',
    members: [
      { id: 1, name: 'John Doe', avatar: '/avatars/john.jpg' },
      { id: 2, name: 'Jane Smith', avatar: '/avatars/jane.jpg' },
      // Add more members as needed
    ]
  }

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex -space-x-2">
          {project.members.map((member) => (
            <Avatar key={member.id} className="border-2 border-white">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={() => setIsAddTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
        <Link href={`/project/${projectId}/settings`}>
          <Button variant="outline">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      {isAddTaskOpen && <AddTaskForm onClose={() => setIsAddTaskOpen(false)} />}
    </header>
  )
}

