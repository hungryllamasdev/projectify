"use client"

import type * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, Plus, FolderKanban, ChevronRight } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { NewProject } from "@/components/project/NewProject"
import { getProjects } from "@/utils/api"
import type { ProjectItem } from "@/utils/types"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  const handleProjectCreated = async (projectId: string) => {
    setIsDialogOpen(false)
    await queryClient.invalidateQueries({ queryKey: ["projects"] })
    router.push(`/p/${projectId}`)
  }

  const NavItem = ({ icon: Icon, label, href }: NavItem) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start px-2 py-1.5 h-8 text-muted-foreground hover:text-primary group",
            isCollapsed && "justify-center px-0",
          )}
          asChild
        >
          <Link href={href}>
            <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="text-sm">{label}</span>}
          </Link>
        </Button>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  )

  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative h-screen bg-sidebar border-r transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header with Logo */}
        <div className="p-3 flex items-center justify-between border-b">
          <Button
            variant="ghost"
            className={cn("w-full justify-start px-2 h-8 hover:bg-muted/50", isCollapsed && "justify-center")}
            asChild
          >
            <Link href="/dashboard">
            <img src="/logo_white.png" alt="Projectify Logo" className="w-6 h-6" />
              {!isCollapsed && <span className="font-semibold">Projectify</span>}
            </Link>
          </Button>
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-grow px-3">
          {/* Projects */}
          <div className="mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {!isCollapsed && (
                <div className="flex items-center justify-between px-2 mb-2">
                  <Link href="/p" className="text-xs font-medium text-muted-foreground hover:text-primary">
                    Projects
                  </Link>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                </div>
              )}
              <DialogContent className="sm:max-w-[425px]">
                <NewProject onSuccess={handleProjectCreated} />
              </DialogContent>
            </Dialog>
            {projects?.map((project: ProjectItem) => (
              <ProjectSection key={project.id} project={project} isCollapsed={isCollapsed} />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="mt-auto">
          <div className="p-3 border-t">
            <NavItem icon={Settings} label="Settings" href="/settings" />
          </div>
        </div>

        {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full border shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-180" : "")} />
        </Button>
      </div>
    </TooltipProvider>
  )
}

function ProjectSection({
  project,
  isCollapsed,
}: {
  project: ProjectItem
  isCollapsed: boolean
}) {
  return (
    <div key={project.id} className="mb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn("w-full justify-start px-2 py-1.5 h-8", isCollapsed && "justify-center px-0")}
            asChild
          >
            <Link href={`/p/${project.id}`}>
              <FolderKanban className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2 text-sm">{project.name}</span>}
            </Link>
          </Button>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{project.name}</TooltipContent>}
      </Tooltip>
    </div>
  )
}

