import { splitCommaSeparatedString } from "@/lib/utils";
import { Genre } from "@prisma/client";
import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    newPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const filmFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().min(5).max(1000),
  releaseYear: z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        const parsed = parseInt(val.toString(), 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    },
    z
      .number()
      .int()
      .min(1888, "Release year must be >= 1888")
      .max(
        new Date().getFullYear() + 1,
        "Release year cannot be beyond next year"
      )
  ),
  genre: z
    // @ts-expect-error: no prob
    .array(z.enum(Object.entries(Genre).map((g) => g[0])))
    .min(1, "Select at least one genre"),
  director: z.string().max(255).min(1, "Include director name"),
  cast: z.preprocess(
    splitCommaSeparatedString,
    z.array(z.string()).min(1, "Select at least one cast")
  ),
  duration: z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") {
      const parsed = parseInt(val.toString(), 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }, z.number().int().positive("Duration must be a positive number")),

  language: z.preprocess(
    splitCommaSeparatedString,
    z.array(z.string().max(50)).min(1, "Select at least one language")
  ),

  country: z.string().max(100).optional(),
  rating: z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") {
      const parsed = parseFloat(val.toString());
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }, z.number().min(0, "Minimum rating is 0.0").max(10, "Maximum rating is 10.0")),
  featured: z.boolean(),
  posterUrl: z
    .array(z.union([z.string().url(), z.instanceof(File)]))
    .min(1)
    .transform((val) =>
      val.map((item) => {
        if (typeof item === "string") return item;
        // custom logic to get preview or placeholder URL from File
        return item;
      })
    ),
  trailerUrl: z
    .preprocess(
      splitCommaSeparatedString,
      z
        .array(z.string().url("Invalid trailer URL"))
        .min(1, "Have atleast one trailer url")
    )
    .optional(),
  videoUrl: z.preprocess(
    splitCommaSeparatedString,
    z.array(z.string().url("Invalid video URL")).min(1)
  ),
});
