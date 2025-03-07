import { getFavorites, searchFilmsByText } from "@/actions/films/server-only";
import SearchPageContainer from "@/components/search-page-container";
import { createClient } from "@/lib/supabase/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
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
        favorites={favorites}
        films={similarFilm}
        query={query}
        user={user}
        genres={genre} // TS-Expect error might be resolved now
      />
    </section>
  );
}
