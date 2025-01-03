import { Button } from "@/components/ui/button"
import { PlusCircle, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Alex</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Project
        </Button>
        <Avatar>
          <AvatarImage src="/avatars/01.png" alt="@alexdev" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

