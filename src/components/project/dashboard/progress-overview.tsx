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
    <CollapsibleCard title="Progress Overview">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium">
            <span>Overall Progress</span>
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-sm font-medium">Hours Logged</p>
                  <p className="text-2xl font-bold">120/200</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>60% of estimated hours used</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className="text-sm font-medium">Next Milestone</p>
                  <p className="text-2xl font-bold">15 Days</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Milestone: Beta Release</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <p className="text-sm font-medium">Sprint Progress</p>
            <Progress value={80} className="w-full mt-2" />
          </div>
        </div>
        <Button variant="outline" className="w-full">
          See All Progress Details
        </Button>
      </div>
    </CollapsibleCard>
  )
}

