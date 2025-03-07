import React, { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { cn } from "@/lib/utils";

const PaginationButtons = ({
  setCurrentPage,
  totalPages,
  currentPage,
  indexOfFirstFilm,
  totalFilms,
  indexOfLastFilm,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  currentPage: number;
  totalFilms: number;
  indexOfFirstFilm: number;
  indexOfLastFilm: number;
}) => {
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2");
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNumber as number);
                  }}
                  isActive={currentPage === pageNumber}
                  className={cn(
                    "bg-red-600 hover:bg-red-700 hover:text-white border-none",
                    currentPage === pageNumber && "bg-red-400"
                  )}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={cn(
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="text-center mt-4 text-sm text-gray-400">
        Showing {indexOfFirstFilm + 1}-{Math.min(indexOfLastFilm, totalFilms)}{" "}
        of {totalFilms} films
      </div>
    </div>
  );
};

export default PaginationButtons;
