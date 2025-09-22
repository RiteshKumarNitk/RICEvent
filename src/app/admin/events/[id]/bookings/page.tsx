
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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

  const event = events.find(e => e.id === eventId);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!eventId) return;
      setLoading(true);

      try {
        const bookingsQuery = query(collection(db, 'bookings'), where('eventId', '==', eventId));
        const bookingSnapshots = await getDocs(bookingsQuery);
        const bookingsData = bookingSnapshots.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            eventDate: (doc.data().eventDate as Timestamp).toDate().toISOString(),
            bookingDate: (doc.data().bookingDate as Timestamp).toDate().toISOString(),
        })) as Booking[];

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
        
        setBookings(enrichedBookings);

      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId]);
  
  if (eventsLoading) return <div className="container text-center py-12">Loading event details...</div>;

  return (
    <div>
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/admin/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                </Link>
            </Button>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Bookings for {event?.name || 'Event'}</CardTitle>
                <CardDescription>A list of all users who have booked tickets for this event.</CardDescription>
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
                                    <TableCell>{booking.attendees.map(a => a.seatId.split('-')[1] || 'GA').join(', ')}</TableCell>
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
