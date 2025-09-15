"use client";

import { useState } from "react";
import type { Event, EventCategory } from "@/lib/types";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { MusicIcon } from "../icons/music-icon";
import { SportsIcon } from "../icons/sports-icon";
import { ArtIcon } from "../icons/art-icon";
import { TheaterIcon } from "../icons/theater-icon";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Input } from "../ui/input";

const categories: { name: EventCategory | 'All', icon: React.ReactNode }[] = [
  { name: "All", icon: <Search className="w-4 h-4 mr-2" /> },
  { name: "Music", icon: <MusicIcon className="w-4 h-4 mr-2" /> },
  { name: "Sports", icon: <SportsIcon className="w-4 h-4 mr-2" /> },
  { name: "Art", icon: <ArtIcon className="w-4 h-4 mr-2" /> },
  { name: "Theater", icon: <TheaterIcon className="w-4 h-4 mr-2" /> },
];

export function EventList({ events }: { events: Event[] }) {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "All">("All");

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <section id="events" className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-headline mb-4 text-center">
          Explore Events
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 p-2 bg-muted rounded-lg max-w-2xl mx-auto">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "ghost"}
              onClick={() => setActiveCategory(category.name)}
              className={cn(
                "flex-1 md:flex-initial transition-all duration-300",
                activeCategory === category.name ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
              )}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
