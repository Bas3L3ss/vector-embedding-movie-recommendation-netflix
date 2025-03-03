import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroBanner from "@/components/hero-banner";
import FilmCarousel from "@/components/film-carousel";

async function getFilms() {
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .order("created_at", { ascending: false });

  return films || [];
}

async function getFilmsByType(type: string) {
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });

  return films || [];
}

async function getFeaturedFilm() {
  const { data: films } = await supabase
    .from("films")
    .select("*")
    .limit(1)
    .single();

  return films;
}

export default async function Home() {
  const [allFilms, movies, tvShows, featuredFilm] = await Promise.all([
    getFilms(),
    getFilmsByType("MOVIE"),
    getFilmsByType("TV_SHOW"),
    getFeaturedFilm(),
  ]);

  // Create trending films (just a subset of all films for demo)
  const trendingFilms = allFilms.slice(0, 10);

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <Suspense fallback={<div className="h-[70vh] bg-black"></div>}>
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
      </div>

      <Footer />
    </main>
  );
}
