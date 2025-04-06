import { createClient } from "@/lib/supabase/server";
import { FilmFormData } from "@/types";
import { Movie } from "@prisma/client";
import { createFiles, deleteFiles } from "../files";
import { generateCachedEmbedding } from "../embedding";
import { revalidateTag } from "next/cache";
import { redis } from "@/lib/redis";

export const invalidateFilmCache = async (
  tags: string[] = ["films"],
  redisKeys: string[] = [],
  redisPatterns: string[] = ["film:*", "films:*"]
): Promise<boolean> => {
  try {
    tags.forEach((tag) => revalidateTag(tag));
    console.log("Next.js cache invalidated for tags:", tags);

    if (redisKeys.length > 0) {
      await redis.del(...redisKeys);
      console.log("Redis cache invalidated for specific keys:", redisKeys);
    }

    for (const pattern of redisPatterns) {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          "100"
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await redis.del(...keys);
          console.log(
            `Redis cache invalidated for ${keys.length} keys matching pattern:`,
            pattern
          );
        }
      } while (cursor !== "0");
    }

    return true;
  } catch (error) {
    console.error("Error invalidating cache:", error);
    return false;
  }
};

const supabase = await createClient();

export const createFilm = async (
  data: FilmFormData,
  posterFiles: File[],
  trailerUrls: string[] = [],
  videoUrls: string[] = []
): Promise<{ success: boolean; film?: any; error?: string }> => {
  let uploadedUrls: string[] = [];
  let createdFilm: any = null;

  try {
    // 1. First create the film record to get the auto-generated ID

    const embedding = await generateCachedEmbedding(
      `${data.title ?? ""}, ${data.description ?? ""}, ${
        data.genre?.join(" ") ?? ""
      }, ${data.tags.join(" ")}`
    );

    const { data: film, error: insertError } = await supabase
      .from("films")
      .insert({
        ...data,
        posterUrl: [],
        trailerUrl: trailerUrls,
        videoUrl: videoUrls,
        embedding,
      })
      .select()
      .single();

    if (insertError || !film) {
      return {
        success: false,
        error: `Failed to create initial film record: ${
          insertError?.message || "Unknown error"
        }`,
      };
    }

    createdFilm = film;
    const filmId = film.id.toString();

    // 2. Upload poster images using the actual film ID
    uploadedUrls = await createFiles(posterFiles, "posters", filmId);

    if (uploadedUrls.length !== posterFiles.length) {
      // If not all files were uploaded successfully, clean up and delete the film
      await deleteFiles(uploadedUrls);
      await supabase.from("films").delete().eq("id", filmId);
      return {
        success: false,
        error: "Failed to upload all poster images",
      };
    }

    // 3. Update the film record with the poster URLs
    const { data: updatedFilm, error: updateError } = await supabase
      .from("films")
      .update({
        posterUrl: uploadedUrls,
      })
      .eq("id", filmId)
      .select()
      .single();

    if (updateError) {
      // If update failed, delete uploaded images and the film record
      await deleteFiles(uploadedUrls);
      await supabase.from("films").delete().eq("id", filmId);
      return {
        success: false,
        error: `Failed to update film with poster URLs: ${updateError.message}`,
      };
    }

    // 4. Invalidate cache
    const cacheKeys = data.genre.map((genre) => `film:${genre}`);

    invalidateFilmCache([
      "films",
      ...cacheKeys,
      ...(data.featured ? ["film-featured"] : []),
    ]);

    return { success: true, film: updatedFilm };
  } catch (error) {
    // If any unexpected error occurs, perform cleanup
    if (uploadedUrls.length > 0) {
      await deleteFiles(uploadedUrls);
    }

    if (createdFilm && createdFilm.id) {
      await supabase.from("films").delete().eq("id", createdFilm.id);
    }

    return {
      success: false,
      error: `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export const updateFilm = async (
  initialData: Movie,
  newData: FilmFormData,
  newPosterFiles: File[] = []
): Promise<{ success: boolean; film?: any; error?: string }> => {
  let newUploadedUrls: string[] = [];

  try {
    const filmId = initialData.id;

    // Find poster URLs to delete (those in initial data but not in kept URLs)
    const urlsToDelete = (initialData.posterUrl || []).filter(
      (url) => !initialData.posterUrl.includes(url)
    );

    // Upload new poster files if any
    if (newPosterFiles.length > 0) {
      newUploadedUrls = await createFiles(
        newPosterFiles,
        "posters",
        filmId.toString()
      );

      if (newUploadedUrls.length !== newPosterFiles.length) {
        await deleteFiles(newUploadedUrls);
        return {
          success: false,
          error: "Failed to upload all new poster images",
        };
      }
    }

    // Combine kept URLs with newly uploaded URLs
    const updatedPosterUrls = [...initialData.posterUrl, ...newUploadedUrls];

    // Update film record

    const embedding = await generateCachedEmbedding(
      `${newData.title ?? ""}, ${newData.description ?? ""}, ${
        newData.genre?.join(" ") ?? ""
      }, ${newData.tags.join(" ")}`
    );

    const { data: updatedFilm, error: updateError } = await supabase
      .from("films")
      .update({
        ...newData,
        posterUrl: updatedPosterUrls,
        embedding,
      })
      .eq("id", filmId)
      .select()
      .single();

    if (updateError) {
      // If update failed, delete newly uploaded images
      if (newUploadedUrls.length > 0) {
        await deleteFiles(newUploadedUrls);
      }

      return {
        success: false,
        error: `Failed to update film: ${updateError.message}`,
      };
    }

    // Delete unused poster images after successful update
    if (urlsToDelete.length > 0) {
      await deleteFiles(urlsToDelete);
    }

    const cacheKeys = newData.genre.map((g) => `film:${g}`);

    invalidateFilmCache(
      ["films", ...cacheKeys, ...(newData.featured ? ["film-featured"] : [])],
      [`film:${filmId}`]
    );
    return { success: true, film: updatedFilm };
  } catch (error) {
    // If any unexpected error occurs, clean up new uploads
    if (newUploadedUrls.length > 0) {
      await deleteFiles(newUploadedUrls);
    }

    // Attempt to restore original data if we have it
    try {
      await supabase.from("films").update(initialData).eq("id", initialData.id);
    } catch (rollbackError) {
      console.error("Failed to rollback film data:", rollbackError);
    }

    return {
      success: false,
      error: `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};

export const deleteFilm = async (
  filmId: string | number
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClient();

  try {
    const { data: film, error: fetchError } = await supabase
      .from("films")
      .select("posterUrl, genre, featured")
      .eq("id", filmId)
      .single();

    if (fetchError || !film) {
      return {
        success: false,
        error: fetchError ? fetchError.message : "Film not found",
      };
    }

    const { error: deleteError } = await supabase
      .from("films")
      .delete()
      .eq("id", filmId);

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete film: ${deleteError.message}`,
      };
    }

    if (film.posterUrl && film.posterUrl.length > 0) {
      await deleteFiles(film.posterUrl);
    }

    const cacheKeys = film.genre.map((g: string) => `film:${g}`);

    invalidateFilmCache(
      ["films", ...cacheKeys, ...(film.featured ? ["film-featured"] : [])],
      [`film:${filmId}`]
    );

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
};
