import { Readable } from "stream";
import formidable from "formidable";
import { genreTags } from "@/lib/mockdata";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createFiles, deleteFiles } from "@/actions/files";
import { generateCachedEmbedding } from "@/actions/embedding";
import { invalidateFilmCache } from "@/lib/invalidate-cache";
import { getFilmById } from "@/actions/films/server-only";

export const config = {
  api: {
    bodyParser: false,
  },
};

function webStreamToNodeReadable(webStream: ReadableStream<Uint8Array>) {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      this.push(done ? null : Buffer.from(value));
    },
  });
}

async function parseFormData(req: NextRequest) {
  const nodeReadable = webStreamToNodeReadable(req.body!);

  // Patch a fake "req" with headers
  const fakeReq: any = nodeReadable;
  fakeReq.headers = {
    "content-type": req.headers.get("content-type") || "",
    "content-length": req.headers.get("content-length") || "",
  };

  const form = formidable({ multiples: true });

  return new Promise<[formidable.Fields, formidable.Files]>(
    (resolve, reject) => {
      form.parse(fakeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    }
  );
}

function extractFormFields(fields: formidable.Fields) {
  const filmId = fields.id?.[0];

  // Parse form data into a structured object
  const updatedData: any = {};
  Object.keys(fields).forEach((key: string) => {
    if (
      key === "id" ||
      key === "originalPosterUrls" ||
      key === "keptPosterUrls"
    ) {
      return; // Skip these fields as they're handled separately
    }

    // Get the first element of the array
    let value = fields[key][0];

    // Try to parse the value if it's a JSON string
    try {
      const parsedValue = JSON.parse(value);
      updatedData[key] = parsedValue;
    } catch (error) {
      // Otherwise, use the string value
      updatedData[key] = value;
    }
  });

  // Handle tags for genres
  updatedData.tags = [];
  if (updatedData.genre && Array.isArray(updatedData.genre)) {
    updatedData.genre.forEach((element: string) => {
      // @ts-expect-error: no prob
      updatedData.tags.push(...genreTags[element]);
    });
  }

  // Parse URL arrays
  const keptPosterUrls = fields.keptPosterUrls
    ? JSON.parse(fields.keptPosterUrls[0])
    : [];

  const originalPosterUrls = fields.originalPosterUrls
    ? JSON.parse(fields.originalPosterUrls[0])
    : [];

  return { filmId, updatedData, keptPosterUrls, originalPosterUrls };
}

function processFileUploads(files: formidable.Files) {
  return files.files
    ? (Array.isArray(files.files) ? files.files : [files.files]).map(
        (file) => ({
          ...file,
          name: file.originalFilename,
        })
      )
    : [];
}

async function handleImageUploads(
  filmId: string,
  newFiles: formidable.File[],
  keptPosterUrls: string[],
  originalPosterUrls: string[]
) {
  // Find URLs to delete (in original but not in kept)
  const urlsToDelete = originalPosterUrls.filter(
    (url: string) => !keptPosterUrls.includes(url)
  );

  // Upload new files if any
  let newUploadedUrls: string[] = [];
  if (newFiles.length > 0) {
    newUploadedUrls = await createFiles(newFiles, "posters", filmId.toString());

    if (newUploadedUrls.length !== newFiles.length) {
      // Clean up any partially uploaded files
      await deleteFiles(newUploadedUrls);
      throw new Error("Failed to upload all poster images");
    }
  }

  return { urlsToDelete, newUploadedUrls };
}

async function updateFilmRecord(
  filmId: string,
  updatedData: any,
  posterUrls: string[]
) {
  // Generate embeddings for search
  const embedding = await generateCachedEmbedding(
    `${updatedData.title ?? ""}, ${updatedData.description ?? ""}, ${
      updatedData.genre?.join(" ") ?? ""
    }, ${updatedData.tags.join(" ")}`
  );

  // Update film record
  const supabase = await createClient();
  const { data: updatedFilm, error: updateError } = await supabase
    .from("Movie")
    .update({
      ...updatedData,
      posterUrl: posterUrls,
      embedding,
    })
    .eq("id", filmId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update film: ${updateError.message}`);
  }

  return updatedFilm;
}

async function handleCacheInvalidation(filmId: string, updatedData: any) {
  // Invalidate cache for affected film
  const cacheKeys = updatedData.genre.map((g: string) => `film:${g}`);
  await invalidateFilmCache(
    ["films", ...cacheKeys, ...(updatedData.featured ? ["film-featured"] : [])],
    [`film:${filmId}`]
  );
}

export async function PUT(req: NextRequest) {
  try {
    // Parse the form data
    const [fields, files] = await parseFormData(req);

    // Extract and validate fields
    const { filmId, updatedData, keptPosterUrls, originalPosterUrls } =
      extractFormFields(fields);

    if (!filmId) {
      return NextResponse.json(
        { success: false, error: "Film ID is required" },
        { status: 400 }
      );
    }

    // Process file uploads
    const newFiles = processFileUploads(files);

    // Fetch current film data
    await getFilmById(filmId);

    // Handle image uploads and deletions
    const { urlsToDelete, newUploadedUrls } = await handleImageUploads(
      filmId,
      newFiles,
      keptPosterUrls,
      originalPosterUrls
    );

    // Combine kept URLs with newly uploaded URLs
    const allPosterUrls = [...keptPosterUrls, ...newUploadedUrls];

    // Update the film record
    const updatedFilm = await updateFilmRecord(
      filmId,
      updatedData,
      allPosterUrls
    );

    // Delete unused poster images after successful update
    if (urlsToDelete.length > 0) {
      await deleteFiles(urlsToDelete);
    }

    // Invalidate cache
    await handleCacheInvalidation(filmId, updatedData);

    return NextResponse.json(
      { success: true, film: updatedFilm },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating film:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
