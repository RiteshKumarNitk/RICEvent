import { Button } from "@/components/ui/button";
import { EventList } from "@/components/events/event-list";
import { events } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const featuredEvents = events.slice(0, 3);

  return (
    <>
      <section className="relative h-[60vh] bg-secondary">
        <Image 
          src="https://picsum.photos/seed/ric-hero/1800/1000"
          alt="Rajasthan International Center"
          fill
          className="object-cover"
          data-ai-hint="modern architecture building"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative h-full flex flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold">Rajasthan International Center</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">The premier destination for cultural, intellectual, and corporate events in Rajasthan.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <EventList events={featuredEvents} />
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
