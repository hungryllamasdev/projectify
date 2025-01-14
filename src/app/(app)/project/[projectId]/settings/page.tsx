'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage({ params }: { params: { projectId: string } }) {
  const [projectName, setProjectName] = useState('Project Name')
  const [newMember, setNewMember] = useState('')

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault()
    // Update project name logic here
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    // Add member logic here
    setNewMember('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
              />
            </div>
            <Button type="submit">Update Project Name</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <Label htmlFor="newMember">Add New Member</Label>
              <Input 
                id="newMember" 
                value={newMember} 
                onChange={(e) => setNewMember(e.target.value)} 
                placeholder="Enter email address"
              />
            </div>
            <Button type="submit">Add Member</Button>
          </form>
          {/* Display current members here */}
        </CardContent>
      </Card>
    </div>
  )
}

