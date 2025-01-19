'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Home, Inbox, Brain, Calendar, ListTodo, Settings, Users, Plus, ChevronDown, FolderKanban, Timer, BarChart2, ChevronRight, UserPlus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { NewProject } from "@/components/project/NewProject"
import { getProjects } from "@/utils/api"
import { ProjectItem } from "@/utils/types"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}


export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

 
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleProjectCreated = async (projectId: string) => {
    setIsDialogOpen(false)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    router.push(`/p/${projectId}`)
  }

  const NavItem = ({ icon: Icon, label, href }: NavItem) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start px-2 py-1.5 h-8 text-muted-foreground hover:text-primary group",
            isCollapsed && "justify-center px-0"
          )}
          asChild
        >
          <Link href={href}>
            <Icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="text-sm">{label}</span>}
          </Link>
        </Button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      )}
    </Tooltip>
  )

  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "relative h-screen bg-sidebar border-r transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header with Profile */}
        <div className="p-3 flex items-center justify-between border-b">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start px-2 h-8 hover:bg-muted/50",
              isCollapsed && "justify-center"
            )}
            asChild
          >
            <Link href="/dashboard">
              <Avatar className="h-5 w-5 mr-2">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <span className="font-semibold">Projectify</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </>
              )}
            </Link>
          </Button>
        </div>

        {/* Main Navigation */}
        <ScrollArea className="flex-grow px-3">
          <div className="space-y-1 py-2">
            <NavItem icon={Home} label="Home" href="/dashboard" />
          </div>

          {/* Projects */}
          <div className="mt-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {!isCollapsed && (
                <div className="flex items-center justify-between px-2 mb-2">
                  <Link href="/p" className="text-xs font-medium text-muted-foreground hover:text-primary">Projects</Link>
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
            {isLoading && <p className="text-muted-foreground text-sm px-2">Loading...</p>}
            {isError && <p className="text-error text-sm px-2">Failed to load projects</p>}
            {projects?.map((project: ProjectItem) => (
              <ProjectSection 
                key={project.id} 
                project={project} 
                isCollapsed={isCollapsed}
                isExpanded={expandedSections.includes(project.id)}
                onToggle={() => toggleSection(project.id)}
              />
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
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed ? "rotate-180" : ""
          )} />
        </Button>
      </div>
    </TooltipProvider>
  )
}

function ProjectSection({ 
  project, 
  isCollapsed, 
  isExpanded, 
  onToggle 
}: { 
  project: ProjectItem; 
  isCollapsed: boolean; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div key={project.id} className="mb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className={cn(
                "flex-grow justify-between px-2 py-1.5 h-8",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => !isCollapsed && onToggle()}
            >
              <FolderKanban className="h-4 w-4" />
              {!isCollapsed && (
                <>
                  <Link href={`/p/${project.id}`} className="flex-grow text-left">
                    <span className="text-sm">{project.name}</span>
                  </Link>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded ? "rotate-180" : ""
                  )} />
                </>
              )}
            </Button>
          </div>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            {project.name}
          </TooltipContent>
        )}
      </Tooltip>
      {!isCollapsed && isExpanded && (
        <div className="ml-3 mt-1 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-7 text-sm text-muted-foreground hover:text-primary"
            onClick={() => {/* Add task logic */}}
          >
            <Plus className="mr-2 h-3 w-3" />
            Add Task
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-7 text-sm text-muted-foreground hover:text-primary"
            onClick={() => {/* View members logic */}}
          >
            <Users className="mr-2 h-3 w-3" />
            View Members
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-7 text-sm text-muted-foreground hover:text-primary"
            onClick={() => {/* Invite members logic */}}
          >
            <UserPlus className="mr-2 h-3 w-3" />
            Invite Members
          </Button>
        </div>
      )}
    </div>
  )
}

