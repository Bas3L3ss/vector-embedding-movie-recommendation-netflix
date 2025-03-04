import { Movie } from "@prisma/client";

export const MockFilms: Movie[] = [
  {
    id: 1,
    title: "The Last Stand",
    description:
      "A retired sheriff defends his town from an escaped cartel leader.",
    releaseYear: 2022,
    genre: ["ACTION", "THRILLER"],
    director: "John Doe",
    cast: ["Jane Smith", "Robert Johnson", "Emily Davis"],
    duration: 115,
    language: ["English"],
    country: "USA",
    rating: 7.3,
    featured: true,
    posterUrl: [
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photo/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
    ],
    trailerUrl: ["https://youtube.com/trailer1"],
    videoUrl: ["https://example.com/movie1.mp4"],
    embedding: [2],
    createdAt: new Date("2025-01-15T12:00:00Z"),
    updatedAt: new Date("2025-02-10T14:30:00Z"),
  },
  {
    id: 2,
    title: "Dreams of Tomorrow",
    description: "A sci-fi journey through time and alternate realities.",
    releaseYear: 2023,
    genre: ["SCI_FI", "DRAMA"],
    director: "Alice Johnson",
    cast: ["Michael Brown", "Sarah White", "David Lee"],
    duration: 132,
    language: ["English", "French"],
    country: "Canada",
    rating: 8.1,
    featured: false,
    posterUrl: [
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
    ],
    trailerUrl: ["https://youtube.com/trailer2"],
    videoUrl: ["https://example.com/movie2.mp4"],
    embedding: null,
    createdAt: new Date("2025-01-20T10:45:00Z"),
    updatedAt: new Date("2025-02-12T09:20:00Z"),
  },
  {
    id: 3,
    title: "Lost in Harmony",
    description: "A heartfelt musical drama about a rising artist.",
    releaseYear: 2021,
    genre: ["MUSIC", "ROMANCE"],
    director: "Emma Watson",
    cast: ["Chris Evans", "Natalie Portman"],
    duration: 97,
    language: ["English", "Spanish"],
    country: "UK",
    rating: 7.8,
    featured: true,
    posterUrl: [
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
    ],
    trailerUrl: ["https://youtube.com/trailer3"],
    videoUrl: ["https://example.com/movie3.mp4"],
    embedding: null,
    createdAt: new Date("2024-11-30T18:00:00Z"),
    updatedAt: new Date("2025-01-15T13:00:00Z"),
  },
  {
    id: 14,
    title: "Shadows of the Past",
    description:
      "A mystery thriller following an investigator’s pursuit of a lost artifact.",
    releaseYear: 2020,
    genre: ["MYSTERY", "THRILLER"],
    director: "Samuel Green",
    cast: ["Morgan Freeman", "Scarlett Johansson"],
    duration: 124,
    language: ["English"],
    country: "Australia",
    rating: 8.5,
    featured: false,
    posterUrl: [
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
      "https://picsum.photos/600/400",
    ],
    trailerUrl: ["https://youtube.com/trailer4"],
    videoUrl: ["https://example.com/movie4.mp4"],
    embedding: null,
    createdAt: new Date("2024-10-05T16:20:00Z"),
    updatedAt: new Date("2025-02-01T08:15:00Z"),
  },
];
