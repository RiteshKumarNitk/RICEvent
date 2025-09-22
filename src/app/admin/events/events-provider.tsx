

"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Event, SeatingChartData } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, Timestamp, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const generateSeats = (rowId: string, count: number, bookedSeats: string[]): { id: string, row: string, col: number, isBooked: boolean }[] => {
    return Array.from({ length: count }, (_, i) => {
        const seatNum = i + 1;
        const seatId = `${rowId}${seatNum}`;
        return {
            id: seatId,
            row: rowId,
            col: seatNum,
            isBooked: bookedSeats.includes(seatId),
        };
    });
};

const bookedSeatsSample = ["A5", "A6", "C10", "D1", "D2", "H5", "K12", "K13", "F20", "G1", "J15"];


const detailedSeatingChart: SeatingChartData = {
  tiers: [
    {
      tierName: 'Balcony',
      sections: [
        {
          sectionName: 'Balcony Left',
          price: 99,
          rows: [
            { rowId: 'J', seats: generateSeats('J', 10, bookedSeatsSample) },
            { rowId: 'K', seats: generateSeats('K', 10, bookedSeatsSample) },
            { rowId: 'L', seats: generateSeats('L', 10, bookedSeatsSample) },
          ],
          className: 'bg-purple-600/20 border-purple-600',
        },
        {
          sectionName: 'Balcony Center',
          price: 99,
          rows: [
             { rowId: 'J', seats: generateSeats('J', 20, bookedSeatsSample) },
             { rowId: 'K', seats: generateSeats('K', 20, bookedSeatsSample) },
             { rowId: 'L', seats: generateSeats('L', 20, bookedSeatsSample) },
          ],
          className: 'bg-purple-600/20 border-purple-600',
        },
        {
          sectionName: 'Balcony Right',
          price: 99,
          rows: [
            { rowId: 'J', seats: generateSeats('J', 10, bookedSeatsSample) },
            { rowId: 'K', seats: generateSeats('K', 10, bookedSeatsSample) },
            { rowId: 'L', seats: generateSeats('L', 10, bookedSeatsSample) },
          ],
          className: 'bg-purple-600/20 border-purple-600',
        },
      ],
    },
    {
      tierName: 'Middle',
      sections: [
        {
          sectionName: 'Middle Left',
          price: 299,
          rows: [
            { rowId: 'F', seats: generateSeats('F', 15, bookedSeatsSample) },
            { rowId: 'G', seats: generateSeats('G', 15, bookedSeatsSample) },
            { rowId: 'H', seats: generateSeats('H', 15, bookedSeatsSample) },
          ],
          className: 'bg-blue-600/20 border-blue-600',
        },
        {
          sectionName: 'Middle Right',
          price: 299,
          rows: [
            { rowId: 'F', seats: generateSeats('F', 15, bookedSeatsSample) },
            { rowId: 'G', seats: generateSeats('G', 15, bookedSeatsSample) },
            { rowId: 'H', seats: generateSeats('H', 15, bookedSeatsSample) },
          ],
          className: 'bg-blue-600/20 border-blue-600',
        },
      ],
    },
    {
        tierName: 'Premium',
        sections: [
            {
                sectionName: 'Premium Center',
                price: 499,
                rows: [
                    { rowId: 'A', seats: generateSeats('A', 20, bookedSeatsSample) },
                    { rowId: 'B', seats: generateSeats('B', 20, bookedSeatsSample) },
                    { rowId: 'C', seats: generateSeats('C', 20, bookedSeatsSample) },
                    { rowId: 'D', seats: generateSeats('D', 20, bookedSeatsSample) },
                ],
                className: 'bg-pink-600/20 border-pink-600',
            }
        ]
    }
  ],
};


