"use client"

import type * as React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Settings, Plus, FolderKanban, ChevronRight, X } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Added this line
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const closeMobileMenu = useCallback(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    closeMobileMenu()
  }, [closeMobileMenu]) 

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  })

  const handleProjectCreated = async (projectId: string) => {
    setIsDialogOpen(false)
    await queryClient.invalidateQueries({ queryKey: ["projects"] })
    router.push(`/p/${projectId}`)
  }

  const NavItem = ({ icon: Icon, label, href}: NavItem) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start px-2 py-1.5 h-8 text-muted-foreground hover:text-primary group",
            isCollapsed && !isMobile && "justify-center px-0",
          )}
          asChild
        >
          <Link href={href} onClick={closeMobileMenu}>
            <Icon className={cn("h-4 w-4", (!isCollapsed || isMobile) && "mr-2")} />
            {(!isCollapsed || isMobile) && <span className="text-sm">{label}</span>}
          </Link>
        </Button>
      </TooltipTrigger>
      {isCollapsed && !isMobile && <TooltipContent side="right">{label}</TooltipContent>}
    </Tooltip>
  )

  if (!isMounted) {
    return null
  }

  return (
    <TooltipProvider>
      {isMobile ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 h-10 w-10 rounded-full border shadow-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-background">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <Link href="/dashboard" className="flex items-center" onClick={closeMobileMenu}>
                    <img src="/logo_white.png" alt="Projectify Logo" className="w-6 h-6 mr-2" />
                    <span className="font-semibold">Projectify</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="flex-grow px-4">
                  <div className="mt-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <div className="flex items-center justify-between mb-2">
                        <Link href="/p" className="text-sm font-medium text-muted-foreground hover:text-primary">
                          Projects
                        </Link>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </div>
                      <DialogContent className="sm:max-w-[425px]">
                        <NewProject onSuccess={handleProjectCreated} />
                      </DialogContent>
                    </Dialog>
                    {projects?.map((project: ProjectItem) => (
                      <ProjectSection
                        key={project.id}
                        project={project}
                        isCollapsed={false}
                        setIsMobileMenuOpen={setIsMobileMenuOpen}
                      />
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-auto p-4 border-t">
                  <NavItem icon={Settings} label="Settings" href="/settings"/>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
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
                <ProjectSection
                  key={project.id}
                  project={project}
                  isCollapsed={isCollapsed}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
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
            <ChevronRight className={cn("h-4 w-4 transition-transform", isCollapsed ? "rotate-180" : "")} />
          </Button>
        </div>
      )}
    </TooltipProvider>
  )
}

function ProjectSection({
  project,
  isCollapsed,
  setIsMobileMenuOpen,
}: {
  project: ProjectItem
  isCollapsed: boolean
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const isMobile = useIsMobile()
  const closeMobileMenu = useCallback(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile, setIsMobileMenuOpen])

  return (
    <div key={project.id} className="mb-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn("w-full justify-start px-2 py-1.5 h-8", isCollapsed && !isMobile && "justify-center px-0")}
            asChild
          >
            <Link href={`/p/${project.id}`} onClick={closeMobileMenu}>
              <FolderKanban className="h-4 w-4" />
              {(!isCollapsed || isMobile) && <span className="ml-2 text-sm">{project.name}</span>}
            </Link>
          </Button>
        </TooltipTrigger>
        {isCollapsed && !isMobile && <TooltipContent side="right">{project.name}</TooltipContent>}
      </Tooltip>
    </div>
  )
}

