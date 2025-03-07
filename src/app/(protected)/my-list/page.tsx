import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFavorites } from "@/actions/films/server-only";
import FilmCard from "@/components/film-card";
import { Metadata } from "next";
import FilmCardV2 from "@/components/film-card-v2";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user favorites safely
  const favorites = user?.id ? await getFavorites(user.id) : [];

  const userName = user?.user_metadata?.name ?? "My";
  const favoriteTitles =
    favorites
      //@ts-expect-error: no problem
      ?.map((fav) => fav.Movie.title)
      .slice(0, 3)
      .join(", ") || "Movies";

  const title = `${userName}'s List - Netflix`;
  const description = `${userName}'s favorite movies: ${favoriteTitles}. Explore your saved movies here.`;

  return {
    title,
    description,
    keywords: [
      "Netflix",
      "favorite movies",
      "watchlist",
      "streaming",
      "My List",
    ],
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
          alt: `${userName}'s favorite movies`,
        },
      ],
      locale: "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yourwebsite.com/twitter-mylist.jpg"],
    },
  };
}

export default async function MyListPage() {
  const { auth } = await createClient();
  const user = (await auth.getUser()).data.user;

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const favorites = await getFavorites(user.id);

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">My List</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl text-gray-400 mb-4">Your list is empty</h2>
          <p className="text-gray-500">
            Add movies and TV shows to your list to watch them later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(({ Movie, filmId }) => (
            <FilmCardV2
              user={user}
              key={filmId}
              //@ts-expect-error: no problem (any[] problem)
              film={Movie}
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
