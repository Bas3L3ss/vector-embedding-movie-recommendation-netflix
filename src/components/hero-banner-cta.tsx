"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Info, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { Movie } from "@prisma/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import useToggleFavorite from "@/hooks/use-toggle-favorite";
import Link from "next/link";

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
  const { favorite, handleToggleFavorite } = useToggleFavorite(
    user,
    film,
    isFavorite
  );
  return (
    <div className="flex space-x-3">
      <Link href={`/film/${film.id}`}>
        <Button
          size="lg"
          className="bg-white hover:bg-white/90 text-black font-semibold"
          onClick={() => router.push(`/film/${film.id}`)}
        >
          <Play className="mr-2 h-5 w-5" />
          Play
        </Button>
      </Link>
      <Link href={`/film/${film.id}`}>
        <Button
          size="lg"
          variant="outline"
          className="bg-gray-500/40 hover:bg-gray-500/60 hover:text-white text-white border-0 gap-2 px-6 rounded-md"
          onClick={() => router.push(`/film/${film.id}`)}
        >
          <Info className="w-5 h-5" /> More Info
        </Button>
      </Link>
      <Button
        size="icon"
        variant="outline"
        className="ml-auto h-10 w-10 rounded-full text-white border-white/40 bg-black/30 hover:bg-black/50"
        onClick={handleToggleFavorite}
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
        className="h-10 w-10 rounded-full border-white/40 bg-black/30 text-white hover:bg-black/50"
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
