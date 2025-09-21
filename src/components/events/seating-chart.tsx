"use client";

import { useState, useEffect } from "react";
import { Event, Seat } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";
import { Separator } from "../ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const RowLabel = ({ label }: { label: string }) => (
  <div className="flex h-8 w-8 items-center justify-center text-sm font-medium text-muted-foreground">
    {label}
  </div>
);

export function SeatingChart({ event, ticketCount }: { event: Event; ticketCount: number }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (ticketCount === 0) {
      toast({
          title: "No Tickets Selected",
          description: "Please go back and select the number of tickets you want.",
      });
    }
  }, [ticketCount, toast]);

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
    setCheckoutOpen(true);
  };
  
  const getSeatPrice = (seat: Seat) => {
      if (!event.seatingChart) return 0;
      for (const section of event.seatingChart.sections) {
        for (const row of section.rows) {
          if (row.find(s => s?.id === seat.id)) {
            return section.price;
          }
        }
      }
      return 0;
  }

  const getTotalPrice = () => {
    if (isFreeEvent) return 0;
    if (!event.seatingChart) return (event.ticketTypes.find(t => t.type === 'Standard')?.price || 0) * ticketCount;
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
  };

  // This is the corrected logic block
  if (!event.seatingChart) {
    // This part now ONLY runs for true general admission events
    const totalPrice = getTotalPrice();
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
                <span>₹{totalPrice.toFixed(2)}</span>
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

  // This part now correctly renders for any event WITH a seating chart.
  const { sections } = event.seatingChart;
  let rowCounter = 0;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
            <div className="w-full overflow-x-auto pb-4">
                <div className="inline-block min-w-full align-middle text-center">
                    <div className="flex flex-col items-center gap-6">
                        {sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="w-full">
                            <p className="text-center font-semibold text-muted-foreground my-2">{section.sectionName} - {isFreeEvent ? 'Free' : `₹${section.price}`}</p>
                            <div className="flex gap-4">
                            <div className="flex flex-col-reverse justify-end gap-2">
                                {section.rows.map((_, i) => <RowLabel key={i} label={alphabet[rowCounter + section.rows.length - 1 - i]} />)}
                            </div>
                            <div className="flex-grow flex flex-col-reverse gap-2">
                                {section.rows.map((row, rowIndex) => {
                                const rowKey = `s${sectionIndex}-r${rowIndex}`;
                                return (
                                    <div key={rowKey} className="flex items-center justify-center gap-2">
                                    {row.map((seat, seatIndex) => {
                                        if (!seat) {
                                        return <div key={`${rowKey}-e${seatIndex}`} className="h-8 w-8" />;
                                        }
                                        const isSelected = selectedSeats.some(s => s.id === seat.id);
                                        return (
                                        <button
                                            key={seat.id}
                                            onClick={() => handleSelectSeat(seat)}
                                            disabled={!seat.isAvailable}
                                            className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-mono transition-colors",
                                            !seat.isAvailable && "bg-gray-400 border-gray-500 text-gray-600 cursor-not-allowed",
                                            isSelected ? "bg-blue-400 border-blue-600 text-white" : "bg-green-200 border-green-400 hover:bg-green-300",
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
          <div className="w-full border-t-4 border-gray-400 p-2 rounded-md text-center my-8 text-sm font-semibold tracking-widest text-muted-foreground">SCREEN</div>

          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md border-green-400 bg-green-200" /> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md border-blue-600 bg-blue-400" /> Selected</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-gray-400 border-gray-500" /> Sold</div>
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
                 <p className="font-mono text-lg font-semibold break-words min-h-[2rem]">{selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(', ') : "No seats selected"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckout} className="w-full" disabled={selectedSeats.length !== ticketCount}>
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
