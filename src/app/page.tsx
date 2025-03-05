import { Suspense } from "react";
import { getFeaturedFilm, getFilms, getFilmsByGenre } from "../actions/films";
import FilmCarousel from "../components/film-carousel";
import HeroBanner from "../components/hero-banner";
import { createClient } from "../lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const [allFilms, dramas, action, featuredFilm, user] = await Promise.all([
    getFilms(),
    getFilmsByGenre("DRAMA"),
    getFilmsByGenre("ACTION"),
    getFeaturedFilm(),
    supabase.auth.getUser(),
  ]);

  const trendingFilms = allFilms.slice(0, 10);

  return (
    <section className="pt-24">
      <Suspense fallback={<div className="h-[70vh] bg-black"></div>}>
        {featuredFilm && (
          <HeroBanner
            user={user.data.user}
            isFavorite
            film={{
              cast: featuredFilm.cast,
              country: featuredFilm.country,
              createdAt: featuredFilm.createdAt,
              description: featuredFilm.description,
              posterurl: featuredFilm.posterUrl,
              director: featuredFilm.director,
              duration: featuredFilm.duration,
              featured: featuredFilm.featured,
              genre: featuredFilm.genre,
              id: featuredFilm.id,
              language: featuredFilm.language,
              rating: featuredFilm.rating?.toNumber(),
              releaseYear: featuredFilm.releaseYear,
              title: featuredFilm.title,
              trailerUrl: featuredFilm.trailerUrl,
              updatedAt: featuredFilm.updatedAt,
              videoUrl: featuredFilm.videoUrl,
            }}
          />
        )}
      </Suspense>
      <div className="mt-4 md:mt-8">
        {trendingFilms.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            title="Trending Now"
            films={trendingFilms.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterurl: film.posterUrl,
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
              };
            })}
          />
        )}
        {dramas.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            title="Drama"
            films={dramas.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterurl: film.posterUrl,
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
              };
            })}
          />
        )}
        {action.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            title="Action"
            films={action.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterurl: film.posterUrl,
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
              };
            })}
          />
        )}
        {allFilms.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            title="New Releases"
            films={allFilms.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterurl: film.posterUrl,
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
              };
            })}
          />
        )}
      </div>
    </section>
  );
}
