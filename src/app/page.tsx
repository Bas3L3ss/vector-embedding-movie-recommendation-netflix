// import { Suspense } from "react";
// import { supabase } from "@/lib/supabase";
// import HeroBanner from "@/components/hero-banner";
// import FilmCarousel from "@/components/film-carousel";
// import { getFeaturedFilm, getFilms, getFilmsByType } from "@/actions/films";

export default async function Home() {
  // const [allFilms, movies, tvShows, featuredFilm] = await Promise.all([
  //   getFilms(),
  //   getFilmsByType("MOVIE"),
  //   getFilmsByType("TV_SHOW"),
  //   getFeaturedFilm(),
  // ]);

  // Create trending films (just a subset of all films for demo)
  // const trendingFilms = allFilms.slice(0, 10);

  return (
    <section>
      {/* <Suspense fallback={<div className="h-[70vh] bg-black"></div>}>
        {featuredFilm && <HeroBanner film={featuredFilm} />}
      </Suspense>

      <div className="mt-4 md:mt-8">
        <Suspense fallback={<div className="h-60 bg-black"></div>}>
          <FilmCarousel title="Trending Now" films={trendingFilms} />
        </Suspense>

        <Suspense fallback={<div className="h-60 bg-black"></div>}>
          <FilmCarousel title="Movies" films={movies} />
        </Suspense>

        <Suspense fallback={<div className="h-60 bg-black"></div>}>
          <FilmCarousel title="TV Shows" films={tvShows} />
        </Suspense>

        <Suspense fallback={<div className="h-60 bg-black"></div>}>
          <FilmCarousel title="New Releases" films={allFilms.slice(5, 15)} />
        </Suspense>
      </div> */}
    </section>
  );
}
