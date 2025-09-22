
"use client";

import { useState, useEffect, useRef } from "react";
import { Event, Seat, SeatSection, SeatRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const generateSeats = (sectionName: string, row: SeatRow, bookedSeats: string[]): Seat[] => {
    const start = row.offset || 1;
    return Array.from({ length: row.seats }, (_, i) => {
        const seatNum = start + i;
        const seatId = `${sectionName}-${row.rowId.replace('-2','')}${seatNum}`;
        return {
            id: seatId,
            row: row.rowId,
            col: seatNum,
            isBooked: bookedSeats.includes(seatId),
        };
    });
};


const SeatComponent = ({ seat, section, isSelected, onSelect }: { seat: Seat, section: SeatSection, isSelected: boolean, onSelect: (seat: Seat, section: SeatSection) => void }) => {
    const handleClick = () => {
        if (!seat.isBooked) {
            onSelect(seat, section);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-200",
                seat.isBooked 
                    ? "bg-red-500/50 text-white/50 cursor-not-allowed" 
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-green-400 cursor-pointer",
                isSelected && "!bg-primary !text-primary-foreground",
            )}
            title={`Seat ${seat.id.split('-')[1]} - ₹${section.price}`}
        >
        </div>
    );
};

export function SeatingChart({ event, ticketCount, onTicketCountChange }: { event: Event, ticketCount: number, onTicketCountChange: (count: number) => void }) {
    const [selectedSeats, setSelectedSeats] = useState<{ seat: Seat, section: SeatSection }[]>([]);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const { toast } = useToast();
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    const seatingData = event.seatingChart;
    
    useEffect(() => {
        const fetchBookedSeats = async () => {
            if (!event.id) return;
            setLoadingBookings(true);
            try {
                // This is less efficient but avoids needing an index. For larger apps, an index is recommended.
                const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
                const seatIds = bookingsSnapshot.docs
                    .filter(doc => doc.data().eventId === event.id)
                    .flatMap(doc => doc.data().attendees.map((attendee: any) => attendee.seatId));
                setBookedSeats(seatIds);
            } catch (error) {
                console.error("Error fetching booked seats:", error);
                toast({
                    variant: "destructive",
                    title: "Could not load booked seats.",
                    description: "There was a problem fetching seat availability from the database.",
                })
            } finally {
                setLoadingBookings(false);
            }
        };

        if(event.seatingChart) {
            fetchBookedSeats();
        } else {
            setLoadingBookings(false);
        }
    }, [event.id, event.seatingChart, toast]);

    useEffect(() => {
        // If the number of selected seats exceeds the new ticket count, truncate the selection
        if (selectedSeats.length > ticketCount) {
            setSelectedSeats(prev => prev.slice(0, ticketCount));
        }
    }, [ticketCount, selectedSeats.length]);
    
    useEffect(() => {
        if (selectedSeats.length > ticketCount) {
            toast({
                variant: "destructive",
                title: `You can only select a maximum of ${ticketCount} seats.`,
                description: "Deselect a seat to choose another.",
            });
        }
    }, [selectedSeats, ticketCount, toast]);

    const handleSelectSeat = (seat: Seat, section: SeatSection) => {
        setSelectedSeats((prev) => {
            const isSelected = prev.some(s => s.seat.id === seat.id);
            if (isSelected) {
                return prev.filter(s => s.seat.id !== seat.id);
            }
            if (prev.length < ticketCount) {
                return [...prev, { seat, section }];
            }
            return prev;
        });
    };

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            toast({
                variant: "destructive",
                title: "No seats selected",
                description: `Please select at least one seat to proceed.`,
            });
            return;
        }
        if (selectedSeats.length !== ticketCount) {
            toast({
                variant: "destructive",
                title: `Incorrect number of seats`,
                description: `Please select exactly ${ticketCount} seats.`,
            });
            return;
        }
        setCheckoutOpen(true);
    };

    const handleGeneralAdmissionCheckout = () => {
        if (ticketCount > 0) {
            // General admission seats don't have IDs, so we pass an empty array
            setSelectedSeats(Array.from({ length: ticketCount }).map(() => ({
                seat: { id: 'GA', row: 'GA', col: 0, isBooked: false },
                section: { sectionName: 'General Admission', price: event.ticketTypes[0]?.price || 0, rows: [], className: '' }
            })));
            setCheckoutOpen(true);
        } else {
             toast({
                variant: "destructive",
                title: "No tickets selected",
                description: `Please select at least one ticket to proceed.`,
            });
        }
    }

    const getTotalPrice = () => {
        return selectedSeats.reduce((total, s) => total + s.section.price, 0);
    };

    const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));

    if (loadingBookings) {
        return <div className="text-center py-12">Loading seat availability...</div>
    }

    if (!seatingData || !seatingData.tiers) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <h2 className="text-xl font-semibold">General Admission Event</h2>
                <p>Click proceed to confirm your booking for {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}.</p>
                <Button className="mt-4" onClick={handleGeneralAdmissionCheckout}>Proceed</Button>
                <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setCheckoutOpen} event={event} selectedSeats={selectedSeats} />
            </div>
        );
    }

    return (
        <>
            <div className="w-full bg-background relative rounded-lg border shadow-lg overflow-hidden">
                 <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <p className="font-semibold hidden sm:block">Tickets:</p>
                     <div className="flex items-center gap-2 bg-background p-1 rounded-md border">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onTicketCountChange(Math.max(1, ticketCount - 1))} disabled={ticketCount <= 1}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-bold w-10 text-center">{ticketCount}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onTicketCountChange(Math.min(6, ticketCount + 1))}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut /></Button>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn /></Button>
                </div>
                <div ref={containerRef} className="overflow-auto p-4 md:p-8 pt-20">
                    <div
                        className="transition-transform duration-300 inline-block"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                    >
                        <div className="space-y-8">
                            {seatingData.tiers.map((tier, tierIndex) => (
                                <div key={tierIndex} className="flex justify-center items-start gap-4">
                                    {tier.sections.map((section, sectionIndex) => (
                                        <div key={sectionIndex} className={cn("p-4 rounded-lg border-2", section.className)}>
                                             <p className="font-semibold text-center text-lg mb-4">{section.sectionName} - ₹{section.price}</p>
                                            <div className="space-y-2">
                                                {section.rows.map(row => (
                                                    <div key={row.rowId} className="flex items-center justify-center gap-2">
                                                        <div className="w-8 text-center font-semibold text-gray-500">{row.rowId.replace('-2','')}</div>
                                                        <div className="flex gap-2 flex-wrap justify-center">
                                                            {generateSeats(section.sectionName, row, bookedSeats).map(seat => (
                                                                <SeatComponent
                                                                    key={seat.id}
                                                                    seat={seat}
                                                                    section={section}
                                                                    isSelected={selectedSeats.some(s => s.seat.id === seat.id)}
                                                                    onSelect={handleSelectSeat}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                         <div className="mt-12 bg-gray-700 text-white text-center py-2 rounded-md font-bold text-xl tracking-widest">
                            STAGE
                        </div>
                         <div className="mt-8 flex justify-center items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-gray-300 dark:bg-gray-600"></div>
                                <span>Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-primary"></div>
                                <span>Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-red-500/50"></div>
                                <span>Booked</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Booking Summary Panel --- */}
                <div className={cn("fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-30 transition-transform duration-300", selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full")}>
                    <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col text-center sm:text-left">
                             <p className="text-lg font-bold">₹{getTotalPrice().toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {selectedSeats.map(s => s.seat.id.split('-')[1]).join(', ') || 'No seats selected'}
                            </p>
                        </div>
                        <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto">
                           {`Proceed with ${selectedSeats.length} ${selectedSeats.length === 1 ? 'seat' : 'seats'}`}
                        </Button>
                    </div>
                </div>
            </div>

            <CheckoutDialog
                isOpen={isCheckoutOpen}
                onOpenChange={setCheckoutOpen}
                event={event}
                selectedSeats={selectedSeats}
            />
        </>
    );
}
