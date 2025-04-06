import { DataTable as FilmTable } from "@/components/dashboard/ui/table/data-table";
import { columns } from "./film-tables/columns";

import { FetchedResponseMoviePagination } from "@/types";

type FilmListingPage = {
  data?: FetchedResponseMoviePagination | null;
  setSelectedFilmIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function FilmListingPage({
  setSelectedFilmIds,
  data,
}: FilmListingPage) {
  return (
    <>
      <FilmTable
        columns={columns}
        // @ts-expect-error: no prob
        data={
          data || {
            data: [],
            pagination: {
              currentPage: 0,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
            success: false,
          }
        }
        setSelectedOption={setSelectedFilmIds}
        totalItems={data?.pagination.total || 0}
      />
    </>
  );
}
