"use client";

import { useState } from "react";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketSelectionProps {
  event: Event;
  onProceed: (ticketCount: number) => void;
}

export function TicketSelection({ event, onProceed }: TicketSelectionProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const { toast } = useToast();
  
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

  const getPriceByCategory = (category: string) => {
    const section = event.seatingChart?.tiers.flatMap(t => t.sections).find(s => s.sectionName.includes(category));
    return section?.price ?? 0;
  }

  return (
    <Card className="sticky top-24">
        <CardHeader>
            <CardTitle className="text-2xl">Select Tickets</CardTitle>
            <CardDescription>
                Choose the number of seats you want to book.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} disabled={ticketCount <= 1}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="text-4xl font-bold w-20 text-center">{ticketCount}</span>
                <Button variant="outline" size="icon" onClick={() => setTicketCount(Math.min(6, ticketCount + 1))}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
             <div className="text-center text-sm text-muted-foreground">
                <p>Prices start from ₹{Math.min(...event.seatingChart?.tiers.flatMap(t => t.sections).map(s => s.price) || [0])}</p>
             </div>
        </CardContent>
        <CardFooter>
             <Button onClick={handleProceed} size="lg" className="w-full">
                <Ticket className="mr-2 h-4 w-4" />
                {event.seatingChart ? `Select ${ticketCount} Seats` : 'Register'}
            </Button>
        </CardFooter>
    </Card>
  )
}
