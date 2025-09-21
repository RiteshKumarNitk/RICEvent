
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Event, Seat, SeatSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, User, ZoomIn, ZoomOut, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SeatComponent = ({ seat, section, isSelected, onSelect }: { seat: Seat, section: SeatSection, isSelected: boolean, onSelect: (seat: Seat) => void }) => {
  const fillClass = isSelected ? 'fill-accent' : (seat.isAvailable ? 'fill-background' : 'fill-muted-foreground/50');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <g
            key={seat.id}
            onClick={() => onSelect(seat)}
            className={cn(
              "cursor-pointer transition-transform duration-150 ease-in-out hover:scale-125",
              !seat.isAvailable && "cursor-not-allowed opacity-70 hover:scale-100",
              isSelected && "hover:scale-110"
            )}
          >
            <circle
              cx={(seat.col * 25)}
              cy={(seat.row.charCodeAt(0) - 65) * 25 + 50}
              r="8"
              className={cn("stroke-[1.5px]", section.className, fillClass, isSelected && 'stroke-accent-foreground')}
            />
          </g>
        </TooltipTrigger>
        <TooltipContent>
          <p>Seat: {seat.id}</p>
          <p>Price: ₹{section.price}</p>
          <p>Status: {seat.isAvailable ? (isSelected ? "Selected" : "Available") : "Sold"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


export function SeatingChart({ event, ticketCount }: { event: Event; ticketCount: number }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ticketCount === 0 && !isCheckoutOpen) {
      toast({
          title: "No Tickets Selected",
          description: "Please go back and select the number of tickets you want.",
      });
    }
  }, [ticketCount, toast, isCheckoutOpen]);

  const isFreeEvent = event.ticketTypes.every(t => t.price === 0);

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.isAvailable) {
      toast({ variant: 'destructive', title: "Seat Sold", description: "This seat is already sold." });
      return;
    }

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length < ticketCount) {
        return [...prev, seat];
      } else {
        toast({
          variant: "destructive",
          title: `You can only select ${ticketCount} seat(s).`,
          description: "Deselect a seat to choose another.",
        });
        return prev;
      }
    });
  };

  const handleCheckout = () => {
    if (event.seatingChart && selectedSeats.length !== ticketCount) {
      toast({
        variant: "destructive",
        title: "Incorrect number of seats",
        description: `Please select exactly ${ticketCount} seat(s).`,
      });
      return;
    }
    setCheckoutOpen(true);
  };
  
  const getSeatPrice = (seat: Seat) => {
      if (!event.seatingChart) return 0;
      for (const section of event.seatingChart.sections) {
        if (section.seats.find(s => s.id === seat.id)) {
            return section.price;
        }
      }
      return 0;
  }

  const getTotalPrice = () => {
    if (isFreeEvent) return 0;
    if (!event.seatingChart) return (event.ticketTypes.find(t => t.type === 'Standard')?.price || 0) * ticketCount;
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
  };
  
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));

  if (!event.seatingChart) {
    // Fallback for general admission
    return (
      <>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{isFreeEvent ? "Register for Event" : "Confirm Tickets"}</CardTitle>
            <CardDescription>This is a general admission event. Confirm the number of tickets to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center bg-secondary p-4 rounded-md">
              <span className="font-semibold text-lg">Tickets</span>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-bold">{ticketCount}</span>
              </div>
            </div>
            {!isFreeEvent && (
              <div className="flex justify-between items-center font-bold text-lg mt-4">
                <span>Total Price:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              <Ticket className="w-5 h-5 mr-2" />
              {isFreeEvent ? "Register Now" : "Buy Tickets"}
            </Button>
          </CardFooter>
        </Card>
        <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setCheckoutOpen} event={event} selectedSeats={Array.from({ length: ticketCount }, (_, i) => ({ id: `GA${i + 1}`, row: 'GA', col: i + 1, isAvailable: true }))} />
      </>
    );
  }
  
  const allSeats = event.seatingChart.sections.flatMap(s => s.seats);
  const maxCol = Math.max(...allSeats.map(s => s.col)) + 1;
  const maxRowCharCode = Math.max(...allSeats.map(s => s.row.charCodeAt(0)));
  const viewboxWidth = maxCol * 25;
  const viewboxHeight = (maxRowCharCode - 65 + 4) * 25;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <div ref={containerRef} className="flex-grow bg-muted/20 border rounded-lg p-4 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border bg-background" /> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-accent" /> Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-muted-foreground/50" /> Sold</div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut /></Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn /></Button>
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
             <svg 
                viewBox={`0 0 ${viewboxWidth} ${viewboxHeight}`} 
                className="transition-transform duration-300"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                >
                <rect width={viewboxWidth} height={viewboxHeight} className="fill-transparent" />
                {event.seatingChart.sections.map((section) => (
                    <g key={section.sectionName}>
                    {section.seats.map((seat) => (
                        <SeatComponent
                            key={seat.id}
                            seat={seat}
                            section={section}
                            isSelected={selectedSeats.some(s => s.id === seat.id)}
                            onSelect={handleSelectSeat}
                        />
                    ))}
                    </g>
                ))}
                <g transform={`translate(${viewboxWidth/2}, ${viewboxHeight - 10})`}>
                    <path d={`M-150,0 Q-120,-20 0,-20 T150,0`} className="fill-none stroke-foreground" strokeWidth="2"/>
                    <text x="0" y="-2" textAnchor="middle" className="text-lg font-bold tracking-widest fill-foreground">STAGE</text>
                </g>
            </svg>
          </div>
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Your Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-lg font-bold mb-2">
                <span>Total</span>
                <span>{isFreeEvent ? 'Free' : `₹${getTotalPrice().toFixed(2)}`}</span>
              </div>
              <Separator />
               <div className="mt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                    <span>Seats ({selectedSeats.length}/{ticketCount})</span>
                </div>
                 <p className="font-mono text-base font-semibold break-words min-h-[4rem] max-h-32 overflow-y-auto">{selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : "No seats selected"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckout} className="w-full" disabled={ticketCount > 0 && selectedSeats.length !== ticketCount}>
                <Ticket className="mr-2 h-4 w-4" />
                {isFreeEvent ? "Register" : "Proceed to Pay"}
              </Button>
            </CardFooter>
          </Card>
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
