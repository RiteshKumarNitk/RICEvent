"use client";

import { useState } from "react";
import { Event, Seat, SeatRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, User, Screen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";
import { Separator } from "../ui/separator";

const RowLabel = ({ label }: { label: string }) => (
  <div className="flex h-6 w-6 items-center justify-center text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

export function SeatingChart({ event, ticketCount }: { event: Event; ticketCount: number }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const isFreeEvent = event.ticketTypes.every(t => t.price === 0);

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.isAvailable) return;

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
    const seatsToCheckout = event.seatingChart ? selectedSeats : Array.from({ length: ticketCount }, (_, i) => ({ id: `GA${i + 1}`, number: `GA${i+1}`, isAvailable: true }));
    setCheckoutOpen(true);
  };

  const getTotalPrice = () => {
    if (!event.seatingChart) return (event.ticketTypes.find(t => t.type === 'Standard')?.price || 0) * ticketCount;
    return selectedSeats.reduce((total, seat) => {
      for (const section of event.seatingChart!.sections) {
        if (section.rows.flat().some(s => s?.id === seat.id)) {
          return total + section.price;
        }
      }
      return total;
    }, 0);
  };
  
  if (!event.seatingChart) {
    const price = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;
    const totalPrice = price * ticketCount;
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
                <span>${totalPrice.toFixed(2)}</span>
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
        <CheckoutDialog isOpen={isCheckoutOpen} onOpenChange={setCheckoutOpen} event={event} selectedSeats={Array.from({ length: ticketCount }, (_, i) => ({ id: `GA${i + 1}`, number: `${i + 1}`, isAvailable: true }))} />
      </>
    );
  }

  const { sections } = event.seatingChart;
  let rowCounter = 0;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
            <div className="w-full overflow-x-auto pb-4">
                <div className="inline-block min-w-full align-middle">
                    <div className="flex flex-col items-center gap-4">
                        {sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="w-full">
                            <p className="text-center text-sm font-semibold text-muted-foreground my-2">{section.sectionName}</p>
                            <Separator className="mb-4" />
                            <div className="flex gap-4">
                            <div className="flex flex-col-reverse justify-end gap-1">
                                {section.rows.map((_, i) => <RowLabel key={i} label={alphabet[rowCounter + section.rows.length - 1 - i]} />)}
                            </div>
                            <div className="flex-grow flex flex-col-reverse gap-1">
                                {section.rows.map((row, rowIndex) => {
                                const rowKey = `s${sectionIndex}-r${rowIndex}`;
                                return (
                                    <div key={rowKey} className="flex items-center justify-center gap-1">
                                    {row.map((seat, seatIndex) => {
                                        if (!seat) {
                                        return <div key={`${rowKey}-e${seatIndex}`} className="h-6 w-6" />;
                                        }
                                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                                        return (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSelectSeat(seat)}
                                            disabled={!seat.isAvailable}
                                            className={cn(
                                            "flex h-6 w-6 items-center justify-center rounded-sm border text-xs font-mono transition-colors",
                                            "disabled:bg-muted disabled:border-muted-foreground/20 disabled:text-muted-foreground/50 disabled:cursor-not-allowed",
                                            isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-primary/10",
                                            seat.isAvailable ? "cursor-pointer" : ""
                                            )}
                                        >
                                            {seat.number}
                                        </button>
                                        );
                                    })}
                                    </div>
                                );
                                })}
                            </div>
                            </div>
                            <div hidden>
                                {rowCounter += section.rows.length}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
          <div className="w-full bg-muted/50 p-2 rounded-md text-center my-4 text-sm font-semibold tracking-widest text-muted-foreground">SCREEN</div>

          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm border bg-background" /> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm border-primary bg-primary" /> Selected</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-muted border-muted-foreground/20" /> Unavailable</div>
          </div>
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Your Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-lg font-bold mb-2">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <Separator />
               <div className="mt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                    <span>Seats ({selectedSeats.length}/{ticketCount})</span>
                </div>
                 <p className="font-mono text-sm break-words">{selectedSeats.length > 0 ? selectedSeats.map(s => s.number).join(', ') : "No seats selected"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckout} className="w-full" disabled={selectedSeats.length !== ticketCount}>
                <Ticket className="mr-2 h-4 w-4" />
                Proceed
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
