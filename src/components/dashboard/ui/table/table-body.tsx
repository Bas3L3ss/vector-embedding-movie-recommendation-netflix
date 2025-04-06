import { Table } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import DataRow from "./data-row";

interface Props<T> {
  table: Table<T>;
  columns: ColumnDef<T, any>[];
  loading: boolean;
}

function TableBody<T>({ table, columns, loading }: Props<T>) {
  const rows = table.getRowModel().rows;

  return (
    <tbody>
      {loading ? (
        <tr>
          <td
            colSpan={columns.length}
            className="h-24 text-center text-[#e5e5e5]"
          >
            Loading...
          </td>
        </tr>
      ) : rows.length ? (
        rows.map((row) => <DataRow key={row.id} row={row} />)
      ) : (
        <tr>
          <td
            colSpan={columns.length}
            className="h-24 text-center text-[#e5e5e5]"
          >
            No results.
          </td>
        </tr>
      )}
    </tbody>
  );
}

export default TableBody;