const sampleEvents: Omit<Event, 'id'>[] = [
  {
    name: 'Starlight Symphony Orchestra',
    description: 'An enchanting evening with the Starlight Symphony Orchestra, performing timeless classics under the stars. A must-see for music lovers.',
    category: 'Music',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    location: 'Jaipur, Rajasthan',
    venue: 'RIC Auditorium',
    image: 'https://picsum.photos/seed/event1/600/400',
    showtimes: ['19:00', '21:30'],
    ticketTypes: [{ type: 'Standard', price: 299 }],
    seatingChart: detailedSeatingChart
  },
  {
    name: 'Tech Visionaries Summit 2024',
    description: 'Join industry leaders and innovators for a day of insightful talks on the future of technology, AI, and sustainability.',
    category: 'Seminar',
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    location: 'Jaipur, Rajasthan',
    venue: 'Convention Hall',
    image: 'https://picsum.photos/seed/event2/600/400',
    showtimes: ['09:00', '11:00', '14:00'],
    ticketTypes: [{ type: 'Standard', price: 99 }],
    seatingChart: detailedSeatingChart
  },
  {
    name: 'Abstract Realities: A Modern Art Exhibit',
    description: 'Explore the vibrant and thought-provoking world of modern abstract art from renowned artists across the globe.',
    category: 'Art',
    date: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
    location: 'Jaipur, Rajasthan',
    venue: 'Art Gallery',
    image: 'https://picsum.photos/seed/event3/600/400',
    showtimes: ['10:00 - 18:00'],
    ticketTypes: [{ type: 'Standard', price: 0 }],
  },
   {
    name: 'Hamlet: A Contemporary Tragedy',
    description: "Experience Shakespeare's masterpiece like never before in this gripping, modern-day adaptation of the classic tragedy.",
    category: 'Theater',
    date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    location: 'Jaipur, Rajasthan',
    venue: 'Main Auditorium',
    image: 'https://picsum.photos/seed/event4/600/400',
    showtimes: ['20:00'],
    ticketTypes: [{ type: 'Standard', price: 499 }],
    seatingChart: detailedSeatingChart
  },
  {
    name: 'Global Rhythms: A Cultural Dance Festival',
    description: 'Celebrate the diversity of world cultures through the universal language of dance. Featuring troupes from five continents.',
    category: 'Cultural',
    date: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    location: 'Jaipur, Rajasthan',
    venue: 'Open Air Theatre',
    image: 'https://picsum.photos/seed/event5/600/400',
    showtimes: ['18:30'],
    ticketTypes: [{ type: 'Standard', price: 199 }],
     seatingChart: detailedSeatingChart
  },
];


interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
  deleteAllEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Event, 'id'>,
        date: (doc.data().date as Timestamp).toDate().toISOString()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events: ", error);
      toast({ variant: 'destructive', title: "Error", description: "Could not fetch events from the database."});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
        const eventData = {
            ...event,
            date: Timestamp.fromDate(new Date(event.date))
        }
        await addDoc(collection(db, "events"), eventData);
        toast({ title: "Success", description: "Event created successfully."});
    } catch (error) {
        console.error("Error adding event: ", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not create event."});
    }
  };

  const updateEvent = async (id: string, event: Partial<Event>) => {
    try {
      const eventRef = doc(db, 'events', id);
      const updateData: { [key: string]: any } = { ...event };

      if (event.date) {
        updateData.date = Timestamp.fromDate(new Date(event.date));
      }

      await updateDoc(eventRef, updateData);
      toast({ title: "Success", description: "Event updated successfully."});
    } catch (error) {
      console.error("Error updating event: ", error);
      toast({ variant: 'destructive', title: "Error", description: "Could not update event."});
    }
  };

  const deleteEvent = async (id: string) => {
    try {
        await deleteDoc(doc(db, "events", id));
        toast({ title: "Success", description: "Event deleted successfully."});
    } catch (error) {
        console.error("Error deleting event: ", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not delete event."});
    }
  };

  const deleteAllEvents = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "events"));
        if (querySnapshot.empty) {
            toast({ title: "Database is already empty", description: "No events to delete."});
            return;
        }
        const batch = writeBatch(db);
        querySnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        toast({ title: "Success", description: "All events have been cleared from the database."});
    } catch (error) {
        console.error("Error clearing database: ", error);
        toast({ variant: 'destructive', title: "Deletion Failed", description: "Could not clear events from the database."});
    }
  }

  const seedDatabase = useCallback(async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const snapshot = await getDocs(eventsCollection);

      if (snapshot.empty) {
        const batch = writeBatch(db);
        sampleEvents.forEach((event) => {
          const eventData = { ...event, date: Timestamp.fromDate(new Date(event.date)) };
          const docRef = doc(eventsCollection);
          batch.set(docRef, eventData);
        });
        await batch.commit();
        toast({ title: 'Database Seeded', description: 'Sample events have been added.' });
      } else {
        toast({ title: 'Database Not Empty', description: 'Seeding was skipped because events already exist.' });
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'Could not add sample events. Check Firestore security rules and that you are logged in.',
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (!loading && events.length === 0) {
      seedDatabase();
    }
  }, [loading, events.length, seedDatabase]);

  return (
    <EventsContext.Provider value={{ events, loading, addEvent, updateEvent, deleteEvent, seedDatabase, deleteAllEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
