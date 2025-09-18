"use client";

import { EventList } from "@/components/events/event-list";
import { useEvents } from "../admin/events/events-provider";

export default function EventsPage() {
  const { events, loading } = useEvents();

  if (loading) {
    return <div className="container text-center py-12">Loading events...</div>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">Explore Our Events</h1>
            <p className="mt-4 text-xl text-muted-foreground">Discover a world of culture, knowledge, and entertainment.</p>
        </div>
        <EventList events={events} />
    </div>
    </div>
  );
}
