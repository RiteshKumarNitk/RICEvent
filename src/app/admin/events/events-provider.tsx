"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (eventId: string, event: Partial<Omit<Event, 'id'>>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// All seeding logic has been moved to a secure API endpoint.
// This provider is now only responsible for fetching and managing event data.

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const eventsCollection = collection(db, 'events');
    
    // Set up the real-time listener.
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
      
      if (snapshot.metadata.fromCache && eventsData.length === 0) {
        // If we are loading from cache and there are no events, it's likely the first load without a network connection.
        // We will show a loading state until we get a response from the server.
        // If you still have no events after connecting, visit /api/seed to populate the database.
      } else {
         setEvents(eventsData);
         setLoading(false);
      }

    }, (error) => {
      console.error("Error fetching events snapshot: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch events. Check Firestore permissions and configuration.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  // The add, update, and delete functions are now handled by the admin panel and forms.
  // These require the user to be authenticated, which is handled by Firestore security rules.
  // The implementations for these functions are no longer needed here as they are in the admin context.
  const addEvent = async () => { console.warn("addEvent is not implemented in this provider context anymore.")};
  const updateEvent = async () => { console.warn("updateEvent is not implemented in this provider context anymore.")};
  const deleteEvent = async () => { console.warn("deleteEvent is not implemented in this provider context anymore.")};


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
