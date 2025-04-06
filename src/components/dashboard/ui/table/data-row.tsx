import { Row, flexRender } from "@tanstack/react-table";

interface Props<T> {
  row: Row<T>;
}

function DataRowComponent<T>({ row }: Props<T>) {
  const isSelected = row.getIsSelected();

  return (
    <tr
      data-state={isSelected ? "selected" : undefined}
      className={`hover:bg-[#262626] transition ${
        isSelected ? "bg-red-800 " : ""
      } `}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="px-4 py-2 text-[#d4d4d4] border-t border-[#333]"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default DataRowComponent;
