"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, getDocs, DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (eventId: string, event: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

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


export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const eventsCollection = collection(db, 'events');
  
    const initializeEvents = async () => {
      // First, check if the events collection is empty.
      const initialSnapshot = await getDocs(eventsCollection);
      if (initialSnapshot.empty) {
        console.log("No events found in Firestore. Seeding database...");
        try {
          // If it's empty, add the sample events.
          for (const event of sampleEvents) {
            await addDoc(eventsCollection, {
              ...event,
              date: new Date(event.date), // Store as Firestore Timestamp
            });
          }
          console.log("Database seeded successfully with sample events.");
        } catch (error) {
          console.error("Error seeding database: ", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not seed the database.' });
        }
      }

      // After potentially seeding, set up the real-time listener.
      const unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
        const eventsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp back to ISO string for consistency in the app
            date: (data.date as Timestamp).toDate().toISOString(),
          } as Event;
        });
        setEvents(eventsData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching events snapshot: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch events. Check Firestore permissions.' });
        setLoading(false);
      });
  
      return unsubscribe;
    };
  
    const unsubscribePromise = initializeEvents();
  
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) {
          unsubscribe();
        }
      });
    };
  }, [toast]);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      await addDoc(collection(db, 'events'), {
          ...event,
          date: new Date(event.date),
      });
      toast({ title: 'Success', description: 'Event added successfully.' });
    } catch (error) {
      console.error("Error adding event: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add event.' });
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Omit<Event, 'id'>>) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatePayload: DocumentData = { ...eventData };
      if (eventData.date) {
        updatePayload.date = new Date(eventData.date);
      }
      await updateDoc(eventRef, updatePayload);
      toast({ title: 'Success', description: 'Event updated successfully.' });
    } catch (error) {
      console.error("Error updating event: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update event.' });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      toast({ title: 'Success', description: 'Event deleted successfully.' });
    } catch (error) {
      console.error("Error deleting event: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete event.' });
    }
  };

  const value = {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
