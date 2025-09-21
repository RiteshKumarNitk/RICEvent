"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, Timestamp, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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
        ticketTypes: [{ type: "Standard", price: 500 }],
        seatingChart: {
            sections: [
                {
                    sectionName: "Platinum",
                    ticketType: "Standard",
                    price: 750,
                    rows: [
                        [ { id: "A1", number: "1", isAvailable: true }, { id: "A2", number: "2", isAvailable: true }, null, { id: "A3", number: "3", isAvailable: true }, { id: "A4", number: "4", isAvailable: true } ],
                        [ { id: "B1", number: "1", isAvailable: false }, { id: "B2", number: "2", isAvailable: true }, null, { id: "B3", number: "3", isAvailable: true }, { id: "B4", number: "4", isAvailable: false } ],
                    ]
                },
                {
                    sectionName: "Gold",
                    ticketType: "Standard",
                    price: 500,
                    rows: [
                        [ { id: "C1", number: "1", isAvailable: true }, { id: "C2", number: "2", isAvailable: true }, { id: "C3", number: "3", isAvailable: true }, null, { id: "C4", number: "4", isAvailable: true }, { id: "C5", number: "5", isAvailable: true } ],
                        [ { id: "D1", number: "1", isAvailable: true }, { id: "D2", number: "2", isAvailable: false }, { id: "D3", number: "3", isAvailable: true }, null, { id: "D4", number: "4", isAvailable: true }, { id: "D5", number: "5", isAvailable: true } ],
                    ]
                }
            ]
        }
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
        ticketTypes: [{ type: "Standard", price: 1500 }],
        seatingChart: {
            sections: [
                {
                    sectionName: "Platinum",
                    ticketType: "Standard",
                    price: 1500,
                    rows: [
                        [ { id: "A1", number: "1", isAvailable: true }, { id: "A2", number: "2", isAvailable: true }, null, { id: "A3", number: "3", isAvailable: true }, { id: "A4", number: "4", isAvailable: true } ],
                        [ { id: "B1", number: "1", isAvailable: false }, { id: "B2", number: "2", isAvailable: true }, null, { id: "B3", number: "3", isAvailable: true }, { id: "B4", number: "4", isAvailable: false } ],
                    ]
                },
                {
                    sectionName: "Gold",
                    ticketType: "Standard",
                    price: 1000,
                    rows: [
                        [ { id: "C1", number: "1", isAvailable: true }, { id: "C2", number: "2", isAvailable: true }, { id: "C3", number: "3", isAvailable: true }, null, { id: "C4", number: "4", isAvailable: true }, { id: "C5", number: "5", isAvailable: true } ],
                        [ { id: "D1", number: "1", isAvailable: true }, { id: "D2", number: "2", isAvailable: false }, { id: "D3", number: "3", isAvailable: true }, null, { id: "D4", number: "4", isAvailable: true }, { id: "D5", number: "5", isAvailable: true } ],
                        [ { id: "E1", number: "1", isAvailable: true }, { id: "E2", number: "2", isAvailable: true }, { id: "E3", number: "3", isAvailable: true }, null, { id: "E4", number: "4", isAvailable: false }, { id: "E5", number: "5", isAvailable: true } ],
                    ]
                }
            ]
        }
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
        seatingChart: {
            sections: [
                {
                    sectionName: "Main Gallery",
                    ticketType: "Standard",
                    price: 0,
                    rows: [
                        [ { id: "A1", number: "1", isAvailable: true }, { id: "A2", number: "2", isAvailable: true }, { id: "A3", number: "3", isAvailable: true }, { id: "A4", number: "4", isAvailable: true } ],
                        [ { id: "B1", number: "1", isAvailable: true }, { id: "B2", number: "2", isAvailable: false }, { id: "B3", number: "3", isAvailable: true }, { id: "B4", number: "4", isAvailable: true } ],
                    ]
                }
            ]
        }
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
        ticketTypes: [{ type: "Standard", price: 250 }],
        seatingChart: {
            sections: [
                {
                    sectionName: "Zone A",
                    ticketType: "Standard",
                    price: 250,
                    rows: [
                        [ { id: "A1", number: "1", isAvailable: true }, { id: "A2", number: "2", isAvailable: true }, { id: "A3", number: "3", isAvailable: true } ],
                        [ { id: "B1", number: "1", isAvailable: true }, { id: "B2", number: "2", isAvailable: true }, { id: "B3", number: "3", isAvailable: true } ],
                    ]
                },
                 {
                    sectionName: "Zone B",
                    ticketType: "Standard",
                    price: 250,
                    rows: [
                        [ { id: "C1", number: "1", isAvailable: true }, { id: "C2", number: "2", isAvailable: true }, { id: "C3", number: "3", isAvailable: true } ],
                        [ { id: "D1", number: "1", isAvailable: false }, { id: "D2", number: "2", isAvailable: true }, { id: "D3", number: "3", isAvailable: false } ],
                    ]
                }
            ]
        }
    },
];

interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (eventId: string, event: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
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

  const seedDatabase = useCallback(async () => {
    const eventsCollection = collection(db, 'events');
    const snapshot = await getDocs(eventsCollection);
    if (!snapshot.empty) {
        toast({ title: "Database Not Empty", description: "Sample events already exist." });
        return;
    }

    try {
      console.log('Seeding database with sample events...');
      for (const eventData of sampleEvents) {
        await addDoc(eventsCollection, {
          ...eventData,
          date: new Date(eventData.date),
        });
      }
      toast({ title: "Database Seeded", description: "Sample events have been added." });
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({ 
          variant: 'destructive', 
          title: 'Seeding Failed', 
          description: 'Could not add sample events. Check Firestore security rules and that you are logged in.' 
      });
    }
  }, [toast]);


  const value = {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
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
