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

export async function findSimilarMovies(
  queryVector: number[],
  threshold: number,
  limit: number
) {
  const result = await supabase().rpc("match_movie", {
    query_embedding: queryVector,
    similarity_threshold: threshold,
    match_count: limit,
  });

  return result.data;
}

export async function searchFilmsByText(query: string) {
  try {
    const vector = await generateCachedEmbedding(query);
    if (vector.length > 0) {
      return await findSimilarMovies(vector, 0.3, 10);
    }
    return [];
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export async function getFilmById(id: string) {
  try {
    // Fetch only the id and embedding columns from the Movie table

    const { data, error } = await supabase()
      .from("Movie")
      .select("*")

      .eq("id", id);
    // Filter by the provided id

    if (error) {
      console.error("Error fetching film by ID:", error);

      return [];

      // Return an empty array in case of error
    }

    return data;
    // Return the fetched data
  } catch (error) {
    console.error("Unexpected error:", error);

    return [];
    // Return an empty array in case of unexpected error
  }
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

    const { data, error } = await client
      .from("Movie")
      .insert(filmsWithEmbeddings);
    if (error) {
      console.log(error);

      throw new Error(error);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error creating film");
  }
}
