import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TableEmptyState } from "../components/TableEmptyState";
import { TableSkeleton } from "../components/TableSkeletonProps";
import { useDataFetchArray } from "../hooks/useDataFetch";
import { useUrlFilters } from "../hooks/useUrlFilters";
import type { Decoration, Decoration } from "../types/Decoration";
import { encodeName } from "../utils/urlSafe";
import { mapRawDecorationtoDecoration } from "../utils/mapDecoration";
import { useCallback } from "react";

export default function Decoration() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const decorationMapper = useCallback(
    (rawData: any[]) => rawData.map(mapRawDecorationtoDecoration),
    []
  );

  const { data: decoration, loading } = useDataFetchArray<Decoration>(
    "/data/decoration-modified.json",
    {
      mapper: decorationMapper
    }
  );

  const navigate = useNavigate();
  const handleAddToBuilder = (decorationItem: Decoration) => {
    // localStorage.setItem(`selected${armorItem.type}`, armorItem.identifier);
    navigate("/skill-builder");
  };

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const armorTypeValue = queryParams.get('armor_type');
  // const availableSlotsValue = queryParams.get('available_slots');
  // console.log("armorTypeValue", armorTypeValue);
  // console.log("availableSlotsValue", availableSlotsValue);



  const columnHelper = createColumnHelper<Decoration>();

  const decorationColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <Link
          to={`/decorations/${encodeName(row.original.name)}`}
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
    columnHelper.accessor((row) =>
      row.skills
        .map((s) => `${s.name} ${s.positive ? "+" : "-"}${s.amount}`)
        .join(", "),
      { id: "skills", header: "Skills" }),
    columnHelper.accessor((row: Decoration) => row.slots, {
      id: "slots",
      header: "Slots",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: [1, 2, 3],
      },
    }),
    // ---------------- Add to Skill Builder button ----------------
    columnHelper.display({
      id: "addToBuilder",
      header: "Builder",
      cell: ({ row }) => (
        <button
          onClick={() => handleAddToBuilder(row.original)}
          className="px-3 py-1 rounded-md text-sm font-semibold
                     bg-[#6B3E1B] text-[#F7E7D0]
                     hover:bg-[#5A3215] transition-all"
        >
          Add to Builder
        </button>
      ),
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

  // console.log("decoration", decoration[0]);

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
