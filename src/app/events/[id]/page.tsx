"use client";

import { events as staticEvents } from "@/lib/data";
import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Share2, Comedy, Languages, PersonStanding } from "lucide-react";
import { format } from "date-fns";
import { useEvents } from "@/app/admin/events/events-provider";
import { Button } from "@/components/ui/button";

export default function EventPage() {
  const params = useParams();
  const id = params.id as string;
  const { events } = useEvents();
  const event = events.find((e) => e.id === id) || staticEvents.find(e => e.id === id);
  const router = useRouter();

  if (!event) {
    notFound();
  }

  const handleBookNow = () => {
    router.push(`/events/${event.id}/seats?tickets=1`);
  };
  
  const ticketPrice = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{event.name}</h1>
                <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div className="lg:col-span-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4 shadow-lg">
                        <Image
                        src={event.image}
                        alt={event.name}
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint={`${event.category.toLowerCase()} event poster`}
                        />
                    </div>
                     <Badge variant="outline" className="text-base py-1 px-3">
                        {event.category}
                    </Badge>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-background rounded-lg shadow-lg p-6 sticky top-24">
                        <ul className="space-y-4 text-muted-foreground mb-6">
                            <li className="flex items-center gap-4">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <Clock className="h-5 w-5 text-primary" />
                                <span>{event.showtimes.join(' / ')}</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>{event.venue}, {event.location}</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <Comedy className="h-5 w-5 text-primary" />
                                <span>{event.category}</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <PersonStanding className="h-5 w-5 text-primary" />
                                <span>18+</span>
                            </li>
                             <li className="flex items-center gap-4">
                                <Languages className="h-5 w-5 text-primary" />
                                <span>English, Hindi</span>
                            </li>
                        </ul>
                        
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-2xl font-bold">₹{ticketPrice.toFixed(2)}</p>
                                <p className="text-sm text-green-600">Available</p>
                            </div>
                        </div>

                        <Button size="lg" className="w-full" onClick={handleBookNow}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
             <div className="prose prose-lg max-w-none mt-12 bg-background p-8 rounded-lg shadow">
                <h2 className="font-bold text-2xl mb-4">About the event</h2>
                <p>{event.description}</p>
            </div>
        </div>
    </div>
  );
}
