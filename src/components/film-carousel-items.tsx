"use client";
import { Movie } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import FilmCard from "./film-card";
import { User } from "@supabase/supabase-js";

const FilmCarouselItems = ({
  films,
  user,
}: {
  films: Movie[];
  user: User | null;
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const updateArrowVisibility = () => {
    if (!carouselRef.current) return;

    setShowLeftArrow(carouselRef.current.scrollLeft > 0);
    setShowRightArrow(
      carouselRef.current.scrollLeft <
        carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 10
    );
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", updateArrowVisibility);
      // Initial check
      updateArrowVisibility();
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", updateArrowVisibility);
      }
    };
  }, [films]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const { current: carousel } = carouselRef;
    const scrollAmount = carousel.clientWidth * 0.8;

    carousel.scrollTo({
      left:
        direction === "left"
          ? carousel.scrollLeft - scrollAmount
          : carousel.scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;

    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  return (
    <>
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 z-10 bg-black/50 p-2 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 z-10 bg-black/50 p-2 rounded-full transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Carousel */}
      <div
        ref={carouselRef}
        className={`flex overflow-x-auto scrollbar-hide px-4 md:px-8 space-x-4 pb-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {films.map((film) => (
          <div key={film.id} className="group flex-none w-[250px] md:w-[280px]">
            {/* TODO: dynamic favourite */}
            <FilmCard user={user} film={film} isFavorite={true} />
          </div>
        ))}
      </div>

      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default FilmCarouselItems;
