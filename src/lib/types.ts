
export type EventCategory = "Music" | "Sports" | "Art" | "Theater" | "Seminar" | "Cultural" | "Talk";

export type TicketType = {
  type: 'VIP' | 'Standard' | 'Balcony';
  price: number;
};

export type Seat = {
  id: string; // e.g., "A1"
  row: string; // e.g., "A"
  col: number; // e.g., 1
  isAvailable: boolean;
};

export type SeatSection = {
  sectionName: string;
  price: number;
  seats: Seat[];
}

export type SeatingChartData = {
  sections: SeatSection[];
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
