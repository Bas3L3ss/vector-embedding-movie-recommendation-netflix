import { Suspense } from "react";
import { redirect } from "next/navigation";
import FilmCard from "../../components/film-card";
import { prisma } from "../../lib/db";
import { createClient } from "../../lib/supabase/server";
import { Movie } from "@prisma/client";

// async function getFavorites(userId: string) {
//   return (await prisma.favorites.findMany({
//     where: { userId },
//     include: { film: true },
//   })) as Movie[];
// }

export default async function MyListPage() {
  const { auth } = await createClient();
  const user = (await auth.getUser()).data.user;

  if (!user?.id) {
    redirect("/auth/signin");
  }

  // const favorites = await getFavorites(user.id);

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-white mb-8">My List</h1>

      {/* <Suspense fallback={<div className="h-60 bg-black"></div>}>
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl text-gray-400 mb-4">Your list is empty</h2>
            <p className="text-gray-500">
              Add movies and TV shows to your list to watch them later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map(({ film }) => (
              <FilmCard
                user={user}
                key={film.id}
                film={film}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </Suspense> */}
    </section>
  );
}
