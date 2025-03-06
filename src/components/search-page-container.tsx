// "use client";
// import { User } from "@supabase/supabase-js";
// import React, { useState } from "react";
// import { Input } from "./ui/input";
// import { Search, X } from "lucide-react";
// import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
// import { Movie } from "@prisma/client";
// import FilmCard from "./film-card";

// const SearchPageContainer = ({
//   user,
//   films,
//   query,
//   favorites,
// }: {
//   user: User | null;
//   query: string;
//   films: Movie[];
//   favorites?: { filmId: string; Movie: Movie[] }[];
// }) => {
//   // TODO: implement react-query
//   const [searchQuery, setSearchQuery] = useState(query ?? "");
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     router.push(`/film?q=${searchQuery}`);
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//   };
//   return (
//     <>
//       <div className="mb-8">
//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative flex-1">
//             <Input
//               type="text"
//               placeholder="Search for movies, TV shows, genres..."
//               className="bg-gray-900 border-gray-700 text-white pl-10 pr-10 py-6 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent"
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//               }}
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             {searchQuery && (
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//                 onClick={clearSearch}
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             )}
//           </div>
//           <Button
//             type="submit"
//             className="bg-red-600 hover:bg-red-700 text-white py-6"
//           >
//             Search
//           </Button>
//         </form>
//       </div>

