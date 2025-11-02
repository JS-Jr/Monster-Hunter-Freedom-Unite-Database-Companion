import { useEffect, useState } from "react";
import type { GameMap } from "../types/Map";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";

export default function Map() {
  const [maps, setMaps] = useState<GameMap[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/data/map.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch map.json");
        return res.json();
      })
      .then((data: any[]) => {
        const cleaned = data
          .filter((m) => m && typeof m.mapName === "string")
          .map((m) => ({
            ...m,
            areas: Array.isArray(m.areas) ? m.areas : [],
          }));

        setMaps(cleaned);
      })
      .catch((err) => console.error("Error loading maps:", err));
  }, []);

  // ✅ Filter by map name
  const filtered = maps.filter((m) =>
    m.mapName.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Flatten areas count for summary
  const columns: {
    header: string;
    accessor: keyof GameMap;
    render?: (value: any, row: GameMap) => React.ReactNode;
  }[] = [
    { header: "Map Name", accessor: "mapName" },
    {
      header: "Areas",
      accessor: "areas",
      render: (areas) => areas.length,
    },
  ];

  return (
    <div>
      <h1>Maps</h1>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        filter=""
        onFilterChange={() => {}}
        filterOptions={[]} // no filter needed for maps
      />

      <DataTable data={filtered} columns={columns} />

      {/* 🗺️ Optional: Expandable list of areas */}
      <div className="mt-6">
        {filtered.map((map) => (
          <div key={map.mapName} className="border p-3 mb-4 rounded-xl">
            <h2 className="font-bold text-lg">{map.mapName}</h2>
            <ul className="pl-4 list-disc">
              {map.areas.map((area) => (
                <li key={area.areaName}>
                  <strong>{area.areaName}</strong>{" "}
                  {area.areaNumber && <span>(#{area.areaNumber})</span>} —{" "}
                  {area.nodes.length} nodes
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
