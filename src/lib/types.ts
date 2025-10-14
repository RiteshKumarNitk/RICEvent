

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
  isMemberBooking?: boolean;
};

export type SeatRow = {
    rowId: string;
    seats: number;
    offset?: number;
    rowLabel?: string;
};

export type SeatSection = {
  sectionName: string;
  price: number;
  rows: SeatRow[];
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
  reservedSeats?: string[];
};

export type Attendee = {
  seatId: string;
  price: number;
  attendeeName: string;
  couponCode?: string;
  isMember: boolean;
  couponVerified: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  attendees: Attendee[];
  total: number;
  bookingDate: string;
};


export type Member = {
    id: string;
    couponCode: string;
    name: string;
    email: string;
    phone: string;
    doa: string; // Date of Association
}
