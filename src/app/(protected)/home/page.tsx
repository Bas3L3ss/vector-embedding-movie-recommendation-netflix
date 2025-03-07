import { Metadata } from "next";
import { getFeaturedFilm, getFilms, getFilmsByGenre } from "@/actions/films";
import FilmCarousel from "@/components/film-carousel";
import HeroBanner from "@/components/hero-banner";
import { createClient } from "@/lib/supabase/server";
import { getFavorites } from "@/actions/films/server-only";

export async function generateMetadata(): Promise<Metadata> {
  const featuredFilm = await getFeaturedFilm();

  const title = featuredFilm
    ? `${featuredFilm.title} - Watch on Netflix`
    : "Netflix - Watch TV Shows & Movies Online";
  const description = featuredFilm
    ? `Watch ${featuredFilm.title}, starring ${
        featuredFilm.cast?.[0] ?? "top actors"
      } on Netflix. Explore trending movies, dramas, and action-packed films.`
    : "Stream the latest and greatest movies & TV shows on Netflix.";

  return {
    title,
    description,
    keywords: [
      "Netflix",
      "stream movies",
      "watch TV shows",
      "best films",
      featuredFilm?.title ?? "Amazing film",
      //@ts-expect-error: no problem
      ...(featuredFilm?.genre ? [featuredFilm.genre] : []),
    ],
    alternates: {
      canonical: "https://yourwebsite.com/",
    },
    openGraph: {
      title,
      description,
      url: "https://yourwebsite.com/",
      siteName: "Netflix",
      images: [
        {
          url:
            featuredFilm?.posterUrl[0] ??
            "https://yourwebsite.com/default-og-image.jpg",
          width: 1200,
          height: 630,
          alt: featuredFilm ? featuredFilm.title : "Netflix Home",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        ...(featuredFilm?.posterUrl ??
          "https://yourwebsite.com/default-twitter-image.jpg"),
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "theme-color": "#141414",
    },
  };
}

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
    <section>
      {featuredFilm && (
        <HeroBanner
          user={user.data.user}
          isFavorite={favorites?.some((f) => f.filmId == featuredFilm.id)}
          film={featuredFilm}
        />
      )}
      <div className="mt-4 md:mt-8">
        {trendingFilms.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            favorites={favorites}
            title="Trending Now"
            films={trendingFilms}
          />
        )}
        {dramas.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            favorites={favorites}
            title="Drama"
            films={dramas}
          />
        )}
        {action.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            favorites={favorites}
            title="Action"
            films={action}
          />
        )}
        {allFilms.length > 0 && (
          <FilmCarousel
            user={user.data.user}
            favorites={favorites}
            title="New Releases"
            films={allFilms}
          />
        )}
      </div>
    </section>
  );
}
