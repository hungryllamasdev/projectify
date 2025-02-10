"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CheckCircle2, Folder, Pin, Star, BarChart2, PieChart, Activity } from "lucide-react"
import { ItemDetailsModal } from "@/components/dashboard/item-details.modal"
import { fetchDashboardData } from "@/utils/api"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  })

  const openModal = (item: any) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (isError) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error fetching dashboard data</div>
  }

  const { myTasks, projects, pinnedTasks, upcomingDeadlines } = data

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_progress":
        return "bg-blue-500"
      case "todo":
        return "bg-yellow-500"
      case "done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8">Dashboard</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Project Overview</CardTitle>
          <CardDescription>A quick glance at your project stats</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks" className="w-full space-y-4">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 gap-4">
              <TabsTrigger value="tasks" className="flex items-center justify-center space-x-2">
                <BarChart2 className="w-4 h-4" />
                <span>Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center justify-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Projects</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Total Tasks", icon: Star, count: myTasks.length },
                  {
                    title: "In Progress",
                    icon: Activity,
                    count: myTasks.filter((task) => task.status === "IN_PROGRESS").length,
                  },
                  {
                    title: "To Do",
                    icon: CheckCircle2,
                    count: myTasks.filter((task) => task.status === "TODO").length,
                  },
                  { title: "Done", icon: CheckCircle2, count: myTasks.filter((task) => task.status === "DONE").length },
                ].map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{item.count}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    onClick={() => openModal(project)}
                  >
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Progress value={project.progress} className="w-full" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "My Tasks",
            icon: CheckCircle2,
            data: myTasks,
            render: (task) => (
              <>
                <h3 className="font-medium">{task.title}</h3>
                <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white mt-1`}>
                  {task.status}
                </Badge>
              </>
            ),
          },
          {
            title: "Projects",
            icon: Folder,
            data: projects,
            render: (project) => (
              <>
                <h3 className="font-medium">{project.name}</h3>
                <Progress value={project.progress} className="mt-2" />
              </>
            ),
          },
          {
            title: "Pinned Tasks",
            icon: Pin,
            data: pinnedTasks,
            render: (task) => <h3 className="font-medium">{task.title}</h3>,
          },
          {
            title: "Upcoming Deadlines",
            icon: CalendarDays,
            data: upcomingDeadlines,
            render: (deadline) => (
              <>
                <h3 className="font-medium">{deadline.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{deadline.date}</p>
              </>
            ),
          },
        ].map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium flex items-center space-x-2">
                <section.icon className="w-5 h-5" />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px]">
                {section.data.map((item) => (
                  <div
                    key={item.id}
                    className="mb-4 p-3 cursor-pointer hover:bg-accent rounded-lg transition-colors duration-200"
                    onClick={() => openModal(item)}
                  >
                    {section.render(item)}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
      <ItemDetailsModal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

