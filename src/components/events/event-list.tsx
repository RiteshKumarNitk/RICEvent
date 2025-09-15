"use client";

import { useState } from "react";
import type { Event, EventCategory } from "@/lib/types";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const categories: (EventCategory | "All")[] = ["All", "Music", "Sports", "Art", "Theater", "Seminar", "Cultural", "Talk"];

export function EventList({ events }: { events: Event[] }) {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "All">("All");

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <section id="events" className="scroll-mt-20">
      <div className="mb-8">
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 p-2 bg-muted rounded-lg max-w-3xl mx-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "flex-1 md:flex-initial transition-all duration-300",
                activeCategory === category ? 'shadow-sm' : 'hover:bg-primary/10'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p>Try selecting a different category.</p>
        </div>
      )}
    </section>
  );
}
