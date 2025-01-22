import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus, TaskPriority, ProjectRole, ActivityType } from "@prisma/client";

// Define types based on the schema
interface DashboardResponse {
  progress: {
    overall: number;
    completedTasks: number;
    totalTasks: number;
    tasksByStatus: Record<TaskStatus, number>;
  };
  team: {
    name: string | null;
    role: ProjectRole;
    image: string | null;
    email: string;
  }[];
  priorityItems: {
    id: string;
    title: string;
    dueDate: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeName: string | null;
  }[];
  activityFeed: {
    id: string;
    type: ActivityType;
    timestamp: Date;
    userName: string | null;
  }[];
  tasksByStatus: {
    status: TaskStatus;
    count: number;
  }[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pid: string } }
) {
  const { pid } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: pid },
      include: {
        tasks: {
          include: {
            assignee: true,
          },
        },
        members: {
          include: {
            user: true,
          },
        },
        ActivityLog: {
          include: {
            user: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
          take: 10, // Limit to last 10 activities
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate task statistics
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task) => task.status === TaskStatus.DONE
    ).length;
    const overallProgress = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // Calculate tasks by status
    const tasksByStatus = Object.values(TaskStatus).map(status => ({
      status,
      count: project.tasks.filter(task => task.status === status).length
    }));

    // Prepare team overview
    const team = project.members.map((member) => ({
      name: member.user.name,
      role: member.role,
      image: member.user.image,
      email: member.user.email,
    }));

    // Get priority items (tasks with upcoming deadlines and high priority)
    const priorityItems = project.tasks
      .filter((task) => task.status !== TaskStatus.DONE)
      .sort((a, b) => {
        // Sort by priority first
        if (a.priority !== b.priority) {
          return a.priority === TaskPriority.HIGH ? -1 : 1;
        }
        // Then by due date if available
        if (a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        return 0;
      })
      .slice(0, 5) // Get top 5 priority items
      .map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate?.toISOString() || null,
        status: task.status,
        priority: task.priority,
        assigneeName: task.assignee.name,
      }));

    // Format activity feed
    const activityFeed = project.ActivityLog.map((log) => ({
      id: log.id,
      type: log.type,
      timestamp: log.timestamp,
      userName: log.user?.name || null,
    }));

    const response: DashboardResponse = {
      progress: {
        overall: overallProgress,
        completedTasks,
        totalTasks,
        tasksByStatus: Object.values(TaskStatus).reduce((acc, status) => ({
          ...acc,
          [status]: project.tasks.filter(task => task.status === status).length
        }), {} as Record<TaskStatus, number>)
      },
      team,
      priorityItems,
      activityFeed,
      tasksByStatus,
    };

    console.log(response)

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching project dashboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}