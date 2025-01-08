'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

const navItems = [
  { name: 'Overview', href: '' },
  { name: 'Kanban Board', href: 'kanban' },
  { name: 'List View', href: 'list' },
  { name: 'Documentation', href: 'docs' },
  { name: 'Notes', href: 'notes' },
]

export default function HorizontalNavigation({ projectId }: { projectId: string }) {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-100 px-4 py-2">
      <ul className="flex space-x-4">
        {navItems.map((item) => {
          const isActive = pathname === `/project/${projectId}${item.href ? `/${item.href}` : ''}`
          return (
            <li key={item.name}>
              <Link
                href={`/project/${projectId}${item.href ? `/${item.href}` : ''}`}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                )}
              >
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

