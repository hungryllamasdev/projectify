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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [bookingsByDate, setBookingsByDate] = useState({});

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <Card className="mb-8">
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
                        const dayRides = bookingsByDate[dateKey] || [];
                        return (
                            <Button
                                key={day.toString()}
                                variant="outline"
                                className={`
                        h-20 p-2 flex flex-col items-start justify-start
                        ${!isSameMonth(day, currentDate) ? "opacity-50" : ""}
                        ${isToday(day) ? "border-blue-500 border-2" : ""}
                        ${isSameDay(day, selectedDate) ? "bg-blue-100" : ""}
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
                                    {dayRides.slice(0, 3).map((ride) => (
                                        <div
                                            key={ride.id}
                                            className={`w-2 h-2 rounded-full ${
                                                statusColors[ride.status].split(
                                                    " "
                                                )[0]
                                            }`}
                                        ></div>
                                    ))}
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
