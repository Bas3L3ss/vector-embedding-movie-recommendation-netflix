import { Genre, Movie } from "@prisma/client";

const commonPosterUrls = [
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/Arcane%20(Top%20Rated).jpg",
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/Godzilla%20x%20Kong.jpg",
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/Nevertheless%20(Recommend).png",
  "https://ucnyynmrpcridchyakug.supabase.co/storage/v1/object/public/posters/One%20Piece%20Live%20Action%20(Recommend).jpg",
];

export const genreTags: Record<Genre, string[]> = {
  ACTION: ["explosive", "high-energy", "combat", "fight scenes", "adrenaline"],
  ADVENTURE: ["journey", "epic", "quest", "exploration", "heroic"],
  ANIMATION: ["animated", "cartoon", "CGI", "family-friendly", "visual"],
  COMEDY: ["funny", "humor", "hilarious", "satire", "lighthearted"],
  CRIME: ["criminal", "mafia", "gangsters", "heist", "underworld"],
  DOCUMENTARY: [
    "real-life",
    "true story",
    "educational",
    "non-fiction",
    "informative",
  ],
  DRAMA: ["emotional", "character-driven", "intense", "heartfelt", "serious"],
  FAMILY: ["kids", "wholesome", "feel-good", "animated", "bonding"],
  FANTASY: ["magical", "mythical", "otherworldly", "supernatural", "legendary"],
  HISTORY: [
    "historical",
    "true events",
    "biographical",
    "period piece",
    "heritage",
  ],
  HORROR: ["scary", "terrifying", "haunted", "supernatural", "eerie"],
  MUSIC: ["musical", "concert", "melody", "performance", "rhythmic"],
  MYSTERY: ["detective", "whodunit", "clues", "investigation", "secrets"],
  ROMANCE: [
    "love story",
    "passionate",
    "heartwarming",
    "relationship",
    "chemistry",
  ],
  SCI_FI: ["futuristic", "technology", "space", "cyberpunk", "aliens"],
  THRILLER: ["suspenseful", "intense", "edge-of-seat", "twists", "danger"],
  WAR: ["battle", "military", "combat", "soldiers", "historical conflict"],
  INDIE: ["independent", "artistic", "low-budget", "creative", "unique"],
  WESTERN: ["cowboys", "gunslinger", "desert", "horseback", "old west"],
  PSYCHOLOGICAL: [
    "mind-bending",
    "introspective",
    "manipulation",
    "dark",
    "disturbing",
  ],
  HISTORICAL: [
    "authentic",
    "period drama",
    "historically accurate",
    "heritage",
    "biographical",
  ],
};

export const randomDirectors = [
  // Modern Hollywood
  "Christopher Nolan",
  "Quentin Tarantino",
  "Denis Villeneuve",
  "Martin Scorsese",
  "Greta Gerwig",
  "David Fincher",
  "Steven Spielberg",
  "James Cameron",
  "Ridley Scott",
  "Wes Anderson",

  // International Filmmakers
  "Bong Joon-ho", // Korean
  "Hayao Miyazaki", // Japanese (Animation)
  "Park Chan-wook", // Korean
  "Hirokazu Kore-eda", // Japanese
  "Akira Kurosawa", // Classic Japanese
  "Jean-Luc Godard", // French New Wave
  "Federico Fellini", // Italian Classic
  "Pedro Almodóvar", // Spanish
  "Guillermo del Toro", // Mexican

  // Classic Hollywood
  "Alfred Hitchcock",
  "Stanley Kubrick",
  "Francis Ford Coppola",
  "Orson Welles",
  "Sergio Leone",
  "Billy Wilder",
  "Frank Capra",
];

