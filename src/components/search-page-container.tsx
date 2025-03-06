"use client";
import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Movie } from "@prisma/client";
import FilmCard from "./film-card";

const SearchPageContainer = ({
  user,
  films,
  query,
  favorites,
}: {
  user: User | null;
  query: string;
  films: Movie[];
  favorites?: { filmId: string; Movie: Movie[] }[];
}) => {
  // TODO: implement react-query
  const [searchQuery, setSearchQuery] = useState(query ?? "");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/film?q=${searchQuery}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };
  return (
    <>
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
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
        </form>
      </div>

      {films?.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Search Results for &quot;{query}&quot;
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {films.map((film) => (
              <FilmCard
                isFavorite={
                  //@ts-expect-error: no problem (posterUrl but supabase return posterurl )
                  favorites && favorites.some((m) => m.filmId == film.id)
                }
                user={user}
                key={film.id}
                film={{
                  cast: film.cast,
                  country: film.country,
                  createdAt: film.createdAt,
                  description: film.description,
                  tags: film.tags,
                  //@ts-expect-error: no problem (posterUrl but supabase return posterurl )
                  posterUrl: film.posterurl,
                  director: film.director,
                  duration: film.duration,
                  featured: film.featured,
                  genre: film.genre,
                  id: film.id,
                  language: film.language,
                  rating: film.rating,
                  releaseYear: film.releaseYear,
                  title: film.title,
                  trailerUrl: film.trailerUrl,
                  updatedAt: film.updatedAt,
                  videoUrl: film.videoUrl,
                }}
              />
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-400 mb-4">
            No results found for &quot;{query}&quot;
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
