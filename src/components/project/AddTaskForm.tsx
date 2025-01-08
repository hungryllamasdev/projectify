'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AddTaskForm({ onClose }: { onClose: () => void }) {
  const [isBatchMode, setIsBatchMode] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isBatchMode ? 'Add Multiple Tasks' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isBatchMode ? (
            <Textarea placeholder="Enter multiple tasks, one per line" className="h-40" />
          ) : (
            <>
              <Input placeholder="Task Title" />
              <Textarea placeholder="Task Description" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Assign To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                  {/* Add more users */}
                </SelectContent>
              </Select>
            </>
          )}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setIsBatchMode(!isBatchMode)}>
              {isBatchMode ? 'Single Task Mode' : 'Batch Mode'}
            </Button>
            <Button type="submit">Add Task{isBatchMode ? 's' : ''}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

