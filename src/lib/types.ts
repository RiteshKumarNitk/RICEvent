


export type EventCategory = "Music" | "Sports" | "Art" | "Theater" | "Seminar" | "Cultural" | "Talk";

export type TicketType = {
  type: 'VIP' | 'Standard' | 'Balcony';
  price: number;
};

export type Seat = {
  id: string; // e.g., "A1"
  row: string;
  col: number;
  isBooked: boolean;
};

export type SeatSection = {
  sectionName: string;
  price: number;
  rows: {
      rowId: string;
      seats: number;
  }[];
  className: string;
}

export type SeatingChartTiers = {
    tierName: string;
    sections: SeatSection[];
}[];


export type SeatingChartData = {
  tiers: SeatingChartTiers;
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
