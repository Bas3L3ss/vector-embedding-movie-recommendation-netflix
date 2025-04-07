import React, { useState } from "react";
import { DataTableFilterBox } from "../../ui/table/data-table-filter-box";
import { DataTableSearch } from "../../ui/table/data-table-search";
import { GENRE_OPTIONS, useFilmTableFilters } from "./use-films-table-filters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import DataTableAddFilm from "../../ui/table/data-table-add-film";

export default function FilmTableAction({
  selectedFilmIds,
  setSelectedFilmIds,
}: {
  selectedFilmIds: string[];
  setSelectedFilmIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setSearchQuery,
    genresFilter,
    setgenresFilter,
  } = useFilmTableFilters();
  const [isDeletingFilms, setIsDeletingFilms] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeletingFilms(true);
    setOpen(false);
    try {
      const response = await fetch("/api/films", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedFilmIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete films");
      }

      const result = await response.json();
      console.log("Delete response:", result);
    } catch (error) {
      console.error("Failed to delete products:", error);
    } finally {
      setIsDeletingFilms(false);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-4 mt-5">
      <DataTableSearch
        searchKey="film"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DataTableFilterBox
        filterKey="genres"
        title="Genres"
        options={GENRE_OPTIONS}
        // @ts-expect-error: no prob
        setFilterValue={setgenresFilter}
        resetFilters={resetFilters}
        isAnyFilterActive={isAnyFilterActive}
        filterValue={genresFilter}
      />

      <DataTableAddFilm />
      {selectedFilmIds?.length > 0 && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className={cn(
                "flex items-center ",
                isDeletingFilms && "animate-pulse"
              )}
              disabled={isDeletingFilms}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              {selectedFilmIds?.length}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedFilmIds?.length}{" "}
                products? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingFilms}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeletingFilms}
              >
                {isDeletingFilms ? "Deleting..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
