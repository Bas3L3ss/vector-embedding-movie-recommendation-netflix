"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import type { Genre, Movie } from "@prisma/client";

import FilmCardV2 from "./film-card-v2";
import SearchFilm from "./film/search-film";

import PaginationButtons from "./film/pagination-buttons";

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
  genres?: Genre[] | Genre;
}) => {
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>(
    Array.isArray(initialGenres)
      ? initialGenres
      : initialGenres
      ? [initialGenres]
      : []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const formatGenre = (genre: Genre) => {
    return genre
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredFilms = films.filter(
    (film) =>
      selectedGenres.length === 0 ||
      film.genre.some((g) => selectedGenres.includes(g))
  );

  const totalFilms = filteredFilms.length;
  const totalPages = Math.ceil(totalFilms / itemsPerPage);
  const indexOfLastFilm = currentPage * itemsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - itemsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedGenres([]);
  }, [query]);

  return (
    <>
      <SearchFilm
        formatGenre={formatGenre}
        query={query}
        selectedGenres={selectedGenres}
        setCurrentPage={setCurrentPage}
        setSelectedGenres={setSelectedGenres}
      />

      {films?.length > 0 ? (
        <div>
          <article className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-0">
              {selectedGenres.length > 0
                ? `${
                    selectedGenres.length === 1
                      ? formatGenre(selectedGenres[0])
                      : `${selectedGenres.length} Genres`
                  } 
                  ${query ? ` matching "${query}"` : ""}`
                : query
                ? `Search Results for "${query}", ${films.length} films found`
                : "All movies"}
            </h2>
            <h3 className="text-sm md:text-base font-bold text-white">
              Page: {currentPage}
            </h3>
          </article>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFilms.map((film) => (
              <FilmCardV2
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

          {/* Pagination UI */}
          {totalPages > 1 && (
            <PaginationButtons
              currentPage={currentPage}
              indexOfFirstFilm={indexOfFirstFilm}
              indexOfLastFilm={indexOfLastFilm}
              setCurrentPage={setCurrentPage}
              totalFilms={totalFilms}
              totalPages={totalPages}
            />
          )}
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
