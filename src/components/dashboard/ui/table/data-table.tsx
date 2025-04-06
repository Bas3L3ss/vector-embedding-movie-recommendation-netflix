"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import useDatatable from "@/hooks/use-data-table";
import DataTablePagination from "./data-table-pagination";
import TableHeader from "./table-header";
import TableBody from "./table-body";
import { ApiResponse } from "@/types";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: ApiResponse<TData> | null;
  loading?: boolean;
  pageSizeOptions?: number[];
  onPageChange?: (page: number, limit: number) => void;
  setSelectedOption?: React.Dispatch<React.SetStateAction<string[]>>;
  onRowUpdate?: (rowData: any) => void;
}

function DataTable<TData>({
  columns,
  data,
  setSelectedOption,
  loading = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageChange,
}: DataTableProps<TData>) {
  const {
    createUrlWithParams,
    router,
    totalItems,
    totalPages,
    table,
    currentPage,
    pageSize,
  } = useDatatable({
    data,
    columns,
    setSelectedOption,
    onPageChange,
  });

  return (
    <div className="flex flex-1 flex-col space-y-4 mt-5 text-white">
      <div className="relative flex flex-1">
        <div className="w-full h-[500px] flex overflow-scroll rounded-md border md:overflow-auto">
          <ScrollArea className="flex-1">
            <Table className="relative text-white bg-[#141414]">
              <TableHeader table={table} />
              <TableBody table={table} columns={columns} loading={loading} />
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <DataTablePagination
        createUrlWithParams={createUrlWithParams}
        currentPage={currentPage}
        onPageChange={onPageChange}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        router={router}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </div>
  );
}

export { DataTable };
