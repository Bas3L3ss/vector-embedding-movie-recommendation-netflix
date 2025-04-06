import { checkAdminUser } from "@/actions/auth";
import { getFilmById } from "@/actions/films/server-only";
import FilmForm from "@/components/dashboard/film/form/film-form";
import BackButton from "@/components/reusable/back-button";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  await checkAdminUser();

  const movieId = (await params).id;
  const film = await getFilmById(movieId);

  if (!film && movieId !== "new") {
    return (
      <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4">
          <BackButton to="/data" />
          <h1 className="text-2xl font-bold text-red-600">
            Not found film {movieId}
          </h1>
        </header>
      </section>
    );
  }
  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4">
        <BackButton to="/data" />
        <h1 className="text-2xl font-bold text-red-600">
          {movieId === "new" ? "Create New Film" : `Manage film ${movieId}`}
        </h1>
        <FilmForm initialData={movieId === "new" ? null : film} />
      </header>
    </section>
  );
};

export default page;
