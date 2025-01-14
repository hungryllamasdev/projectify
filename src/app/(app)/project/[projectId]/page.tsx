import Dashboard from "@/components/project/Dashboard";


export default function ProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
      <Dashboard projectId={params.projectId} />
    </div>
  )
}

