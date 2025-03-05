import { prisma } from "../../lib/db";
import { Genre, Movie } from "@prisma/client";
import { generateCachedEmbedding } from "../embedding";
import { supabase } from "@/lib/supabase/client";

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

export async function addFilms(films: Movie[]) {
  try {
    const client = supabase();

    const filmsWithEmbeddings = await Promise.all(
      films.map(async (film) => ({
        ...film,
        embedding: await generateCachedEmbedding(
          `${film.description},${film.title}`
        ),
      }))
    );

    const { error } = await client.from("Movie").insert(filmsWithEmbeddings);
    if (error) {
      console.log(error);

      throw new Error("Error creating movies");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error creating film");
  }
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
