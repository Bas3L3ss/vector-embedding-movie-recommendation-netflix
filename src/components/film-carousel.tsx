import { Movie as Film } from "@prisma/client";

import { User } from "@supabase/supabase-js";
import FilmCarouselItems from "./film-carousel-items";

interface FilmCarouselProps {
  title: string;
  films: Film[];
  favorites?: string[];
  user: User | null;
}

export default function FilmCarousel({
  favorites,
  user,
  title,
  films,
}: FilmCarouselProps) {
  return (
    <div className="relative group py-4">
      <h2 className="text-xl font-bold mb-4 text-white pl-4 md:pl-8">
        {title}
      </h2>

      <FilmCarouselItems films={films} user={user} />
    </div>
  );
}
