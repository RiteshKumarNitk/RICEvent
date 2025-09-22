
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEvents } from "@/app/admin/events/events-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import type { Booking, Event } from "@/lib/types";
import { BookingDetailsDialog } from "@/components/account/booking-details-dialog";


export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [registeredBookings, setRegisteredBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const redirectPath = redirect ? `?redirect=${redirect}` : '';
      router.push(`/login${redirectPath}`);
    }
  }, [user, loading, router, redirect]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setBookingsLoading(true);
      try {
        // Removed orderBy to prevent query failure without a composite index
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const bookingsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              eventDate: (data.eventDate as Timestamp).toDate().toISOString(),
              bookingDate: (data.bookingDate as Timestamp).toDate().toISOString(),
            } as Booking;
        });
        
        // Sort bookings by date client-side
        const sortedBookings = bookingsData.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

        setRegisteredBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      } finally {
        setBookingsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  }

  if (loading || !user) {
    return <div className="container text-center py-12">Loading your account details...</div>;
  }
  
  const getEventForBooking = (booking: Booking): Event | undefined => {
    return events.find(event => event.id === booking.eventId);
  }

  return (
    <>
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback>{user.displayName ? user.displayName[0] : user.email ? user.email[0].toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName || 'User'}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Button variant="destructive" className="w-full" onClick={logout}>Log Out</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>Events you have booked.</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading || eventsLoading ? (
                 <p className="text-muted-foreground text-center">Loading your events...</p>
              ) : registeredBookings.length > 0 ? (
                <ul className="space-y-4">
                  {registeredBookings.map((booking, index) => {
                    const event = getEventForBooking(booking);
                    return (
                        <li key={booking.id}>
                        <div className="flex justify-between items-center">
                            <div>
                            <p className="font-semibold">{booking.eventName}</p>
                            <p className="text-sm text-muted-foreground">Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)} disabled={!event}>View Booking</Button>
                            </div>
                        </div>
                        {index < registeredBookings.length - 1 && <Separator className="mt-4" />}
                        </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center">You have no registered events.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    {selectedBooking && (
        <BookingDetailsDialog 
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            booking={selectedBooking}
            event={getEventForBooking(selectedBooking)}
        />
    )}
    </>
  );
}
