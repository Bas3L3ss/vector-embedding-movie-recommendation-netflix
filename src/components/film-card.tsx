"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check, Info } from "lucide-react";
import { Movie as Film } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface FilmCardProps {
  film: Film;
  isFavorite?: boolean;
  user: User | null;
}

export default function FilmCard({
  film,
  isFavorite = false,
  user,
}: FilmCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to add films to your list",
      });
      return;
    }

    try {
      if (favorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("film_id", film.id);

        if (error) throw error;
        setFavorite(false);
        toast("Removed from My List", {
          description: `${film.title} has been removed from your list`,
        });
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          film_id: film.id,
        });

        if (error) throw error;
        setFavorite(true);
        toast("Added to My List", {
          description: `${film.title} has been added to your list`,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error", {
        description: "There was an error updating your list",
      });
    }
  };

  return (
    <Link href={`/film/${film.id}`}>
      <div
        className="relative group rounded-md overflow-hidden transition-transform duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[16/9] relative">
          <Image
            src={film.posterUrl[0]}
            alt={film.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content overlay */}
          {isHovered && (
            <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
              <h3 className="font-bold truncate">{film.title}</h3>
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
                  onClick={toggleFavorite}
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
              <div className="flex items-center text-xs mt-2 text-gray-300">
                <span className="mr-2">{film.releaseYear}</span>
                <span className="mr-2 border px-1 text-[10px] border-gray-500">
                  {String(film.rating)}
                </span>
                <span>{film.duration} min</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
