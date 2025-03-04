"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FilmCard from "@/components/film-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Movie } from "@prisma/client";
import { searchFilmsByText } from "@/actions/films";
import { useAuth } from "../context/auth-provider";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const searchResults = await searchFilmsByText(query);
      setResults(searchResults as Movie[]);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/film?q=${searchQuery}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results for &quot;{initialQuery}&quot;
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((film) => (
                <FilmCard user={user} key={film.id} film={film} />
              ))}
            </div>
          </div>
        ) : initialQuery ? (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-400 mb-4">
              No results found for &quot;{initialQuery}&quot;
            </h2>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
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
      </div>

      <Footer />
    </main>
  );
}
