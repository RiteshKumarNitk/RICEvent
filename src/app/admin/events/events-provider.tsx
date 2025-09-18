"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Event } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface EventsContextType {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to string if necessary
          date: (data.date as Timestamp).toDate().toISOString(),
        } as Event;
      });
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      await addDoc(collection(db, 'events'), {
          ...event,
          date: new Date(event.date), // Store as Firestore Timestamp
      });
      toast({ title: 'Success', description: 'Event added successfully.' });
    } catch (error) {
      console.error("Error adding event: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not add event.' });
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
      const eventRef = doc(db, 'events', updatedEvent.id);
      await updateDoc(eventRef, {
        ...updatedEvent,
        date: new Date(updatedEvent.date), // Store as Firestore Timestamp
      });
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
