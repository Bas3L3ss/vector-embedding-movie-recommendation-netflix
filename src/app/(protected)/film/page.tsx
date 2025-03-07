import { getFavorites, searchFilmsByText } from "@/actions/films/server-only";
import SearchPageContainer from "@/components/search-page-container";
import { createClient } from "@/lib/supabase/server";
import { Movie } from "@prisma/client";
import { Metadata } from "next";

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const genre = searchParams.genre;
  const films: Movie[] = await searchFilmsByText(query);

  const title =
    films.length > 0 ? `(${films.length}) Films Found | Netflix` : "Netflix";
  const description = `(${films.length}) Films Found with ${genre} Genres`;

  return {
    title,
    description,
    keywords: ["Netflix", "Films", "Search", `${query}`, `${genre}`],
    alternates: {
      canonical: "https://yourwebsite.com/mylist",
    },
    openGraph: {
      title,
      description,
      url: "https://yourwebsite.com/mylist",
      siteName: "Netflix",
      images: [
        {
          url: "https://yourwebsite.com/og-mylist.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yourwebsite.com/twitter-mylist.jpg"],
    },
  };
}

export default async function SearchPage(props: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q;
  const genre = searchParams.genre;

  const supabase = await createClient();
  const userPromise = supabase.auth.getUser(); // Start fetching the user early
  const searchPromise = searchFilmsByText(query);

  const [{ data: userData }, similarFilm] = await Promise.all([
    userPromise,
    searchPromise,
  ]);
  const user = userData.user;

  const favorites = user ? await getFavorites(user.id) : null;

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SearchPageContainer
        //@ts-expect-error: wouldnt let me assert type
        favorites={favorites}
        films={similarFilm}
        query={query}
        user={user}
        //@ts-expect-error: wouldnt let me assert type
        genres={genre}
      />
    </section>
  );
}
