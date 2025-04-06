"use client";

import React, { useState } from "react";
import FilmTableAction from "@/components/dashboard/film/film-tables/films-table-action";
import FilmListingPage from "@/components/dashboard/film/listing-film-table";
import { FetchedResponseMoviePagination } from "@/types";

interface FilmClientComponentProps {
  data?: FetchedResponseMoviePagination | null;
}

const FilmClientComponent: React.FC<FilmClientComponentProps> = ({ data }) => {
  const [selectedFilmIds, setSelectedFilmIds] = useState<string[]>([]);

  return (
    <>
      <FilmTableAction
        setSelectedFilmIds={setSelectedFilmIds}
        selectedFilmIds={selectedFilmIds}
      />

      <FilmListingPage data={data} setSelectedFilmIds={setSelectedFilmIds} />
    </>
  );
};

export default FilmClientComponent;
