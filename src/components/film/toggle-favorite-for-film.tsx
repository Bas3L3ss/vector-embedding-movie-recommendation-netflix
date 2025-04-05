"use client";

import React from "react";
import { Button } from "../ui/button";
import { Minus, Play, Plus } from "lucide-react";
import useToggleFavorite from "@/hooks/use-toggle-favorite";
import { User } from "@supabase/supabase-js";
import { Movie } from "@prisma/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const ToggleFavoriteForFilm = ({
  user,
  film,
  isFavorite,
}: {
  user: User | null;
  film: Movie;
  isFavorite: boolean;
}) => {
  const { favorite, handleToggleFavorite } = useToggleFavorite(
    user,
    film,
    isFavorite
  );
  const isMobile = useIsMobile();
  return (
    <>
      <Button
        size={isMobile ? "default" : "lg"}
        className="bg-white  hover:bg-white/90  text-black font-semibold"
        onClick={() => {
          toast("Not supported yet");
        }}
      >
        <Play className="mr-2 h-5 w-5 fill-black" />
        Play
      </Button>
      <Button
        size={isMobile ? "default" : "lg"}
        variant="outline"
        onClick={handleToggleFavorite}
        className="border-gray-600  
      hover:bg-white/90
        "
      >
        {!favorite ? (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Add to my List
          </>
        ) : (
          <>
            <Minus className="mr-2 h-5 w-5" />
            Remove from my List
          </>
        )}
      </Button>
    </>
  );
};

export default ToggleFavoriteForFilm;
