

"use client";

import { useState, useEffect, useRef } from "react";
import { Event, Seat, SeatSection, SeatRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";

const MAX_SEATS = 6;
const SEAT_RADIUS = 8;
const SEAT_SPACING = 22;
const ROW_SPACING = 24;

const SeatComponent = ({ seat, section, isSelected, isBooked, onSelect, showTooltip }: { seat: Seat, section: SeatSection, isSelected: boolean, isBooked: boolean, onSelect: (seat: Seat) => void, showTooltip: (seat: Seat, section: SeatSection, element: SVGCircleElement) => void }) => {
  const seatRef = useRef<SVGCircleElement>(null);

  const status = isBooked ? 'booked' : isSelected ? 'selected' : 'available';

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

  const getSeatClass = () => {
    if (isBooked) return "fill-gray-500 dark:fill-gray-800 cursor-not-allowed";
    if (isSelected) return "fill-green-500 dark:fill-green-600 stroke-green-700";
    return cn("cursor-pointer hover:fill-green-400", section.className);
  }

  return (
    <g transform={`translate(${seat.x || 0}, ${seat.y || 0})`} onClick={handleClick} onMouseEnter={handleMouseEnter}>
        <circle
            ref={seatRef}
            r={SEAT_RADIUS}
            className={cn("transition-all duration-200", getSeatClass())}
            strokeWidth="1"
        />
        <text 
            className="text-[8px] fill-current text-white font-bold pointer-events-none" 
            textAnchor="middle" 
            dy=".3em"
        >
            {seat.id.split('-')[1]}
        </text>
    </g>
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

export function SeatingChart({ event }: { event: Event }) {
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
  
  const seatingData = event.seatingChart;
  if (!seatingData) {
      return <div>Loading seating chart...</div>;
  }

  const { bookedSeats = [] } = seatingData;

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

  const showTooltip = (seat: Seat, section: SeatSection, element: SVGCircleElement) => {
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

  const renderCurvedRow = (row: SeatRow, rowIndex: number, totalRows: number) => {
      const seats = row.seats;
      const numSeats = seats.length;
      const arcWidth = numSeats * SEAT_SPACING;
      const radius = (arcWidth * 1.5) / Math.PI; 
      
      const rowY = rowIndex * ROW_SPACING;

      return seats.map((seatNum, index) => {
          const angle = (index / (numSeats - 1) - 0.5) * Math.PI * 0.6; 
          const x = radius * Math.sin(angle);
          const y = radius * (1 - Math.cos(angle)) + rowY;
          const seatId = `${row.row}${seatNum}`;
          
          const seatObj: Seat = { id: seatId, row: row.row, col: seatNum, x, y };

          return {
              seat: seatObj,
              component: (
                  <SeatComponent
                      key={seatId}
                      seat={seatObj}
                      section={seatingData.sections.find(s => s.rows.includes(row))!}
                      isSelected={selectedSeats.some(s => s.id === seatId)}
                      isBooked={bookedSeats.includes(seatId)}
                      onSelect={handleSelectSeat}
                      showTooltip={showTooltip}
                  />
              ),
          };
      });
  };

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

  let yOffset = 0;
  const allRenderedSeats = seatingData.sections.flatMap(section => {
    const renderedSection = section.rows.map((row, rowIndex) => {
        const renderedRow = renderCurvedRow(row, rowIndex, section.rows.length);
        return renderedRow;
    });
    
    // Find max Y in this section to calculate offset for the next
    const maxYInSection = Math.max(...renderedSection.flat().map(s => s.seat.y || 0));
    const sectionSeats = renderedSection.flat().map(s => {
        s.seat.y = (s.seat.y || 0) + yOffset;
        return s;
    });
    
    yOffset += maxYInSection + ROW_SPACING * 2; // Add extra spacing between sections

    return sectionSeats;
  }).flat();
  
  const svgWidth = 800;
  const svgHeight = 600;

  return (
    <>
      <div className="w-full bg-background relative rounded-lg border shadow-lg" onMouseLeave={hideTooltip}>
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut /></Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn /></Button>
        </div>
        
        <div ref={containerRef} className="overflow-auto p-4 md:p-8" >
          <SeatTooltip tooltipData={tooltip} onMouseLeave={hideTooltip} />
           <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-auto transition-transform duration-300"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
           >
            <g transform={`translate(${svgWidth / 2}, 50)`}>
                {allRenderedSeats.map(({ seat, component }) => component)}

                {/* Stage */}
                <g transform={`translate(0, ${yOffset + 50})`}>
                    <path d={`M -150 0 C -150 -30, 150 -30, 150 0 Z`} fill="none" stroke="currentColor" strokeWidth="2" />
                    <text textAnchor="middle" dy="-15" className="font-bold text-lg tracking-widest fill-current">STAGE</text>
                </g>

                {/* Legend */}
                <g transform={`translate(${-svgWidth / 2 + 20}, ${yOffset + 100})`}>
                    {seatingData.sections.map((s, i) => (
                        <g key={s.sectionName} transform={`translate(0, ${i * 20})`}>
                            <rect width="12" height="12" className={s.className} />
                            <text x="18" y="10" className="text-xs fill-current">{s.sectionName} - ₹{s.price}</text>
                        </g>
                    ))}
                    <g transform={`translate(200, 0)`}>
                        <circle cx="6" cy="6" r="6" className="fill-gray-300 dark:fill-gray-600" />
                        <text x="18" y="10" className="text-xs fill-current">Available</text>
                    </g>
                     <g transform={`translate(200, 20)`}>
                        <circle cx="6" cy="6" r="6" className="fill-green-500" />
                        <text x="18" y="10" className="text-xs fill-current">Selected</text>
                    </g>
                     <g transform={`translate(200, 40)`}>
                        <circle cx="6" cy="6" r="6" className="fill-gray-500 dark:fill-gray-800" />
                        <text x="18" y="10" className="text-xs fill-current">Booked</text>
                    </g>
                </g>
            </g>
          </svg>
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


    