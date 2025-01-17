"use client";

import { useState, useMemo } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TaskDetails } from "./TaskDetails";

export interface Task {
  id: string;
  projectID: string;
  title: string;
  type: "FEATURE" | "BUG" | "TASK";
  description?: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
  isCompleted: boolean;
  isPinned: boolean;
  priority: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarProps {
  data: Task[];
}

export default function Calendar({ data: initialData }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [data, setData] = useState<Task[]>(initialData);
    const { toast } = useToast();

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const tasksByDate = useMemo(() => {
        const taskMap: { [key: string]: Task[] } = {};
        data.forEach(task => {
            if (task.dueDate) {
                const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd");
                if (!taskMap[dateKey]) {
                    taskMap[dateKey] = [];
                }
                taskMap[dateKey].push(task);
            }
        });
        return taskMap;
    }, [data]);

    const statusColors = {
        BACKLOG: "bg-gray-400",
        TODO: "bg-yellow-400",
        IN_PROGRESS: "bg-blue-400",
        DONE: "bg-green-400"
    };

    const selectedTasks = selectedDate
        ? tasksByDate[format(selectedDate, "yyyy-MM-dd")] || []
        : [];

    const handleTaskUpdate = (updatedTask: Task) => {
        setData(prevData => prevData.map(task => task.id === updatedTask.id ? updatedTask : task));
        toast({
            title: "Task updated",
            description: "The task has been successfully updated.",
        });
    };

    const handleTaskDelete = (taskId: string) => {
        setData(prevData => prevData.filter(task => task.id !== taskId));
        toast({
            title: "Task deleted",
            description: "The task has been successfully deleted.",
        });
    };

    return (
        <div className="flex gap-8">
            <Card className="mb-8 flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        {format(currentDate, "MMMM yyyy")}
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevMonth}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="text-center font-medium text-gray-500 py-2"
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {monthDays.map((day, dayIdx) => {
                            const dateKey = format(day, "yyyy-MM-dd");
                            const dayTasks = tasksByDate[dateKey] || [];
                            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                            return (
                                <Button
                                    key={day.toString()}
                                    variant="outline"
                                    className={`
                                        h-20 p-2 flex flex-col items-start justify-start
                                        ${!isSameMonth(day, currentDate) ? "opacity-50" : ""}
                                        ${isToday(day) ? "border-blue-500 border-2" : ""}
                                        ${isSelected ? "bg-blue-100" : ""}
                                    `}
                                    onClick={() => handleDateClick(day)}
                                >
                                    <span
                                        className={`text-sm font-medium ${
                                            isToday(day) ? "text-blue-600" : ""
                                        }`}
                                    >
                                        {format(day, "d")}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {dayTasks.slice(0, 3).map((task) => (
                                            <div
                                                key={task.id}
                                                className={`w-2 h-2 rounded-full ${statusColors[task.status]}`}
                                                title={task.title}
                                            ></div>
                                        ))}
                                        {dayTasks.length > 3 && (
                                            <div className="text-xs text-gray-500">
                                                +{dayTasks.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
            <div className="w-1/3">
                <TaskDetails
                    tasks={selectedTasks}
                    selectedDate={selectedDate}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                />
            </div>
        </div>
    );
}