//       {films?.length > 0 ? (
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-6">
//             Search Results for &quot;{query}&quot;
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//             {films.map((film) => (
//               <FilmCard
//                 isFavorite={
//                   //@ts-expect-error: no problem (posterUrl but supabase return posterurl )
//                   favorites && favorites.some((m) => m.filmId == film.id)
//                 }
//                 user={user}
//                 key={film.id}
//                 film={{
//                   cast: film.cast,
//                   country: film.country,
//                   createdAt: film.createdAt,
//                   description: film.description,
//                   tags: film.tags,
//                   //@ts-expect-error: no problem (posterUrl but supabase return posterurl )
//                   posterUrl: film.posterurl,
//                   director: film.director,
//                   duration: film.duration,
//                   featured: film.featured,
//                   genre: film.genre,
//                   id: film.id,
//                   language: film.language,
//                   rating: film.rating,
//                   releaseYear: film.releaseYear,
//                   title: film.title,
//                   trailerUrl: film.trailerUrl,
//                   updatedAt: film.updatedAt,
//                   videoUrl: film.videoUrl,
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       ) : query ? (
//         <div className="text-center py-16">
//           <h2 className="text-xl text-gray-400 mb-4">
//             No results found for &quot;{query}&quot;
//           </h2>
//           <p className="text-gray-500">
//             Try adjusting your search or filter to find what you&apos;re looking
//             for.
//           </p>
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <h2 className="text-xl text-gray-400 mb-4">
//             Search for movies and TV shows
//           </h2>
//           <p className="text-gray-500">
//             Find your favorite movies, TV shows, actors, directors, and more.
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default SearchPageContainer;
"use client";
import type { User } from "@supabase/supabase-js";
import type React from "react";
import { useState } from "react";
import { Input } from "./ui/input";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import type { Genre, Movie } from "@prisma/client";
import FilmCard from "./film-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const SearchPageContainer = ({
  user,
  films,
  query,
  favorites,
  genres: initialGenres,
}: {
  user: User | null;
  query: string;
  films: Movie[];
  favorites?: { filmId: string; Movie: Movie[] }[];
  genres?: Genre[];
}) => {
  // TODO: implement react-query
  const [searchQuery, setSearchQuery] = useState(query ?? "");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(
    Array.isArray(initialGenres)
      ? initialGenres
      : initialGenres
      ? [initialGenres]
      : []
  );
  const router = useRouter();

  const genreOptions: Genre[] = [
    "ACTION",
    "ADVENTURE",
    "ANIMATION",
    "COMEDY",
    "CRIME",
    "DOCUMENTARY",
    "DRAMA",
    "BOLLYWOOD",
    "FAMILY",
    "FANTASY",
    "HISTORY",
    "HORROR",
    "MUSIC",
    "SUPERHERO",
    "MARVEL",
    "DC",
    "MYSTERY",
    "ROMANCE",
    "SCI_FI",
    "THRILLER",
    "WAR",
    "INDIE",
    "WESTERN",
    "PSYCHOLOGICAL",
    "HISTORICAL",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build the query parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);

    // Add multiple genres as separate parameters
    if (selectedGenres.length > 0) {
      selectedGenres.forEach((genre) => {
        params.append("genre", genre);
      });
    }

    router.push(`/film?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleGenreToggle = (genre: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearGenreFilter = (genreToRemove?: string) => {
    if (genreToRemove) {
      setSelectedGenres((prev) => prev.filter((g) => g !== genreToRemove));
    } else {
      setSelectedGenres([]);
    }
  };

  // Format genre for display
  const formatGenre = (genre: string) => {
    return genre
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for movies, TV shows, genres..."
                className="bg-gray-900 border-gray-700 text-white pl-10 pr-10 py-6 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={clearSearch}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-6"
            >
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <Filter className="h-4 w-4  mr-2" />
                    <span
                      className={cn(selectedGenres.length == 0 && "pr-[25px]")}
                    >
                      Genres
                    </span>{" "}
                    {selectedGenres.length > 0 && `(${selectedGenres.length})`}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white max-h-[300px] overflow-y-auto w-[220px]">
                  {genreOptions.map((genre) => (
                    <DropdownMenuItem
                      key={genre}
                      className={cn(
                        "cursor-pointer border border-transparent hover:bg-gray-700 flex items-center gap-2",
                        selectedGenres.includes(genre) &&
                          "border border-red-500"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        handleGenreToggle(genre);
                      }}
                    >
                      {formatGenre(genre)}
                    </DropdownMenuItem>
                  ))}
                  <div className="flex justify-between p-2 border-t border-gray-700 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearGenreFilter()}
                      className="text-gray-400 hover:text-white"
                    >
                      Clear All
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <Badge
                  key={genre}
                  className="bg-red-600 hover:bg-red-700 gap-1 px-3 py-1"
                >
                  {formatGenre(genre)}
                  <button
                    onClick={() => clearGenreFilter(genre)}
                    className="ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedGenres.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearGenreFilter()}
                  className=" hover:bg-black text-white"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      {films?.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedGenres.length > 0
              ? `${
                  selectedGenres.length === 1
                    ? formatGenre(selectedGenres[0])
                    : `${selectedGenres.length} Genres`
                } 
                  ${query ? ` matching "${query}"` : ""}`
              : query
              ? `Search Results for "${query}"`
              : "All movies"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {films
              .filter(
                (film) =>
                  selectedGenres.length === 0 ||
                  film.genre.some((g) => selectedGenres.includes(g))
              )
              .map((film) => (
                <FilmCard
                  key={film.id}
                  //@ts-expect-error: this is fine
                  isFavorite={favorites?.some((m) => m.filmId === film.id)}
                  user={user}
                  film={{
                    ...film,
                    //@ts-expect-error: Ensure correct Supabase typing instead of ignoring
                    posterUrl: film.posterurl,
                  }}
                />
              ))}
          </div>
        </div>
      ) : query || selectedGenres.length > 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-400 mb-4">
            No results found
            {query && ` for "${query}"`}
            {selectedGenres.length > 0 && ` in selected genres`}
          </h2>
          <p className="text-gray-500">
            Try adjusting your search or filter to find what you&apos;re looking
            for.
          </p>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-400 mb-4">
            Search for movies and TV shows
          </h2>
          <p className="text-gray-500">
            Find your favorite movies, TV shows, actors, directors, and more.
          </p>
        </div>
      )}
    </>
  );
};

export default SearchPageContainer;
