import { useEffect, useState } from "react";
import type { GameMap } from "../types/Map";
import { Table } from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export default function Map() {
  const [maps, setMaps] = useState<GameMap[]>([]);

  useEffect(() => {
    fetch("/data/map.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch map.json");
        return res.json();
      })
      .then((data: any[]) => {
        setMaps(data);
      })
      .catch((err) => console.error("Error loading maps:", err));
  }, []);

  const columnHelper = createColumnHelper<GameMap>();
  const mapColumns = [
    columnHelper.accessor("mapName", {
      header: "Map Name",
      cell: ({ row }) => (
        <Link
          to={`/maps/${encodeURIComponent(row.original.mapName)}`}
          className="font-semibold text-[#5A3F28] hover:underline"
        >
          {row.original.mapName}
        </Link>
      ),
    }),
    columnHelper.accessor("areas", {
      header: "Areas",
      cell: (info) => info.getValue().length,
    }),
  ];

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-3xl font-bold mb-6">Armor</h1>
      <Table
        data={maps}
        columns={mapColumns}
        initialPageSize={10}
        globalFilterable={true} // enables the search input
      />
    </div>
  );
}
