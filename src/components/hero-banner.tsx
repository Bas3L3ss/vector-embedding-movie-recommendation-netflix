"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Movie as Film } from "@prisma/client";
import HeroBannerCta from "./hero-banner-cta";
import { User } from "@supabase/supabase-js";

interface HeroBannerProps {
  user: User | null;
  film: Film;
  isFavorite?: boolean;
}

export default function HeroBanner({
  film,
  isFavorite = false,
  user,
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoplay]);

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh]">
      <div className="absolute inset-0">
        <Image
          src={film.posterUrl[currentSlide]}
          alt={film.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

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

        <HeroBannerCta isFavorite={isFavorite} user={user} film={film} />
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
