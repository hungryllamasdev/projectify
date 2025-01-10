import Header from '@/components/project/Header'
import ActivityLog from '@/components/project/ActivityLog'
import HorizontalNavigation from '@/components/project/HorizontalNavigation'

export default function NewProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header projectId="new" />
      <HorizontalNavigation projectId="new" />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

