import { getFeaturedFilm, getFilms, getFilmsByGenre } from "@/actions/films";
import FilmCarousel from "@/components/film-carousel";
import HeroBanner from "@/components/hero-banner";
import { createClient } from "@/lib/supabase/server";
import { getFavorites } from "@/actions/films/server-only";

export default async function Home() {
  const supabase = await createClient();
  const [allFilms, dramas, action, featuredFilm, user] = await Promise.all([
    getFilms(),
    getFilmsByGenre("DRAMA"),
    getFilmsByGenre("ACTION"),
    getFeaturedFilm(),
    supabase.auth.getUser(),
  ]);
  let favorites;

  if (user && user.data.user?.id) {
    favorites = await getFavorites(user.data.user.id);
  }

  const trendingFilms = allFilms.slice(0, 10);
  return (
    <section className="pt-24">
      {featuredFilm && (
        <HeroBanner
          user={user.data.user}
          isFavorite={favorites?.some((f) => f.filmId == featuredFilm.id)}
          film={{
            cast: featuredFilm.cast,
            country: featuredFilm.country,
            createdAt: featuredFilm.createdAt,
            description: featuredFilm.description,
            posterUrl: featuredFilm.posterUrl,
            director: featuredFilm.director,
            duration: featuredFilm.duration,
            featured: featuredFilm.featured,
            genre: featuredFilm.genre,
            id: featuredFilm.id,
            language: featuredFilm.language,
            //@ts-expect-error: no problem
            rating: featuredFilm.rating?.toNumber(),
            releaseYear: featuredFilm.releaseYear,
            title: featuredFilm.title,
            trailerUrl: featuredFilm.trailerUrl,
            updatedAt: featuredFilm.updatedAt,
            videoUrl: featuredFilm.videoUrl,
          }}
        />
      )}
      <div className="mt-4 md:mt-8">
        {trendingFilms.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            //@ts-expect-error: no problem
            favorites={favorites}
            title="Trending Now"
            //@ts-expect-error: no problem
            films={trendingFilms.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterUrl: film.posterUrl,
                director: film.director,
                duration: film.duration,
                featured: film.featured,
                genre: film.genre,
                id: film.id,
                language: film.language,
                rating: film.rating?.toNumber(),
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
            //@ts-expect-error: no problem
            favorites={favorites}
            title="Drama"
            //@ts-expect-error: it's fine
            films={dramas.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterUrl: film.posterUrl,
                director: film.director,
                duration: film.duration,
                featured: film.featured,
                genre: film.genre,
                id: film.id,
                language: film.language,
                rating: film.rating?.toNumber(),
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
            //@ts-expect-error: no problem
            favorites={favorites}
            title="Action"
            //@ts-expect-error: no problem
            films={action.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterUrl: film.posterUrl,
                director: film.director,
                duration: film.duration,
                featured: film.featured,
                genre: film.genre,
                id: film.id,
                language: film.language,
                rating: film.rating?.toNumber(),
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
            //@ts-expect-error: no problem
            favorites={favorites}
            title="New Releases"
            //@ts-expect-error: no problem
            films={allFilms.map((film) => {
              return {
                cast: film.cast,
                country: film.country,
                createdAt: film.createdAt,
                description: film.description,
                posterUrl: film.posterUrl,
                director: film.director,
                duration: film.duration,
                featured: film.featured,
                genre: film.genre,
                id: film.id,
                language: film.language,
                rating: film.rating?.toNumber(),
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
