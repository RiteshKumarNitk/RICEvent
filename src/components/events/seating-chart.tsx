"use client";

import { useState } from "react";
import { Event, Seat } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair, Ticket, Plus, Minus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";

export function SeatingChart({ event }: { event: Event }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [step, setStep] = useState<'selectCount' | 'selectSeats'>('selectCount');
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  
  const ticketPrice = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;
  const isFreeEvent = ticketPrice === 0;

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    setSelectedSeats((prev) => {
        const isSelected = prev.find((s) => s.id === seat.id);
        if (isSelected) {
            return prev.filter((s) => s.id !== seat.id);
        }
        if (prev.length < ticketCount) {
            return [...prev, seat];
        } else {
            toast({
                variant: 'destructive',
                title: `You can only select ${ticketCount} seat(s).`,
                description: 'Deselect a seat to choose another.'
            })
            return prev;
        }
    });
  };

  const handleProceedToSeats = () => {
    if (ticketCount === 0) {
      toast({
        variant: 'destructive',
        title: "No tickets selected",
        description: "Please select the number of tickets.",
      });
      return;
    }
    setStep('selectSeats');
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
     // For general admission, create a placeholder seat array
    const seatsToCheckout = event.seatingChart ? selectedSeats : Array.from({ length: ticketCount }, (_, i) => ({ id: `GA${i + 1}`, isAvailable: true }));

    setCheckoutOpen(true);
  };

  if (step === 'selectCount') {
     return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-2xl">How many seats?</CardTitle>
                <CardDescription>Select the number of tickets you wish to book.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6">
                 <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} disabled={ticketCount <= 0}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-4xl font-bold w-20 text-center">{ticketCount}</span>
                    <Button variant="outline" size="icon" onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                 {!isFreeEvent && (
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-xl">Total: ${(ticketCount * ticketPrice).toFixed(2)}</span>
                        <span className="text-muted-foreground text-sm">(${ticketPrice.toFixed(2)} per ticket)</span>
                    </div>
                 )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleProceedToSeats} size="lg" className="w-full">
                    Select Seats
                </Button>
            </CardFooter>
        </Card>
     )
  }

  // General Admission flow
  if (!event.seatingChart) {
    const buttonText = isFreeEvent ? "Register Now" : "Buy Tickets";
    return (
       <>
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{isFreeEvent ? "Register" : "Get Your Tickets"}</CardTitle>
                <CardDescription>This is a general admission event.</CardDescription>
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
                      <span>${(ticketPrice * ticketCount).toFixed(2)}</span>
                  </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                    <Ticket className="w-5 h-5 mr-2" />
                    {buttonText}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => { setStep('selectCount'); setSelectedSeats([])}}>Change Ticket Count</Button>
            </CardFooter>
        </Card>
         <CheckoutDialog 
            isOpen={isCheckoutOpen}
            onOpenChange={setCheckoutOpen}
            event={event}
            selectedSeats={Array.from({ length: ticketCount }, (_, i) => ({ id: `GA${i + 1}`, isAvailable: true }))}
        />
       </>
    )
  }

  // Seating Chart flow
  const { seatsPerRow, seats } = event.seatingChart;
  const totalPrice = selectedSeats.length * ticketPrice;
  const canProceed = selectedSeats.length === ticketCount;

  const checkoutButtonText = isFreeEvent ? "Register" : "Proceed to Checkout";

  return (
    <>
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-2xl">Select Your Seats</CardTitle>
        <CardDescription>Please select {ticketCount} seat(s).</CardDescription>
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
                  seat.isAvailable ? "bg-secondary hover:bg-primary/10" : "bg-muted",
                  selectedSeats.find(s => s.id === seat.id) && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card"
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
            <div className="flex items-center"><Armchair className="w-4 h-4 mr-2 text-primary" /> Selected</div>
            <div className="flex items-center"><Armchair className="w-4 h-4 mr-2 text-muted-foreground opacity-30" /> Unavailable</div>
        </div>
        <div className="mt-6 bg-secondary p-4 rounded-lg">
            <h4 className="font-bold mb-2">Your Selection</h4>
            <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground">Seats ({selectedSeats.length}/{ticketCount}):</span>
                <span className="font-semibold truncate">{selectedSeats.map(s => s.id).join(', ') || 'None'}</span>
            </div>
            {!isFreeEvent && (
              <div className="flex justify-between items-center font-bold text-xl">
                  <span>Total:</span>
                  <span>${(selectedSeats.length * ticketPrice).toFixed(2)}</span>
              </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button onClick={handleCheckout} size="lg" className="w-full" disabled={!canProceed}>
            <Ticket className="w-5 h-5 mr-2" />
            {checkoutButtonText}
        </Button>
        <Button variant="outline" className="w-full" onClick={() => { setStep('selectCount'); setSelectedSeats([])}}>Change Ticket Count</Button>
      </CardFooter>
    </Card>
    <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onOpenChange={setCheckoutOpen}
        event={event}
        selectedSeats={selectedSeats}
    />
    </>
  );
}
