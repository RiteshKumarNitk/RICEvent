import type { Event, SeatingChartData } from "./types";

const generateSeatingChart = (): SeatingChartData => {
  const createRow = (seatCount: number, startNum: number, isAvailableProb: number, isReversed = false): (any | null)[] => {
    const row = Array.from({ length: seatCount }, (_, i) => {
      const seatNum = startNum + (isReversed ? (seatCount - 1 - i) : i);
      return {
        id: `S${seatNum}`,
        number: `${seatNum}`,
        isAvailable: Math.random() < isAvailableProb,
      }
    });
    return row;
  }
  return {
    sections: [
      {
        sectionName: 'Premium',
        ticketType: 'VIP',
        price: 300,
        rows: [
          ...Array(8).fill(0).map((_, rowIndex) => [
            ...createRow(2, 1, 0.9, true), null, null, ...createRow(8, 7, 0.7, true), null, null, ...createRow(6, 15, 0.8, true)
          ].reverse()),
        ]
      },
      {
        sectionName: 'Executive',
        ticketType: 'Standard',
        price: 280,
        rows: [
            ...Array(3).fill(0).map((_, rowIndex) => [
            ...createRow(9, 1, 0.85), null, null, ...createRow(6, 12, 0.8)
          ]),
        ]
      },
      {
        sectionName: 'Normal',
        ticketType: 'Balcony',
        price: 260,
        rows: [
          [...createRow(3, 1, 0.9, true), null, ...createRow(3, 7, 0.9, true), null, ...createRow(6, 10, 0.9, true)]
        ]
      },
    ]
  };
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
    showtimes: ["10:00", "13:00", "16:00"],
    ticketTypes: [
      { type: "Standard", price: 0 },
    ],
    seatingChart: generateSeatingChart(),
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
    seatingChart: generateSeatingChart(),
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
    seatingChart: generateSeatingChart(),
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
    seatingChart: generateSeatingChart(),
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
    seatingChart: generateSeatingChart(),
  },
];
