'use client'

import { Suspense } from 'react'
import Header from '@/components/project/Header'
import KanbanBoard from '@/components/project/KanbanBoard'
import TaskDrawer from '@/components/project/TaskDrawer'
import SettingsPopup from '@/components/project/SettingsPopup'
import ActivityLog from '@/components/project/ActivityLog'
import QuickNavigationTabs from '@/components/project/QuickNavigationTabs'

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="flex h-screen flex-col">
      <Header projectId={params.projectId} />
      <QuickNavigationTabs />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Suspense fallback={<div>Loading Kanban board...</div>}>
            <KanbanBoard />
          </Suspense>
        </div>
        <div className="w-64 border-l border-gray-200 overflow-auto">
          <Suspense fallback={<div>Loading activity log...</div>}>
            <ActivityLog projectId={params.projectId} />
          </Suspense>
        </div>
      </div>
      <TaskDrawer />
      <SettingsPopup />
    </div>
  )
}

