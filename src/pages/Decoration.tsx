import type { Armor } from "../types/Armor";
import { mapRawArmorToArmor } from "../utils/mapArmor";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";
import { TableEmptyState } from "../components/TableEmptyState";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { useCallback } from "react";
import type { Decoration } from "../types/Decoration";

export default function Decoration() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const { data: decoration, loading } = useDataFetchArray<Decoration>(
    "/data/decoration-modified.json"
  );

  const columnHelper = createColumnHelper<Decoration>();

  const decorationColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <Link
          to={`/decoration/${encodeURIComponent(row.original.name)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    }),
    columnHelper.accessor("skill_group", {
      header: "Skill Group",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(
            decoration?.map((decorationItem) => decorationItem.skill_group)
          )
        ),
      },
    }),
    columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(decoration?.map((decorationItem) => decorationItem.rarity))
        ).sort((a, b) => a - b),
      },
    }),
    columnHelper.accessor((row: Decoration) => row.skills.join(", "), {
      id: "skills",
      header: "Skills",
    }),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Decoration</h1>
        <TableSkeleton rows={10} columns={decorationColumns.length} />
      </div>
    );
  }

  if (!decoration || decoration.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Decoration</h1>
        <TableEmptyState message="No decoration found." />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Decoration</h1>
      <Table
        data={decoration}
        columns={decorationColumns}
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
