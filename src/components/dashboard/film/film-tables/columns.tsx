"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Movie } from "@prisma/client";
import Image from "next/image";
export const columns: ColumnDef<Movie>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-2 py-1">
        <Checkbox
          className="size-5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-1">
        <Checkbox
          className="size-5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Poster
  {
    accessorKey: "posterUrl",
    header: "POSTER",
    cell: ({ row }) => {
      const { posterUrl, title } = row.original;
      const firstPoster = posterUrl?.[0];

      return (
        <div className="p-2">
          {firstPoster ? (
            <Image
              src={firstPoster}
              alt={title}
              width={64}
              height={64}
              className="object-cover rounded-md border border-gray-800"
            />
          ) : (
            <div className="h-16 w-16 bg-gray-800 flex items-center justify-center rounded-md">
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>
      );
    },
  },

  // Title
  {
    accessorKey: "title",
    header: "TITLE",
    cell: ({ row }) => {
      const title = row.original.title;

      return (
        <div className="px-2 py-1 font-medium text-slate-100">{title}</div>
      );
    },
  },

  // Genre
  {
    accessorKey: "genre",
    header: "GENRE",
    cell: ({ row }) => {
      const genres = row.original.genre;

      return (
        <div className="px-2 py-1 flex flex-wrap gap-1">
          {genres.map((genre, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-800 text-slate-200 rounded-md text-xs capitalize"
            >
              {genre.toLowerCase().replace("_", " ")}
            </span>
          ))}
        </div>
      );
    },
  },

  // Release Year
  {
    accessorKey: "releaseYear",
    header: "YEAR",
    cell: ({ row }) => {
      const releaseYear = row.original.releaseYear;

      return <div className="px-2 py-1 text-slate-100">{releaseYear}</div>;
    },
  },

  // Rating
  {
    accessorKey: "rating",
    header: "RATING",
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="px-2 py-1 text-slate-100">
          {/* @ts-expect-error: no prob */}
          {rating ? `${parseFloat(rating as string).toFixed(1)}/10` : "N/A"}
        </div>
      );
    },
  },

  // Duration
  {
    accessorKey: "duration",
    header: "DURATION",
    cell: ({ row }) => {
      const minutes = row.original.duration;

      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      const durationString =
        hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;

      return <div className="px-2 py-1 text-slate-100">{durationString}</div>;
    },
  },

  // Description
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => {
      const description = row.original.description || "";

      const truncated =
        description.length > 40
          ? `${description.substring(0, 40)}...`
          : description;

      return (
        <div className="px-2 py-1 text-slate-100">
          <span title={description}>{truncated}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "trailer",
    header: "TRAILER_URL",
    cell: ({ row }) => {
      const trailerUrl = row.original.trailerUrl || [];

      return (
        <div className="px-2 py-1 flex flex-wrap gap-1">
          {trailerUrl?.length > 0 && (
            <span title={trailerUrl[0]}>{trailerUrl[0]}</span>
          )}
        </div>
      );
    },
  },

  // Featured
  {
    accessorKey: "featured",
    header: "FEATURED",
    cell: ({ row }) => {
      const featured = row.original.featured;

      return (
        <div className="px-2 py-1">
          {featured ? (
            <span className="px-2 py-1 bg-amber-800 text-amber-100 rounded-md text-xs">
              Featured
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      );
    },
  },

  // Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const filmId = row.original.id;

      return (
        <div className="px-2 py-1">
          <CellAction
            // @ts-expect-error: no prob
            filmId={filmId as string}
            onUpdate={() => {
              window.location.assign(`/data/${filmId}`);
            }}
          />
        </div>
      );
    },
  },
];
