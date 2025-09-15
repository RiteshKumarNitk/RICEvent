import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/events/event-list";
import { events } from "@/lib/data";
import { Suspense } from "react";
import { EventRecommendations } from "@/components/events/event-recommendations";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative mb-16 h-[50vh] min-h-[400px] w-full overflow-hidden rounded-2xl bg-primary/20">
        <Image
          src="https://picsum.photos/seed/hero/1200/600"
          alt="Concert crowd"
          fill
          className="object-cover"
          priority
          data-ai-hint="concert crowd"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg">
            Unforgettable Experiences Await
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6 drop-shadow-md">
            Discover and book tickets for the best live events, from concerts and sports to theater and art shows.
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 px-8 font-bold">
            Explore Events
          </Button>
        </div>
      </section>
      
      <Suspense fallback={<div className="text-center">Loading recommendations...</div>}>
        <EventRecommendations />
      </Suspense>

      <EventList events={events} />
    </div>
  );
}
