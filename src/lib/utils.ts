import { FormValues } from "@/hooks/use-film-form";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function extractYouTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : "";
}
export const debounce = (func: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
export function enumToOptions<T extends object>(
  enumObj: T
): { label: string; value: keyof T }[] {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // filter out reverse mapping if it's a numeric enum
    .map((key) => ({
      label: key,
      value: key,
    }));
}
export const splitCommaSeparatedString = (val: unknown) => {
  if (typeof val === "string") {
    return val
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return val;
};
export function appendFilmDataToFormData(formData: FormData, data: FormValues) {
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

  // Append image files and their URLs
  const posterUrls: string[] = [];
  data.posterUrl.forEach((file: File | string) => {
    if (file instanceof File) {
      formData.append("files", file); // 👈 matches `formidable`'s fieldname
    } else if (typeof file === "string") {
      posterUrls.push(file); // Collect URL strings in an array
    }
  });
  if (posterUrls.length > 0) {
    formData.append("posterUrl", JSON.stringify(posterUrls)); // Append the array of URLs as JSON
  }
  return formData;
}
