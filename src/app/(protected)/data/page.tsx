import React from "react";
import FilmClientComponent from "./_component/client-table";
import { FetchedResponseMoviePagination } from "@/types";
import { checkAdminUser } from "@/actions/auth";
import { fetchMovies } from "@/actions/films";

const AdminDataManagePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await checkAdminUser();
  const params = await searchParams;
  // Parse pagination parameters with default values
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit =
    typeof params.limit === "string" ? parseInt(params.limit, 10) : 10;

  const genres =
    typeof params.genres === "string"
      ? params.genres.split(",")
      : Array.isArray(params.genres)
      ? params.genres
      : undefined;

  const search = typeof params.q === "string" ? params.q : undefined;

  const data: FetchedResponseMoviePagination = await fetchMovies({
    page,
    limit,
    // @ts-expect-error: no prob
    genres,
    search,
  });

  return (
    <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4">
        <h1 className="text-2xl font-bold text-red-600">Manage films</h1>
      </header>

      <FilmClientComponent data={data} />
    </section>
  );
};

export default AdminDataManagePage;
