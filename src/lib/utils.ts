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
