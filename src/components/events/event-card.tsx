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
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  layout?: 'grid' | 'list';
}

export function EventCard({ event, layout = 'grid' }: EventCardProps) {
  if (layout === 'list') {
    return (
       <Link href={`/events/${event.id}`} className="group block">
        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="hidden sm:block">
              <div className="font-semibold text-center text-primary w-16">
                  <div className="text-sm">{format(new Date(event.date), "MMM")}</div>
                  <div className="text-3xl">{format(new Date(event.date), "dd")}</div>
              </div>
            </div>
             <div className="relative w-32 h-20 overflow-hidden rounded-md flex-shrink-0">
                <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover"
                    data-ai-hint={`${event.category.toLowerCase()} event`}
                />
            </div>
            <div className="flex-1">
                <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors mb-1">
                  {event.name}
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.venue}</span>
                </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
                 <Badge variant="secondary" className="font-semibold">{event.category}</Badge>
                 <Button variant="ghost" size="sm">
                     Details <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/events/${event.id}`} className="group block h-full">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-card">
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
            <div className="flex items-center text-sm text-muted-foreground flex-1">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.venue}</span>
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-2">
          <Badge variant="secondary" className="font-semibold">{event.category}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}