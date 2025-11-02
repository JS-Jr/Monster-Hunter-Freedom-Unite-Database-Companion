import { useEffect, useState } from "react";
import type { Armor } from "../types/Armor";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";

export default function Armor() {
  const [armors, setArmors] = useState<Armor[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // ✅ Load armor data
  useEffect(() => {
    fetch("/data/armor.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch armor.json");
        return res.json();
      })
      .then((data: any[]) => {
        const cleaned = data
          .filter((a) => a && typeof a.name === "string")
          .map((a) => ({
            ...a,
            create_mats: Array.isArray(a.create_mats) ? a.create_mats : [],
            resistances: a.resistances || {
              fire: 0,
              water: 0,
              thunder: 0,
              ice: 0,
              dragon: 0,
            },
            defense: a.defense || { base: 0, max: 0 },
          }));

        setArmors(cleaned);
      })
      .catch((err) => console.error("Error loading armor:", err));
  }, []);

  // ✅ Extract unique armor types (head, body, etc.)
  const types = Array.from(
    new Set(armors.map((a) => a.type))
  ).filter(Boolean) as string[];

  // ✅ Search + filter
  const filtered = armors.filter((a) => {
    const matchName = a.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = filter ? a.type === filter : true;
    return matchName && matchType;
  });

  // ✅ Define DataTable columns
  const columns: {
    header: string;
    accessor: keyof Armor;
    render?: (value: any, row: Armor) => React.ReactNode;
  }[] = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "type" },
    { header: "Rarity", accessor: "rarity" },
    {
      header: "Defense",
      accessor: "defense",
      render: (value) => `${value.base} → ${value.max}`,
    },
    {
      header: "Resistances",
      accessor: "resistances",
      render: (value) =>
        `🔥${value.fire} 💧${value.water} ⚡${value.thunder} ❄️${value.ice} 🐉${value.dragon}`,
    },
    { header: "Slots", accessor: "slots" },
  ];

  return (
    <div>
      <h1>Armor</h1>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={types}
      />

      <DataTable data={filtered} columns={columns} />
    </div>
  );
}
