"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Play, Info, Plus, Check, Volume2, VolumeX } from "lucide-react";
import { Movie as Film } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface HeroBannerProps {
  film: Film;
  isFavorite?: boolean;
}

export default function HeroBanner({
  film,
  isFavorite = false,
}: HeroBannerProps) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(isFavorite);
  const [muted, setMuted] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const toggleFavorite = async () => {
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
    <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={film.posterUrl[currentSlide]}
          alt={film.title}
          fill
          priority
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-16 max-w-screen-lg">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {film.title}
        </h1>

        <div className="flex items-center text-sm text-gray-300 mb-4 space-x-4">
          <span>{film.releaseYear}</span>
          <span className="border px-1 text-xs border-gray-500">
            {String(film.rating)}
          </span>
          <span>{film.duration} min</span>
          <span className="hidden md:inline">HD</span>
        </div>

        <p className="text-white text-sm md:text-base max-w-md md:max-w-2xl mb-6 line-clamp-3 md:line-clamp-4">
          {film.description}
        </p>

        <div className="flex space-x-3">
          <Button
            size="lg"
            className="bg-white hover:bg-white/90 text-black font-semibold"
            onClick={() => router.push(`/film/${film.id}`)}
          >
            <Play className="mr-2 h-5 w-5" />
            Play
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="bg-gray-500/30 hover:bg-gray-500/50 border-none text-white font-semibold"
            onClick={() => router.push(`/film/${film.id}`)}
          >
            <Info className="mr-2 h-5 w-5" />
            More Info
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="ml-auto h-10 w-10 rounded-full border-white/40 bg-black/30 hover:bg-black/50"
            onClick={toggleFavorite}
          >
            {favorite ? (
              <Check className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 rounded-full border-white/40 bg-black/30 hover:bg-black/50"
            onClick={() => setMuted(!muted)}
          >
            {muted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Dots navigation */}
      <div className="   items-center justify-center flex space-x-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentSlide === index ? "w-6 bg-red-600" : "w-2 bg-gray-500"
            }`}
            onClick={() => {
              setCurrentSlide(index);
              setAutoplay(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}
