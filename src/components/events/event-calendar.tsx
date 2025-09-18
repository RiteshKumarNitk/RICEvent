"use client";

import { useState } from "react";
import { Event } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { EventList } from "./event-list";
import { Card, CardContent } from "@/components/ui/card";
import { format, getDay } from "date-fns";
import { DayContent, DayPicker } from "react-day-picker";

interface EventCalendarProps {
    events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const eventDates = events.map(event => new Date(event.date).toDateString());

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
    }
    
    function DayContent(props: any) {
        const hasEvent = eventDates.includes(props.date.toDateString());
        return (
            <div className="relative h-full w-full">
                <DayPicker.Day {...props} />
                {hasEvent && <div className="event-dot" />}
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                 <Card>
                    <CardContent className="p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="w-full"
                            components={{
                                Day: DayContent,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">
                    Events for {date ? format(date, "MMMM d, yyyy") : "All Upcoming Events"}
                </h2>
                <EventList events={events} initialDate={date} />
            </div>
        </div>
    );
}
