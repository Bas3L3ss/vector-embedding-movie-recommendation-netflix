import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Play,
  ThumbsUp,
  Share2,
  Info,
  Star,
  Award,
  Clock,
  Calendar,
  Globe,
  MessageCircle,
} from "lucide-react";

import FilmCarousel from "@/components/film-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { Movie } from "@prisma/client";
import { createClient } from "@/lib/supabase/server";
import { extractYouTubeId } from "@/lib/utils";
import {
  findSimilarMovies,
  getFavorites,
  getFilmById,
} from "@/actions/films/server-only";
import { Metadata } from "next";
import ToggleFavoriteForFilm from "@/components/film/toggle-favorite-for-film";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const filmId = (await params).id;
  const film = await getFilmById(filmId);

  const title = film?.title ? `${film.title} | Netflix` : "Not found";
  const description = film?.description ?? "";
  const imageUrl = film?.posterUrl[0];
  return {
    title,
    description,
    keywords: [
      "Netflix",
      `${film?.title}`,
      `${film?.genre}`,
      "Watch",
      `${film?.tags}`,
    ],
    alternates: {
      canonical: imageUrl,
    },
    openGraph: {
      title,
      description,
      url: imageUrl,
      siteName: "Netflix",
      images: [
        {
          url: imageUrl ?? "",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [...(film?.posterUrl ?? "")],
    },
  };
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const film: Movie | null = await getFilmById(id);
  const user = (await (await createClient()).auth.getUser()).data.user;

  let favorites;
  if (!film) {
    notFound();
  }
  if (user) {
    favorites = (await getFavorites(user.id)).map((m) => m.Movie);
  }

  const genres = film.genre;

  const similarFilms: Movie[] = (
    await findSimilarMovies(
      // @ts-expect-error: no problem
      film.embedding,
      0.75,
      11
    )
  ).slice(1);

  // Format cast as an array if it's a string
  const castArray =
    typeof film.cast === "string"
      ? //@ts-expect-error: no problem

        film.cast.split(",").map((actor) => actor.trim())
      : film.cast;

  // Calculate match percentage based on rating
  const matchPercentage = Math.min(
    Math.round((Number(film.rating) / 10) * 100),
    98
  );

  // Mock data for enhanced details
  const criticScore = Math.round(Number(film.rating) * 10);
  const audienceScore = Math.min(
    criticScore + Math.floor(Math.random() * 10) - 5,
    100
  );

  // Mock awards
  const awards =
    film.rating && Number(film.rating) > 7.5
      ? ["Academy Award Nominee", "Golden Globe Winner"]
      : [];

  // Mock reviews
  const reviews = [
    {
      author: "Film Critic",
      avatar: "/placeholder.svg?height=40&width=40",
      text: `A masterful ${genres[0]?.toLowerCase()} that captivates from start to finish. ${
        film.director
      }'s direction is impeccable.`,
      rating: 4.5,
    },
    {
      author: "Audience Member",
      avatar: "/placeholder.svg?height=40&width=40",
      text: `${
        castArray[0]
      } delivers a stunning performance in this ${genres[0]?.toLowerCase()} masterpiece.`,
      rating: 4.2,
    },
  ];

  // Content rating based on film genre
  const contentRating = genres.includes("FAMILY")
    ? "PG"
    : genres.includes("HORROR") || genres.includes("THRILLER")
    ? "R"
    : "PG-13";

  return (
    <section className="relative">
      {/* Hero Banner with Video Trailer Overlay */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]  overflow-hidden">
        <Image
          src={film?.posterUrl?.[1] || "/placeholder.svg"}
          alt={film.title}
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />

        {/* Enhanced gradient overlays with better mobile support */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black to-transparent" />

        {/* Play button overlay with animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="sm"
            className="bg-white hover:bg-white/90 text-black font-semibold transition-transform hover:scale-105 shadow-lg sm:text-base sm:px-4 md:size-lg"
          >
            <Play className="mr-1 h-4 w-4 sm:h-5 sm:w-5 fill-black" />
            Play
          </Button>
        </div>

        {/* Film title overlay for mobile with improved spacing */}
      </div>

      {/* Film Details Section with improved responsive layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 -mt-16 sm:-mt-24 md:-mt-32 relative z-10">
        <div className="  block bottom-0 left-0 right-0  py-4 sm:p-6 md:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 drop-shadow-md line-clamp-2">
            {film.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-300">
            <span className="text-green-500 font-semibold">
              {matchPercentage}% Match
            </span>
            <span>{new Date(film.createdAt).getFullYear()}</span>
            <span className="border px-1 text-xs border-gray-500">
              {contentRating}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Poster and Quick Stats */}
          <div className="hidden md:block">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl border border-gray-800">
              <Image
                src={film?.posterUrl?.[0] || "/placeholder.svg"}
                alt={film.title}
                sizes="(max-width: 768px) 100vw, 33vw"
                fill
                className="object-cover"
              />
            </div>

            {/* Quick Stats */}
            <div className="mt-4 lg:mt-6 bg-gray-900/60 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-gray-800">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500 mr-1 fill-yellow-500" />
                  <span className="text-white font-bold">
                    {film.rating?.toString()}/10
                  </span>
                </div>
                <span className="text-xs lg:text-sm text-gray-400">IMDb</span>
              </div>

              <div className="space-y-2 lg:space-y-3">
                <div>
                  <div className="flex justify-between text-xs lg:text-sm mb-1">
                    <span className="text-gray-400">Critic Score</span>
                    <span className="text-white">{criticScore}%</span>
                  </div>
                  <Progress value={criticScore} className="h-1 lg:h-1.5" />
                </div>

                <div>
                  <div className="flex justify-between text-xs lg:text-sm mb-1">
                    <span className="text-gray-400">Audience Score</span>
                    <span className="text-white">{audienceScore}%</span>
                  </div>
                  <Progress value={audienceScore} className="h-1 lg:h-1.5" />
                </div>
              </div>

              {awards.length > 0 && (
                <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-800">
                  <h4 className="text-gray-400 text-xs lg:text-sm mb-2">
                    Awards
                  </h4>
                  <div className="space-y-1 lg:space-y-2">
                    {awards.map((award, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="h-3 w-3 lg:h-4 lg:w-4 text-yellow-500 mr-1 lg:mr-2" />
                        <span className="text-xs lg:text-sm text-white">
                          {award}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details with better spacing on different screen sizes */}
          <div className="md:col-span-2">
            {/* Title and basic info - hidden on mobile as it's shown in the hero */}
            <div className="hidden md:block">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 lg:mb-3 leading-tight">
                {film.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-xs lg:text-sm text-gray-300 mb-3 lg:mb-4">
                <span className="text-green-500 font-semibold">
                  {matchPercentage}% Match
                </span>
                <span>{new Date(film.createdAt).getFullYear()}</span>
                <span className="border px-1 text-xs border-gray-500">
                  {contentRating}
                </span>
                <span>{film.duration} min</span>
                <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">
                  HD
                </span>
                <span className="bg-gray-800 px-1.5 py-0.5 rounded text-xs">
                  5.1
                </span>
              </div>
            </div>

            {/* Action Buttons with improved mobile layout */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <ToggleFavoriteForFilm
                // @ts-expect-error: no prob
                isFavorite={favorites?.some((f) => f.id == film.id)}
                user={user}
                film={film}
              />

              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-gray-600 hover:bg-gray-800 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-gray-600 hover:bg-gray-800 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Film metadata with icons - improved grid for small screens */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm text-gray-300">
                  {new Date(film.createdAt).getFullYear()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm text-gray-300">
                  {film.duration} minutes
                </span>
              </div>
              <div className="flex items-center">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm text-gray-300">
                  {film.language?.[0] || "English"}
                </span>
              </div>
              <div className="flex items-center">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm text-gray-300">
                  {contentRating}
                </span>
              </div>
            </div>

            {/* Genres with better wrapping on small screens */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="bg-gray-800/50 hover:bg-gray-700 text-white border-gray-700 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Description with adaptive text size */}
            <p className="text-white text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              {film.description}
            </p>

            {/* Tabs for different content sections */}
            <Tabs defaultValue="details" className="mt-6 sm:mt-8">
              <TabsList className="bg-gray-900/60 border border-gray-800 w-full overflow-x-auto">
                <TabsTrigger value="details" className="text-xs sm:text-sm">
                  Details
                </TabsTrigger>
                <TabsTrigger value="cast" className="text-xs sm:text-sm">
                  Cast & Crew
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="trailers" className="text-xs sm:text-sm">
                  Trailers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-gray-400 text-sm font-semibold mb-1 sm:mb-2">
                      Director
                    </h3>
                    <p className="text-white text-sm sm:text-base">
                      {film.director}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-400 text-sm font-semibold mb-1 sm:mb-2">
                      Country
                    </h3>
                    <p className="text-white text-sm sm:text-base">
                      {film.country || "United States"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-400 text-sm font-semibold mb-1 sm:mb-2">
                      Language
                    </h3>
                    <p className="text-white text-sm sm:text-base">
                      {film.language?.join(", ") || "English"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-gray-400 text-sm font-semibold mb-1 sm:mb-2">
                      Release
                    </h3>
                    <p className="text-white text-sm sm:text-base">
                      {film.releaseYear}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cast" className="mt-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {/* @ts-expect-error: no problem */}
                  {castArray.slice(0, 8).map((actor, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-gray-800"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-gray-700">
                          <AvatarImage
                            src={`/placeholder.svg?height=48&width=48`}
                            alt={actor}
                          />
                          <AvatarFallback className="bg-gray-800 text-gray-400 text-xs sm:text-sm">
                            {actor
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-sm sm:text-base">
                            {actor}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Actor
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-span-full mt-2">
                    <h3 className="text-gray-400 text-sm font-semibold mb-1 sm:mb-2">
                      Director
                    </h3>
                    <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-gray-800 inline-block">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border border-gray-700">
                          <AvatarImage
                            src={`/placeholder.svg?height=48&width=48`}
                            alt={film.director ?? `director of ${film.title}`}
                          />
                          <AvatarFallback className="bg-gray-800 text-gray-400 text-xs sm:text-sm">
                            {film.director
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "D"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-sm sm:text-base">
                            {film.director}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Director
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-gray-800"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage
                            src={review.avatar}
                            alt={review.author}
                          />
                          <AvatarFallback className="bg-gray-800 text-gray-400 text-xs sm:text-sm">
                            {review.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium text-sm sm:text-base">
                            {review.author}
                          </p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  i < Math.floor(review.rating)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : i < review.rating
                                    ? "text-yellow-500 fill-yellow-500 opacity-50"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm sm:text-base">
                        {review.text}
                      </p>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 mt-2 text-xs sm:text-sm"
                  >
                    <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    See All Reviews
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="trailers" className="mt-4">
                <div className="aspect-video bg-gray-900/60 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800">
                  {film.trailerUrl && film.trailerUrl[0] ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(
                        film.trailerUrl[0]
                      )}`}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${film.title} trailer`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500 mx-auto mb-1 sm:mb-2" />
                        <p className="text-gray-400 text-sm sm:text-base">
                          Trailer not available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Similar Films Section */}
      <div className="mt-12 sm:mt-16 pb-12 sm:pb-16 bg-gradient-to-b from-transparent to-gray-950">
        {similarFilms.length > 0 && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center">
              More Like This
              <span className="text-xs sm:text-sm font-normal text-gray-400 sm:ml-2 mt-1 sm:mt-0">
                Because you watched {film.title}
              </span>
            </h2>
            <FilmCarousel
              user={user}
              title=""
              //@ts-expect-error: no problem
              favorites={favorites}
              //@ts-expect-error: no problem
              films={similarFilms.map((similarFilm) => {
                return {
                  cast: similarFilm.cast,
                  country: similarFilm.country,
                  createdAt: similarFilm.createdAt,
                  description: similarFilm.description,
                  posterUrl: !similarFilm.posterUrl
                    ? //@ts-expect-error: no problem
                      similarFilm.posterurl
                    : similarFilm.posterUrl,
                  director: similarFilm.director,
                  duration: similarFilm.duration,
                  featured: similarFilm.featured,
                  genre: similarFilm.genre,
                  id: similarFilm.id,
                  language: similarFilm.language,
                  rating: similarFilm.rating,
                  releaseYear: similarFilm.releaseYear,
                  title: similarFilm.title,
                  trailerUrl: similarFilm.trailerUrl,
                  updatedAt: similarFilm.updatedAt,
                  videoUrl: similarFilm.videoUrl,
                };
              })}
            />
          </div>
        )}
      </div>
    </section>
  );
}
