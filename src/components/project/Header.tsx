'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Settings } from 'lucide-react'

export default function Header({ projectId }: { projectId: string }) {
  const [progress, setProgress] = useState(60) // This would be fetched from your data source
  const [projectName, setProjectName] = useState("Project Name") // This would be fetched from your data source

  const handleAddTask = () => {
    // Implement add task functionality
  }

  const handleOpenSettings = () => {
    // Implement open settings functionality
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{projectName}</h1>
        <Progress value={progress} className="w-32" />
        <span className="text-sm text-gray-500">{progress}% complete</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm" onClick={handleAddTask}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
        <Button size="sm" variant="outline" onClick={handleOpenSettings}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

