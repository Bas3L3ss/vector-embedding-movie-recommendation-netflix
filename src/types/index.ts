import { Genre, Movie } from "@prisma/client";

interface FetchedResponseMoviePagination {
  data: Movie[];
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FetchMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
  genres?: Genre[];
}
interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

type FilmFormData = {
  title: string;
  description?: string;
  releaseYear: number;
  genre: Genre[];
  director?: string;
  cast: string[];
  duration: number;
  language: string[];
  country?: string;
  rating?: number;
  featured: boolean;
  tags: string[];
  trailerUrl?: string[];
  videoUrl?: string[];
};

export type {
  FetchedResponseMoviePagination,
  FetchMoviesParams,
  ApiResponse,
  FilmFormData,
};
