import { Button } from "@/components/ui/button";
import { events } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EventCard } from "@/components/events/event-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const upcomingEvents = events.slice(0, 5);

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="container relative h-full flex flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold">Rajasthan International Center</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl">The premier destination for cultural, intellectual, and corporate events in Rajasthan.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16 space-y-16">
        
        <section>
            <Image
                src="https://storage.googleapis.com/aifirebase-static-content/studio-public/blockbuster-tuesday.png"
                alt="Blockbuster Tuesdays"
                width={1200}
                height={300}
                className="w-full h-auto rounded-lg shadow-lg"
            />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
           <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-1">
                    {upcomingEvents.map((event, index) => (
                      <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3 p-1">
                        <EventCard event={event} index={index} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
            </CardContent>
          </Card>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </section>

        <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Follow us on Instagram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                            <Image
                                src={`https://picsum.photos/seed/insta${i}/400`}
                                alt={`Instagram Post ${i+1}`}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full"
                                data-ai-hint="lifestyle event"
                            />
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
        </section>

        <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">Latest on YouTube</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="aspect-video bg-muted rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                             <Image
                                src={`https://picsum.photos/seed/youtube${i}/800/450`}
                                alt={`YouTube Video ${i+1}`}
                                width={800}
                                height={450}
                                className="object-cover w-full h-full"
                                data-ai-hint="event recording"
                            />
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
        </section>
      </div>
    </>
  );
}
