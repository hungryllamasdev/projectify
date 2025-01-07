'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPopup() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Implement settings submission logic
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>Manage your project settings here.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Project Name" />
              <Button type="submit">Save Changes</Button>
            </form>
          </TabsContent>
          <TabsContent value="notifications">
            {/* Add notification settings here */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

