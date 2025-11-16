import { useState } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { Armor } from "../types/Armor";

const columnHelper = createColumnHelper<Armor>();

const columns = [
  columnHelper.accessor("name", { header: "Armor Name" }),
  columnHelper.accessor("type", { header: "Type" }),
  columnHelper.accessor("rarity", { header: "Rarity", filterFn: "equals" }),
  columnHelper.accessor("defense", { header: "Defense" }),
  columnHelper.accessor((row) => row.resistances.fire, {
    id: "fireRes",
    header: "Fire",
  }),
  columnHelper.accessor((row) => row.resistances.water, {
    id: "waterRes",
    header: "Water",
  }),
  columnHelper.accessor((row) => row.resistances.thunder, {
    id: "thunderRes",
    header: "Thunder",
  }),
  columnHelper.accessor((row) => row.resistances.ice, {
    id: "iceRes",
    header: "Ice",
  }),
  columnHelper.accessor((row) => row.resistances.dragon, {
    id: "dragonRes",
    header: "Dragon",
  }),
  columnHelper.accessor(
    (row) => row.skills.map((s) => `${s.name} +${s.amount}`).join(", "),
    { id: "skills", header: "Skills" }
  ),
];

export default function ArmorTable({ data }: { data: Armor[] }) {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Extract unique types & rarities for dropdowns
  const uniqueTypes = Array.from(new Set(data.map((item) => item.type)));
  const uniqueRarities = Array.from(
    new Set(data.map((item) => item.rarity))
  ).sort((a, b) => a - b);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // enables filtering by search + dropdowns
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Filter Controls */}
      <div className="mb-4 flex justify-between gap-4">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search armors..."
          className="border px-3 py-2 rounded w-64 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Type Filter */}
        <select
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("type")?.setFilterValue(e.target.value)
          }
          className="border px-3 py-2 rounded shadow-sm"
        >
          <option value="">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        {/* Rarity Filter */}
        <select
          value={(table.getColumn("rarity")?.getFilterValue() as string) ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            table
              .getColumn("rarity")
              ?.setFilterValue(value ? Number(value) : undefined);
          }}
          className="border px-3 py-2 rounded shadow-sm"
        >
          <option value="">All Rarities</option>
          {uniqueRarities.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
        <table className="min-w-full bg-white text-gray-700 text-sm">
          <thead className="bg-gray-100 text-left">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b font-semibold cursor-pointer select-none"
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
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-2 px-4 py-2 bg-gray-50 border-t rounded-b-lg">
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="px-2 py-1 border rounded disabled:opacity-50"
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
          className="border rounded px-2 py-1"
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
