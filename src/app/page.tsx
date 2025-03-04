import { Suspense } from "react";
import { getFeaturedFilm, getFilms, getFilmsByGenre } from "@/actions/films";
import FilmCarousel from "@/components/film-carousel";
import HeroBanner from "@/components/hero-banner";

export default async function Home() {
  const [allFilms, dramas, action, featuredFilm] = await Promise.all([
    getFilms(),
    getFilmsByGenre("DRAMA"),
    getFilmsByGenre("ACTION"),
    getFeaturedFilm(),
  ]);

  const trendingFilms = allFilms.slice(0, 10);

  return (
    <section>
      <Suspense fallback={<div className="h-[70vh] bg-black"></div>}>
        {/* {featuredFilm && <HeroBanner film={featuredFilm} />} */}
      </Suspense>

      <div className="mt-4 md:mt-8">
        {trendingFilms.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel title="Trending Now" films={trendingFilms} />
          </Suspense>
        )}
        {dramas.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel title="Drama" films={dramas} />
          </Suspense>
        )}
        {action.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel title="Action" films={action} />
          </Suspense>
        )}
        {allFilms.length > 0 && (
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            <FilmCarousel title="New Releases" films={allFilms.slice(5, 15)} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
