import { createClient } from "@/lib/supabase/server";
import { FilmFormData } from "@/types";
import { createFiles, deleteFiles } from "../files";
import { generateCachedEmbedding } from "../embedding";
import { invalidateFilmCache } from "@/lib/invalidate-cache";

export const createFilm = async (
  data: FilmFormData
): Promise<{ success: boolean; film?: any; error?: string }> => {
  let uploadedUrls: string[] = [];
  let createdFilm: any = null;
  const posterFiles = data.posterUrl;

  try {
    const supabase = await createClient();

    const embedding = await generateCachedEmbedding(
      `${data.title ?? ""}, ${data.description ?? ""}, ${
        data.genre?.length ? data.genre.join(" ") : ""
      }, ${data.tags?.length ? data.tags.join(" ") : ""}`
    );

    const { data: film, error: insertError } = await supabase
      .from("Movie")
      .insert({
        ...data,
        posterUrl: [],
        embedding,
        updatedAt: new Date(),
      })
      .select()
      .single();

    if (insertError?.message || !film) {
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
    uploadedUrls = await createFiles(
      posterFiles?.filter((file) => typeof file === "object") || [],
      "posters",
      filmId
    );

    if (uploadedUrls.length !== posterFiles?.length) {
      // If not all files were uploaded successfully, clean up and delete the film
      await deleteFiles(uploadedUrls);
      await supabase.from("Movie").delete().eq("id", filmId);
      return {
        success: false,
        error: "Failed to upload all poster images",
      };
    }

    // 3. Update the film record with the poster URLs
    const { data: updatedFilm, error: updateError } = await supabase
      .from("Movie")
      .update({
        posterUrl: uploadedUrls,
      })
      .eq("id", filmId)
      .select()
      .single();

    if (updateError) {
      // If update failed, delete uploaded images and the film record
      await deleteFiles(uploadedUrls);
      await supabase.from("Movie").delete().eq("id", filmId);
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
    const supabase = await createClient();

    if (createdFilm && createdFilm.id) {
      await supabase.from("Movie").delete().eq("id", createdFilm.id);
    }

    // If any unexpected error occurs, perform cleanup
    if (uploadedUrls.length > 0) {
      await deleteFiles(uploadedUrls);
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
      .from("Movie")
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
      .from("Movie")
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
