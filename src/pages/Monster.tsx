import { useEffect, useState } from "react";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";
import type { Monster } from "../types/Monster";

export default function Monsters() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/data/monster.json") // ✅ match your file name
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch monsters.json");
        return res.json();
      })
      .then((data) => setMonsters(data))
      .catch((err) => console.error("Error loading monsters:", err));
  }, []);

  const types = Array.from(new Set(monsters.map((m) => m.type)));

  const filtered = monsters.filter((m) => {
    const matchName = m.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filter ? m.type === filter : true;
    return matchName && matchType;
  });

  return (
    <div>
      <h1>Monsters</h1>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        filterOptions={types}
      />

      <DataTable data={filtered} />

    </div>
  );
}
