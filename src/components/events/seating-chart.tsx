
"use client";

import { useState, useEffect } from "react";
import { Event, Seat, SeatSection, SeatRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Plus, Minus, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CheckoutDialog } from "../checkout/checkout-dialog";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// --- Generate seats for each row ---
const generateSeats = (
  sectionName: string,
  row: SeatRow,
  bookedSeats: string[],
  reservedSeats: string[]
): Seat[] => {
  const start = (row.offset || 0) + 1;
  return Array.from({ length: row.seats }, (_, i) => {
    const seatNum = start + i;
    const seatId = `${sectionName}-${row.rowId}-${seatNum}`;
    const simpleSeatId = `${row.rowId}-${seatNum}`;
    return {
      id: seatId,
      row: row.rowId,
      col: seatNum,
      isBooked: bookedSeats.includes(seatId) || reservedSeats.includes(simpleSeatId.toUpperCase()),
    };
  });
};

// --- Seat Component ---
const SeatComponent = ({
  seat,
  section,
  isSelected,
  onSelect,
  isReserved
}: {
  seat: Seat;
  section: SeatSection;
  isSelected: boolean;
  onSelect: (seat: Seat, section: SeatSection) => void;
  isReserved: boolean;
}) => {
  const handleClick = () => {
    if (!seat.isBooked && !isReserved) onSelect(seat, section);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative w-5 h-5 md:w-6 md:h-6 transition-all duration-200 flex items-center justify-center",
        !seat.isBooked && !isReserved && "cursor-pointer group"
      )}
      title={isReserved ? `Seat ${seat.row}-${seat.col} - Reserved` : `Seat ${seat.row}-${seat.col} - ₹${section.price}`}
    >
      <div className={cn(
          "absolute bottom-0 h-3/4 w-full rounded-t-sm",
           seat.isBooked ? "bg-muted" : "bg-gray-300 dark:bg-gray-700 group-hover:bg-primary/20",
           isReserved && "!bg-amber-600/50",
           isSelected && "!bg-primary"
      )} />
      <div className={cn(
          "absolute bottom-0 h-1/4 w-[120%] rounded-sm",
           seat.isBooked ? "bg-muted/80" : "bg-gray-400 dark:bg-gray-600 group-hover:bg-primary/40",
           isReserved && "!bg-amber-700/50",
           isSelected && "!bg-primary"
      )} />
      
      {!seat.isBooked && !isReserved &&
        <span className={cn(
            "relative text-[10px] md:text-xs font-bold",
            isSelected ? "text-primary-foreground" : "text-gray-700 dark:text-gray-200"
        )}>
            {seat.col}
        </span>
      }
      {isReserved && 
        <Lock className="relative h-3 w-3 text-white" />
      }
    </div>
  );
};

