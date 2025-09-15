import type { Event } from "./types";

const generateSeatingChart = (rows: number, seatsPerRow: number) => {
  const seats = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < seatsPerRow; j++) {
      const rowLabel = String.fromCharCode(65 + i);
      const seatNumber = j + 1;
      seats.push({
        id: `${rowLabel}${seatNumber}`,
        isAvailable: Math.random() > 0.2, // 80% chance of being available
      });
    }
  }
  return { rows, seatsPerRow, seats };
};


export const events: Event[] = [
  {
    id: "1",
    name: "Starlight Symphony Orchestra",
    description: "An unforgettable night of classical music under the stars. The Starlight Symphony Orchestra performs timeless masterpieces by Mozart, Beethoven, and Bach in a stunning open-air amphitheater.",
    category: "Music",
    date: "2024-09-15T20:00:00Z",
    location: "San Francisco, CA",
    venue: "The Grand Amphitheater",
    image: "https://picsum.photos/seed/1/600/400",
    showtimes: ["19:00", "21:30"],
    ticketTypes: [
      { type: "Standard", price: 75 },
      { type: "VIP", price: 150 },
    ],
    seatingChart: generateSeatingChart(10, 20),
  },
  {
    id: "2",
    name: "Titans vs. Giants - Championship Final",
    description: "The ultimate showdown! Watch the Titans and the Giants battle it out for the championship title in a high-stakes game that will keep you on the edge of your seat.",
    category: "Sports",
    date: "2024-10-05T18:00:00Z",
    location: "New York, NY",
    venue: "Metropolis Stadium",
    image: "https://picsum.photos/seed/2/600/400",
    showtimes: ["18:00"],
    ticketTypes: [
      { type: "Standard", price: 120 },
      { type: "Balcony", price: 80 },
      { type: "VIP", price: 300 },
    ],
    seatingChart: generateSeatingChart(20, 30),
  },
  {
    id: "3",
    name: "Modern Art & Abstract Forms",
    description: "Explore a curated collection of groundbreaking works from the most influential abstract artists of the 21st century. A journey through color, shape, and emotion.",
    category: "Art",
    date: "2024-09-20T10:00:00Z",
    location: "Chicago, IL",
    venue: "The Vanguard Gallery",
    image: "https://picsum.photos/seed/3/600/400",
    showtimes: ["10:00 - 18:00 (All Day)"],
    ticketTypes: [{ type: "Standard", price: 25 }],
  },
  {
    id: "4",
    name: "The Phantom of the Opera",
    description: "Experience the legendary musical by Andrew Lloyd Webber. A tale of love, obsession, and music in the heart of the Paris Opera House. A timeless classic brought to life on stage.",
    category: "Theater",
    date: "2024-11-01T19:30:00Z",
    location: "London, UK",
    venue: "Her Majesty's Theatre",
    image: "https://picsum.photos/seed/4/600/400",
    showtimes: ["14:30", "19:30"],
    ticketTypes: [
      { type: "Standard", price: 90 },
      { type: "Balcony", price: 60 },
      { type: "VIP", price: 200 },
    ],
    seatingChart: generateSeatingChart(15, 25),
  },
  {
    id: "5",
    name: "Indie Rock Fest 2024",
    description: "A two-day festival featuring the hottest indie rock bands from around the world. Don't miss this celebration of music, culture, and community.",
    category: "Music",
    date: "2024-08-25T14:00:00Z",
    location: "Austin, TX",
    venue: "Zilker Park",
    image: "https://picsum.photos/seed/5/600/400",
    showtimes: ["14:00 (Day 1)", "14:00 (Day 2)"],
    ticketTypes: [
      { type: "Standard", price: 85 },
      { type: "VIP", price: 250 },
    ],
  },
  {
    id: "6",
    name: "Sculpture Garden Tour",
    description: "A guided tour through the serene and beautiful sculpture garden, showcasing magnificent works by renowned sculptors. An oasis of art and nature in the city.",
    category: "Art",
    date: "2024-09-12T11:00:00Z",
    location: "Los Angeles, CA",
    venue: "Elysian Fields Sculpture Park",
    image: "https://picsum.photos/seed/6/600/400",
    showtimes: ["11:00", "14:00"],
    ticketTypes: [{ type: "Standard", price: 20 }],
  },
    {
    id: "7",
    name: "Warriors vs. Lakers",
    description: "A classic rivalry renewed. Feel the electric atmosphere as the Warriors take on the Lakers in a game that promises intense action and drama.",
    category: "Sports",
    date: "2024-11-10T19:00:00Z",
    location: "San Francisco, CA",
    venue: "Chase Center",
    image: "https://picsum.photos/seed/7/600/400",
    showtimes: ["19:00"],
    ticketTypes: [
        { type: "Standard", price: 150 },
        { type: "Balcony", price: 95 },
        { type: "VIP", price: 400 },
    ],
    seatingChart: generateSeatingChart(18, 28),
    },
    {
    id: "8",
    name: "Hamlet - A Modern Retelling",
    description: "Shakespeare's masterpiece is reimagined for the 21st century. A visceral and compelling production that explores themes of revenge, madness, and mortality.",
    category: "Theater",
    date: "2024-10-18T20:00:00Z",
    location: "New York, NY",
    venue: "The Vanguard Theater",
    image: "https://picsum.photos/seed/8/600/400",
    showtimes: ["20:00"],
    ticketTypes: [
        { type: "Standard", price: 80 },
        { type: "VIP", price: 160 },
    ],
    seatingChart: generateSeatingChart(12, 22),
  }
];
