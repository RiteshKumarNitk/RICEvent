
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, Timestamp, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const detailedSeatingChart = {
  sections: [
    {
      sectionName: "Club",
      price: 499,
      rows: Array.from({ length: 5 }, (_, i) => String.fromCharCode(65 + i)), // A-E
      seatsPerRow: 16,
      className: "bg-red-500/20 border-red-500",
    },
    {
      sectionName: "Executive",
      price: 299,
      rows: Array.from({ length_from: 6, length: 7 }, (_, i) => String.fromCharCode(65 + i)), // F-L
      seatsPerRow: 20,
      className: "bg-purple-500/20 border-purple-500",
    },
    {
      sectionName: "Normal",
      price: 99,
      rows: Array.from({ length_from: 13, length: 5 }, (_, i) => String.fromCharCode(65 + i)), // M-Q
      seatsPerRow: 22,
      className: "bg-blue-500/20 border-blue-500",
    },
  ],
   bookedSeats: ["A5", "C10", "D1", "F8", "G12", "H3", "L18", "P20", "Q1"],
};


const sampleEvents: Omit<Event, 'id'>[] = [
    {
        name: "Starlight Symphony Orchestra",
        description: "Experience a magical evening with the Starlight Symphony Orchestra, performing classical masterpieces under the stars. A perfect event for music lovers of all ages.",
        category: "Music",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Jaipur, Rajasthan",
        venue: "Central Park Amphitheater",
        image: "https://picsum.photos/seed/event1/600/400",
        showtimes: ["19:00"],
        ticketTypes: [{ type: "Standard", price: 0 }],
        seatingChart: detailedSeatingChart,
    },
    {
        name: "Future of AI - Tech Summit",
        description: "Join industry leaders and innovators to discuss the future of Artificial Intelligence. This summit will feature keynote speakers, panel discussions, and networking opportunities.",
        category: "Seminar",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Jaipur, Rajasthan",
        venue: "RIC Convention Hall",
        image: "https://picsum.photos/seed/event2/600/400",
        showtimes: ["09:00", "13:00"],
        ticketTypes: [{ type: "Standard", price: 0 }],
        seatingChart: detailedSeatingChart,
    },
    {
        name: "Abstract Expressions Art Exhibit",
        description: "A curated collection of abstract art from emerging local artists. Explore the depths of emotion and form through a variety of mediums.",
        category: "Art",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Jaipur, Rajasthan",
        venue: "RIC Art Gallery",
        image: "https://picsum.photos/seed/event3/600/400",
        showtimes: ["11:00"],
        ticketTypes: [{ type: "Standard", price: 0 }],
         seatingChart: detailedSeatingChart,
    },
     {
        name: "Rajasthan Cultural Festival",
        description: "Celebrate the rich heritage of Rajasthan with a day full of folk music, dance performances, traditional food stalls, and artisan crafts.",
        category: "Cultural",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: "Jaipur, Rajasthan",
        venue: "Jaipur Exhibition Centre",
        image: "https://picsum.photos/seed/event4/600/400",
        showtimes: ["10:00"],
        ticketTypes: [{ type: "Standard", price: 0 }],
        seatingChart: detailedSeatingChart,
    },
];

interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (eventId: string, event: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  deleteAllEvents: () => Promise<void>;
  seedDatabase: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const eventsCollection = collection(db, 'events');
    const unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
        const eventsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            ...data,
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

    return () => unsubscribe();
  }, [toast]);

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      const eventsCollection = collection(db, 'events');
      await addDoc(eventsCollection, {
        ...eventData,
        date: new Date(eventData.date),
      });
      toast({ title: 'Success', description: 'Event created successfully.' });
    } catch (error) {
      console.error("Error adding event:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create event.' });
      throw error;
    }
  };
  
  const updateEvent = async (eventId: string, eventData: Partial<Omit<Event, 'id'>>) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const dataToUpdate: { [key: string]: any } = { ...eventData };
      if (eventData.date) {
        dataToUpdate.date = new Date(eventData.date);
      }
      await updateDoc(eventRef, dataToUpdate);
      toast({ title: 'Success', description: 'Event updated successfully.' });
    } catch (error) {
      console.error("Error updating event:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update event.' });
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      toast({ title: 'Success', description: 'Event deleted successfully.' });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event.' });
      throw error;
    }
  };

  const deleteAllEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const snapshot = await getDocs(eventsCollection);
      if (snapshot.empty) {
        toast({ title: "Database Empty", description: "There are no events to delete." });
        return;
      }
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast({ title: "All Events Deleted", description: "All events have been removed from the database." });
    } catch (error) {
      console.error('Error deleting all events:', error);
      toast({ 
          variant: 'destructive', 
          title: 'Deletion Failed', 
          description: 'Could not delete all events. Check Firestore security rules.' 
      });
      throw error;
    }
  };

  const seedDatabase = useCallback(async () => {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);
    if (!snapshot.empty) {
        toast({ title: "Database Not Empty", description: "Sample events already exist. Use 'Clear and Reseed' to start fresh." });
        return;
    }

    try {
      console.log('Seeding database with sample events...');
      const batch = writeBatch(db);
      for (const eventData of sampleEvents) {
        const docRef = doc(collection(db, 'events'));
        batch.set(docRef, {
            ...eventData,
            date: new Date(eventData.date),
        });
      }
      await batch.commit();
      toast({ title: "Database Seeded", description: "Sample events have been added." });
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({ 
          variant: 'destructive', 
          title: 'Seeding Failed', 
          description: `Could not add sample events. ${error.message}` 
      });
    }
  }, [toast]);


  const value = {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    deleteAllEvents,
    seedDatabase
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

    