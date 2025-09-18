"use client";

import { events as staticEvents } from "@/lib/data";
import { EventCalendar } from "@/components/events/event-calendar";
import { useEvents } from "../admin/events/events-provider";

export default function EventsPage() {
  const { events } = useEvents();
  const allEvents = [...staticEvents, ...events.filter(e => !staticEvents.find(se => se.id === e.id))];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Explore Our Events</h1>
            <p className="mt-4 text-xl text-muted-foreground">Discover a world of culture, knowledge, and entertainment.</p>
        </div>
        <EventCalendar events={allEvents} />
    </div>
    </div>
  );
}
