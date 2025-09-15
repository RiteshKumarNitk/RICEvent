import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EventList } from "@/components/events/event-list";
import { events } from "@/lib/data";
import { Suspense } from "react";
import { EventRecommendations } from "@/components/events/event-recommendations";
import { FeaturedCarousel } from "@/components/events/featured-carousel";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const featuredEvents = events.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <FeaturedCarousel events={featuredEvents} />
      </section>
      
      <Suspense fallback={<div className="text-center">Loading recommendations...</div>}>
        <EventRecommendations />
      </Suspense>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recommended Movies</h2>
        <Button variant="link" asChild className="text-primary">
          <Link href="#events">See All <ChevronRight className="w-4 h-4" /></Link>
        </Button>
      </div>
      <EventList events={events} />
    </div>
  );
}
