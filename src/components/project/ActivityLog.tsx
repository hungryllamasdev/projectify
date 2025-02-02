"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { useQuery } from "@tanstack/react-query"
import type { TeamMember, ActivityLogItem } from "@/utils/types"
import type { DateRange } from "react-day-picker"
import { fetchActivities } from "@/utils/api"

interface ActivityLogProps {
  projectId: string
  members: TeamMember[]
}

export default function ActivityLog({ projectId, members }: ActivityLogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedUser, setSelectedUser] = useState("all")

  const {
    data: activities,
    isLoading,
    isError,
  } = useQuery<ActivityLogItem[]>({
    queryKey: ["activities", projectId, searchTerm, dateRange, selectedUser],
    queryFn: () => fetchActivities(projectId, { searchTerm, dateRange, selectedUser }),
    enabled: open,
  })

  const formatActivityType = (type: string) => {
    return type
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4 z-50">
          <Activity className="mr-2 h-4 w-4" />
          Activity Log
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Activity Log</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Search task or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <DatePickerWithRange dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      {member.avatar && (
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="h-4 w-4 rounded-full"
                        />
                      )}
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading && <p className="text-center text-gray-500">Loading activities...</p>}
            {isError && <p className="text-center text-red-500">Error loading activities</p>}
            {activities?.length ? (
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <li key={activity.id} className="text-sm border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.user?.name || "Unknown User"}</span>
                      <span className="text-gray-500 text-xs">{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="mt-1">
                      {formatActivityType(activity.type)}
                      {activity.task && (
                        <>
                          {" "}
                          on task{" "}
                          <span className="font-medium">
                            {activity.task.title} ({activity.taskId})
                          </span>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No activities found</p>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

