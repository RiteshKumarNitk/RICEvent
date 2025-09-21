
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Event, Seat, SeatSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, User, ZoomIn, ZoomOut, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";

const MAX_SEATS = 6;

const SeatComponent = ({ seat, section, isSelected, isBooked, onSelect }: { seat: Seat, section: SeatSection, isSelected: boolean, isBooked: boolean, onSelect: (seat: Seat) => void }) => {
  const seatId = `${seat.row}${seat.col}`;
  const status = isBooked ? 'booked' : isSelected ? 'selected' : 'available';

  const seatStyles = {
    available: "bg-white border-gray-300 hover:bg-green-200",
    booked: "bg-gray-300 cursor-not-allowed",
    selected: "bg-green-500 text-white border-green-600",
  };

  return (
    <div
      onClick={() => !isBooked && onSelect(seat)}
      className={cn(
        "w-6 h-6 rounded-sm flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors duration-200",
        seatStyles[status]
      )}
      title={`Seat ${seatId}\nPrice: ₹${section.price}\nStatus: ${status}`}
    >
      {seat.col}
    </div>
  );
};

export function SeatingChart({ event, ticketCount: initialTicketCount }: { event: Event; ticketCount: number }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Note: ticketCount from the previous page is now initialTicketCount, and not directly used for selection logic.

  useEffect(() => {
    if (!event.seatingChart) {
      toast({
        title: "General Admission",
        description: "This event does not have a seating chart.",
      });
    }
  }, [event.seatingChart, toast]);

  const handleSelectSeat = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      }
      if (prev.length < MAX_SEATS) {
        return [...prev, seat];
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
  
  const getSeatPrice = (seat: Seat) => {
    if (!event.seatingChart) return 0;
    for (const section of event.seatingChart.sections) {
      if (section.rows.includes(seat.row)) {
        return section.price;
      }
    }
    return 0;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
  };
  
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));

  if (!event.seatingChart) {
    // Fallback for general admission
    return (
      <div className="text-center text-muted-foreground py-12">
        <h2 className="text-xl font-semibold">General Admission Event</h2>
        <p>This event does not have reserved seating.</p>
         <Button className="mt-4" onClick={() => setCheckoutOpen(true)}>Proceed</Button>
         <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setCheckoutOpen} event={event} selectedSeats={[]} />
      </div>
    );
  }

  const { sections, bookedSeats = [] } = event.seatingChart;
  
  return (
    <>
      <div className="w-full bg-background relative overflow-hidden">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn /></Button>
        </div>
        
        <div ref={containerRef} className="overflow-auto py-8 px-4">
          <div 
            className="mx-auto transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <div className="flex flex-col items-center gap-6">
                {/* Screen */}
                <div className="w-full max-w-4xl h-2 bg-gray-300 rounded-t-full"></div>
                <p className="text-muted-foreground text-sm tracking-widest">All eyes this way</p>

                {/* Seats */}
                <div className="flex flex-col gap-4 w-full items-center">
                    {sections.map(section => (
                        <div key={section.sectionName} className="flex flex-col items-center gap-2">
                            <p className="font-semibold text-lg">{section.sectionName} - ₹{section.price}</p>
                            <div className={cn("p-4 border-t-2", section.className)}>
                                {section.rows.map(row => (
                                    <div key={row} className="flex items-center gap-2 mb-2">
                                        <div className="w-6 text-center font-semibold text-gray-500">{row}</div>
                                        <div className="flex gap-2">
                                            {Array.from({ length: section.seatsPerRow / 2}).map((_, i) => {
                                                const seatNum = i + 1;
                                                const seat: Seat = { id: `${row}${seatNum}`, row, col: seatNum };
                                                return <SeatComponent key={seat.id} seat={seat} section={section} isSelected={selectedSeats.some(s => s.id === seat.id)} isBooked={bookedSeats.includes(seat.id)} onSelect={handleSelectSeat} />;
                                            })}
                                        </div>
                                        <div className="w-8"></div>
                                        <div className="flex gap-2">
                                            {Array.from({ length: section.seatsPerRow / 2}).map((_, i) => {
                                                const seatNum = i + 1 + section.seatsPerRow / 2;
                                                const seat: Seat = { id: `${row}${seatNum}`, row, col: seatNum };
                                                return <SeatComponent key={seat.id} seat={seat} section={section} isSelected={selectedSeats.some(s => s.id === seat.id)} isBooked={bookedSeats.includes(seat.id)} onSelect={handleSelectSeat} />;
                                            })}
                                        </div>
                                        <div className="w-6 text-center font-semibold text-gray-500">{row}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-white border border-gray-300" /> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-green-500" /> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-gray-300" /> Sold</div>
                </div>
            </div>
          </div>
        </div>

        {/* --- Booking Summary Panel --- */}
        {selectedSeats.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-30">
                <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col text-center sm:text-left">
                       <p className="text-lg font-bold">₹{getTotalPrice().toFixed(2)}</p>
                       <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {selectedSeats.map(s => s.id).join(', ')}
                       </p>
                    </div>
                    <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto" disabled={selectedSeats.length === 0}>
                       Proceed ({selectedSeats.length} {selectedSeats.length > 1 ? 'Seats' : 'Seat'})
                    </Button>
                </div>
            </div>
        )}
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

    