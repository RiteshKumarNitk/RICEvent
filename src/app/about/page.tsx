import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About the Rajasthan International Center</h1>
        <p className="mt-4 text-xl text-muted-foreground">A Hub of Culture, Knowledge, and Diplomacy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p>
            The Rajasthan International Centre (RIC) stands as a premier institution in Jaipur, conceived to foster cultural exchange, intellectual dialogue, and social engagement. It is a space where art, culture, and intellect converge, offering a platform for thinkers, artists, and leaders from around the globe.
          </p>
          <p>
            Our mission is to create a vibrant ecosystem for knowledge sharing and collaboration. We host a diverse range of events, including international conferences, seminars, cultural performances, and art exhibitions, all aimed at enriching the intellectual and cultural landscape of Rajasthan.
          </p>
          <p>
            Designed with state-of-the-art facilities, the RIC boasts a main auditorium, multiple conference halls, an art gallery, and a library, making it an ideal venue for events of all scales. We are committed to providing a world-class experience to our guests and patrons.
          </p>
        </div>
        <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-xl">
          <Image
            src="https://picsum.photos/seed/ric-about/800/600"
            alt="Rajasthan International Center Building"
            fill
            className="object-cover"
            data-ai-hint="modern building exterior"
          />
        </div>
      </div>
    </div>
  );
}
