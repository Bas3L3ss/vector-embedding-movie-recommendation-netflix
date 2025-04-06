// hooks/use-data-table.ts
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ApiResponse } from "@/types";

interface UseDataTableProps<TData> {
  data: ApiResponse<TData> | null;
  columns: ColumnDef<TData, any>[];
  onRowUpdate?: (rowData: any) => void;
  setSelectedOption?: React.Dispatch<React.SetStateAction<string[]>>;
  onPageChange?: (page: number, limit: number) => void;
}

const useDatatable = <TData>({
  data,
  columns,
  setSelectedOption,
  onPageChange,
}: UseDataTableProps<TData>) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page and limit from URL or use defaults
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("limit") || "10", 10);

  // Calculate pagination from API response or use defaults
  const pagination = useMemo(
    () =>
      data?.pagination || {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: pageSize,
      },
    [data?.pagination, pageSize]
  );

  const totalItems = pagination.total;
  const totalPages = pagination.totalPages;

  // Setup table with pagination
  const table = useReactTable({
    data: data?.data,
    enableRowSelection: true,
    columns,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    onPaginationChange: useCallback(
      (updater: any) => {
        const state =
          typeof updater === "function"
            ? updater({ pageIndex: currentPage - 1, pageSize })
            : updater;

        const newPage = state.pageIndex + 1;
        const newLimit = state.pageSize;

        // Create new URLSearchParams object
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        params.set("limit", newLimit.toString());

        // Update URL with Next.js router
        router.push(`?${params.toString()}`, { scroll: false });

        // Call onPageChange callback if provided
        if (onPageChange) {
          onPageChange(newPage, newLimit);
        }
      },
      [currentPage, pageSize, router, searchParams, onPageChange]
    ),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  // Handle selection changes
  useEffect(() => {
    if (setSelectedOption) {
      const selectedData = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      const newSelectedIds = selectedData
        // @ts-expect-error: no prob
        .map((value) => value.id)
        .filter(Boolean);

      setSelectedOption((prev) =>
        JSON.stringify(prev) !== JSON.stringify(newSelectedIds)
          ? newSelectedIds
          : prev
      );
    }
  }, [table.getSelectedRowModel().rows, setSelectedOption]);

  // Update table pagination when URL changes
  useEffect(() => {
    table.setPagination({
      pageIndex: currentPage - 1,
      pageSize,
    });
  }, [currentPage, pageSize, table]);

  // Handle empty pages
  useEffect(() => {
    if (data?.data.length === 0 && pagination.currentPage > 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (pagination.currentPage - 1).toString());
      params.set("limit", "10");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [data, pagination, router, searchParams]);

  const createUrlWithParams = useCallback(
    (updatedParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updatedParams).forEach(([key, value]) => {
        params.set(key, value);
      });
      return `?${params.toString()}`;
    },
    [searchParams]
  );

  return {
    createUrlWithParams,
    router,
    totalItems,
    totalPages,
    table,
    currentPage,
    pageSize,
  };
};

export default useDatatable;
