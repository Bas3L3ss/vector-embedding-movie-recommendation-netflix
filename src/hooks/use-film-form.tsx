import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { filmFormSchema } from "@/schema";
import { z } from "zod";

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
      rating: initialData?.rating || undefined || null,
      featured: initialData?.featured || false,
      posterUrl: initialData?.posterUrl || [],
      trailerUrl: initialData?.trailerUrl || [],
      videoUrl: initialData?.videoUrl || [],
      tags: initialData?.tags || [],
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

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        // await updateFilm(initialData._id, data);
        console.log(data, "create");
      } else {
        console.log(data, "update");

        // await createFilm(data);
      }
      toast.success(`Film ${initialData ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

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
