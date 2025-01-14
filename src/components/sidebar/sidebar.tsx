'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Home, Inbox, Brain, Calendar, ListTodo, Settings, Users, Plus, ChevronDown, FolderKanban, Timer, BarChart2, ChevronRight, UserPlus } from 'lucide-react'

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

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
}

interface ProjectItem {
  id: string
  name: string
  pinned: boolean
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Project-1'])
  const router = useRouter()

  const Projects: ProjectItem[] = [
    {
      id: 'Project-1',
      name: 'Main Project',
      pinned: true,
    },
    {
      id: 'Project-2',
      name: 'Secondary Project',
      pinned: false,
    },
  ]

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
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
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <Link href="/p" className="text-xs font-medium text-muted-foreground hover:text-primary">Pinned Projects</Link>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            {Projects.filter(project => project.pinned).map((project) => (
              <ProjectSection key={project.id} project={project} isCollapsed={isCollapsed} />
            ))}
            {!isCollapsed && (
              <div className="px-2 mt-4 mb-2">
                <span className="text-xs font-medium text-muted-foreground">Projects</span>
              </div>
            )}
            {Projects.filter(project => !project.pinned).map((project) => (
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
          <ChevronRight className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed ? "rotate-180" : ""
          )} />
        </Button>
      </div>
    </TooltipProvider>
  )
}

function ProjectSection({ project, isCollapsed }: { project: ProjectItem; isCollapsed: boolean }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div key={project.id} className="mb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between px-2 py-1.5 h-8",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => !isCollapsed && setIsExpanded(!isExpanded)}
          >
            <FolderKanban className="h-4 w-4" />
            {!isCollapsed && (
              <>
                <span className="text-sm">{project.name}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isExpanded ? "rotate-180" : ""
                )} />
              </>
            )}
          </Button>
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

