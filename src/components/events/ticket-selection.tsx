"use client";

import { useState } from "react";
import { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketSelectionProps {
  event: Event;
  onProceed: (ticketCount: number) => void;
}

export function TicketSelection({ event, onProceed }: TicketSelectionProps) {
  const [ticketCount, setTicketCount] = useState(0);
  const { toast } = useToast();
  
  const ticketPrice = event.ticketTypes.find(t => t.type === 'Standard')?.price || 0;
  const isFreeEvent = event.ticketTypes.every(t => t.price === 0);

  const handleProceed = () => {
    if (ticketCount === 0) {
      toast({
        variant: 'destructive',
        title: "No tickets selected",
        description: "Please select at least one ticket.",
      });
      return;
    }
    onProceed(ticketCount);
  };

  return (
    <Card className="sticky top-24">
        <CardHeader>
            <CardTitle className="text-2xl">How many seats?</CardTitle>
            <CardDescription>
                {event.seatingChart ? 'Select the number of tickets you wish to book.' : 'This is a general admission event.'}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setTicketCount(Math.max(0, ticketCount - 1))} disabled={ticketCount <= 0}>
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
             {isFreeEvent && ticketCount > 0 && (
                <div className="text-center">
                  <p className="font-semibold text-lg">Free Event</p>
                  <p className="text-muted-foreground text-sm">No payment required.</p>
                </div>
             )}
        </CardContent>
        <CardFooter>
             <Button onClick={handleProceed} size="lg" className="w-full">
                <Ticket className="mr-2 h-4 w-4" />
                {event.seatingChart ? 'Select Seats' : 'Register'}
            </Button>
        </CardFooter>
    </Card>
  )
}
