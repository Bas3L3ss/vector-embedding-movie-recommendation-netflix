import { createClient } from "@/lib/supabase/server";

export const createFiles = async (
  newFiles: File[],
  folderName: string,
  filmId: string
): Promise<string[]> => {
  const supabase = await createClient();
  const shortId = filmId.substring(0, 10);

  const uploadPromises = newFiles.map(async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const baseName = file.name.substring(0, file.name.lastIndexOf("."));
      const fileName = `${baseName}_${shortId}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;

      const { error } = await supabase.storage
        .from("films-assets")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Error uploading file:", error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("films-assets")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error processing file:", error);
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);

  return results.filter((url) => url !== null) as string[];
};

export const deleteFiles = async (urls: string[]): Promise<boolean> => {
  const supabase = await createClient();
  let allSuccess = true;

  for (const url of urls) {
    try {
      const pathMatch = url.match(/\/films-assets\/(.+)$/);

      if (!pathMatch || !pathMatch[1]) {
        console.error("Could not extract path from URL:", url);
        allSuccess = false;
        continue;
      }

      const path = pathMatch[1];

      const { error } = await supabase.storage
        .from("films-assets")
        .remove([path]);

      if (error) {
        console.error("Error deleting file:", error);
        allSuccess = false;
      }
    } catch (error) {
      console.error("Unexpected error in deleteFiles:", error);
      allSuccess = false;
    }
  }

  return allSuccess;
};
