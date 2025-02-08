"use client"

import type React from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/settings/sidebar-nav"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"


const sidebarNavItems = [
  {
    title: "Account",
    href: "/settings",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
  {
    title: "Display",
    href: "/settings/display",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? (
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-0.5 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and set your preferences.</p>
          </div>
          <Separator className="my-6" />
          <Tabs defaultValue={pathname} className="w-full">
            <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-nowrap">
              {sidebarNavItems.map((item) => (
                <TabsTrigger key={item.href} value={item.href} className="flex-shrink-0" asChild>
                  <Link href={item.href}>{item.title}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="mt-6">{children}</div>
        </div>
      ) : (
        <div className="hidden space-y-6 p-10 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

