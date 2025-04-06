import { flexRender, Table } from "@tanstack/react-table";

interface Props<T> {
  table: Table<T>;
}

function TableHeaderComponent<T>({ table }: Props<T>) {
  return (
    <thead className="bg-[#181818] border-b border-[#333]">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="text-sm font-semibold uppercase tracking-wider text-[#e5e5e5] px-4 py-2"
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}

export default TableHeaderComponent;
