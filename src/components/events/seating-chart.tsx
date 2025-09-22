
"use client";

import { useState, useEffect, useRef } from "react";
import { Event, Seat, SeatSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";

const MAX_SEATS = 6;

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
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer",
                seat.isBooked ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-300 dark:bg-gray-600 hover:bg-green-400",
                isSelected && "!bg-green-500 !text-white",
                !seat.isBooked && section.className.replace('bg-', 'hover:bg-'),
            )}
            title={`Seat ${seat.id} - ₹${section.price}`}
        >
            {seat.col}
        </div>
    );
};

export function SeatingChart({ event }: { event: Event }) {
    const [selectedSeats, setSelectedSeats] = useState<{ seat: Seat, section: SeatSection }[]>([]);
    const { toast } = useToast();
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!event.seatingChart) {
            toast({
                title: "General Admission",
                description: "This event does not have a seating chart.",
            });
        }
    }, [event.seatingChart, toast]);

    const handleSelectSeat = (seat: Seat, section: SeatSection) => {
        setSelectedSeats((prev) => {
            const isSelected = prev.some(s => s.seat.id === seat.id);
            if (isSelected) {
                return prev.filter(s => s.seat.id !== seat.id);
            }
            if (prev.length < MAX_SEATS) {
                return [...prev, { seat, section }];
            } else {
                toast({
                    variant: "destructive",
                    title: `You can only select a maximum of ${MAX_SEATS} seats.`,
                    description: "Deselect a seat to choose another.",
                });
                return prev;
            }
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
        setCheckoutOpen(true);
    };

    const getTotalPrice = () => {
        return selectedSeats.reduce((total, s) => total + s.section.price, 0);
    };

    const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));

    const seatingData = event.seatingChart;

    if (!seatingData) {
        return (
            <div className="text-center text-muted-foreground py-12">
                <h2 className="text-xl font-semibold">General Admission Event</h2>
                <p>This event does not have reserved seating.</p>
                <Button className="mt-4" onClick={() => setCheckoutOpen(true)}>Proceed</Button>
                <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setCheckoutOpen} event={event} selectedSeats={[]} />
            </div>
        );
    }

    return (
        <>
            <div className="w-full bg-background relative rounded-lg border shadow-lg overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                    <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut /></Button>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn /></Button>
                </div>
                <div ref={containerRef} className="overflow-auto p-4 md:p-8">
                    <div
                        className="transition-transform duration-300 inline-block"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                    >
                        <div className="space-y-8">
                            {seatingData.tiers.map((tier, tierIndex) => (
                                <div key={tierIndex} className="flex justify-center items-start gap-4">
                                    {tier.sections.map((section, sectionIndex) => (
                                        <div key={sectionIndex} className={cn("p-4 rounded-lg border-2", section.className)}>
                                            <p className="font-semibold text-lg text-center mb-2">{section.sectionName}</p>
                                            <div className="space-y-2">
                                                {section.rows.map(row => (
                                                    <div key={row.rowId} className="flex items-center gap-2">
                                                        <div className="w-8 text-center font-semibold text-gray-500">{row.rowId}</div>
                                                        <div className="flex gap-2 flex-wrap">
                                                            {row.seats.map(seat => (
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
                    </div>
                </div>

                {/* --- Booking Summary Panel --- */}
                <div className={cn("fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-30 transition-transform duration-300", selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full")}>
                    <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col text-center sm:text-left">
                            <p className="text-lg font-bold">₹{getTotalPrice().toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {selectedSeats.map(s => s.seat.id).join(', ')}
                            </p>
                        </div>
                        <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto" disabled={selectedSeats.length === 0}>
                            Proceed ({selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'})
                        </Button>
                    </div>
                </div>
            </div>

            <CheckoutDialog
                isOpen={isCheckoutOpen}
                onOpenChange={setCheckoutOpen}
                event={event}
                selectedSeats={selectedSeats.map(s => s.seat)}
            />
        </>
    );
}
