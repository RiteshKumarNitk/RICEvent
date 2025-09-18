"use client";

import { useState, useMemo } from "react";
import type { Event, EventCategory } from "@/lib/types";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories: (EventCategory | "All")[] = ["All", "Music", "Sports", "Art", "Theater", "Seminar", "Cultural", "Talk"];

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const [activeCategory, setActiveCategory] = useState<EventCategory | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => activeCategory === "All" || event.category === activeCategory)
      .filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, activeCategory, searchTerm]);


  return (
    <section id="events" className="scroll-mt-20">
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for events..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 p-1 bg-muted rounded-lg">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "ghost"}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "flex-1 md:flex-initial transition-all duration-300 text-xs sm:text-sm h-8",
                activeCategory === category ? 'shadow-sm' : 'hover:bg-primary/10'
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p>Try adjusting your search or selecting a different category.</p>
        </div>
      )}
    </section>
  );
}
