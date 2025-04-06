// import { generateCachedEmbedding } from "../embedding";
// import {
//   genreTags,
//   languages,
//   randomCast,
//   randomDirectors,
// } from "@/lib/mockdata";

// export async function addFilms(films: Movie[]) {
//   try {
//     const client = supabase();

//     const filmsWithEmbeddings = await Promise.all(
//       films.map(async (film) => ({
//         ...film,
//         embedding: await generateCachedEmbedding(
//           `${film.title ?? ""}, ${film.description ?? ""}, ${
//             film.genre?.join(" ") ?? ""
//           }, ${film.tags.join(" ")}`
//         ),
//       }))
//     );

//     const { error } = await client.from("Movie").insert(filmsWithEmbeddings);
//     if (error) {
//       console.log(error);

//       // throw new Error("Error creating movies");
//     }
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error creating film");
//   }
// }
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
