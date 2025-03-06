import { prisma } from "../../lib/db";
import { Genre, Movie } from "@prisma/client";
import { generateCachedEmbedding } from "../embedding";
import { supabase } from "@/lib/supabase/client";
import { cache } from "@/lib/cache";
import {
  genreTags,
  languages,
  randomCast,
  randomDirectors,
} from "@/lib/mockdata";

// TODO: pagination for getFilmsByGenre
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

export async function addFilms(films: Movie[]) {
  try {
    const client = supabase();

    const filmsWithEmbeddings = await Promise.all(
      films.map(async (film) => ({
        ...film,
        embedding: await generateCachedEmbedding(
          `${film.title ?? ""}, ${film.description ?? ""}, ${
            film.genre?.join(" ") ?? ""
          }, ${film.tags.join(" ")}`
        ),
      }))
    );

    const { error } = await client.from("Movie").insert(filmsWithEmbeddings);
    if (error) {
      console.log(error);

      // throw new Error("Error creating movies");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error creating film");
  }
}
// export async function refreshMoviesMetadata() {
//   const { data: movies, error } = await supabase()
//     .from("Movie")
//     .select("id, title, description, genre");

//   if (error) {
//     console.error("Error fetching movies:", error);
//     return;
//   }
//   console.log(movies.length);

//   const updates = movies.map((movie, i) => ({
//     id: movie.id,
//     // director: randomDirectors[i % randomDirectors.length], // Rotate through directors
//     // language: languages[i % languages.length], // Rotate through different languages
//     // releaseYear: 1980 + Math.floor(Math.random() * 45), // Random year from 1980-2024
//     // cast: randomCast[i % randomCast.length], // Rotate cast
//     // duration: 90 + Math.floor(Math.random() * 61), // Duration between 90-150 mins
//     // country: i % 4 === 0 ? "Japan" : "USA", // Some foreign films
//     // rating: (7 + Math.random() * 2).toFixed(1), // Rating between 7.0-9.0
//     // featured: i % 2 === 0, // Alternates featured status
//     // updatedAt: new Date(),
//     tags: movie.genre.flatMap((g) => genreTags[g] || []),
//   }));
//   console.log(updates);

//   // Batch update movies
//   // for (const update of updates) {
//   //   const { error: updateError, data } = await supabase()
//   //     .from("Movie")
//   //     .update(update)
//   //     .eq("id", update.id);
//   //   console.log(data);

//   //   if (updateError) {
//   //     console.error(`Error updating movie ${update.id}:`, updateError);
//   //   }
//   // }

//   console.log("Movie metadata updated successfully!");
// }

// export async function refreshMovieEmbedding() {
//   const { data: movies, error } = await supabase()
//     .from("Movie")
//     .select(
//       "id, title, description, genre, cast, director, language, releaseYear, tags, embedding"
//     );

//   if (error) {
//     console.error("Error fetching movies:", error);
//     return;
//   }

//   console.log("Fetched movies:", movies.length);

//   // Generate embeddings in parallel and wait for all of them
//   const updates = await Promise.all(
//     movies.map(async (film) => ({
//       id: film.id,
//       embedding:
//         (await generateCachedEmbedding(
//           `${film.title ?? ""}, ${film.description ?? ""}, ${
//             film.genre?.join(" ") ?? ""
//           }, ${film.tags.join(" ")}`
//         )) ?? film.embedding``,
//     }))
//   );
//   console.log("done embedded");

//   for (const update of updates) {
//     const { error: updateError } = await supabase()
//       .from("Movie")
//       .update(update)
//       .eq("id", update.id);

//     if (updateError) {
//       console.error(`Error updating movie ${update.id}:`, updateError);
//     }
//   }

//   console.log("Movie embeddings updated successfully!");
// }
