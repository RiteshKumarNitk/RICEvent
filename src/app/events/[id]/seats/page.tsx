"use client";

import { useSearchParams, notFound, useParams } from "next/navigation";
import { useEvents } from "@/app/admin/events/events-provider";
import { SeatingChart } from "@/components/events/seating-chart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket } from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/types";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ShowtimeSelector = ({ event, selectedShowtime, onSelect }: { event: Event, selectedShowtime: string, onSelect: (time: string) => void }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {event.showtimes.map(time => (
                <Button 
                    key={time} 
                    variant={selectedShowtime === time ? 'default' : 'outline'}
                    onClick={() => onSelect(time)}
                    className={cn(selectedShowtime === time && "shadow-md")}
                >
                    {time}
                </Button>
            ))}
        </div>
    )
}

export default function SeatsPage() {
  const params = useParams();
  const id = params.id as string;
  const { events, loading } = useEvents();
  const searchParams = useSearchParams();
  
  const ticketCountParam = searchParams.get('tickets');
  const ticketCount = ticketCountParam ? parseInt(ticketCountParam, 10) : 0;

  const event = events.find((e) => e.id === id);
  const [selectedShowtime, setSelectedShowtime] = useState(event?.showtimes[0] || "");

  if (loading) {
      return <div className="container text-center py-12">Loading seating information...</div>;
  }

  if (!event || !ticketCount) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="icon" className="hidden md:flex">
                    <Link href={`/events/${id}`}>
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{event.name}</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        {event.venue} | {format(new Date(event.date), "E, d MMM yyyy")}
                    </p>
                </div>
            </div>
             <Badge variant="outline" className="flex items-center gap-2 text-base py-2 px-4 border-primary text-primary">
                <Ticket className="h-5 w-5" />
                <span>{ticketCount} Tickets</span>
            </Badge>
        </div>

        <div className="mb-8">
           <p className="text-sm font-semibold mb-2">Showtimes:</p>
           <ShowtimeSelector event={event} selectedShowtime={selectedShowtime} onSelect={setSelectedShowtime} />
        </div>
        
        <SeatingChart event={event} ticketCount={ticketCount} />
    </div>
  );
}
