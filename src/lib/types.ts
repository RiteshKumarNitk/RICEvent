export type EventCategory = "Music" | "Sports" | "Art" | "Theater" | "Seminar" | "Cultural" | "Talk";

export type TicketType = {
  type: 'VIP' | 'Standard' | 'Balcony';
  price: number;
};

export type Seat = {
  id: string;
  number: string;
  isAvailable: boolean;
};

export type SeatRow = (Seat | null)[];

export type SeatSection = {
  sectionName: string;
  ticketType: TicketType['type'];
  price: number;
  rows: SeatRow[];
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
