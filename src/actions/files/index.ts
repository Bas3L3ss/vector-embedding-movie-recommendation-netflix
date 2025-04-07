import { createClient } from "@/lib/supabase/server";

export const createFiles = async (
  newFiles: any[],
  folderName: string,
  filmId: string
): Promise<string[]> => {
  if (newFiles.length < 1) return [];

  const supabase = await createClient();
  const shortId = filmId.substring(0, 10);

  const uploadPromises = newFiles.map(async (file) => {
    if (typeof file === "string") return file; // Already a URL

    try {
      let fileData, fileName, fileExt;

      if (file.originalFilename) {
        // This is a file from formidable or similar
        const fs = require("fs").promises;
        fileData = await fs.readFile(file.filepath);
        fileName = file.originalFilename;
        fileExt = fileName.split(".").pop();
      } else {
        // Standard File object
        fileData = file;
        fileName = file.name;
        fileExt = fileName.split(".").pop();
      }

      const baseName = fileName.substring(0, fileName.lastIndexOf("."));
      const uniqueFileName = `${baseName}_id:${shortId}.${fileExt}`;
      const filePath = decodeURIComponent(`${folderName}/${uniqueFileName}`);

      const { error } = await supabase.storage
        .from("posters")
        .upload(filePath, fileData, {
          contentType: file.mimetype || `image/${fileExt}`, // Set the correct content type
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Error uploading file:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("posters")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error processing file:", error);
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);
  const validUrls = results.filter((url) => url !== null) as string[];

  if (validUrls.length !== newFiles.length) {
    console.error("Failed to upload all poster images");
  }

  return validUrls;
};
export const deleteFiles = async (urls: string[]): Promise<boolean> => {
  const supabase = await createClient();

  try {
    const deletionResults = await Promise.all(
      urls.map(async (u) => {
        try {
          const url = decodeURIComponent(u);
          // Check if this is a full URL or just a path
          let path;

          if (url.includes("supabase.co/storage/v1/object/")) {
            // Handle full Supabase URLs
            const pathMatch = url.match(/public\/posters\/posters\/(.+)$/);
            if (!pathMatch || !pathMatch[1]) {
              console.error("Could not extract path from URL:", url);
              return false;
            }
            path = pathMatch[1];
          } else if (url.startsWith("public/posters/posters/")) {
            path = url.replace("public/posters/posters/", "");
          } else {
            path = url;
          }

          // Log the path we're going to delete
          console.log(`Attempting to delete: posters/${path}`);

          const { error } = await supabase.storage
            .from("posters")
            .remove([`posters/${path}`]);

          if (error) {
            console.error(`Error deleting posters/${path}:`, error);
            return false;
          }

          return true;
        } catch (error) {
          console.error("Error processing URL:", url, error);
          return false;
        }
      })
    );

    return deletionResults.every((result) => result === true);
  } catch (error) {
    console.error("Unexpected error in deleteFiles:", error);
    return false;
  }
};
