import { useEffect, useState } from "react";
import type { Monster } from "../types/Monster";
import { createColumnHelper } from "@tanstack/react-table";
import { Table } from "../components/Table";

export default function Monsters() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const columnHelper = createColumnHelper<Monster>();

  const monsterColumns = [
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("type", { header: "Type" }),
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
            const formattedValues = Object.entries(
              values as Record<string, number>
            )
              .map(([type, val]) => `${type}: ${val}`)
              .join(", ");
            return `${zone}: ${formattedValues}`;
          })
          .join(" | "),
      { id: "hitzones", header: "Hitzones" }
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
    // <div className="p-4 bg-[#4A2F1F] min-h-screen text-[#f5f5f5]">
    <div className="p-4 min-h-screen bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Monsters</h1>

      <Table
        data={monsters}
        columns={monsterColumns}
        initialPageSize={10}
        globalFilterable={true} // enables the search input
      />
    </div>
  );
}
