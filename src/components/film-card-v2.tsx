"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Plus,
  Check,
  Info,
  Star,
  Clock,
  Calendar,
  Award,
} from "lucide-react";
import type { Movie as Film } from "@prisma/client";
import { Button } from "./ui/button";
import type { User } from "@supabase/supabase-js";
import useToggleFavorite from "@/hooks/use-toggle-favorite";
import { Badge } from "./ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilmCardProps {
  film: Film;
  isFavorite?: boolean;
  user: User | null;
}

export default function FilmCardV2({
  film,
  isFavorite = false,
  user,
}: FilmCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const { favorite, handleToggleFavorite } = useToggleFavorite(
    user,
    film,
    isFavorite
  );

  if (!film) {
    return null;
  }

  // Format genres for display
  const displayGenres = film.genre
    .slice(0, 2)
    .map((genre) => genre.replace("_", " ").toLowerCase());

  // Truncate description
  const truncatedDescription = film.description
    ? film.description.length > 100
      ? `${film.description.substring(0, 100)}...`
      : film.description
    : "No description available";

  return (
    <Link href={`/film/${film.id}`}>
      <div
        className="relative group rounded-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[16/9] relative">
          <Image
            src={film.posterUrl[1] || "/placeholder.svg"}
            alt={film.title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Featured badge */}
          {film.featured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge
                variant="secondary"
                className="bg-amber-500 text-black font-medium"
              >
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Gradient overlay - improved for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content overlay */}
          {isHovered || isMobile ? (
            <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
              <div className="flex flex-wrap gap-1 mb-1">
                {displayGenres.map((genre, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] py-0 h-4 border-white/40 text-white/90"
                  >
                    {genre}
                  </Badge>
                ))}
                {film.genre.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-4 border-white/40 text-white/90"
                  >
                    +{film.genre.length - 2} more
                  </Badge>
                )}
              </div>

              <h3 className="font-bold text-sm md:text-base truncate">
                {film.title}
              </h3>

              {film.director && (
                <p className="text-xs text-gray-300 mt-0.5">
                  Dir: {film.director}
                </p>
              )}

              <p className="text-xs text-gray-300 mt-1 line-clamp-2 hidden md:block">
                {truncatedDescription}
              </p>

              <div className="flex items-center space-x-2 mt-2">
                <Button
                  size="icon"
                  variant="default"
                  className="h-8 w-8 rounded-full bg-white hover:bg-white/90 text-black"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full border-white/40 bg-black/30 hover:bg-black/50"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                >
                  {favorite ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full border-white/40 bg-black/30 hover:bg-black/50 ml-auto"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center text-xs mt-2 text-gray-300 flex-wrap gap-y-1">
                <div className="flex items-center mr-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{film.releaseYear}</span>
                </div>

                <div className="flex items-center mr-3">
                  <Star className="h-3 w-3 mr-1 fill-amber-400 stroke-amber-400" />
                  <span>{Number(film.rating).toFixed(1)}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{film.duration} min</span>
                </div>

                {film.language && film.language.length > 0 && (
                  <div className="ml-auto">
                    <span className="text-[10px] uppercase">
                      {film.language[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Non-hovered state - show minimal info
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-medium text-sm text-white truncate">
                {film.title}
              </h3>
              <div className="flex items-center text-xs text-gray-300">
                <span>{film.releaseYear}</span>
                {film.rating && (
                  <div className="flex items-center ml-2">
                    <Star className="h-3 w-3 mr-0.5 fill-amber-400 stroke-amber-400" />
                    <span>{Number(film.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
