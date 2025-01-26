import { createColumns } from "./list/columns"
import { DataTable } from "./list/data-table"
import type { TeamMember } from "@/utils/types"
import type { Task } from "@/utils/types"

interface ListProps {
  data: Task[]
  members: TeamMember[]
}

export default function List({ data, members }: ListProps) {
  const columns = createColumns(members)

  return (
    <div>
      <DataTable data={data} columns={columns} assignableUsers={members} />
    </div>
  )
}

