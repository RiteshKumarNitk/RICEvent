import { EventList } from "@/components/events/event-list";
import { events } from "@/lib/data";

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">All Events</h1>
            <p className="mt-4 text-xl text-muted-foreground">Explore our diverse range of events</p>
        </div>
        <EventList events={events} />
    </div>
  );
}
