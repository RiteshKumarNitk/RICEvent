
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Booking } from '@/lib/types';
import { useEvents } from '../../events-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Ticket, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

interface EnrichedBooking extends Booking {
  userDisplayName?: string;
  userEmail?: string;
}

export default function EventBookingsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { events, loading: eventsLoading } = useEvents();
  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const event = events.find(e => e.id === eventId);
  
  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.total, 0);
  const totalSeatsSold = bookings.reduce((acc, booking) => acc + booking.attendees.length, 0);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };
    
    const fetchBookings = async () => {
      if (!eventId) return;
      setLoading(true);

      try {
        const bookingsQuery = query(collection(db, 'bookings'), where('eventId', '==', eventId));
        const bookingSnapshots = await getDocs(bookingsQuery);
        const bookingsData = bookingSnapshots.docs.map(doc => {
            const data = doc.data();
            const eventDate = data.eventDate instanceof Timestamp 
                ? data.eventDate.toDate().toISOString() 
                : data.eventDate;

            const bookingDate = data.bookingDate instanceof Timestamp 
                ? data.bookingDate.toDate().toISOString() 
                : data.bookingDate;

            return { 
                id: doc.id, 
                ...data,
                eventDate,
                bookingDate,
            } as Booking;
        });

        // Enrich bookings with user data
        const enrichedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            const userDocRef = doc(db, 'users', booking.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              return {
                ...booking,
                userDisplayName: userData.displayName,
                userEmail: userData.email,
              };
            }
            return booking;
          })
        );
        
        setBookings(enrichedBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));

      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId, user]);
  
  if (eventsLoading) return <div className="container text-center py-12">Loading event details...</div>;

  return (
    <div>
        <div className="mb-4">
            <Button asChild variant="outline">
                <Link href="/admin/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                </Link>
            </Button>
        </div>
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Bookings for {event?.name || 'Event'}</h1>
            <p className="text-muted-foreground">A summary of all bookings for this event.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tickets Sold</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSeatsSold}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bookings.length}</div>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Individual Bookings</CardTitle>
                <CardDescription>A detailed list of all users who have booked tickets for this event.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booked By</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Total Paid</TableHead>
                            <TableHead>Booking Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">Loading bookings...</TableCell>
                            </TableRow>
                        ) : bookings.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="text-center">No bookings found for this event.</TableCell>
                            </TableRow>
                        ) : (
                            bookings.map(booking => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.userDisplayName || 'N/A'}</TableCell>
                                    <TableCell>{booking.userEmail || 'N/A'}</TableCell>
                                    <TableCell>{booking.attendees.map(a => `${a.seatId.split('-')[0].charAt(0)}-${a.seatId.split('-')[1]}` || 'GA').join(', ')}</TableCell>
                                    <TableCell>₹{booking.total.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(booking.bookingDate).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
