import ProgressOverview from "@/components/project/dashboard/progress-overview"
import TeamOverview from "@/components/project/dashboard/team-overview"
import PriorityItems from "@/components/project/dashboard/priority-items"
import QuickActions from "@/components/project/dashboard/quick-actions"
import KeyMetrics from "@/components/project/dashboard/key-metrics"
import FinancialOverview from "@/components/project/dashboard/financial-overview"
import type { DashboardData } from "@/utils/types"

interface DashboardProps {
  data: DashboardData | undefined
}

export default function Dashboard({ data }: DashboardProps) {
  if (!data) {
    return <div>Loading dashboard data...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="col-span-full md:col-span-1 lg:col-span-2">
        <ProgressOverview data={data.progress} />
      </div>
      <div className="col-span-full md:col-span-1">
        <TeamOverview data={data.team} />
      </div>
      <div className="col-span-full md:col-span-1">
        <PriorityItems data={data.priorityItems} />
      </div>
      <div className="col-span-full md:col-span-1">
        <QuickActions />
      </div>
      <div className="col-span-full">
        <KeyMetrics data={data.tasksByStatus} financialData={data.financialData} />
      </div>
      <div className="col-span-full">
        <FinancialOverview data={data.financialData} />
      </div>
    </div>
  )
}

