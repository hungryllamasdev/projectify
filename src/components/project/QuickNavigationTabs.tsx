'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KanbanSquare, Calendar, BarChart2 } from 'lucide-react'

export default function QuickNavigationTabs() {
  const [activeTab, setActiveTab] = useState('kanban')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="kanban" className="flex items-center space-x-2">
          <KanbanSquare className="h-4 w-4" />
          <span>Kanban</span>
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
        </TabsTrigger>
        <TabsTrigger value="summary" className="flex items-center space-x-2">
          <BarChart2 className="h-4 w-4" />
          <span>Summary</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

