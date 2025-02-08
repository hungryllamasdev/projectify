import { createColumns } from "./list/columns"
import { DataTable } from "./list/data-table"
import type { TeamMember } from "@/utils/types"
import type { Task } from "@/utils/types"
import { useIsMobile } from "@/hooks/use-mobile"

interface ListProps {
  data: Task[]
  members: TeamMember[]
}

export default function List({ data, members }: ListProps) {
  const isMobile = useIsMobile()
  const columns = createColumns(members, isMobile)

  return (
    <div className={isMobile ? "overflow-x-auto" : ""}>
      <DataTable data={data} columns={columns} assignableUsers={members} />
    </div>
  )
}

