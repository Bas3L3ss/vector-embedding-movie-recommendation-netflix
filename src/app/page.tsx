import { Suspense } from "react";
import { getFeaturedFilm, getFilms, getFilmsByGenre } from "@/actions/films";
import FilmCarousel from "@/components/film-carousel";
import HeroBanner from "@/components/hero-banner";
import { createClient } from "@/lib/supabase/server";

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
    <section>
      <Suspense fallback={<div className="h-[70vh] bg-black"></div>}>
        {featuredFilm && (
          <HeroBanner user={user.data.user} isFavorite film={featuredFilm} />
        )}
      </Suspense>

      <div className="mt-4 md:mt-8">
        {trendingFilms.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel
              user={user.data.user}
              title="Trending Now"
              films={trendingFilms}
            />
          </Suspense>
        )}
        {dramas.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel user={user.data.user} title="Drama" films={dramas} />
          </Suspense>
        )}
        {action.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel user={user.data.user} title="Action" films={action} />
          </Suspense>
        )}
        {allFilms.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel
              user={user.data.user}
              title="New Releases"
              films={allFilms.slice(5, 15)}
            />
          </Suspense>
        )}
      </div>
    </section>
  );
}
