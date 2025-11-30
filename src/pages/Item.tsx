import { useEffect, useState } from "react";
import type { Item } from "../types/Item";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

export default function Item() {
  const [itemData, setItemData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // const [sorting, setSorting] = useState([]);
  // const [columnFilters, setColumnFilters] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch JSON data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/item.json");
        // const data: Item[] = await response.json();
        // setItemData(data);

        console.log("Mapping");

        const rawData: any[] = await response.json();

        if (!Array.isArray(rawData)) {
          console.error("Data is not an array", rawData);
          setItemData([]);
          return;
        }

        const mappedData: Item[] = rawData.map((item) => ({
          type: item.itemType ?? "", // ensure string
          name: item.itemName ?? "",
          rarity: Number(item.rarity ?? 0), // ensure number
          bagCapacity: Number(item.bagCapacity ?? 0),
          sellValue: item.sellValue ?? "",
          howToGet: item.howToGet ?? "",
        }));

        console.log(mappedData);
        setItemData(mappedData);

        // console.log(itemData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   setPageIndex(0);
  // }, [itemData]);

  // const uniqueTypes = Array.from(new Set(itemData.map((item) => item.type)));
  // const uniqueRarities = Array.from(
  //   new Set(itemData.map((item) => item.rarity))
  // );

  const columnHelper = createColumnHelper<Item>();
  const columns = [
    columnHelper.accessor("type", { header: "Type" }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            to={`/item/${item.name}`}
            className="text-blue-600 hover:underline"
          >
            {item.name}
          </Link>
        );
      },
    }),
    columnHelper.accessor("rarity", { header: "Rarity", filterFn: "equals" }),
    columnHelper.accessor("bagCapacity", {
      header: "Bag Capacity",
      filterFn: "equals",
    }),
    columnHelper.accessor("sellValue", {
      header: "Sell Value",
      filterFn: "equals",
    }),
    columnHelper.accessor("howToGet", {
      header: "How to Get",
      filterFn: "equals",
    }),
  ];

  const table = useReactTable({
    data: itemData,
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const uniqueTypes = Array.from(new Set(itemData.map((item) => item.type)));
  const uniqueRarities = Array.from(
    new Set(itemData.map((item) => item.rarity))
  );

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Item List</h1>

      {loading ? (
        <div>Loading Item data...</div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Filter Controls */}
          <div className="mb-4 flex justify-between gap-4">
            {/* Global Search */}
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search items..."
              className="border px-3 py-2 rounded w-64 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />

            {/* Type Filter */}
            {
              <select
                value={
                  (table.getColumn("type")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table
                    .getColumn("type")
                    ?.setFilterValue(e.target.value || undefined)
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
            }

            {/* Rarity Filter */}
            {
              <select
                value={
                  (table.getColumn("rarity")?.getFilterValue() as string) ?? ""
                }
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
            }
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
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 border-b">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong>{" "}
              of {table.getPageCount()}
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
      )}
    </div>
  );
}
