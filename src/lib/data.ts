// This file is now deprecated as event data is managed in Firestore.
// It is kept for type reference and potential fallback, but is not actively used.

import type { Event, SeatingChartData } from "./types";

const generateCinemaSeatingChart = (): SeatingChartData => {
  const createRow = (seatCount: number, startNum: number, isAvailableProb: number): (Seat | null)[] => {
    const row = Array.from({ length: seatCount }, (_, i) => {
      const seatNum = startNum + i;
      return {
        id: `${seatNum}`, // Simplified ID for cinema
        number: `${seatNum}`,
        isAvailable: Math.random() < isAvailableProb,
      }
    });
    return row;
  }
  return {
    sections: [
       {
        sectionName: 'Normal',
        ticketType: 'Standard',
        price: 260,
        rows: [
            ...Array.from({length: 4}, (_, i) => i + 1).map(rowNum => [
                ...createRow(6, (rowNum-1)*20 + 1, 0.9), null, ...createRow(8, (rowNum-1)*20 + 7, 0.8), null, ...createRow(6, (rowNum-1)*20 + 15, 0.9)
            ])
        ]
      },
      {
        sectionName: 'Executive',
        ticketType: 'VIP',
        price: 280,
        rows: [
             ...Array.from({length: 8}, (_, i) => i + 5).map(rowNum => [
                ...createRow(6, (rowNum-1)*20 + 1, 0.7), null, ...createRow(8, (rowNum-1)*20 + 7, 0.6), null, ...createRow(6, (rowNum-1)*20 + 15, 0.7)
            ])
        ]
      },
    ]
  };
};

export const events: Event[] = []; // Initial data is now fetched from Firestore
