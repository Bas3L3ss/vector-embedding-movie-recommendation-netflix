import { prisma } from "@/lib/db";
import { Genre } from "@prisma/client";

export async function getFilms() {
  const films = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return films;
}
export async function getFilmsByGenre(genre: Genre) {
  const films = await prisma.movie.findMany({
    where: {
      genre: {
        has: genre,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return films;
}
export async function getFeaturedFilm() {
  const film = await prisma.movie.findFirst({
    where: {
      featured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return film;
}

export async function findSimilarMovies(
  queryVector: number[],
  threshold: number,
  limit: number
) {
  const result = await prisma.$queryRaw`
    select id, title, description, 1 - (embedding <=> ${queryVector}::vector) as similarity
    from "Movie"
    where 1 - (embedding <=> ${queryVector}::vector) > ${threshold}
    order by similarity desc
    limit ${limit};
  `;

  return result;
}

export async function getFilmById(id: string) {
  return await prisma.movie.findUnique({
    where: { id: BigInt(id) },
  });
}
