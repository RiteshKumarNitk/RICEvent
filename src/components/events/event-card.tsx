import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={event.image}
              alt={event.name}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${event.category.toLowerCase()} event`}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <CardTitle className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors">
              {event.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.venue}</span>
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Badge variant="secondary">{event.category}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
