'use client'

import { Sidebar } from "@/components/sidebar/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type React from "react" 

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={cn("flex-1 p-6 overflow-auto", isMobile && "pt-16")}>{children}</main>
    </div>
  )
}

