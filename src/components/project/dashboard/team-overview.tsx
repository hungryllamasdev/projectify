"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ProjectRole } from "@prisma/client"

interface TeamOverviewProps {
  data: {
    name: string | null
    role: ProjectRole
    image: string | null
    email: string
  }[]
}

export default function TeamOverview({ data }: TeamOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((member, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.image || undefined} alt={member.name || ""} />
                <AvatarFallback>{member.name ? member.name[0] : "?"}</AvatarFallback>
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

