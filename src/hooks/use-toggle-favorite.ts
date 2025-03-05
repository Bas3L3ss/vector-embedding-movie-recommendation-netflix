import { toggleFavorites } from "@/actions/films";
import { Movie } from "@prisma/client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { toast } from "sonner";

const useToggleFavorite = (
  user: User | null,
  film: Movie,
  isFavorite: boolean
) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to add films to your list",
      });
      return;
    }

    try {
      await toggleFavorites(user.id, film.id, isFavorite);
      if (favorite) {
        setFavorite(false);
        toast("Removed from My List", {
          description: `${film.title} has been removed from your list`,
        });
      } else {
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
  return { favorite, handleToggleFavorite };
};

export default useToggleFavorite;
