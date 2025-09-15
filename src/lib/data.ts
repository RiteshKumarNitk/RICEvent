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
    name: "Seminar on Artificial Intelligence",
    description: "Join leading experts in a discussion about the future of AI and its impact on society. A must-attend for tech enthusiasts and professionals.",
    category: "Seminar",
    date: "2024-09-15T10:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Main Auditorium, RIC",
    image: "https://picsum.photos/seed/1/600/400",
    showtimes: ["10:00"],
    ticketTypes: [
      { type: "Standard", price: 0 },
    ],
    seatingChart: generateSeatingChart(10, 20),
  },
  {
    id: "2",
    name: "Rajasthani Folk Music Concert",
    description: "Experience the vibrant and soulful melodies of Rajasthan. A mesmerizing evening featuring renowned folk artists.",
    category: "Cultural",
    date: "2024-10-05T18:30:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Open Air Theatre, RIC",
    image: "https://picsum.photos/seed/2/600/400",
    showtimes: ["18:30"],
    ticketTypes: [
      { type: "Standard", price: 50 },
      { type: "VIP", price: 100 },
    ],
    seatingChart: generateSeatingChart(15, 20),
  },
  {
    id: "3",
    name: "A Talk on Sustainable Architecture",
    description: "Esteemed architect Anjali Sharma discusses the principles and practices of green building design for a sustainable future.",
    category: "Talk",
    date: "2024-09-20T16:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Conference Hall 1, RIC",
    image: "https://picsum.photos/seed/3/600/400",
    showtimes: ["16:00"],
    ticketTypes: [{ type: "Standard", price: 0 }],
  },
  {
    id: "4",
    name: "Classical Dance Performance: Kathak",
    description: "A breathtaking performance of Kathak, one of the eight major forms of Indian classical dance, by the Jaipur Gharana.",
    category: "Cultural",
    date: "2024-11-01T19:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Main Auditorium, RIC",
    image: "https://picsum.photos/seed/4/600/400",
    showtimes: ["19:00"],
    ticketTypes: [
      { type: "Standard", price: 40 },
      { type: "Balcony", price: 25 },
    ],
    seatingChart: generateSeatingChart(12, 18),
  },
];
