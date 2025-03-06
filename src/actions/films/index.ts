import { prisma } from "../../lib/db";
import { Genre, Movie } from "@prisma/client";
import { generateCachedEmbedding } from "../embedding";
import { supabase } from "@/lib/supabase/client";
import { cache } from "@/lib/cache";

// TODO: pagination for getFilms, getFilmsByGenre, getFeaturedFilm
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
const getCachedFilmsByGenre = (genre: Genre) => {
  return cache(cachedGetFilmsByGenre, ["films", genre], {
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
  return cache(cachedFeaturedFilm, ["featured-films"], {
    revalidate: 3600,
  })();
};
export async function getFeaturedFilm() {
  return await getCachedFeaturedFilm();
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
