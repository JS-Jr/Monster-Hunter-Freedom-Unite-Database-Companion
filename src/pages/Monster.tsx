import { useEffect } from "react";
import type { Monster } from "../types/Monster";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link } from "react-router-dom";
import { useUrlFilters } from "../hooks/useUrlFilters";
import { useDataFetch } from "../hooks/useDataFetch";

export default function Monsters() {
  const columnHelper = createColumnHelper<Monster>();

  // List page - fetch all monsters
  // const { data: monsters, loading } = useDataFetch<Monster>("/data/monster.json");

  // // Detail page - fetch single monster by name
  // const { data: monster, loading } = useSingleDataFetch<Monster>(
  //   "/data/monster.json",
  //   monsterName
  // );

  const {
    columnFilters,
    globalFilter,
    handleFiltersChange,
    handleGlobalFilterChange,
  } = useUrlFilters();

  const { data: monsters, loading } =
    useDataFetch<Monster>("/data/monster.json");

  const monsterColumns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => (
        <Link
          to={`/monster/${encodeURIComponent(row.original.name)}`}
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
        options: Array.from(new Set(monsters.map((m) => m.type))),
      },
    }),
    columnHelper.accessor(
      (row) =>
        Object.entries(row.drops)
          .map(([rank, types]) => {
            // Cast types to Record<string, {name: string; chance: string}[]>
            const items = Object.values(
              types as Record<string, { name: string; chance: string }[]>
            )
              .flatMap((arr) => arr) // now TypeScript knows arr is an array
              .map((drop) => `${drop.name} (${drop.chance})`)
              .join(", ");
            return `${rank}: ${items}`;
          })
          .join(" | "),
      { id: "drops", header: "Drops" }
    ),
    columnHelper.accessor(
      (row) =>
        Object.entries(row.hitzones)
          .map(([zone, values]) => {
            const formattedValues = Object.entries(values)
              .map(([type, val]) => `${type}: ${val}`)
              .join(", ");
            return `${zone}: ${formattedValues}`;
          })
          .join(" | "),
      {
        id: "hitzones",
        header: "Hitzones",
      }
    ),
  ];

  if (monsters == null) return <h1></h1>;

  return (
    <div className="p-4 min-h-screen bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Monsters</h1>
      <Table
        data={monsters}
        columns={monsterColumns}
        initialPageSize={10}
        globalFilterable
        initialColumnFilters={columnFilters}
        onFiltersChange={handleFiltersChange}
        initialGlobalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
      />
    </div>
  );
}
