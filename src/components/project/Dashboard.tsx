import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function Dashboard({ projectId }: { projectId: string }) {
  // This data would be fetched from your API
  const urgentTasks = [
    { id: 1, title: 'Urgent Task 1', deadline: '2023-06-30' },
    { id: 2, title: 'Urgent Task 2', deadline: '2023-07-01' },
  ]

  const projectProgress = 65

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Urgent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {urgentTasks.map(task => (
              <li key={task.id} className="flex justify-between">
                <span>{task.title}</span>
                <span className="text-red-500">{task.deadline}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={projectProgress} className="w-full" />
          <p className="text-center mt-2">{projectProgress}% Complete</p>
        </CardContent>
      </Card>
      {/* Add more cards for other metrics */}
    </div>
  )
}

