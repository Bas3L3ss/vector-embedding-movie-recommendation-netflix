"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Star,
  Play,
  Info,
  ChevronRight,
  Bell,
  Plus,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

type Show = {
  id: number;
  title: string;
  poster: string;
  banner?: string;
  rating: number;
  year: number;
  contentRating: string;
  genres: string[];
  description: string;
  seasons?: number;
  episodes?: number;
  cast?: { name: string; role: string; photo: string }[];
  reviews?: { user: string; rating: number; comment: string }[];
  seasonData?: {
    number: number;
    episodes: {
      number: number;
      title: string;
      duration: string;
      description: string;
    }[];
  }[];
};

// Sample data
const shows: Show[] = [
  {
    id: 1,
    title: "Cosmic Frontiers",
    poster: "/placeholder.svg?height=400&width=300",
    banner: "/placeholder.svg?height=1080&width=1920",
    rating: 9.2,
    year: 2023,
    contentRating: "TV-MA",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    description:
      "A team of explorers ventures into the unknown reaches of space, discovering wonders and terrors beyond imagination while confronting their own demons.",
    seasons: 2,
    episodes: 16,
    cast: [
      {
        name: "Alex Rivera",
        role: "Captain Sarah Chen",
        photo: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Michael Johnson",
        role: "Dr. James Wilson",
        photo: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Sophia Lee",
        role: "Engineer Zoe Martinez",
        photo: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "David Kim",
        role: "Security Chief Marcus Taylor",
        photo: "/placeholder.svg?height=100&width=100",
      },
    ],
    reviews: [
      {
        user: "spaceExplorer",
        rating: 5,
        comment: "Absolutely mind-blowing visuals and storytelling!",
      },
      {
        user: "sciFiFan42",
        rating: 4,
        comment:
          "Great character development, though some episodes drag a bit.",
      },
      {
        user: "tvCritic",
        rating: 5,
        comment: "One of the best sci-fi shows of the decade.",
      },
    ],
    seasonData: [
      {
        number: 1,
        episodes: [
          {
            number: 1,
            title: "Pilot",
            duration: "45 min",
            description:
              "The journey begins as our protagonists discover a mysterious artifact.",
          },
          {
            number: 2,
            title: "The Discovery",
            duration: "42 min",
            description:
              "The team delves deeper into the mystery, uncovering unexpected clues.",
          },
          {
            number: 3,
            title: "Revelations",
            duration: "47 min",
            description:
              "Shocking truths are revealed as the protagonists face their first major obstacle.",
          },
        ],
      },
      {
        number: 2,
        episodes: [
          {
            number: 1,
            title: "New Beginnings",
            duration: "48 min",
            description:
              "One year later, our heroes regroup to face a new threat.",
          },
          {
            number: 2,
            title: "Shadows of the Past",
            duration: "45 min",
            description:
              "A familiar face returns, bringing secrets that could unravel the team's mission.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Midnight Chronicles",
    poster: "/placeholder.svg?height=400&width=300",
    rating: 8.7,
    year: 2022,
    contentRating: "TV-14",
    genres: ["Mystery", "Thriller", "Supernatural"],
    description:
      "In a small town where nothing is as it seems, detective Anna Morgan investigates a series of strange disappearances linked to ancient folklore.",
  },
  {
    id: 3,
    title: "Kingdom's Edge",
    poster: "/placeholder.svg?height=400&width=300",
    rating: 9.5,
    year: 2021,
    contentRating: "TV-MA",
    genres: ["Fantasy", "Action", "Drama"],
    description:
      "In a medieval realm torn by war, political intrigue, and magical forces, unlikely heroes rise to shape the fate of kingdoms.",
  },
  {
    id: 4,
    title: "Urban Legends",
    poster: "/placeholder.svg?height=400&width=300",
    rating: 8.3,
    year: 2023,
    contentRating: "TV-MA",
    genres: ["Horror", "Anthology", "Mystery"],
    description:
      "Each episode brings to life a different urban legend, blurring the lines between folklore and reality in terrifying ways.",
  },
  {
    id: 5,
    title: "The Last Stand",
    poster: "/placeholder.svg?height=400&width=300",
    rating: 8.9,
    year: 2022,
    contentRating: "TV-MA",
    genres: ["Post-Apocalyptic", "Drama", "Action"],
    description:
      "In a world devastated by a global catastrophe, survivors band together to rebuild society and face new threats to humanity.",
  },
  {
    id: 6,
    title: "Medical Frontline",
    poster: "/placeholder.svg?height=400&width=300",
    rating: 8.6,
    year: 2021,
    contentRating: "TV-14",
    genres: ["Medical", "Drama"],
    description:
      "Follow the intense lives of doctors and nurses at a prestigious hospital as they navigate professional challenges and personal dramas.",
  },
];

export default function NetflixApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredShow, setFeaturedShow] = useState<Show | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Set a random featured show on load
    setFeaturedShow(shows[0]);

    // Add scroll listener for navbar background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredShows = shows.filter(
    (show) =>
      show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.genres.some((genre) =>
        genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {!searchQuery && featuredShow && (
        <div className="relative w-full h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={
                featuredShow.banner || "/placeholder.svg?height=1080&width=1920"
              }
              alt={featuredShow.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
          </div>
          <div className="absolute bottom-[20%] left-0 p-6 md:p-16 w-full max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              {featuredShow.title}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[#46d369] font-semibold">
                {Math.floor(featuredShow.rating * 10)}% Match
              </span>
              <span>{featuredShow.year}</span>
              <span className="border border-gray-600 px-2 py-0.5 text-sm">
                {featuredShow.contentRating}
              </span>
              <span>{featuredShow.seasons} Seasons</span>
            </div>
            <p className="text-lg mb-6 line-clamp-3">
              {featuredShow.description}
            </p>
            <div className="flex gap-3">
              <Button
                size="lg"
                className="bg-white hover:bg-white/90 text-black gap-2 px-6 rounded-md"
              >
                <Play className="w-5 h-5 fill-black" /> Play
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-gray-500/40 hover:bg-gray-500/60 text-white border-0 gap-2 px-6 rounded-md"
              >
                <Info className="w-5 h-5" /> More Info
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`container mx-auto px-4 ${searchQuery ? "pt-24" : "pt-8"}`}
      >
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-xl font-medium mb-4">
              Results for &quot;{searchQuery}&quot;
            </h2>
            {filteredShows.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No shows found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}

        {/* Content Rows */}
        {!searchQuery && (
          <>
            <section className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">Popular on Netflix</h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center">
                  Explore All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {shows.slice(0, 6).map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">Trending Now</h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center">
                  Explore All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {shows
                  .slice(2, 6)
                  .concat(shows.slice(0, 2))
                  .map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">Sci-Fi & Fantasy</h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center">
                  Explore All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {shows
                  .filter((show) =>
                    show.genres.some((genre) =>
                      ["Sci-Fi", "Fantasy"].includes(genre)
                    )
                  )
                  .map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">
                  Continue Watching for You
                </h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center">
                  Explore All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {shows.slice(0, 4).map((show, index) => (
                  <Link
                    key={show.id}
                    className="relative cursor-pointer group"
                    href={`/tv-shows/${show.id}`}
                  >
                    <div className="aspect-video rounded overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=180&width=320&text=${show.title}`}
                        alt={show.title}
                        width={320}
                        height={180}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 fill-white" />
                    </div>
                    <div className="mt-1">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full hover:bg-white/20"
                          >
                            <Play className="h-4 w-4 fill-white" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full hover:bg-white/20"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-white/20"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                        <span>
                          S{index + 1} E{Math.floor(Math.random() * 5) + 1}
                        </span>
                        <span>
                          {Math.floor(Math.random() * 30) + 10} min left
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E50914] h-full rounded-full"
                        style={{
                          width: `${Math.floor(Math.random() * 80) + 10}%`,
                        }}
                      ></div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">New Releases</h2>
                <button className="text-sm text-gray-400 hover:text-white flex items-center">
                  Explore All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {shows
                  .filter((show) => show.year >= 2023)
                  .map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-gray-500">
        <div className="flex gap-4 mb-4">
          <a href="#" className="hover:text-gray-300">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a href="#" className="hover:text-gray-300">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="hover:text-gray-300">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-6">
          <a href="#" className="hover:underline">
            Audio Description
          </a>
          <a href="#" className="hover:underline">
            Help Center
          </a>
          <a href="#" className="hover:underline">
            Gift Cards
          </a>
          <a href="#" className="hover:underline">
            Media Center
          </a>
          <a href="#" className="hover:underline">
            Investor Relations
          </a>
          <a href="#" className="hover:underline">
            Jobs
          </a>
          <a href="#" className="hover:underline">
            Terms of Use
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Legal Notices
          </a>
          <a href="#" className="hover:underline">
            Cookie Preferences
          </a>
          <a href="#" className="hover:underline">
            Corporate Information
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>
        <button className="border border-gray-600 px-2 py-1 text-xs mb-4">
          Service Code
        </button>
        <p className="text-xs">
          © 1997-{new Date().getFullYear()} Netflix, Inc.
        </p>
      </footer>
    </div>
  );
}

function ShowCard({ show }: { show: Show }) {
  return (
    <Link
      className="relative cursor-pointer group"
      href={`/tv-show/${show.id}`}
    >
      <div className="aspect-[2/3] rounded overflow-hidden">
        <Image
          src={show.poster || "/placeholder.svg"}
          alt={show.title}
          width={300}
          height={400}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-full hover:bg-white/20 p-0"
            >
              <Play className="h-3 w-3 fill-white" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 rounded-full hover:bg-white/20 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
            <span className="text-xs">{show.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {show.genres.slice(0, 2).map((genre, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-[10px] py-0 px-1 h-4 bg-black/50 border-gray-600"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
