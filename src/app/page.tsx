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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building, Clapperboard, Lightbulb, Users } from "lucide-react";

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
      
      <div className="container mx-auto px-4 py-16 space-y-20">

        <section>
          <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">A Hub of Culture, Knowledge, and Diplomacy</h2>
              <p className="text-lg text-muted-foreground">
                  The Rajasthan International Centre (RIC) is a world-class institution designed to be the epicenter of cultural exchange, intellectual dialogue, and social engagement in Rajasthan. We offer a vibrant platform for thinkers, artists, and leaders to connect and collaborate.
              </p>
          </div>
        </section>

        <section>
             <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">What We Offer</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center p-4">
                        <Clapperboard className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Culture & Arts</h3>
                        <p className="text-muted-foreground">Immerse yourself in a diverse array of cultural performances, art exhibitions, and film screenings that showcase local and global talent.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <Lightbulb className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Knowledge & Ideas</h3>
                        <p className="text-muted-foreground">Engage in thought-provoking seminars, talks, and conferences featuring leading experts from various fields.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <Users className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-2xl font-semibold mb-2">Community & Networking</h3>
                        <p className="text-muted-foreground">Connect with like-minded individuals and professionals in a dynamic environment built for collaboration.</p>
                    </div>
                </CardContent>
             </Card>
        </section>
        
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
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-3xl font-bold">Upcoming Events</CardTitle>
               <Button asChild variant="outline">
                  <Link href="/events">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {upcomingEvents.map((event, index) => (
                      <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                        <EventCard event={event} index={index} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex" />
                  <CarouselNext className="hidden md:flex" />
                </Carousel>
            </CardContent>
          </Card>
        </section>

         <section>
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Explore Our Venues</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                     <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image src="https://picsum.photos/seed/venue1/400" layout="fill" objectFit="cover" alt="Auditorium" data-ai-hint="modern auditorium interior"/>
                        <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                            <h3 className="text-white font-bold text-xl">Main Auditorium</h3>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image src="https://picsum.photos/seed/venue2/400" layout="fill" objectFit="cover" alt="Conference Hall" data-ai-hint="conference room empty"/>
                        <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                            <h3 className="text-white font-bold text-xl">Conference Halls</h3>
                        </div>
                    </div>
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image src="https://picsum.photos/seed/venue3/400" layout="fill" objectFit="cover" alt="Art Gallery" data-ai-hint="art gallery empty"/>
                        <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                            <h3 className="text-white font-bold text-xl">Art Gallery</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
