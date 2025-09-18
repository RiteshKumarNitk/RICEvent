"use client";

import { useState } from "react";
import { Event } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { EventList } from "./event-list";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { DayContent, DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

interface EventCalendarProps {
    events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const eventDates = events.map(event => new Date(event.date).toDateString());

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
    }
    
    const eventDayStyle = { 
        backgroundColor: 'hsl(var(--secondary))',
        borderRadius: 'var(--radius)',
    };
    
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
                             modifiers={{
                                event: (day) => eventDates.includes(day.toDateString()),
                            }}
                            modifiersClassNames={{
                                event: 'event-day'
                            }}
                        />
                    </CardContent>
                </Card>
                 <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-md event-day-legend"></div>
                        <span>Date with an event</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs">
                           {new Date().getDate()}
                        </div>
                        <span>Selected date</span>
                    </div>
                </div>
            </div>
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">
                    Events for {date ? format(date, "MMMM d, yyyy") : "All Upcoming Events"}
                </h2>
                <EventList events={events} selectedDate={date} />
            </div>
        </div>
    );
}
