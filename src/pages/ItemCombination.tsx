import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";
import { TableEmptyState } from "../components/TableEmptyState";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { encodeName } from "../utils/urlSafe";
import type { ItemCombination } from "../types/Item-Combination";

export default function ItemCombination() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const { data: itemCombination, loading } = useDataFetchArray<ItemCombination>(
    "/data/item-combination.json",
  );

  const columnHelper = createColumnHelper<ItemCombination>();

  const itemCombinationColumns = [
    columnHelper.accessor("type", {
      header: "Type",
      filterFn: "equalsString",
    }),
    columnHelper.accessor("number", {
      header: "Number",
    }),

    columnHelper.accessor("material_a", {
      header: "Material A",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            to={`/item/${encodeName(item.material_a)}`}
            className="text-blue-600 hover:underline"
          >
            {item.material_a}
          </Link>
        );
      },
    }),
    columnHelper.accessor("material_b", {
      header: "Material B",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            to={`/item/${encodeName(item.material_b)}`}
            className="text-blue-600 hover:underline"
          >
            {item.material_b}
          </Link>
        );
      },
    }),
    columnHelper.accessor("item_result", {
      header: "Item Result",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            to={`/item/${encodeName(item.item_result)}`}
            className="text-blue-600 hover:underline"
          >
            {item.item_result}
          </Link>
        );
      },
    }),
    columnHelper.accessor("result", {
      header: "Result",
    }),
    columnHelper.accessor("success_rate", {
      header: "Success Rate",
    }),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Item Combination</h1>
        <TableSkeleton rows={10} columns={itemCombinationColumns.length} />
      </div>
    );
  }

  if (!itemCombination || itemCombination.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Item Combination</h1>
        <TableEmptyState message="No item combination found." />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Item Combination</h1>
      <Table
        data={itemCombination}
        columns={itemCombinationColumns}
        initialPageSize={10}
        globalFilterable
        initialColumnFilters={columnFilters}
        onFiltersChange={handleFiltersChange}
        initialGlobalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        initialSorting={sorting} // new
        onSortingChange={handleSortingChange} // new
      />
    </div>
  );
}
