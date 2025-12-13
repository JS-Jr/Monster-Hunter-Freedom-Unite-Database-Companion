import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  initialPageSize?: number;
  globalFilterable?: boolean;
  columnFilters?: ColumnFiltersState;
}

export function Table<T>({
  data,
  columns,
  initialPageSize = 10,
  globalFilterable = true,
  columnFilters = [],
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState<ColumnFiltersState>(
    columnFilters ?? []
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters: filters,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setFilters,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-full">
      {/* Global Search */}
      {globalFilterable && (
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="border border-[#5A3F28] px-3 py-2 rounded shadow-sm w-64 mb-4 focus:outline-none focus:ring focus:ring-[#5A3F28] bg-[#F9EEDC] text-[#5A3F28]"
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-[#5A3F28]">
        <table className="min-w-full text-sm text-[#5A3F28] bg-[#F9EEDC]">
          <thead className="bg-[#5A3F28] text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b border-[#8B6B52] font-semibold cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span>
                      {header.column.getIsSorted() === "asc"
                        ? " 🔼"
                        : header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#7B543A] hover:text-[#F9EEDC] transition-colors cursor-default"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border-b border-[#8B6B52]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-2 px-4 py-2 rounded-b-lg bg-[#F9EEDC] text-[#5A3F28]">
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 bg-[#5A3F28] text-white border-[#5A3F28] hover:bg-[#7B543A]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50 bg-[#5A3F28] text-white border-[#5A3F28] hover:bg-[#7B543A]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <span>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          {table.getPageCount()}
        </span>
        <select
          className="border rounded px-2 py-1 bg-[#F9EEDC] text-[#5A3F28] border-[#5A3F28]"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageIndex(0);
          }}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
