import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Play, Plus, ThumbsUp, Share2 } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FilmCarousel from "@/components/film-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { findSimilarMovies, getFilmById } from "@/actions/films";
import { Movie } from "@prisma/client";

export default async function FilmPage({ params }: { params: { id: string } }) {
  const film = await getFilmById(params.id);

  if (!film) {
    notFound();
  }
  const genres = film.genre;

  const similarFilms: Movie[] = await findSimilarMovies(
    film.embedding,
    0.5,
    10
  );

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="relative pt-16">
        {/* Hero Banner */}
        <div className="relative w-full h-[50vh] md:h-[70vh]">
          <Image
            src={film.posterUrl[0]}
            alt={film.title}
            fill
            priority
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-black font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
          </div>
        </div>

        {/* Film Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Poster */}
            <div className="hidden md:block">
              <div className="aspect-[2/3] relative rounded-md overflow-hidden">
                <Image
                  src={film.posterUrl[0]}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {film.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
                <span>{film.createdAt.getFullYear()}</span>
                <span className="border px-1 text-xs border-gray-500">
                  {String(film.rating)}
                </span>
                <span>{film.duration} min</span>
                <span className="text-green-500 font-semibold">97% Match</span>
                <span className="hidden md:inline">HD</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="bg-transparent border-gray-600"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-3 mb-6">
                <Button
                  size="sm"
                  className="bg-white hover:bg-white/90 text-black font-semibold"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </Button>

                <Button size="sm" variant="outline" className="border-gray-600">
                  <Plus className="mr-2 h-4 w-4" />
                  My List
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-gray-600"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-gray-600"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-white mb-6">{film.description}</p>

              <Separator className="my-6 bg-gray-800" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-gray-400 font-semibold mb-2">Cast</h3>
                  <p className="text-white">Cast information would go here</p>
                </div>

                <div>
                  <h3 className="text-gray-400 font-semibold mb-2">Director</h3>
                  <p className="text-white">
                    Director information would go here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Films */}
        <div className="mt-16">
          <Suspense fallback={<div className="h-60 bg-black"></div>}>
            {similarFilms.length > 0 && (
              <FilmCarousel
                title="More Like This"
                films={similarFilms.map((film) => ({
                  id: film.id,
                  title: film.title,
                  thumbnailUrl: film.posterUrl[0],
                  releaseYear: 2023, // Default values since the similarity search doesn't return full film details
                  duration: 120,
                  maturityRating: "PG-13",
                  description: "",
                  type: "MOVIE",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }))}
              />
            )}
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  );
}
