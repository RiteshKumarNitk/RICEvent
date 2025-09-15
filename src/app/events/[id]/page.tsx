import { events } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { SeatingChart } from "@/components/events/seating-chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EventPage({ params }: { params: { id: string } }) {
  const event = events.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-4 shadow-lg">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              priority
              data-ai-hint={`${event.category.toLowerCase()} event`}
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-muted-foreground">
                <Badge variant="secondary" className="text-base">
                  {event.category}
                </Badge>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.venue}, {event.location}</span>
                </div>
              </div>
              <p className="text-lg leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
            <SeatingChart event={event} />
        </div>
      </div>
    </div>
  );
}
