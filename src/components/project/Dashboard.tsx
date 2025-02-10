import ProgressOverview from "@/components/project/dashboard/progress-overview"
import TeamOverview from "@/components/project/dashboard/team-overview"
import PriorityItems from "@/components/project/dashboard/priority-items"
import FinancialMetrics from "@/components/project/dashboard/financial-overview"
import type { DashboardData } from "@/utils/types"
import { useIsMobile } from "@/hooks/use-mobile"

interface DashboardProps {
  data: DashboardData | undefined
}

export default function Dashboard({ data }: DashboardProps) {
  const isMobile = useIsMobile()

  if (!data) {
    return <div>Loading dashboard data...</div>
  }

  return (
    <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
      <div className={isMobile ? "" : "lg:col-span-2"}>
        <ProgressOverview data={data.progress} />
      </div>
      <div>
        <TeamOverview data={data.team} />
      </div>
      <div>
        <PriorityItems data={data.priorityItems} />
      </div>
      <div className={isMobile ? "" : "lg:col-span-2"}>
        <FinancialMetrics taskData={data.tasksByStatus} financialData={data.financialData} />
      </div>
    </div>
  )
}