// --- Main SeatingChart ---
export function SeatingChart({
  event,
  ticketCount,
  onTicketCountChange,
}: {
  event: Event;
  ticketCount: number;
  onTicketCountChange: (count: number) => void;
}) {
  const [selectedSeats, setSelectedSeats] = useState<
    { seat: Seat; section: SeatSection }[]
  >([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const { toast } = useToast();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const seatingData = event.seatingChart;
  const reservedSeats = event.reservedSeats || [];

  // --- Fetch booked seats ---
  useEffect(() => {
    if (!event.id || !event.seatingChart) {
      setLoadingBookings(false);
      return;
    }
    
    setLoadingBookings(true);
    const bookingsQuery = query(collection(db, 'bookings'), where('eventId', '==', event.id));
    
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const seatIds = snapshot.docs.flatMap(doc => doc.data().attendees.map((attendee: any) => attendee.seatId));
      setBookedSeats(seatIds);
      setLoadingBookings(false);
    }, (error) => {
        console.error("Error fetching booked seats:", error);
        toast({
          variant: "destructive",
          title: "Could not load booked seats.",
          description:
            "There was a problem fetching seat availability from the database.",
        });
        setLoadingBookings(false);
    });

    return () => unsubscribe();
  }, [event.id, event.seatingChart, toast]);

  // --- Truncate if ticket count reduced ---
  useEffect(() => {
    if (selectedSeats.length > ticketCount) {
      setSelectedSeats((prev) => prev.slice(0, ticketCount));
    }
  }, [ticketCount, selectedSeats.length]);

  // --- Select seat ---
  const handleSelectSeat = (seat: Seat, section: SeatSection) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seat.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.seat.id !== seat.id);
      }
      if (prev.length < ticketCount) {
        return [...prev, { seat, section }];
      }
      // If max seats are selected, replace the first selected seat with the new one
      if (prev.length === ticketCount) {
        const newSelection = [...prev.slice(1), { seat, section }];
        toast({
          title: `Seat Updated`,
          description: `Replaced seat ${prev[0].seat.row}-${prev[0].seat.col} with ${seat.row}-${seat.col}.`,
        });
        return newSelection;
      }
      return prev;
    });
  };

  // --- Checkout ---
  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: "destructive",
        title: "No seats selected",
        description: `Please select at least one seat to proceed.`,
      });
      return;
    }
    if (selectedSeats.length !== ticketCount) {
      toast({
        variant: "destructive",
        title: `Incorrect number of seats`,
        description: `Please select exactly ${ticketCount} seats.`,
      });
      return;
    }
    setCheckoutOpen(true);
  };

  // --- Row angle helper (per-row small fan) ---
  const getRowAngle = (sectionName: string, rowIndex: number) => {
    // section-level + per-row varies more outward for higher index (back rows)
    if (sectionName.toLowerCase().includes("left")) {
      return -6 - rowIndex * 0.6;
    }
    if (sectionName.toLowerCase().includes("right")) {
      return 6 + rowIndex * 0.6;
    }
    return 0;
  };

  // --- GA Checkout ---
  const handleGeneralAdmissionCheckout = () => {
    if (ticketCount > 0) {
      setSelectedSeats(
        Array.from({ length: ticketCount }).map((_, i) => ({
          seat: {
            id: `GA-${i + 1}`,
            row: "GA",
            col: i + 1,
            isBooked: false,
          },
          section: {
            sectionName: "General Admission",
            price: event.ticketTypes?.[0]?.price || 0,
            rows: [],
            className: "",
          },
        }))
      );
      setCheckoutOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "No tickets selected",
        description: `Please select at least one ticket to proceed.`,
      });
    }
  };

  const getTotalPrice = () =>
    selectedSeats.reduce((total, s) => total + s.section.price, 0);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  if (loadingBookings) {
    return <div className="text-center py-12">Loading seat availability...</div>;
  }

  if (!seatingData || !seatingData.tiers) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <h2 className="text-xl font-semibold">General Admission Event</h2>
        <p>
          Click proceed to confirm your booking for {ticketCount}{" "}
          {ticketCount === 1 ? "ticket" : "tickets"}.
        </p>
        <Button className="mt-4" onClick={handleGeneralAdmissionCheckout}>
          Proceed
        </Button>
        <CheckoutDialog
          isOpen={isCheckoutOpen}
          onOpenChange={setCheckoutOpen}
          event={event}
          selectedSeats={selectedSeats}
        />
      </div>
    );
  }

  // Render helper for a single section
  const renderSection = (section: SeatSection, idx: number) => {
    const angle = (section as any).angle ?? 0;
    const translateX = (section as any).translateX ?? 0;
    // section transform (rotate + translateX); transformOrigin keeps pivot sensible
    const sectionStyle: React.CSSProperties = {
      transform: `rotate(${angle}deg) translateX(${translateX}px)`,
      transformOrigin: "center bottom",
    };

    return (
      <div
        key={idx}
        className={cn(
          "p-2 md:p-4 rounded-xl",
          section.className
        )}
        style={sectionStyle}
      >
        <p className="font-semibold text-center text-sm md:text-lg mb-2 md:mb-4">
          {section.sectionName} - ₹{section.price}
        </p>

        <div className="space-y-2">
          {section.rows.map((row: SeatRow, rowIndex: number) => (
            <div
              key={row.rowId}
              className="flex items-center justify-center gap-1 md:gap-2 origin-bottom"
              style={{
                transform: `rotate(${getRowAngle(section.sectionName, rowIndex)}deg)`,
              }}
            >
              {/* Row label */}
              <div className="seat-row-label">
                {row.rowId.replace(/-.*/, "")}
              </div>

              {/* Seats: allow wrapping so rows break naturally on small screens */}
              <div className="flex gap-1 md:gap-2 justify-center whitespace-nowrap">
                {generateSeats(section.sectionName, row, bookedSeats, reservedSeats).map(
                  (seat) => {
                    const simpleSeatId = `${seat.row}-${seat.col}`;
                    const isReserved = reservedSeats.includes(simpleSeatId.toUpperCase());
                    return (
                        <SeatComponent
                          key={seat.id}
                          seat={seat}
                          section={section}
                          isSelected={selectedSeats.some(
                            (s) => s.seat.id === seat.id
                          )}
                          onSelect={handleSelectSeat}
                          isReserved={isReserved}
                        />
                    )
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full bg-background relative rounded-lg border shadow-lg overflow-hidden">
        {/* Ticket Counter */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <p className="font-semibold hidden sm:block">Tickets:</p>
          <div className="flex items-center gap-2 bg-background p-1 rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onTicketCountChange(Math.max(1, ticketCount - 1))}
              disabled={ticketCount <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-bold w-10 text-center">
              {ticketCount}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onTicketCountChange(Math.min(6, ticketCount + 1))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn />
          </Button>
        </div>

        {/* Seating Chart */}
        <div className="overflow-auto pt-12">
          <div
            className="transition-transform duration-300 inline-block min-w-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
          >
            <div className="space-y-2">
              {seatingData.tiers.map((tier, tierIndex) => {
                // split sections into left / center / right buckets by name
                const leftSections = tier.sections.filter((s: any) =>
                  /left/i.test(s.sectionName)
                );
                const rightSections = tier.sections.filter((s: any) =>
                  /right/i.test(s.sectionName)
                );
                const centerSections = tier.sections.filter(
                  (s: any) => !/left|right/i.test(s.sectionName)
                );

                const hasAngledSections = tier.sections.some(s => (s as any).angle !== 0 && (s as any).angle !== undefined);

                return (
                  <div key={tierIndex} className="space-y-4">
                    <div className="text-center font-bold">{tier.tierName}</div>

                    <div className="flex flex-nowrap items-start justify-center">
                      {/* LEFT */}
                      <div className={cn("flex flex-col items-center", hasAngledSections && "mt-8")}>
                        {leftSections.map((sec: any, idx: number) =>
                          renderSection(sec, idx)
                        )}
                      </div>

                      {/* CENTER */}
                      <div className="flex flex-col items-center mx-2 md:mx-4">
                        {centerSections.map((sec: any, idx: number) =>
                          renderSection(sec, idx)
                        )}
                      </div>

                      {/* RIGHT */}
                      <div className={cn("flex flex-col items-center", hasAngledSections && "mt-8")}>
                        {rightSections.map((sec: any, idx: number) =>
                          renderSection(sec, idx)
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stage */}
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-700 text-white text-center py-3 px-10 rounded-md font-bold text-xl tracking-widest w-64">
                STAGE
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm border bg-gray-300 dark:bg-gray-700"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-primary"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-muted"></div>
                <span>Booked</span>
              </div>
               <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-amber-600/50 flex items-center justify-center">
                    <Lock className="h-3 w-3 text-white" />
                </div>
                <span>Reserved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-30 transition-transform duration-300",
            selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-center sm:text-left">
              <p className="text-lg font-bold">₹{getTotalPrice().toFixed(2)}</p>
              <p className="text-sm text-muted-foreground truncate max-w-xs">
                {selectedSeats.map((s) => `${s.seat.row}-${s.seat.col}`).join(", ") ||
                  "No seats selected"}
              </p>
            </div>
            <Button onClick={handleCheckout} size="lg" className="w-full sm:w-auto">
              {`Proceed with ${selectedSeats.length} ${
                selectedSeats.length === 1 ? "seat" : "seats"
              }`}
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onOpenChange={setCheckoutOpen}
        event={event}
        selectedSeats={selectedSeats}
      />
    </>
  );
}
