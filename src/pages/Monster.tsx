import { useEffect, useState } from "react";
import type { Monster } from "../types/Monster";
import {
  createColumnHelper,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Table } from "../components/Table";
import { Link, useSearchParams } from "react-router-dom";

export default function Monsters() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const columnHelper = createColumnHelper<Monster>();
  const [searchParams, setSearchParams] = useSearchParams();

  const columnFiltersFromUrl: ColumnFiltersState = Array.from(
    searchParams.entries()
  )
    .filter(([key]) => key !== "q")
    .map(([id, value]) => ({
      id,
      value,
    }));

  const globalFilterFromUrl = searchParams.get("q") ?? "";

  const handleFiltersChange = (filters: ColumnFiltersState) => {
    const params = new URLSearchParams(searchParams);

    // remove all column filter params first (except q)
    Array.from(params.keys()).forEach((key) => {
      if (key !== "q") {
        params.delete(key);
      }
    });

    // add active filters
    filters.forEach(({ id, value }) => {
      if (value != null && value !== "") {
        params.set(id, String(value));
      }
    });

    setSearchParams(params, { replace: true });
  };

  const handleGlobalSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    setSearchParams(params, { replace: true });
  };

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

  useEffect(() => {
    fetch("/data/monster.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch monsters.json");
        return res.json();
      })
      .then((data) => setMonsters(data))
      .catch((err) => console.error("Error loading monsters:", err));
  }, []);

  return (
    <div className="p-4 min-h-screen bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Monsters</h1>
      <Table
        data={monsters}
        columns={monsterColumns}
        initialPageSize={10}
        globalFilterable
        initialColumnFilters={columnFiltersFromUrl}
        onFiltersChange={handleFiltersChange}
        initialGlobalFilter={globalFilterFromUrl}
        onGlobalFilterChange={handleGlobalSearchChange}
      />
    </div>
  );
}
