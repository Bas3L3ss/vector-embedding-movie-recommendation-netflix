import { prisma } from "../../lib/db";
import { Genre, Prisma } from "@prisma/client";

import { supabase } from "@/lib/supabase/client";
import { cache } from "@/lib/cache";
import { FetchedResponseMoviePagination, FetchMoviesParams } from "@/types";

async function cachedGetFilms() {
  try {
    const films = await prisma.movie.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return films.map((f) => ({
      ...f,
      id: f.id.toString(),
      rating: f.rating?.toNumber(),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}
const getCachedFilms = () => {
  return cache(cachedGetFilms, ["films"], {
    revalidate: 3600,
  })();
};
export async function getFilms() {
  return await getCachedFilms();
}

async function cachedGetFilmsByGenre(genre: Genre) {
  try {
    const films = await prisma.movie.findMany({
      where: {
        genre: {
          has: genre,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return films.map((f) => ({
      ...f,
      id: f.id.toString(),
      rating: f.rating?.toNumber(),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}
const getCachedFilmsByGenre = (genre: Genre) => {
  return cache(cachedGetFilmsByGenre, [`films:${genre}`], {
    revalidate: 3600,
  })(genre);
};
export async function getFilmsByGenre(genre: Genre) {
  return await getCachedFilmsByGenre(genre);
}

async function cachedFeaturedFilm() {
  try {
    const film = await prisma.movie.findFirst({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    });

    if (!film) return null;
    return {
      ...film,
      rating: Number(film.rating),
      id: film.id.toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getCachedFeaturedFilm = () => {
  return cache(cachedFeaturedFilm, ["film-featured"], {
    revalidate: 3600,
  })();
};
export async function getFeaturedFilm() {
  return await getCachedFeaturedFilm();
}

export async function toggleFavorites(
  userId: string,
  filmId: bigint,
  favorite: boolean
) {
  const serializedFilmId = filmId.toString();

  if (favorite) {
    const { error } = await supabase()
      .from("Favorite")
      .delete()
      .eq("userId", userId)
      .eq("filmId", serializedFilmId);

    if (error) throw error;
  } else {
    // Add to Favorite
    const { error } = await supabase().from("Favorite").insert({
      userId: userId,
      filmId: serializedFilmId,
    });

    if (error) throw error;
  }
}

export const fetchMovies = async ({
  page = 1,
  limit = 10,
  search,
  genres,
}: FetchMoviesParams): Promise<FetchedResponseMoviePagination> => {
  const offset = (page - 1) * limit;

  // Build filters step-by-step
  const filters: Prisma.MovieWhereInput[] = [];

  if (search) {
    filters.push({
      title: {
        contains: search,
        mode: "insensitive",
      },
    });
  }

  if (genres && genres.length > 0) {
    filters.push({
      genre: {
        hasSome: genres,
      },
    });
  }

  // If no filters, use an empty object.
  const whereClause: Prisma.MovieWhereInput =
    filters.length > 0 ? { AND: filters } : {};

  const [total, data] = await Promise.all([
    prisma.movie.count({ where: whereClause }),
    prisma.movie.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);
  const plainData = data.map((movie) => ({
    ...movie,
    id: movie.id.toString(),
    rating: movie.rating ? movie.rating.toString() : null,
  }));
  return {
    // @ts-expect-error: no prob
    data: plainData,
    pagination: {
      currentPage: page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
