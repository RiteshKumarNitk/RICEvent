
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Event, Seat, SeatSection, SeatRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";

const MAX_SEATS = 6;

const SeatComponent = ({ seat, section, isSelected, isBooked, onSelect, showTooltip }: { seat: Seat, section: SeatSection, isSelected: boolean, isBooked: boolean, onSelect: (seat: Seat) => void, showTooltip: (seat: Seat, section: SeatSection, element: HTMLDivElement) => void }) => {
  const seatRef = useRef<HTMLDivElement>(null);
  const status = isBooked ? 'booked' : isSelected ? 'selected' : 'available';

  const seatStyles = {
    available: "bg-gray-300 dark:bg-gray-700 hover:bg-green-500 dark:hover:bg-green-600",
    booked: "bg-muted-foreground/30 cursor-not-allowed",
    selected: "bg-primary text-primary-foreground transform scale-110 shadow-lg",
  };

  const handleClick = () => {
    if (!isBooked) {
      onSelect(seat);
    }
  };

  const handleMouseEnter = () => {
    if (seatRef.current) {
        showTooltip(seat, section, seatRef.current);
    }
  }

  return (
    <div
      ref={seatRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn("w-4 h-4 md:w-5 md:h-5 rounded-full cursor-pointer transition-all duration-150 flex-shrink-0", seatStyles[status])}
    />
  );
};

const SeatTooltip = ({ tooltipData, onMouseLeave }: { tooltipData: { seat: Seat, section: SeatSection, style: React.CSSProperties } | null, onMouseLeave: () => void }) => {
    if (!tooltipData) return null;
    const { seat, section, style } = tooltipData;
    return (
        <div 
            className="absolute z-50 p-2 text-xs font-semibold text-white bg-gray-800 rounded-md shadow-lg pointer-events-none"
            style={style}
            onMouseLeave={onMouseLeave}
        >
            Seat {seat.id} - ₹{section.price}
        </div>
    );
}

export function SeatingChart({ event, ticketCount: initialTicketCount }: { event: Event; ticketCount: number }) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState<{seat: Seat, section: SeatSection, style: React.CSSProperties} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  let tooltipTimeout = useRef<NodeJS.Timeout | null>(null);


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
  
  const getSeatPrice = (seatId: string) => {
    if (!event.seatingChart) return 0;
    const seatRow = seatId.charAt(0);
    for (const section of event.seatingChart.sections) {
      if (section.rows.some(r => r.row === seatRow)) {
        return section.price;
      }
    }
    return 0;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat.id), 0);
  };
  
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.5));

  const showTooltip = (seat: Seat, section: SeatSection, element: HTMLDivElement) => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      setTooltip({
          seat,
          section,
          style: {
              left: rect.left - containerRect.left + rect.width / 2,
              top: rect.top - containerRect.top - rect.height,
              transform: 'translateX(-50%) translateY(-0.5rem)',
          }
      });
  }

  const hideTooltip = () => {
      tooltipTimeout.current = setTimeout(() => {
          setTooltip(null);
      }, 100);
  }

  if (!event.seatingChart) {
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
  
  const getSectionStyle = (sectionName: string) => {
      if (sectionName === "ROYAL") return { color: 'hsl(var(--seat-color-royal))' };
      if (sectionName === "CLUB") return { color: 'hsl(var(--seat-color-club))' };
      if (sectionName === "EXECUTIVE") return { color: 'hsl(var(--seat-color-executive))' };
      return {};
  }
  
  return (
    <>
      <div className="w-full bg-background relative" onMouseLeave={hideTooltip}>
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn /></Button>
        </div>
        
        <div ref={containerRef} className="overflow-auto py-8 px-4" >
          <SeatTooltip tooltipData={tooltip} onMouseLeave={hideTooltip} />
          <div 
            className="mx-auto transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <div className="flex flex-col items-center gap-6">

                {/* Seats */}
                <div className="flex flex-col-reverse gap-4 w-full items-center">
                    {sections.map((section, sectionIndex) => (
                        <div key={section.sectionName} className="flex flex-col-reverse items-center gap-1">
                            <p className="font-semibold text-xs mt-2" style={getSectionStyle(section.sectionName)}>{section.sectionName} - ₹{section.price}</p>
                            <div className={cn("flex flex-col-reverse gap-1 p-2 rounded-lg")}>
                                {section.rows.map((rowInfo, rowIndex) => (
                                    <div key={rowInfo.row} className="flex items-center justify-center gap-1 md:gap-2">
                                        <div className="seat-row-label">{rowInfo.row}</div>
                                        <div className="flex justify-center gap-1 md:gap-2" style={{ width: `${rowInfo.seats * 1.75}rem` }}>
                                            {Array.from({ length: rowInfo.seats }).map((_, i) => {
                                                const seatNum = i + 1;
                                                const seat: Seat = { id: `${rowInfo.row}${seatNum}`, row: rowInfo.row, col: seatNum };
                                                return <SeatComponent key={seat.id} seat={seat} section={section} isSelected={selectedSeats.some(s => s.id === seat.id)} isBooked={bookedSeats.includes(seat.id)} onSelect={handleSelectSeat} showTooltip={showTooltip} />;
                                            })}
                                        </div>
                                        <div className="seat-row-label">{rowInfo.row}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stage */}
                <div className="w-2/3 h-10 mt-8 flex items-center justify-center">
                    <div className="w-full h-full border-b-4 border-t-2 border-x-2 border-primary rounded-t-[100%]">
                       <p className="text-center font-bold text-primary tracking-widest mt-2">STAGE</p>
                    </div>
                </div>


                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700" /> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-primary" /> Selected</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-muted-foreground/30" /> Sold</div>
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
                      {selectedSeats.map(s => s.id).join(', ')}
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
        selectedSeats={selectedSeats}
      />
    </>
  );
}
