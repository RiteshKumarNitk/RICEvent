"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event, Seat } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SeatingChart({ event }: { event: Event }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  
  const ticketPrice = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.isAvailable) return;
    setSelectedSeats((prev) =>
      prev.find((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: "destructive",
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
      });
      return;
    }
    const seatIds = selectedSeats.map(s => s.id).join(',');
    router.push(`/checkout?eventId=${event.id}&seats=${seatIds}`);
  };

  if (!event.seatingChart) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Get Your Tickets</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">This is a general admission event. No seat selection required.</p>
                <div className="flex justify-between items-center font-bold text-lg mb-4">
                    <span>Price per ticket:</span>
                    <span>${ticketPrice.toFixed(2)}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={() => router.push(`/checkout?eventId=${event.id}&seats=GA1`)}>
                    <Ticket className="w-5 h-5 mr-2" />
                    Buy Ticket
                </Button>
            </CardFooter>
        </Card>
    )
  }

  const { rows, seatsPerRow, seats } = event.seatingChart;
  const totalPrice = selectedSeats.length * ticketPrice;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Select Your Seats</CardTitle>
        <CardDescription>Click on available seats to select them.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-muted p-2 rounded-md text-center mb-4 text-sm font-semibold">STAGE</div>
        <div className="overflow-x-auto">
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))` }}>
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => handleSelectSeat(seat)}
                disabled={!seat.isAvailable}
                className={cn(
                  "flex items-center justify-center rounded-md aspect-square transition-colors duration-200",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  seat.isAvailable ? "bg-secondary hover:bg-primary/20" : "bg-muted",
                  selectedSeats.find(s => s.id === seat.id) && "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-card"
                )}
                aria-label={`Seat ${seat.id}`}
              >
                <Armchair className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-around text-sm">
            <div className="flex items-center"><Armchair className="w-4 h-4 mr-2 text-secondary-foreground" /> Available</div>
            <div className="flex items-center"><Armchair className="w-4 h-4 mr-2 text-accent" /> Selected</div>
            <div className="flex items-center"><Armchair className="w-4 h-4 mr-2 text-muted-foreground opacity-30" /> Unavailable</div>
        </div>
        {selectedSeats.length > 0 && (
            <div className="mt-6 bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">Your Selection</h4>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-muted-foreground">Seats:</span>
                    <span className="font-semibold">{selectedSeats.map(s => s.id).join(', ')}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-xl">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleCheckout} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Ticket className="w-5 h-5 mr-2" />
            Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
