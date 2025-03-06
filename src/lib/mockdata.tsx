import { Genre, Movie } from "@prisma/client";

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
const commonPosterUrls = [
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/Arcane%20(Top%20Rated).jpg",
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/Godzilla%20x%20Kong.jpg",
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/Nevertheless%20(Recommend).png",
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/One%20Piece%20Live%20Action%20(Recommend).jpg",
];

const movies: {
  title: string;
  description: string;
  genre: Genre[];
}[] = [
  {
    title: "Inception",
    description:
      "A skilled thief enters the dreams of others to steal secrets and must pull off an impossible heist.",
    genre: ["SCI_FI", "THRILLER", "ACTION"],
  },
  {
    title: "The Dark Knight",
    description:
      "Batman faces his greatest challenge when the Joker unleashes chaos on Gotham City.",
    genre: ["ACTION", "CRIME", "THRILLER"],
  },
  {
    title: "Interstellar",
    description:
      "A group of astronauts travels through a wormhole to find a new home for humanity.",
    genre: ["SCI_FI", "ADVENTURE", "DRAMA"],
  },
  {
    title: "Parasite",
    description:
      "A poor family schemes to infiltrate a wealthy household, leading to unexpected consequences.",
    genre: ["THRILLER", "DRAMA"],
  },
  {
    title: "The Shawshank Redemption",
    description:
      "A banker is sentenced to life in prison and forms an unlikely friendship while planning his escape.",
    genre: ["DRAMA", "CRIME"],
  },
  {
    title: "Avengers: Endgame",
    description:
      "The Avengers assemble one final time to undo Thanos' devastating snap and restore the universe.",
    genre: ["ACTION", "SCI_FI", "ADVENTURE"],
  },
  {
    title: "Spirited Away",
    description:
      "A young girl enters a mystical world ruled by spirits and must find a way to free her parents.",
    genre: ["ANIMATION", "FANTASY", "ADVENTURE"],
  },
  {
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    genre: ["CRIME", "DRAMA"],
  },
  {
    title: "Pulp Fiction",
    description:
      "A nonlinear tale of crime, redemption, and dark humor in the underworld of Los Angeles.",
    genre: ["CRIME", "THRILLER"],
  },
  {
    title: "Titanic",
    description:
      "A young couple from different social classes fall in love aboard the ill-fated Titanic.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "The Matrix",
    description:
      "A hacker discovers that reality is a simulation and joins a rebellion against its controllers.",
    genre: ["SCI_FI", "ACTION"],
  },
  {
    title: "The Lion King",
    description:
      "A young lion prince flees his kingdom only to learn the true meaning of responsibility.",
    genre: ["ANIMATION", "FAMILY", "ADVENTURE"],
  },
  {
    title: "The Silence of the Lambs",
    description:
      "A young FBI agent seeks the help of a manipulative killer to catch a serial murderer.",
    genre: ["THRILLER", "CRIME"],
  },
  {
    title: "Gladiator",
    description:
      "A betrayed Roman general seeks vengeance against the corrupt emperor who murdered his family.",
    genre: ["ACTION", "DRAMA"],
  },
  {
    title: "Forrest Gump",
    description:
      "A kind-hearted man unintentionally influences several historical events throughout his life.",
    genre: ["DRAMA", "ROMANCE"],
  },
  {
    title: "Joker",
    description:
      "A mentally troubled comedian turns to crime and starts a revolution in Gotham City.",
    genre: ["THRILLER", "DRAMA"],
  },
  {
    title: "Toy Story",
    description:
      "A cowboy doll feels threatened when a new space ranger toy enters his owner's life.",
    genre: ["ANIMATION", "FAMILY", "COMEDY"],
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description:
      "A hobbit embarks on a dangerous quest to destroy a powerful ring.",
    genre: ["FANTASY", "ADVENTURE", "ACTION"],
  },
  {
    title: "Schindler’s List",
    description:
      "A businessman saves the lives of thousands of Jewish refugees during World War II.",
    genre: ["HISTORY", "DRAMA"],
  },
  {
    title: "Django Unchained",
    description:
      "A freed slave teams up with a bounty hunter to rescue his wife from a brutal plantation owner.",
    genre: ["WESTERN", "ACTION", "DRAMA"],
  },
  {
    title: "Whiplash",
    description:
      "A young drummer enrolls in a competitive music conservatory and faces intense training.",
    genre: ["DRAMA", "MUSIC"],
  },
  {
    title: "A Quiet Place",
    description:
      "A family must live in silence to avoid creatures that hunt by sound.",
    genre: ["HORROR", "THRILLER"],
  },
  {
    title: "La La Land",
    description:
      "A jazz musician and an aspiring actress fall in love but struggle to balance their dreams.",
    genre: ["ROMANCE", "MUSIC", "DRAMA"],
  },
  {
    title: "Get Out",
    description:
      "A Black man visits his white girlfriend’s family estate and uncovers disturbing secrets.",
    genre: ["HORROR", "THRILLER"],
  },
  {
    title: "Mad Max: Fury Road",
    description:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.",
    genre: ["ACTION", "SCI_FI"],
  },
  {
    title: "Blade Runner 2049",
    description:
      "A new blade runner unearths a secret that could plunge society into chaos.",
    genre: ["SCI_FI", "THRILLER"],
  },
  {
    title: "The Revenant",
    description:
      "A frontiersman fights for survival and revenge after being left for dead.",
    genre: ["ADVENTURE", "DRAMA"],
  },
  {
    title: "The Prestige",
    description:
      "Two rival magicians battle for supremacy, pushing each other to deadly extremes.",
    genre: ["MYSTERY", "THRILLER"],
  },
  {
    title: "The Grand Budapest Hotel",
    description:
      "A concierge and his protégé are caught up in a mystery surrounding a valuable painting.",
    genre: ["COMEDY", "CRIME"],
  },
  {
    title: "The Wolf of Wall Street",
    description: "A stockbroker rises to wealth through fraud and corruption.",
    genre: ["COMEDY", "DRAMA"],
  },
  {
    title: "No Country for Old Men",
    description:
      "A hunter stumbles upon a drug deal gone wrong and is pursued by a relentless assassin.",
    genre: ["THRILLER", "CRIME"],
  },
  {
    title: "12 Angry Men",
    description:
      "A jury debates a murder case, revealing biases and challenging justice.",
    genre: ["DRAMA", "CRIME"],
  },
  {
    title: "Coco",
    description:
      "A young boy journeys to the Land of the Dead to uncover his family's history.",
    genre: ["ANIMATION", "MUSIC", "FAMILY"],
  },
  {
    title: "The Conjuring",
    description:
      "Paranormal investigators help a family experiencing a terrifying haunting.",
    genre: ["HORROR", "THRILLER"],
  },
  {
    title: "The Social Network",
    description:
      "The story of Facebook’s founding and the legal battles that followed.",
    genre: ["DRAMA", "ACTION"],
  },
  {
    title: "Shutter Island",
    description:
      "A U.S. Marshal investigates a psychiatric facility where nothing is as it seems.",
    genre: ["THRILLER", "MYSTERY"],
  },
  {
    title: "Oldboy",
    description:
      "A man is mysteriously imprisoned for 15 years and then suddenly released.",
    genre: ["THRILLER", "ACTION"],
  },
  {
    title: "Zootopia",
    description:
      "A rabbit police officer and a con artist fox work together to uncover a conspiracy.",
    genre: ["ANIMATION", "ADVENTURE", "COMEDY"],
  },
  {
    title: "Edge of Tomorrow",
    description:
      "A soldier relives the same battle against an alien invasion, learning from each death.",
    genre: ["SCI_FI", "ACTION"],
  },
  {
    title: "The Irishman",
    description:
      "A hitman recalls his involvement in the disappearance of Jimmy Hoffa.",
    genre: ["CRIME", "DRAMA"],
  },
  {
    title: "Dune",
    description:
      "A young nobleman must navigate political intrigue and war on a desert planet.",
    genre: ["SCI_FI", "ADVENTURE"],
  },
  {
    title: "John Wick",
    description:
      "A retired hitman seeks revenge against those who wronged him.",
    genre: ["ACTION", "THRILLER"],
  },
  {
    title: "Inside Out",
    description:
      "A young girl’s emotions struggle to guide her through a life-changing move.",
    genre: ["ANIMATION", "FAMILY"],
  },
];

export const data: Movie[] = Array.from({ length: movies.length }, (_, i) => ({
  title: movies[i].title,
  releaseYear: 2024,
  director: "John Doe",
  cast: ["Actor 1", "Actor 2"],
  duration: 120 + i, // in minutes
  language: ["English"],
  country: "USA",
  rating: 8.5,
  featured: i % 2 === 0, // Alternate featured status
  posterUrl: commonPosterUrls,
  trailerUrl: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"], // Mock trailer URL
  videoUrl: ["https://example.com/movie.mp4"], // Mock video URL
  createdAt: new Date(),
  description: movies[i].description,
  genre: movies[i].genre,
  updatedAt: new Date(),
}));
