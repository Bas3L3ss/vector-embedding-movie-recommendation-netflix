import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { filmFormSchema } from "@/schema";
import { z } from "zod";
import { appendFilmDataToFormData } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type FormValues = z.infer<typeof filmFormSchema>;

const useFilmForm = ({
  initialData,
}: {
  initialData: Partial<FormValues> | null;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      title: initialData?.title || "",
      description: initialData?.description || "",
      director: initialData?.director || "",
      releaseYear: initialData?.releaseYear || null || undefined,
      cast: initialData?.cast || [],
      duration: initialData?.duration || 0,
      language: initialData?.language || [],
      country: initialData?.country || "",
      rating: initialData?.rating || undefined,
      featured: initialData?.featured || false,
      posterUrl: initialData?.posterUrl || [],
      trailerUrl: initialData?.trailerUrl || [],
      videoUrl: initialData?.videoUrl || [],
    }),
    [initialData]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(filmFormSchema),
    defaultValues: {
      ...defaultValues,
      genre: initialData?.genre || [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Add other fields

    try {
      const url = initialData
        ? // @ts-expect-error: no prob
          `/api/films/${initialData.id}` // update endpoint
        : "/api/films"; // create endpoint

      const method = initialData ? "PUT" : "POST";

      const formData = new FormData();
      if (!initialData) {
        appendFilmDataToFormData(formData, data);
      } else {
        formData.append("id", initialData.id);

        // Add all the form fields for the updated data
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("releaseYear", String(data.releaseYear));
        formData.append("duration", String(data.duration));
        formData.append("director", data.director);
        formData.append("featured", String(data.featured));
        formData.append("genre", JSON.stringify(data.genre));
        formData.append("cast", JSON.stringify(data.cast));
        formData.append("country", JSON.stringify(data.country));
        formData.append("rating", JSON.stringify(data.rating));
        formData.append("trailerUrl", JSON.stringify(data.trailerUrl));
        formData.append("language", JSON.stringify(data.language));
        formData.append("videoUrl", JSON.stringify(data.videoUrl));

        // Handle poster URLs that should be kept
        const posterUrls: string[] = [];

        // Process each poster (file or URL string)
        data.posterUrl.forEach((file: File | string) => {
          if (file instanceof File) {
            formData.append("files", file); // Append actual files to be uploaded
          } else if (typeof file === "string") {
            posterUrls.push(file); // Collect URL strings to be kept
          }
        });

        // Append the array of URLs to keep as JSON string
        if (posterUrls.length > 0) {
          formData.append("keptPosterUrls", JSON.stringify(posterUrls));
        }

        // Original poster URLs for comparison to determine which to delete
        formData.append(
          "originalPosterUrls",
          JSON.stringify(initialData.posterUrl || [])
        );
      }

      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Response was not okay");
      }

      const result = await response.json();
      toast.success(`Film ${initialData ? "updated" : "created"} successfully`);
      console.log(result);
    } catch (error) {
      console.error("Error submitting film:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  const addImageField = () => {
    const currentImages = form.getValues("posterUrl");
    if (currentImages.length < 5) {
      form.setValue("posterUrl", [...currentImages, ""]);
    }
  };

  const removeImageField = (index: number) => {
    const currentImages = form.getValues("posterUrl");

    if (currentImages.length > 2) {
      const newImages: Array<string | File> = [];
      currentImages.forEach((img, i) => {
        if (index !== i) {
          newImages.push(img);
        }
      });

      form.setValue("posterUrl", newImages);
    }
  };

  return {
    addImageField,
    defaultValues,
    form,
    isSubmitting,
    onSubmit,
    removeImageField,
  };
};

export default useFilmForm;
