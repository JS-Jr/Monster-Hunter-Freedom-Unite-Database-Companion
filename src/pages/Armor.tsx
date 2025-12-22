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

export default function Armor() {
  const {
    columnFilters,
    globalFilter,
    sorting,
    handleFiltersChange,
    handleGlobalFilterChange,
    handleSortingChange,
  } = useUrlFilters();

  const armorMapper = useCallback(
    (rawData: any[]) => rawData.map(mapRawArmorToArmor),
    []
  );

  const { data: armor, loading } = useDataFetchArray<Armor>(
    "/data/armor.json",
    {
      mapper: armorMapper,
    }
  );

  const columnHelper = createColumnHelper<Armor>();

  const armorColumns = [
    columnHelper.accessor("name", {
      header: "Armor Name",
      cell: ({ row }) => (
        <Link
          to={`/armor/${encodeURIComponent(row.original.name)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    }),
    columnHelper.accessor("type", {
      header: "Type",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(new Set(armor?.map((armorItem) => armorItem.type))),
      },
    }),
    columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: "equalsString",
      meta: {
        type: "select",
        options: Array.from(
          new Set(armor?.map((armorItem) => armorItem.rarity))
        ).sort((a, b) => a - b),
      },
    }),
    columnHelper.accessor("defense", { header: "Defense" }),
    columnHelper.accessor(
      (row: { resistances: { fire: any } }) => row.resistances.fire,
      {
        id: "fireRes",
        header: "Fire",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { water: any } }) => row.resistances.water,
      {
        id: "waterRes",
        header: "Water",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { thunder: any } }) => row.resistances.thunder,
      {
        id: "thunderRes",
        header: "Thunder",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { ice: any } }) => row.resistances.ice,
      {
        id: "iceRes",
        header: "Ice",
      }
    ),
    columnHelper.accessor(
      (row: { resistances: { dragon: any } }) => row.resistances.dragon,
      {
        id: "dragonRes",
        header: "Dragon",
      }
    ),
    columnHelper.accessor(
      (row: { skills: { name: any; amount: any }[] }) =>
        row.skills
          .map((s: { name: any; amount: any }) => `${s.name} +${s.amount}`)
          .join(", "),
      { id: "skills", header: "Skills" }
    ),
  ];

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Armor</h1>
        <TableSkeleton rows={10} columns={armorColumns.length} />
      </div>
    );
  }

  if (!armor || armor.length === 0) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        <h1 className="text-3xl font-bold mb-6">Armor</h1>
        <TableEmptyState message="No armor found." />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Armor</h1>
      <Table
        data={armor}
        columns={armorColumns}
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
