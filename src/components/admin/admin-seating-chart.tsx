
"use client";

import { useState, useEffect, useMemo } from "react";
import { Event, Seat, SeatSection, SeatRow, Attendee } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Lock, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type BookedSeatInfo = {
  seatId: string;
  isMember: boolean;
};

const generateSeats = (
  sectionName: string,
  row: SeatRow
): (Seat | { isSpacer: true })[] => {
  if (row.rowId === 'spacer') {
    return [{ isSpacer: true }];
  }
  const start = (row.offset || 0) + 1;
  return Array.from({ length: row.seats }, (_, i) => {
    const seatNum = start + i;
    const seatId = `${sectionName}-${row.rowId}-${seatNum}`;
    
    return {
      id: seatId,
      row: row.rowLabel || row.rowId,
      col: seatNum,
      isBooked: false, // In admin view, we only care about reserved status for selection
    };
  });
};

const AdminSeatComponent = ({
  seat,
  isBooked,
  isReserved,
  onSelect,
}: {
  seat: Seat;
  isBooked: boolean;
  isReserved: boolean;
  onSelect: (seatId: string) => void;
}) => {
  const handleClick = () => {
    if (!isBooked) onSelect(`${seat.row}-${seat.col}`);
  };
  
  const simpleSeatId = `${seat.row}-${seat.col}`;

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative w-5 h-5 md:w-6 md:h-6 transition-all duration-200 flex items-center justify-center",
        !isBooked && "cursor-pointer group"
      )}
      title={isBooked ? `Seat ${simpleSeatId} - Booked` : `Seat ${simpleSeatId}`}
    >
      <div className={cn(
          "absolute bottom-0 h-3/4 w-full rounded-t-sm",
           isBooked ? "bg-gray-500" : "bg-gray-300 dark:bg-gray-700 group-hover:bg-primary/20",
           isReserved && "!bg-amber-600",
      )} />
      <div className={cn(
          "absolute bottom-0 h-1/4 w-[120%] rounded-sm",
           isBooked ? "bg-gray-600" : "bg-gray-400 dark:bg-gray-600 group-hover:bg-primary/40",
           isReserved && "!bg-amber-700",
      )} />
      
      {isReserved && 
        <Lock className="relative h-3 w-3 text-white" />
      }
      {isBooked && !isReserved &&
        <UserCheck className="relative h-3 w-3 text-white" />
      }
    </div>
  );
};


