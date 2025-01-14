'use client'

import { useState } from 'react'
import { Check, Copy, Link, Settings, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  documentName?: string
}

export function ShareDialog({ isOpen, onClose, documentName = 'Untitled document' }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://your-app.com/share/xyz')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle>Share "{documentName}"</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 rounded-lg border p-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <Input 
              className="border-0 bg-transparent p-0 focus-visible:ring-0" 
              placeholder="Add people, groups, and calendar events"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">People with access</h4>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>H</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div>hungryllama (you)</div>
                    <div className="text-muted-foreground">hungryllama999@gmail.com</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Owner</div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">General access</h4>
              <div className="flex items-center gap-2 rounded-lg border p-2">
                <Link className="h-5 w-5 text-muted-foreground" />
                <Select defaultValue="restricted">
                  <SelectTrigger className="border-0 bg-transparent p-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="anyone">Anyone with the link</SelectItem>
                    <SelectItem value="domain">Anyone in your organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Only people with access can open with the link
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy link
            </Button>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

