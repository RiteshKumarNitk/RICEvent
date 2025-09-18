"use client";

import { events as staticEvents } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { SeatingChart } from "@/components/events/seating-chart";
import {
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEvents } from "@/app/admin/events/events-provider";

export default function EventPage({ params }: { params: { id: string } }) {
  const { events } = useEvents();
  const event = events.find((e) => e.id === params.id) || staticEvents.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
        <div className="md:col-span-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6 shadow-lg">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
              data-ai-hint={`${event.category.toLowerCase()} event`}
            />
          </div>
           <CardHeader className="px-0">
              <div className="flex items-center gap-4 mb-2">
                 <Badge variant="secondary" className="text-base">
                  {event.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{event.name}</CardTitle>
               <div className="flex items-center pt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.venue}, {event.location}</span>
                </div>
            </CardHeader>
           
              <div className="prose prose-lg max-w-none mt-6">
                <p>{event.description}</p>
              </div>
        </div>
        <div className="md:col-span-2">
            <SeatingChart event={event} />
        </div>
      </div>
    </div>
  );
}
