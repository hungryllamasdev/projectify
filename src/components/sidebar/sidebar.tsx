'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Home, Inbox, Brain, Calendar, ListTodo, Settings, Users, Plus, ChevronDown, FolderKanban, Timer, BarChart2, ChevronRight } from 'lucide-react'

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

interface WorkspaceItem {
  id: string
  name: string
  projects: { id: string; name: string }[]
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['workspace-1'])
  const router = useRouter()

  const workspaces: WorkspaceItem[] = [
    {
      id: 'workspace-1',
      name: 'Main Workspace',
      projects: [
        { id: 'p1', name: 'Website Redesign' },
        { id: 'p2', name: 'Mobile App' },
        { id: 'p3', name: 'Marketing Campaign' },
      ],
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
        "relative h-screen bg-sidebar border-r transition-all duration-300 ease-in-out",
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
            <Link href="/profile">
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

        {/* Search */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-8 bg-muted/50 border-none h-8"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            <NavItem icon={Home} label="Home" href="/dashboard" />
            <NavItem icon={Inbox} label="Inbox" href="/inbox" />
            <NavItem icon={Calendar} label="Calendar" href="/calendar" />
            <NavItem icon={Timer} label="Time Tracking" href="/time" />
            <NavItem icon={BarChart2} label="Analytics" href="/analytics" />
          </div>

          {/* Workspaces */}
          <div className="mt-4">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">WORKSPACES</span>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between px-2 py-1.5 h-8",
                        isCollapsed && "justify-center px-0"
                      )}
                      onClick={() => !isCollapsed && toggleSection(workspace.id)}
                    >
                      <FolderKanban className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span className="text-sm">{workspace.name}</span>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            expandedSections.includes(workspace.id) ? "rotate-180" : ""
                          )} />
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      {workspace.name}
                    </TooltipContent>
                  )}
                </Tooltip>
                {!isCollapsed && expandedSections.includes(workspace.id) && (
                  <div className="ml-3 mt-1 space-y-1">
                    {workspace.projects.map((project) => (
                      <Button
                        key={project.id}
                        variant="ghost"
                        className="w-full justify-start px-2 py-1.5 h-7 text-sm text-muted-foreground hover:text-primary"
                        asChild
                      >
                        <Link href={`/project/${project.id}`}>
                          <FolderKanban className="mr-2 h-3 w-3" />
                          {project.name}
                        </Link>
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 py-1.5 h-7 text-sm text-muted-foreground hover:text-primary"
                      onClick={() => router.push('/new-project')}
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      New Project
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tools Section */}
          <div className="mt-4">
            {!isCollapsed && (
              <div className="px-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">TOOLS</span>
              </div>
            )}
            <div className="space-y-1">
              <NavItem icon={Brain} label="AI Assistant" href="/ai" />
              <NavItem icon={ListTodo} label="Task Templates" href="/templates" />
              <NavItem icon={Users} label="Team" href="/team" />
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t mt-auto">
          <NavItem icon={Settings} label="Settings" href="/settings" />
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

