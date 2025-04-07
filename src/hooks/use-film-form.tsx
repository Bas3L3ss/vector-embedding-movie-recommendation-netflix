import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { filmFormSchema } from "@/schema";
import { z } from "zod";
import { createFilm } from "@/actions/films/admin";

export type FormValues = z.infer<typeof filmFormSchema>;

const useFilmForm = ({
  initialData,
}: {
  initialData: Partial<FormValues> | null;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Add other fields

    try {
      const url = initialData
        ? // @ts-expect-error: no prob
          `/api/films/${initialData.id}` // update endpoint
        : "/api/films"; // create endpoint

      const method = initialData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
