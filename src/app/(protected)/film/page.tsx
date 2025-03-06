import { getFavorites, searchFilmsByText } from "@/actions/films/server-only";
import SearchPageContainer from "@/components/search-page-container";
import { createClient } from "@/lib/supabase/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const paramValue = await searchParams;
  const query = paramValue.q;
  const genre = paramValue.genre;

  const user = (await (await createClient()).auth.getUser()).data.user;

  const similarFilm = await searchFilmsByText(query, 0);
  let favorites;
  if (user) {
    favorites = await getFavorites(user.id);
  }

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SearchPageContainer
        favorites={favorites}
        films={similarFilm}
        query={query}
        user={user}
        //@ts-expect-error: no problem typescript wouldnt let me assert the type
        genres={genre}
      />
    </section>
  );
}
