import Image from 'next/image';
import { Building, Globe, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">About the Rajasthan International Center</h1>
          <p className="mt-4 text-xl text-muted-foreground">A Hub of Culture, Knowledge, and Diplomacy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
            <Image
              src="https://picsum.photos/seed/ric-about/800/600"
              alt="Rajasthan International Center Building"
              fill
              className="object-cover"
              data-ai-hint="modern building exterior"
            />
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              The Rajasthan International Centre (RIC) stands as a premier institution in Jaipur, conceived to foster cultural exchange, intellectual dialogue, and social engagement. It is a space where art, culture, and intellect converge, offering a platform for thinkers, artists, and leaders from around the globe.
            </p>
            <p>
              Our mission is to create a vibrant ecosystem for knowledge sharing and collaboration. We host a diverse range of events, including international conferences, seminars, cultural performances, and art exhibitions, all aimed at enriching the intellectual and cultural landscape of Rajasthan.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">To promote intellectual and cultural activities, providing a world-class platform for dialogue and diplomacy that bridges Rajasthan with the world.</p>
            </div>
            <div className="flex flex-col items-center">
              <Building className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Our Facilities</h3>
              <p className="text-muted-foreground">State-of-the-art auditoriums, convention halls, a digital library, and art galleries designed to host a wide spectrum of events.</p>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-semibold mb-2">Our Vision</h3>
              <p className="text-muted-foreground">To be a globally recognized center of excellence that showcases the rich heritage of Rajasthan while embracing modern innovation and thought.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Location & Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>
                    Conveniently located in the Jhalana Institutional Area, the heart of Jaipur, the Rajasthan International Center is easily accessible from all parts of the city. Its strategic location makes it an ideal venue for both local and international visitors.
                </p>
                 <p>
                    The center follows international standards for accessibility and services, ensuring a comfortable and welcoming environment for all our guests. We are committed to sustainability and green practices in our operations.
                </p>
            </div>
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                 <Image
                    src="https://picsum.photos/seed/ric-map/800/600"
                    alt="Map location of Rajasthan International Center"
                    fill
                    className="object-cover"
                    data-ai-hint="city map location"
                 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
