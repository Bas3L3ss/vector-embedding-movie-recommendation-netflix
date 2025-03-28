import { $Enums, Genre } from "@prisma/client";
import React, { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Loading from "../reusable/loading";

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
const SearchFilm = ({
  query,
  selectedGenres,
  setSelectedGenres,
  formatGenre,
  setCurrentPage,
}: {
  query: string;
  selectedGenres: Genre[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<$Enums.Genre[]>>;
  formatGenre: (genre: Genre) => string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [searchQuery, setSearchQuery] = useState(query ?? "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
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

    startTransition(() => {
      router.push(`/film?${params.toString()}`);
    });
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenres, setCurrentPage]);

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              disabled={isPending}
              placeholder="Search for movies, TV shows, genres..."
              className={cn(
                "bg-gray-900 border-gray-700 text-white pl-10 pr-10 py-6 rounded-md focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent disabled:opacity-100",
                isPending && "animate-pulse"
              )}
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
            className="bg-red-600 w-[75px]   hover:bg-red-700 text-white py-6"
            disabled={isPending}
          >
            {isPending ? (
              <Loading size={16} classNameInner="!border-white" />
            ) : (
              "Search"
            )}
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
                  </span>
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
                      selectedGenres.includes(genre) && "border border-red-500"
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
  );
};

export default SearchFilm;