export function AdminSeatingChart({
  event,
  reservedSeats,
  onReservedSeatsChange
}: {
  event: Event;
  reservedSeats: string[];
  onReservedSeatsChange: (seats: string[]) => void;
}) {
  const [bookedSeats, setBookedSeats] = useState<BookedSeatInfo[]>([]);
  const { toast } = useToast();

  const seatingData = event.seatingChart;

  useEffect(() => {
    if (!event.id || !event.seatingChart) return;
    
    const bookingsQuery = query(collection(db, 'bookings'), where('eventId', '==', event.id));
    
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
        const seatInfos = snapshot.docs.flatMap(doc => {
            const data = doc.data();
            if (Array.isArray(data.attendees)) {
                return data.attendees.map((attendee: Attendee) => ({
                    seatId: attendee.seatId,
                    isMember: attendee.isMember
                }));
            }
            return [];
        });
        setBookedSeats(seatInfos);
    });

    return () => unsubscribe();
  }, [event.id, event.seatingChart]);

  const handleSelectSeat = (seatId: string) => {
    const upperCaseSeatId = seatId.toUpperCase();
    const newReservedSeats = reservedSeats.includes(upperCaseSeatId)
      ? reservedSeats.filter(s => s !== upperCaseSeatId)
      : [...reservedSeats, upperCaseSeatId];
    onReservedSeatsChange(newReservedSeats);
  };
  
  const getRowAngle = (sectionName: string, rowIndex: number) => {
    if (sectionName.toLowerCase().includes("left")) return -6 - rowIndex * 0.6;
    if (sectionName.toLowerCase().includes("right")) return 6 + rowIndex * 0.6;
    return 0;
  };

  if (!seatingData || !seatingData.tiers) {
    return <p className="text-muted-foreground">This event does not have a seating chart.</p>;
  }
  
  const groupedRows = (rows: SeatRow[]) => {
    return rows.reduce((acc, row) => {
      const label = row.rowLabel || row.rowId.replace(/-.*/, "");
      if (!acc[label]) acc[label] = [];
      acc[label].push(row);
      return acc;
    }, {} as Record<string, SeatRow[]>);
  };

  const renderSection = (section: SeatSection, idx: number) => {
    const angle = (section as any).angle ?? 0;
    const translateX = (section as any).translateX ?? 0;
    const sectionStyle: React.CSSProperties = {
      transform: `rotate(${angle}deg) translateX(${translateX}px)`,
      transformOrigin: "center bottom",
    };
    
    const rowsByLabel = groupedRows(section.rows);

    return (
      <div key={idx} className={cn("p-2 md:p-4 rounded-xl", section.className)} style={sectionStyle}>
        <p className="font-semibold text-center text-sm md:text-lg mb-2 md:mb-4">
          {section.sectionName}
        </p>

        <div className="space-y-2">
          {Object.entries(rowsByLabel).map(([rowLabel, rowParts], rowIndex) => {
            if (rowLabel === 'spacer') return <div key={`spacer-${rowIndex}`} className="h-4 md:h-6" />;
            return (
              <div key={rowLabel} className="flex items-center justify-center gap-1 md:gap-2 origin-bottom" style={{transform: `rotate(${getRowAngle(section.sectionName, rowIndex)}deg)`}}>
                <div className="seat-row-label">{rowLabel}</div>
                <div className="flex gap-4 justify-center whitespace-nowrap">
                  {rowParts.map((rowPart) => (
                     <div key={rowPart.rowId} className="flex gap-1 md:gap-2">
                       {generateSeats(section.sectionName, rowPart).map((seat) => {
                          if ('isSpacer' in seat) return null;
                          const simpleSeatId = `${seat.row}-${seat.col}`.toUpperCase();
                          const isBooked = bookedSeats.some(b => `${b.seatId.split('-')[1]}-${b.seatId.split('-')[2]}` === simpleSeatId);
                          return (
                              <AdminSeatComponent
                                key={seat.id}
                                seat={seat}
                                isBooked={isBooked}
                                isReserved={reservedSeats.includes(simpleSeatId)}
                                onSelect={handleSelectSeat}
                              />
                          )
                       })}
                     </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-muted/30 relative rounded-lg border p-4 overflow-hidden">
      <div className="overflow-auto">
        <div className="transition-transform duration-300 inline-block min-w-full">
          <div className="space-y-2">
            {seatingData.tiers.map((tier, tierIndex) => (
              <div key={tierIndex} className="space-y-4">
                <div className="text-center font-bold">{tier.tierName}</div>
                <div className="flex flex-nowrap items-start justify-center">
                  {tier.sections.map((sec: any, idx: number) => (
                    <div key={idx} className={cn("flex flex-col items-center mx-1 md:mx-2", tier.tierName !== "Middle" && tier.tierName !== "Premium" && "mt-8")}>
                      {renderSection(sec, idx)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <div className="bg-gray-700 text-white text-center py-3 px-10 rounded-md font-bold text-xl tracking-widest w-64">STAGE</div>
          </div>
          <div className="mt-8 flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm border bg-gray-300 dark:bg-gray-700"></div><span>Available</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-amber-600 flex items-center justify-center"><Lock className="h-3 w-3 text-white" /></div><span>Reserved</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm bg-gray-500 flex items-center justify-center"><UserCheck className="h-3 w-3 text-white" /></div><span>Booked</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
