"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from '@/lib/types';
import { events as initialEvents } from '@/lib/data';

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const value = {
    events,
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
