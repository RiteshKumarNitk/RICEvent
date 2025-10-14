
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Booking, Attendee, Seat, SeatRow } from '@/lib/types';
import { useEvents } from '../../events-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Ticket, DollarSign, Lock, Armchair } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface EnrichedBooking extends Booking {
  userDisplayName?: string;
  userEmail?: string;
}

const SeatMap = ({ event }: { event: any }) => {
    if (!event.seatingChart) {
        return <p className="text-sm text-muted-foreground">No seating chart for this event.</p>;
    }

    const { tiers } = event.seatingChart;
    const reservedSeats = event.reservedSeats?.map((s: string) => s.toUpperCase()) || [];
    
    // Flatten all rows from all tiers and sections
    const allRows: (SeatRow & { sectionName: string })[] = tiers.flatMap((tier: any) =>
        tier.sections.flatMap((section: any) =>
            section.rows.map((row: any) => ({ ...row, sectionName: section.sectionName }))
        )
    );

    const groupedRows = allRows.reduce((acc, row) => {
        if (row.rowId === 'spacer') return acc;
        const label = row.rowLabel || row.rowId.replace(/-.*/, "");
        if (!acc[label]) {
            acc[label] = [];
        }
        acc[label].push(row);
        return acc;
    }, {} as Record<string, (SeatRow & { sectionName: string })[]>);

    const maxSeats = Math.max(...allRows.map(r => (r.offset || 0) + r.seats));

    return (
        <TooltipProvider>
            <div className="space-y-1.5 p-2 border rounded-lg bg-muted/50 overflow-x-auto">
                {Object.entries(groupedRows).map(([rowLabel, rowParts]) => (
                    <div key={rowLabel} className="flex items-center gap-2">
                        <div className="w-4 text-center text-xs font-semibold text-muted-foreground">{rowLabel}</div>
                        <div className="flex-1 flex items-center gap-0.5">
                           {Array.from({ length: maxSeats }).map((_, seatIndex) => {
                                let isSeat = false;
                                let isReserved = false;
                                let seatId = '';

                                for (const part of rowParts) {
                                    const start = part.offset || 0;
                                    const end = start + part.seats;
                                    if (seatIndex >= start && seatIndex < end) {
                                        isSeat = true;
                                        seatId = `${rowLabel}-${seatIndex + 1}`;
                                        if (reservedSeats.includes(seatId.toUpperCase())) {
                                            isReserved = true;
                                        }
                                        break;
                                    }
                                }

                                if (!isSeat) {
                                    return <div key={seatIndex} className="w-3 h-3" />;
                                }
                                
                                return (
                                    <Tooltip key={seatIndex}>
                                        <TooltipTrigger>
                                            <div className={cn(
                                                "w-3 h-3 rounded-sm flex items-center justify-center",
                                                isReserved ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'
                                            )}>
                                                {isReserved && <Lock className="w-2 h-2 text-white" />}
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Seat {seatId}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                           })}
                        </div>
                    </div>
                ))}
                 <div className="flex justify-center pt-4">
                    <div className="bg-gray-700 text-white text-center py-1 px-4 rounded-md font-bold text-xs tracking-widest w-fit">
                        STAGE
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

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

        // Enrich bookings with user data from the attendees list
        const enrichedBookings = bookingsData.map(booking => {
          // Use the name from the first attendee as the primary booker's name
          const primaryAttendeeName = booking.attendees[0]?.attendeeName;
          return {
            ...booking,
            userDisplayName: primaryAttendeeName,
            userEmail: 'N/A', // Email is not stored per booking in this structure
          };
        });
        
        setBookings(enrichedBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));

      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [eventId, user]);
  
  if (eventsLoading || !event) return <div className="container text-center py-12">Loading event details...</div>;

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
            <p className="text-muted-foreground">A summary of all bookings and reservations for this event.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
                    <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
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
            <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Reserved Seats</CardTitle>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{event?.reservedSeats?.length || 0}</div>
                     <div className="text-xs text-muted-foreground flex flex-wrap gap-1 mt-1">
                        {event?.reservedSeats && event.reservedSeats.map(seat => (
                            <Badge key={seat} variant="outline" className="bg-amber-100 dark:bg-amber-900/50">{seat}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2">
                <CardHeader>
                    <CardTitle>Individual Bookings</CardTitle>
                    <CardDescription>A detailed list of all users who have booked tickets for this event.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Booked By</TableHead>
                                <TableHead>Booking Type</TableHead>
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
                                bookings.map(booking => {
                                    const isAnyMember = booking.attendees.some(a => a.isMember);
                                    return (
                                    <TableRow key={booking.id}>
                                        <TableCell>{booking.userDisplayName || 'Guest'}</TableCell>
                                        <TableCell>
                                            <Badge variant={isAnyMember ? 'default' : 'secondary'}>
                                                {isAnyMember ? 'Member Booking' : 'Guest Booking'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {booking.attendees.map((attendee: Attendee) => (
                                                    <Badge key={attendee.seatId} variant={attendee.isMember ? 'default' : 'secondary'}>
                                                        {attendee.seatId.includes('-') ? `${attendee.seatId.split('-')[1]}-${attendee.seatId.split('-')[2]}` : 'GA'}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>₹{booking.total.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(booking.bookingDate).toLocaleString()}</TableCell>
                                    </TableRow>
                                )})
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Reserved Seat Map</CardTitle>
                    <CardDescription>A visual overview of reserved (blocked) seats.</CardDescription>
                </CardHeader>
                <CardContent>
                   <SeatMap event={event} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    