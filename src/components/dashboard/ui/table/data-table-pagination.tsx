import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";

const DataTablePagination = ({
  totalItems,
  currentPage,
  pageSize,
  createUrlWithParams,
  router,
  onPageChange,
  pageSizeOptions,
  totalPages,
}: {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  createUrlWithParams: (updatedParams: Record<string, string>) => string;
  router: AppRouterInstance;
  onPageChange: ((page: number, limit: number) => void) | undefined;
  pageSizeOptions: number[];
  totalPages: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row">
      <div className="flex w-full items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalItems > 0 ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
              entries
            </>
          ) : (
            "No entries found"
          )}
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap text-sm font-medium">
              Rows per page
            </p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                const newLimit = Number(value);
                // Reset to page 1 when changing page size
                const url = createUrlWithParams({
                  page: "1",
                  limit: value,
                });
                router.push(url, { scroll: false });

                if (onPageChange) {
                  onPageChange(1, newLimit);
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
        <div className="flex w-[150px] items-center justify-center text-sm font-medium">
          {totalItems > 0 ? (
            <>
              Page {currentPage} of {totalPages}
            </>
          ) : (
            "No pages"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              const url = createUrlWithParams({ page: "1" });
              router.push(url, { scroll: false });

              if (onPageChange) {
                onPageChange(1, pageSize);
              }
            }}
            disabled={currentPage <= 1}
          >
            <DoubleArrowLeftIcon
              className="h-4 w-4 text-black"
              aria-hidden="true"
            />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const prevPage = Math.max(1, currentPage - 1);
              const url = createUrlWithParams({
                page: prevPage.toString(),
              });
              router.push(url, { scroll: false });

              if (onPageChange) {
                onPageChange(prevPage, pageSize);
              }
            }}
            disabled={currentPage <= 1}
          >
            <ChevronLeftIcon
              className="h-4 w-4 text-black"
              aria-hidden="true"
            />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              const nextPage = Math.min(totalPages, currentPage + 1);
              const url = createUrlWithParams({
                page: nextPage.toString(),
              });
              router.push(url, { scroll: false });

              if (onPageChange) {
                onPageChange(nextPage, pageSize);
              }
            }}
            disabled={currentPage >= totalPages}
          >
            <ChevronRightIcon
              className="h-4 w-4 text-black"
              aria-hidden="true"
            />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              const url = createUrlWithParams({
                page: totalPages.toString(),
              });
              router.push(url, { scroll: false });

              if (onPageChange) {
                onPageChange(totalPages, pageSize);
              }
            }}
            disabled={currentPage >= totalPages}
          >
            <DoubleArrowRightIcon
              className="h-4 w-4 text-black "
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
