import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Weapon } from "../types/Weapon";
import SearchFilter from "../components/SearchFilter";
import DataTable from "../components/DataTable";

export default function Weapons() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/data/weapons.json")
      .then((res) => res.json())
      .then((data: Weapon[]) => {
        const valid = data.filter((w) => w && typeof w.name === "string");
        setWeapons(valid);
      })
      .catch((err) => console.error("Error loading weapons:", err));
  }, []);

  const types = Array.from(
    new Set(weapons.map((w) => w.type).filter((t): t is string => !!t))
  );

  const filtered = weapons.filter((w) => {
    const nameMatch = w.name.toLowerCase().includes(search.toLowerCase());
    const typeMatch = filter ? w.type === filter : true;
    return nameMatch && typeMatch;
  });

  const columns = [
    {
      header: "Name",
      accessor: "name" as const,
      render: (value: string, row: Weapon) => (
        <Link to={`/weapons/${encodeURIComponent(row.name)}`}>{value}</Link>
      ),
    },
    { header: "Type", accessor: "type" as const },
    { header: "Attack", accessor: "attack" as const },
    { header: "Affinity", accessor: "affinity" as const },
    { header: "Rarity", accessor: "rarity" as const },
    {
      header: "Elements",
      accessor: "elements" as const,
      render: (elements: Weapon["elements"]) =>
        elements?.map((e) => `${e.name} ${e.attack}`).join(", ") || "—",
    },
  ];

  return (
    <div>
      <h1>Weapons</h1>

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