export const randomCast = [
  // Popular Hollywood Actors
  ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
  ["Robert Downey Jr.", "Scarlett Johansson"],
  ["Brad Pitt", "Edward Norton"],
  ["Natalie Portman", "Joaquin Phoenix"],
  ["Tom Hardy", "Cillian Murphy"],
  ["Margot Robbie", "Ryan Gosling"],
  ["Florence Pugh", "Timothée Chalamet"],
  ["Denzel Washington", "Viola Davis"],

  // International Stars
  ["Song Kang-ho", "Tilda Swinton"], // Korean + Indie
  ["Rinko Kikuchi", "Hiroyuki Sanada"], // Japanese
  ["Penélope Cruz", "Antonio Banderas"], // Spanish
  ["Mads Mikkelsen", "Nikolaj Coster-Waldau"], // Danish
  ["Jean Dujardin", "Marion Cotillard"], // French
  ["Tony Leung", "Zhang Ziyi"], // Chinese

  // Classic Actors
  ["Marlon Brando", "Al Pacino"],
  ["Humphrey Bogart", "Ingrid Bergman"],
  ["James Stewart", "Grace Kelly"],
  ["Audrey Hepburn", "Cary Grant"],
  ["Clint Eastwood", "Eli Wallach"],
];

export const languages = [
  ["English"],
  ["English", "Japanese"],
  ["French", "English"],
  ["Spanish"],
  ["Korean"],
  ["Hindi", "English"],
  ["Mandarin"],
  ["German", "English"],
  ["Italian"],
  ["Portuguese"],
];

