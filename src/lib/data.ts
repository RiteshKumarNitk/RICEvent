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

export const events: Event[] = [
  {
    id: "1",
    name: "Jawan (Hindi)",
    description: "A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in society.",
    category: "Theater",
    date: "2024-09-15T10:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Cinepolis, World Trade Park",
    image: "https://picsum.photos/seed/movie1/600/400",
    showtimes: ["10:00 AM", "01:30 PM", "05:00 PM", "09:30 PM"],
    ticketTypes: [
      { type: "Standard", price: 260 },
      { type: "VIP", price: 280 },
    ],
    seatingChart: generateCinemaSeatingChart(),
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
    showtimes: ["18:30", "20:30"],
    ticketTypes: [
      { type: "Standard", price: 50 },
      { type: "VIP", price: 100 },
    ],
    seatingChart: generateCinemaSeatingChart(),
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
    seatingChart: generateCinemaSeatingChart(),
  },
  {
    id: "5",
    name: "Pro Kabaddi League: Jaipur Pink Panthers vs U Mumba",
    description: "Catch the thrilling action of the Pro Kabaddi League as home team Jaipur Pink Panthers take on rivals U Mumba.",
    category: "Sports",
    date: "2024-09-22T20:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Indoor Stadium, RIC",
    image: "https://picsum.photos/seed/5/600/400",
    showtimes: ["20:00"],
    ticketTypes: [
        { type: "Standard", price: 80 },
        { type: "VIP", price: 150 },
    ],
    seatingChart: generateCinemaSeatingChart(),
  },
  {
    id: "6",
    name: "Contemporary Art Exhibition: 'Colors of Tomorrow'",
    description: "Explore a stunning collection of contemporary art from emerging Indian artists. The exhibition focuses on themes of technology and nature.",
    category: "Art",
    date: "2024-10-10T11:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Art Gallery, RIC",
    image: "https://picsum.photos/seed/6/600/400",
    showtimes: ["11:00", "14:00", "17:00"],
    ticketTypes: [{ type: "Standard", price: 0 }],
    seatingChart: generateCinemaSeatingChart(),
  },
  {
    id: "7",
    name: "Sufi Music Night with The Raghu Dixit Project",
    description: "Get lost in the soulful and energetic performance of The Raghu Dixit Project. An evening of sufi-rock fusion that you won't forget.",
    category: "Music",
    date: "2024-11-15T19:30:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Open Air Theatre, RIC",
    image: "https://picsum.photos/seed/7/600/400",
    showtimes: ["19:30"],
    ticketTypes: [
      { type: "Standard", price: 75 },
    ],
  },
  {
    id: "8",
    name: "Theatre Play: 'The Post Office' by Rabindranath Tagore",
    description: "A heart-touching play by the legendary Rabindranath Tagore, performed by a renowned theatre group from Kolkata.",
    category: "Theater",
    date: "2024-10-25T18:00:00Z",
    location: "Jaipur, Rajasthan",
    venue: "Mini Auditorium, RIC",
    image: "https://picsum.photos/seed/8/600/400",
    showtimes: ["18:00", "20:30"],
    ticketTypes: [
      { type: "Standard", price: 30 },
    ],
    seatingChart: generateCinemaSeatingChart(),
  },
];
