// src/components/events/featured-carousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Event } from "@/lib/types";

export function FeaturedCarousel({ events }: { events: Event[] }) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem key={event.id}>
            <Link href={`/events/${event.id}`}>
              <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-lg">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority={events.indexOf(event) < 2}
                  data-ai-hint={`${event.category.toLowerCase()} event poster`}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
    </Carousel>
  );
}
