"use client"

import { CollapsibleCard } from "@/components/ui/collapsible-card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TaskStatus } from "@prisma/client"

interface ProgressOverviewProps {
  data: {
    overall: number
    completedTasks: number
    totalTasks: number
    tasksByStatus: Record<TaskStatus, number>
  }
}

export default function ProgressOverview({ data }: ProgressOverviewProps) {
  return (
    <>
      <h1>Progress Overview</h1>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium">
            <span>{data.overall}%</span>
          </div>
          <Progress value={data.overall} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-sm font-medium">Tasks Completed</p>
                  <p className="text-2xl font-bold">
                    {data.completedTasks}/{data.totalTasks}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{data.overall}% of tasks completed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  )
}

