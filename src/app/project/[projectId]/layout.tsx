import ActivityLog from "@/components/project/ActivityLog"
import Header from "@/components/project/Header"
import HorizontalNavigation from "@/components/project/HorizontalNavigation"

export default function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { projectId: string }
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header projectId={params.projectId} />
      <HorizontalNavigation projectId={params.projectId} />
      <main className="flex-1 p-6">
        {children}
      </main>
      <ActivityLog projectId={params.projectId} />
    </div>
  )
}