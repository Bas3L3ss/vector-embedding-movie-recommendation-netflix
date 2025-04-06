import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const GENRE_OPTIONS = Object.values(Genre).map((genre) => ({
  value: genre,
  label:
    genre.charAt(0).toUpperCase() +
    genre.slice(1).toLowerCase().replace(/_/g, " "),
}));

export function useFilmTableFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const genresFilter = searchParams.get("genres") || "";
  const page = Number(searchParams.get("page")) || 1;

  const setQueryParams = useCallback(
    (newParams: { q?: string; genres?: string; page?: string }) => {
      // Create a new URLSearchParams object based on the current params
      const params = new URLSearchParams(searchParams.toString());

      // Update each parameter as needed
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      // Navigate to the new URL with Next.js router
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const resetFilters = useCallback(() => {
    setQueryParams({ q: "", genres: "", page: "1" });
  }, [setQueryParams]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!genresFilter;
  }, [searchQuery, genresFilter]);

  return {
    searchQuery,
    setSearchQuery: (value: string) => setQueryParams({ q: value }),
    page,
    setPage: (value: string) => setQueryParams({ page: value }),
    resetFilters,
    isAnyFilterActive,
    genresFilter,
    setgenresFilter: (value: string) => setQueryParams({ genres: value }),
  };
}
