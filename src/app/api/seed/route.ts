import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';

const sampleEvents: Omit<Event, 'id'>[] = [
    {
        name: "Starlight Symphony Orchestra",
        description: "Experience a magical evening with the Starlight Symphony Orchestra, performing classical masterpieces under the stars. A perfect event for music lovers of all ages.",
        category: "Music",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        location: "Jaipur, Rajasthan",
        venue: "Central Park Amphitheater",
        image: "https://picsum.photos/seed/event1/600/400",
        showtimes: ["19:00"],
        ticketTypes: [{ type: "Standard", price: 500 }],
    },
    {
        name: "Future of AI - Tech Summit",
        description: "Join industry leaders and innovators to discuss the future of Artificial Intelligence. This summit will feature keynote speakers, panel discussions, and networking opportunities.",
        category: "Seminar",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
        location: "Jaipur, Rajasthan",
        venue: "RIC Convention Hall",
        image: "https://picsum.photos/seed/event2/600/400",
        showtimes: ["09:00", "13:00"],
        ticketTypes: [{ type: "Standard", price: 1500 }],
    },
    {
        name: "Abstract Expressions Art Exhibit",
        description: "A curated collection of abstract art from emerging local artists. Explore the depths of emotion and form through a variety of mediums.",
        category: "Art",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
        location: "Jaipur, Rajasthan",
        venue: "RIC Art Gallery",
        image: "https://picsum.photos/seed/event3/600/400",
        showtimes: ["11:00"],
        ticketTypes: [{ type: "Standard", price: 0 }],
    },
     {
        name: "Rajasthan Cultural Festival",
        description: "Celebrate the rich heritage of Rajasthan with a day full of folk music, dance performances, traditional food stalls, and artisan crafts.",
        category: "Cultural",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month from now
        location: "Jaipur, Rajasthan",
        venue: "Jaipur Exhibition Centre",
        image: "https://picsum.photos/seed/event4/600/400",
        showtimes: ["10:00"],
        ticketTypes: [{ type: "Standard", price: 250 }],
    },
];

// This is a special endpoint to seed the database with initial data.
// It should only be run once. It is safe to call multiple times, as it will
// not add duplicate data if events already exist.
export async function GET() {
  try {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);

    if (!snapshot.empty) {
      return NextResponse.json({ message: 'Database already seeded.' }, { status: 200 });
    }

    console.log('Database is empty. Seeding with sample events...');
    for (const eventData of sampleEvents) {
      await addDoc(eventsCollection, {
        ...eventData,
        date: new Date(eventData.date), // Store as a proper timestamp
      });
    }
    
    return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error seeding database:', error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    // Check for permission errors specifically.
    if (errorMessage.includes('Missing or insufficient permissions')) {
        return NextResponse.json({ 
            message: 'Firestore security rules are blocking the seeding process. Please ensure that your rules allow for writes to the events collection, at least temporarily.',
            error: errorMessage
        }, { status: 500 });
    }
    return NextResponse.json({ message: 'Failed to seed database.', error: errorMessage }, { status: 500 });
  }
}
