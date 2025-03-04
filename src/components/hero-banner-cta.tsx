"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Info, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { Movie } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase/client";

const HeroBannerCta = ({
  film,
  user,
  isFavorite,
}: {
  film: Movie;
  isFavorite: boolean;
  user: User | null;
}) => {
  const router = useRouter();
  const [muted, setMuted] = useState(true);
  const [favorite, setFavorite] = useState(isFavorite);
  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to add films to your list",
      });
      return;
    }

    try {
      if (favorite) {
        const { error } = await supabase()
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
        const { error } = await supabase().from("favorites").insert({
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
  );
};

export default HeroBannerCta;