const movies: {
  title: string;
  description: string;
  genre: Genre[];
}[] = [
  {
    title: "Your Name (Kimi no Na wa)",
    description:
      "Two teenagers, a city boy and a rural girl, mysteriously swap bodies across time and space. As they experience each other's lives, they develop an unbreakable bond, but a looming catastrophe threatens to separate them forever. In a race against fate, they must find each other before it's too late.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "The Notebook",
    description:
      "A young couple from different social backgrounds falls deeply in love during the summer of the 1940s. Torn apart by class differences and war, their love story is tested by time, memory, and fate. Years later, an elderly man reads their story to a woman with fading recollections, revealing the true power of enduring love.",
    genre: ["ROMANCE", "DRAMA"],
  },

  {
    title: "Call Me by Your Name",
    description:
      "During a summer in 1980s Italy, a 17-year-old boy falls for an older graduate student who visits his family's villa. As they share stolen moments under the Mediterranean sun, their deep connection blossoms into a transformative romance. A story of first love, heartbreak, and the memories that linger forever.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Before Sunrise",
    description:
      "A chance encounter on a train leads to an unforgettable night in Vienna between two strangers. Knowing they have only a few hours together, they explore the city, exchanging thoughts on love, life, and destiny. As dawn approaches, they must decide if their connection is fleeting or meant to last.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Titanic",
    description:
      "A wealthy young woman and a struggling artist fall in love aboard the doomed Titanic. As their love defies social barriers, they face the ultimate test when the ship meets its tragic fate. A sweeping romance of passion, sacrifice, and the power of true love.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "A Moment to Remember (Korean)",
    description:
      "A young woman and a devoted husband build a beautiful life together, only to have it shattered by early-onset Alzheimer's. As her memories fade, he fights to keep their love alive, cherishing every fleeting moment. A heartbreaking yet inspiring story of unconditional love and devotion.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "My Sassy Girl (Korean)",
    description:
      "A kind-hearted man crosses paths with an unpredictable and strong-willed woman, leading to a whirlwind romance. As they navigate her eccentricities and troubled past, he discovers the depth of her pain and love. A touching mix of humor, fate, and heartfelt emotions.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Winter Sonata (Korean)",
    description:
      "A young woman falls for a mysterious man who reminds her of a long-lost childhood love. As they uncover secrets from the past, their romance is tested by fate, memory loss, and heartbreak. A timeless K-drama that redefined love stories in Korean entertainment.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Dilwale Dulhania Le Jayenge (Bollywood)",
    description:
      "Two young people meet and fall in love during a European trip, but family traditions threaten to keep them apart. As he travels to India to win over her strict family, he faces obstacles that test his love and determination. An iconic Bollywood romance that celebrates love, culture, and destiny.",
    genre: ["ROMANCE", "DRAMA", "BOLLYWOOD"],
  },
  {
    title: "Kabir Singh (Bollywood)",
    description:
      "A brilliant but self-destructive surgeon spirals into alcohol and rage when the love of his life is forced to marry someone else. As he loses himself in pain and obsession, he must find redemption before it's too late. A gripping tale of passion, heartbreak, and self-destruction.",
    genre: ["ROMANCE", "DRAMA", "BOLLYWOOD"],
  },
  {
    title: "Veer-Zaara (Bollywood)",
    description:
      "An Indian Air Force pilot and a Pakistani woman fall deeply in love, but political tensions and family honor tear them apart. Imprisoned for decades, he silently waits for justice, while she keeps his love alive in her heart. A saga of love, sacrifice, and the unbreakable bonds that transcend borders.",
    genre: ["ROMANCE", "DRAMA", "BOLLYWOOD"],
  },
  {
    title: "The Fault in Our Stars",
    description:
      "Two teenagers, both battling terminal illness, meet in a cancer support group and embark on a journey of love and discovery. As they navigate life’s fleeting moments, they find beauty in their shared struggles. A heartbreaking yet uplifting story of love, loss, and the impact of a single lifetime.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Hometown Cha-Cha-Cha (Korean)",
    description:
      "A perfectionist dentist moves to a small coastal town, where she clashes with a warm-hearted and free-spirited handyman. As they grow closer, she learns to embrace life’s simple joys, while he confronts his hidden past. A charming and heartwarming romance set against breathtaking seaside scenery.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Barfi! (Bollywood)",
    description:
      "A charming mute and deaf man forms an extraordinary bond with a woman with autism. Their love story defies norms, challenges society, and teaches the true meaning of happiness. A visually stunning and emotionally moving tale of love in its purest form.",
    genre: ["ROMANCE", "DRAMA", "BOLLYWOOD"],
  },
  {
    title: "Crash Landing on You (Korean)",
    description:
      "A South Korean heiress accidentally lands in North Korea during a paragliding accident and is rescued by a stoic North Korean soldier. As they fall in love in the most impossible circumstances, they risk everything to be together. A thrilling and emotional tale of love, fate, and forbidden romance.",
    genre: ["ROMANCE", "DRAMA"],
  },
  {
    title: "Aashiqui 2 (Bollywood)",
    description:
      "A fading rockstar discovers a talented singer and helps her rise to fame, but his own demons threaten their love. As she soars to success, he struggles with alcoholism and insecurity, leading to a tragic yet unforgettable romance. A soulful love story that lingers in the heart long after it ends.",
    genre: ["ROMANCE", "DRAMA", "BOLLYWOOD"],
  },
  {
    title: "Train to Busan (Korean)",
    description:
      "A workaholic father and his young daughter board a train to Busan, only to find themselves trapped in a zombie outbreak. Amidst the chaos, unexpected bonds form, sacrifices are made, and love prevails even in the darkest times. A gripping mix of horror, action, and emotional storytelling.",
    genre: ["DRAMA", "THRILLER"],
  },
  {
    title: "Jab We Met (Bollywood)",
    description:
      "A depressed businessman crosses paths with a lively and talkative woman on a train journey, changing both of their lives forever. As she teaches him to embrace life, he helps her find the courage to follow her heart. A heartwarming and fun-filled love story that redefines fate and second chances.",
    genre: ["ROMANCE", "DRAMA", "BOLLYWOOD"],
  },
];

export const data: Movie[] = Array.from({ length: movies.length }, (_, i) => ({
  title: movies[i].title,
  description: movies[i].description,
  genre: movies[i].genre,
  director: randomDirectors[i % randomDirectors.length], // Rotate through directors
  language: languages[i % languages.length], // Rotate through different languages
  releaseYear: 1980 + Math.floor(Math.random() * 45), // Random year from 1980-2024
  cast: randomCast[i % randomCast.length], // Rotate cast
  duration: 90 + Math.floor(Math.random() * 61), // Duration between 90-150 mins
  country: i % 4 === 0 ? "Japan" : "USA", // Some foreign films
  rating: 7 + Math.random() * 2, // Rating between 7.0-9.0
  featured: i % 2 === 0,
  posterUrl: commonPosterUrls,
  trailerUrl: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  videoUrl: ["https://example.com/movie.mp4"],
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: movies[i].genre.flatMap((g) => genreTags[g] || []),
}));
