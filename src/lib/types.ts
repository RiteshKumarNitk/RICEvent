
export type EventCategory = "Music" | "Sports" | "Art" | "Theater" | "Seminar" | "Cultural" | "Talk";

export type TicketType = {
  type: 'VIP' | 'Standard' | 'Balcony';
  price: number;
};

export type Seat = {
  id: string; // e.g., "A1"
  row: string;
  col: number;
};

export type SeatRow = {
  row: string;
  seats: number;
}

export type SeatSection = {
  sectionName: string;
  price: number;
  rows: SeatRow[];
  className: string;
}

export type SeatingChartData = {
  sections: SeatSection[];
  bookedSeats: string[];
};

export type Event = {
  id: string;
  name: string;
  description: string;
  category: EventCategory;
  date: string;
  location: string;
  venue: string;
  image: string;
  showtimes: string[];
  ticketTypes: TicketType[];
  seatingChart?: SeatingChartData;
};
